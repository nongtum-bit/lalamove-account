const LalamoveUI = (() => {
    function updateCheckinUI() {
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
    }

    function updateLiveDuration() {
        const durationEl = document.getElementById('checkin-duration');
        const checkinData = LalamoveModule.getCheckinStatus();
        if (!checkinData.start || checkinData.end) {
            durationEl.classList.add('hidden');
            return;
        }
        const start = new Date(checkinData.start);
        const now = new Date();
        const diffMs = now - start;
        const h = Math.floor(diffMs / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0');
        durationEl.innerHTML = `ทำงานมาแล้ว <span class="font-mono">${h}:${m}:${s}</span>`;
        durationEl.classList.remove('hidden');
    }

    function init() {
        // Minimal init, main logic is in global functions in index.html for maximum compatibility
        console.log('[LalaDaily] UI ready (using global fallback for mobile)');
        // Update initial state
        if (window.LalamoveModule) {
            const summary = LalamoveModule.calculateTodaySummary();
            document.getElementById('total-income').textContent = summary.totalIncome.toLocaleString();
            document.getElementById('total-expense').textContent = summary.totalExpense.toLocaleString();
            document.getElementById('real-net').textContent = summary.net.toLocaleString();
            document.getElementById('transaction-count').textContent = summary.count + ' รายการ';
            updateCheckinUI();
        }
    }

    return { init, updateCheckinUI };
})();

window.LalamoveUI = LalamoveUI;