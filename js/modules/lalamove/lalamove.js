const LalamoveModule = (() => {
    let records = [];
    let checkin = { start: null, end: null };
    let timerInterval = null;

    function loadData() {
        try {
            records = Storage.get('records', []);
            checkin = Storage.get('checkin', { start: null, end: null });
        } catch (e) {
            console.error('[LalamoveModule] loadData error:', e);
            records = [];
            checkin = { start: null, end: null };
        }
    }

    function saveData() {
        try {
            Storage.set('records', records);
            Storage.set('checkin', checkin);
        } catch (e) {
            console.error('[LalamoveModule] saveData error:', e);
        }
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

        return {
            totalIncome,
            totalExpense,
            net: totalIncome - totalExpense,
            count: todayRecords.length
        };
    }

    function addIncome(data) {
        try {
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
        } catch (e) {
            console.error('[LalamoveModule] addIncome error:', e);
            return null;
        }
    }

    function addExpense(data) {
        try {
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
        } catch (e) {
            console.error('[LalamoveModule] addExpense error:', e);
            return null;
        }
    }

    function checkIn() {
        try {
            if (checkin.start) {
                console.log('[LalamoveModule] Already checked in');
                return false;
            }
            checkin.start = new Date().toISOString();
            checkin.end = null;
            saveData();
            startLiveTimer();
            if (window.EventBus) EventBus.emit('checkin:updated');
            console.log('[LalamoveModule] Check-in successful');
            return true;
        } catch (e) {
            console.error('[LalamoveModule] checkIn error:', e);
            return false;
        }
    }

    function checkOut() {
        try {
            if (!checkin.start) return false;
            checkin.end = new Date().toISOString();
            saveData();
            stopLiveTimer();
            if (window.EventBus) EventBus.emit('checkin:updated');
            console.log('[LalamoveModule] Check-out successful');
            return true;
        } catch (e) {
            console.error('[LalamoveModule] checkOut error:', e);
            return false;
        }
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
        try {
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
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `lalamove_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        } catch (e) {
            console.error('[LalamoveModule] exportTodayCSV error:', e);
            alert('เกิดข้อผิดพลาดในการ export CSV');
        }
    }

    function init() {
        console.log('[LalamoveModule] Initializing...');
        loadData();
        if (checkin.start && !checkin.end) {
            startLiveTimer();
        }
        console.log('[LalamoveModule] Initialized successfully');
    }

    return {
        init,
        getTodayRecords,
        calculateTodaySummary,
        addIncome,
        addExpense,
        checkIn,
        checkOut,
        getCheckinStatus,
        exportTodayCSV
    };
})();

window.LalamoveModule = LalamoveModule;