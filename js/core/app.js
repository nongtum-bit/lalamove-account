/**
 * App (Core Layer)
 * 
 * จุดเริ่มต้นของแอพพลิเคชัน
 * รับผิดชอบ:
 * - โหลดข้อมูลพื้นฐาน
 * - ลงทะเบียนโมดูล
 * - เริ่มต้น Router
 * - กำหนดโมดูลเริ่มต้น
 */

const App = (() => {
    let initialized = false;

    return {
        /**
         * เริ่มต้นแอพพลิเคชัน
         */
        init() {
            if (initialized) return;
            initialized = true;

            console.log('%c[LalaFinance] Initializing application...', 'color:#10b981');

            // โหลดข้อมูลพื้นฐาน (ถ้ามี)
            if (window.Storage) {
                // สามารถโหลดการตั้งค่าทั่วไปได้ที่นี่
            }

            // TODO: ลงทะเบียนโมดูล (จะเพิ่มในขั้นตอนต่อไป)
            // Router.register('lalamove', LalamoveModule);
            // Router.register('personal-finance', PersonalFinanceModule);

            // TODO: กำหนดโมดูลเริ่มต้น
            // Router.navigate('lalamove');

            console.log('%c[LalaFinance] Application initialized successfully.', 'color:#10b981');
        }
    };
})();

// เริ่มต้นแอพเมื่อโหลดหน้าเสร็จ
window.addEventListener('load', () => {
    if (window.App) {
        window.App.init();
    }
});

// Export
window.App = App;