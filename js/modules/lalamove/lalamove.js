const LalamoveModule = (() => {
    let records = [];
    let checkin = { start: null, end: null };
    let timerInterval = null;

    function loadData() {
        records = Storage.get('records', []);
        checkin = Storage.get('checkin', { start: null, end: null });
    }

    function saveData() {
        Storage.set('records', records);
        Storage.set('checkin', checkin);
    }

    function getTodayRecords() {
        const today = new Date().toISOString().split('T')[0];
        return records.filter(r => r.date === today);
    }

    function calculateTodaySummary() {
        const todayRecords = getTodayRecords();
        let totalIncome = 0, totalExpense = 0;
        todayRecords.forEach(r => {
            if (r.type === 'income') totalIncome += r.amount;
            else totalExpense += r.amount;
        });
        return { totalIncome, totalExpense, net: totalIncome - totalExpense, count: todayRecords.length };
    }

    function addIncome(data) {
        const record = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            type: 'income',
            category: 'งานลาล่ามูฟ',
            fare: data.fare || 0,
            tip: data.tip || 0,
            gp: data.gp || 0,
            amount: (data.fare || 0) + (data.tip || 0) - (data.gp || 0),
            km: data.km || 0,
            note: data.note || ''
        };
        records.push(record);
        saveData();
        if (window.EventBus) EventBus.emit('records:updated');
        return record;
    }

    function addExpense(data) {
        const record = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            type: 'expense',
            category: data.category,
            amount: data.amount,
            note: data.note || ''
        };
        records.push(record);
        saveData();
        if (window.EventBus) EventBus.emit('records:updated');
        return record;
    }

    function checkIn() {
        if (checkin.start) return false;
        checkin.start = new Date().toISOString();
        checkin.end = null;
        saveData();
        startLiveTimer();
        if (window.EventBus) EventBus.emit('checkin:updated');
        return true;
    }

    function checkOut() {
        if (!checkin.start) return false;
        checkin.end = new Date().toISOString();
        saveData();
        stopLiveTimer();
        if (window.EventBus) EventBus.emit('checkin:updated');
        return true;
    }

    function startLiveTimer() {
        stopLiveTimer();
        timerInterval = setInterval(() => {
            if (window.EventBus) EventBus.emit('checkin:tick');
        }, 1000);
    }

    function stopLiveTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function getCheckinStatus() {
        return { ...checkin };
    }

    function exportTodayCSV() {
        const todayRecords = getTodayRecords().sort((a, b) => b.id - a.id);
        if (todayRecords.length === 0) {
            alert('ไม่มีรายการวันนี้ให้ export');
            return;
        }
        let csv = 'เวลา,ประเภท,รายได้,ทิป,GP,จำนวนเงิน,กม.,หมวดหมู่,หมายเหตุ\n';
        todayRecords.forEach(r => {
            if (r.type === 'income') {
                csv += `${r.time},รายได้,${r.fare},${r.tip},${r.gp},${r.amount},${r.km},,${r.note}\n`;
            } else {
                csv += `${r.time},รายจ่าย,,,,${r.amount},,${r.category},${r.note}\n`;
            }
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `lalamove_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    function init() {
        loadData();
        if (checkin.start && !checkin.end) startLiveTimer();
    }

    return { init, getTodayRecords, calculateTodaySummary, addIncome, addExpense, checkIn, checkOut, getCheckinStatus, exportTodayCSV };
})();

window.LalamoveModule = LalamoveModule;