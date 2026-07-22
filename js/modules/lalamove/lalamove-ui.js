/**
 * Lalamove UI Module
 * 
 * จัดการส่วนแสดงผลและ Event Handling ของโมดูล Lalamove
 */

const LalamoveUI = (() => {
    function initUI() {
        // Setup buttons
        const checkinBtn = document.getElementById('btn-checkin');
        const checkoutBtn = document.getElementById('btn-checkout');
        const addIncomeBtn = document.getElementById('btn-add-income');
        const addExpenseBtn = document.getElementById('btn-add-expense');

        if (checkinBtn) checkinBtn.onclick = () => LalamoveModule.checkIn && LalamoveModule.checkIn();
        if (checkoutBtn) checkoutBtn.onclick = () => LalamoveModule.checkOut && LalamoveModule.checkOut();
        if (addIncomeBtn) addIncomeBtn.onclick = () => alert('เปิด Modal บันทึกงาน (กำลังพัฒนา)');
        if (addExpenseBtn) addExpenseBtn.onclick = () => alert('เปิด Modal ค่าใช้จ่าย (กำลังพัฒนา)');

        console.log('%c[LalamoveUI] UI initialized', 'color:#10b981');
    }

    return {
        init: initUI
    };
})();

window.LalamoveUI = LalamoveUI;