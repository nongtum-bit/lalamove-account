const LalamoveUI = (() => {
    let selectedExpenseCategory = '';

    function updateSummary() {
        try {
            const summary = LalamoveModule.calculateTodaySummary();
            
            document.getElementById('total-income').textContent = summary.totalIncome.toLocaleString();
            document.getElementById('total-expense').textContent = summary.totalExpense.toLocaleString();
            
            const netEl = document.getElementById('real-net');
            netEl.textContent = summary.net.toLocaleString();
            netEl.style.color = summary.net >= 0 ? '#10b981' : '#f87171';
            
            document.getElementById('transaction-count').textContent = summary.count + ' รายการ';
        } catch (e) {
            console.error('[LalamoveUI] updateSummary error:', e);
        }
    }

    function renderTransactions() {
        try {
            const container = document.getElementById('transactions-list');
            const list = LalamoveModule.getTodayRecords().sort((a, b) => b.id - a.id);

            container.innerHTML = '';

            if (list.length === 0) {
                container.innerHTML = `<div class="text-center py-8 text-slate-400 text-sm">ยังไม่มีรายการวันนี้</div>`;
                return;
            }

            list.forEach(record => {
                const div = document.createElement('div');
                div.className = 'transaction-item flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700';
                
                const icon = record.type === 'income' 
                    ? '<i class="fas fa-arrow-up text-emerald-400"></i>' 
                    : '<i class="fas fa-arrow-down text-red-400"></i>';
                const color = record.type === 'income' ? 'text-emerald-400' : 'text-red-400';

                let detail = '';
                if (record.type === 'income') {
                    detail = `รายได้ ${record.fare} | ทิป ${record.tip} | GP ${record.gp}`;
                } else {
                    detail = record.category;
                }

                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700">${icon}</div>
                        <div>
                            <div class="font-medium">${record.type === 'income' ? 'งานลาล่ามูฟ' : record.category}</div>
                            <div class="text-xs text-slate-400">${detail}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold ${color}">${record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}</div>
                        <div class="text-xs text-slate-500">เวลา ${record.time}</div>
                    </div>
                `;
                container.appendChild(div);
            });
        } catch (e) {
            console.error('[LalamoveUI] renderTransactions error:', e);
        }
    }

    function updateCheckinUI() {
        try {
            const statusEl = document.getElementById('checkin-status');
            const durationEl = document.getElementById('checkin-duration');
            const checkinData = LalamoveModule.getCheckinStatus();

            if (!checkinData.start) {
                statusEl.innerHTML = 'ยังไม่ได้เช็คอิน';
                durationEl.classList.add('hidden');
                return;
            }

            const startTime = new Date(checkinData.start).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            statusEl.innerHTML = `เริ่มงานเมื่อ <span class="font-semibold text-emerald-400">${startTime}</span>`;

            if (!checkinData.end) {
                durationEl.classList.remove('hidden');
            } else {
                durationEl.classList.add('hidden');
            }
        } catch (e) {
            console.error('[LalamoveUI] updateCheckinUI error:', e);
        }
    }

    function updateLiveDuration() {
        try {
            const durationEl = document.getElementById('checkin-duration');
            const checkinData = LalamoveModule.getCheckinStatus();

            if (!checkinData.start || checkinData.end) {
                durationEl.classList.add('hidden');
                return;
            }

            const start = new Date(checkinData.start);
            const now = new Date();
            const diffMs = now - start;
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);

            durationEl.innerHTML = `ทำงานมาแล้ว <span class="font-mono">${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}</span>`;
            durationEl.classList.remove('hidden');
        } catch (e) {
            console.error('[LalamoveUI] updateLiveDuration error:', e);
        }
    }

    function initEventListeners() {
        try {
            // Check-in button
            const btnCheckin = document.getElementById('btn-checkin');
            if (btnCheckin) {
                btnCheckin.addEventListener('click', () => {
                    console.log('[LalaDaily] Check-in clicked');
                    const success = LalamoveModule.checkIn();
                    console.log('[LalaDaily] checkIn returned:', success);
                    if (success) {
                        updateCheckinUI();
                    }
                });
            }

            // Check-out button
            const btnCheckout = document.getElementById('btn-checkout');
            if (btnCheckout) {
                btnCheckout.addEventListener('click', () => {
                    console.log('[LalaDaily] Check-out clicked');
                    const success = LalamoveModule.checkOut();
                    if (success) {
                        updateCheckinUI();
                    }
                });
            }

            // Other buttons...
            const incomeModal = document.getElementById('income-modal');
            const btnAddIncome = document.getElementById('btn-add-income');
            if (btnAddIncome && incomeModal) {
                btnAddIncome.addEventListener('click', () => {
                    incomeModal.classList.remove('hidden');
                    incomeModal.classList.add('flex');
                });
            }

            const btnCloseIncome = document.getElementById('btn-close-income');
            if (btnCloseIncome) btnCloseIncome.addEventListener('click', () => incomeModal && incomeModal.classList.add('hidden'));
            
            const btnCancelIncome = document.getElementById('btn-cancel-income');
            if (btnCancelIncome) btnCancelIncome.addEventListener('click', () => incomeModal && incomeModal.classList.add('hidden'));
            
            const btnSaveIncome = document.getElementById('btn-save-income');
            if (btnSaveIncome) {
                btnSaveIncome.addEventListener('click', () => {
                    try {
                        const data = {
                            km: parseFloat(document.getElementById('income-km').value) || 0,
                            fare: parseFloat(document.getElementById('income-fare').value) || 0,
                            tip: parseFloat(document.getElementById('income-tip').value) || 0,
                            gp: parseFloat(document.getElementById('income-gp').value) || 0,
                            note: document.getElementById('income-note').value.trim()
                        };
                        if (data.fare <= 0 && data.tip <= 0) {
                            alert('กรุณาระบุรายได้');
                            return;
                        }
                        LalamoveModule.addIncome(data);
                        if (incomeModal) incomeModal.classList.add('hidden');
                        document.getElementById('income-fare').value = '';
                        document.getElementById('income-tip').value = '';
                        document.getElementById('income-gp').value = '';
                    } catch (e) {
                        console.error('[LalaDaily] saveIncome error:', e);
                    }
                });
            }

            // Expense buttons (simplified for brevity)
            const expenseModal = document.getElementById('expense-modal');
            const btnAddExpense = document.getElementById('btn-add-expense');
            if (btnAddExpense && expenseModal) {
                btnAddExpense.addEventListener('click', () => {
                    selectedExpenseCategory = '';
                    document.getElementById('expense-category').value = '';
                    document.querySelectorAll('.expense-cat-btn').forEach(b => b.classList.remove('active', 'bg-emerald-600', 'border-emerald-500'));
                    expenseModal.classList.remove('hidden');
                    expenseModal.classList.add('flex');
                });
            }

            // Export CSV
            const btnExport = document.getElementById('btn-export-csv');
            if (btnExport) {
                btnExport.addEventListener('click', () => {
                    LalamoveModule.exportTodayCSV();
                });
            }

            // Event Bus
            if (window.EventBus) {
                EventBus.on('records:updated', () => {
                    updateSummary();
                    renderTransactions();
                });
                EventBus.on('checkin:updated', updateCheckinUI);
                EventBus.on('checkin:tick', updateLiveDuration);
            }

            console.log('[LalaDaily] Event listeners attached successfully');
        } catch (e) {
            console.error('[LalamoveUI] initEventListeners error:', e);
        }
    }

    function init() {
        console.log('[LalaDaily] LalamoveUI initializing...');
        try {
            updateSummary();
            renderTransactions();
            updateCheckinUI();
            initEventListeners();

            const checkinData = LalamoveModule.getCheckinStatus();
            if (checkinData.start && !checkinData.end) {
                updateLiveDuration();
            }
            console.log('[LalaDaily] LalamoveUI ready');
        } catch (e) {
            console.error('[LalamoveUI] init error:', e);
        }
    }

    return { init };
})();

window.LalamoveUI = LalamoveUI;