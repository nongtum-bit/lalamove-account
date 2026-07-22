/**
 * Lalamove Module
 * 
 * โมดูลหลักสำหรับบันทึกงานลาล่ามูฟ
 * รับผิดชอบ:
 * - การจัดการข้อมูล (records, checkin, settings)
 * - การคำนวณกำไรสุทธิ
 * - CRUD รายการ
 * - Event Delegation
 */

const LalamoveModule = (() => {
    // State ภายในโมดูล
    let records = [];
    let settings = { fuelPrice: 32, fuelConsumption: 12, depreciationRate: 1 };
    let checkin = { start: null, end: null };
    let currentEditId = null;
    let currentDeleteId = null;
    let checkinInterval = null;
    let currentDetailRecord = null;
    let currentTollPayer = 'customer';
    let undoStack = [];
    let selectedExpenseCategory = '';

    const EXPENSE_CATEGORIES = ['น้ำมัน', 'อาหาร', 'ค่าสึกหรอ', 'ทางด่วนลูกค้า', 'ทางด่วนเราเอง', 'ส่วนตัว'];

    // === DATA LAYER ===
    function loadData() {
        const saved = localStorage.getItem('lalamove_records');
        if (saved) records = JSON.parse(saved);
        const s = localStorage.getItem('lalamove_settings');
        if (s) settings = JSON.parse(s);
        const c = localStorage.getItem('lalamove_checkin');
        if (c) checkin = JSON.parse(c);
        const u = localStorage.getItem('lalamove_undoStack');
        if (u) undoStack = JSON.parse(u);
    }

    function saveData() {
        localStorage.setItem('lalamove_records', JSON.stringify(records));
        localStorage.setItem('lalamove_settings', JSON.stringify(settings));
        localStorage.setItem('lalamove_checkin', JSON.stringify(checkin));
        localStorage.setItem('lalamove_undoStack', JSON.stringify(undoStack));
    }

    // === CALCULATION ===
    function calculateRealNet(todayRecords) {
        let totalIncome = 0, totalExpense = 0, totalKm = 0, totalFare = 0, totalTip = 0, totalGp = 0;

        todayRecords.forEach(r => {
            if (r.type === 'income') {
                totalIncome += (r.fare || 0) + (r.tip || 0);
                totalFare += r.fare || 0;
                totalTip += r.tip || 0;
                totalKm += r.km || 0;
                totalGp += r.gp || 0;
                if (r.tollPayer === 'self') totalExpense += r.toll || 0;
            } else if (r.type === 'expense' && r.category !== 'ทางด่วนลูกค้า') {
                totalExpense += r.amount;
            }
        });

        const fuelCost = (totalKm / settings.fuelConsumption) * settings.fuelPrice;
        const depCost = totalKm * settings.depreciationRate;
        const realNet = totalIncome - totalExpense - totalGp - fuelCost - depCost;

        return { totalIncome, totalExpense, totalFare, totalTip, totalGp, fuelCost, depCost, realNet, totalKm };
    }

    function updateSummary() {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = records.filter(r => r.date === today);
        const calc = calculateRealNet(todayRecords);

        const incomeEl = document.getElementById('total-income');
        const expenseEl = document.getElementById('total-expense');
        const netEl = document.getElementById('real-net');

        if (incomeEl) incomeEl.textContent = calc.totalIncome.toLocaleString();
        if (expenseEl) expenseEl.textContent = calc.totalExpense.toLocaleString();
        if (netEl) {
            netEl.textContent = Math.round(calc.realNet).toLocaleString();
            netEl.style.color = calc.realNet >= 0 ? '#10b981' : '#f87171';
        }

        const countEl = document.getElementById('transaction-count');
        if (countEl) countEl.textContent = todayRecords.length + ' รายการ';

        window.currentSummary = calc;
    }

    // === RENDER ===
    function renderTransactions() {
        const container = document.getElementById('transactions-list');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        const list = records.filter(r => r.date === today).sort((a, b) => b.id - a.id);

        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = `<div class="text-center py-8 text-slate-400 text-sm">ยังไม่มีรายการวันนี้</div>`;
            return;
        }

        list.forEach(record => {
            const div = document.createElement('div');
            div.className = 'transaction-item flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 active:bg-slate-700';
            div.dataset.id = record.id;

            const icon = record.type === 'income' 
                ? '<i class="fas fa-arrow-up text-emerald-400"></i>' 
                : '<i class="fas fa-arrow-down text-red-400"></i>';
            const color = record.type === 'income' ? 'text-emerald-400' : 'text-red-400';

            div.innerHTML = `
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700">${icon}</div>
                    <div class="min-w-0 flex-1">
                        <div class="font-medium truncate">${record.category || (record.type === 'income' ? 'งานลาล่ามูฟ' : 'ค่าใช้จ่าย')}</div>
                        <div class="text-xs text-slate-400 truncate">${record.note || ''}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="text-right">
                        <div class="font-semibold ${color}">${record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}</div>
                        <div class="text-xs text-slate-500">${record.time}</div>
                    </div>
                    <div class="flex gap-1.5">
                        <button class="action-btn bg-emerald-600 text-white edit-btn" data-id="${record.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn bg-red-600 text-white delete-btn" data-id="${record.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });

        // Setup event delegation
        setupEventDelegation(container);
    }

    function setupEventDelegation(container) {
        container.addEventListener('click', function(e) {
            const row = e.target.closest('.transaction-item');
            if (!row) return;

            const id = parseInt(row.dataset.id);
            if (!id) return;

            if (e.target.closest('.edit-btn')) {
                e.stopImmediatePropagation();
                editRecordDirect(id);
                return;
            }

            if (e.target.closest('.delete-btn')) {
                e.stopImmediatePropagation();
                handleDeleteClick(id);
                return;
            }

            showDetailModalById(id);
        });
    }

    function handleDeleteClick(id) {
        const record = records.find(r => r.id === id);
        if (!record) return;

        currentDeleteId = id;

        if (record.amount >= 1500) {
            if (!confirm(`รายการนี้มีมูลค่า ${record.amount.toLocaleString()} บาท\nคุณแน่ใจหรือไม่ว่าต้องการลบ?`)) {
                currentDeleteId = null;
                return;
            }
        }
        showDeleteConfirm();
    }

    // === CRUD ===
    function addIncome() {
        // ... (โค้ดเดิมจาก index.html)
        alert('ฟังก์ชัน addIncome ถูกย้ายเข้าโมดูลแล้ว (กำลังพัฒนา)');
    }

    function addExpense() {
        alert('ฟังก์ชัน addExpense ถูกย้ายเข้าโมดูลแล้ว (กำลังพัฒนา)');
    }

    function editRecordDirect(id) {
        alert('ฟังก์ชัน editRecordDirect ถูกย้ายเข้าโมดูลแล้ว (กำลังพัฒนา)');
    }

    function deleteRecord(id) {
        const rec = records.find(r => r.id === id);
        if (!rec) return;

        undoStack.push(rec);
        if (undoStack.length > 5) undoStack.shift();

        records = records.filter(r => r.id !== id);
        saveData();
        updateSummary();
        renderTransactions();
        showUndoToast();
    }

    function showDetailModalById(id) {
        const record = records.find(r => r.id === id);
        if (!record) return;
        showDetailModal(record);
    }

    function showDetailModal(record) {
        // ... (โค้ด modal)
        alert('Detail Modal ถูกย้ายเข้าโมดูลแล้ว (กำลังพัฒนา)');
    }

    function showDeleteConfirm() {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('hidden');
        if (modal) modal.classList.add('flex');
    }

    function showUndoToast() {
        // ... (โค้ด toast)
    }

    function showToast(msg) {
        // ... (โค้ด toast)
    }

    // === CHECKIN ===
    function updateCheckin() {
        // ... (โค้ดเดิม)
    }

    function startCheckinTimer() {
        // ...
    }

    function checkIn() {
        // ...
    }

    function checkOut() {
        // ...
    }

    // === PUBLIC API ===
    return {
        init() {
            loadData();
            updateSummary();
            renderTransactions();
            updateCheckin();
            console.log('%c[LalamoveModule] Initialized', 'color:#10b981');
        },

        show() {
            const section = document.getElementById('module-lalamove');
            if (section) section.classList.add('active');
            this.init();
        },

        hide() {
            const section = document.getElementById('module-lalamove');
            if (section) section.classList.remove('active');
        },

        // Expose สำหรับ debug
        getRecords: () => records
    };
})();

// Export
window.LalamoveModule = LalamoveModule;