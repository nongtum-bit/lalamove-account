/**
 * Router (Core Layer)
 * 
 * จัดการการสลับระหว่างโมดูลต่าง ๆ (Lalamove <-> Personal Finance)
 * ใช้แสดง/ซ่อน section ตาม module ที่เลือก
 * 
 * ตัวอย่างการใช้งาน:
 *   Router.navigate('lalamove');
 *   Router.navigate('personal-finance');
 */

const Router = (() => {
    let currentModule = null;
    const modules = {};

    return {
        /**
         * ลงทะเบียนโมดูล
         * @param {string} name - ชื่อโมดูล (เช่น 'lalamove', 'personal-finance')
         * @param {Object} moduleInstance - อินสแตนซ์ของโมดูล
         */
        register(name, moduleInstance) {
            modules[name] = moduleInstance;
        },

        /**
         * สลับไปยังโมดูลที่ต้องการ
         * @param {string} moduleName
         */
        navigate(moduleName) {
            if (!modules[moduleName]) {
                console.error(`[Router] Module "${moduleName}" not found.`);
                return;
            }

            // ซ่อนโมดูลปัจจุบัน
            if (currentModule && modules[currentModule].hide) {
                modules[currentModule].hide();
            }

            // แสดงโมดูลใหม่
            currentModule = moduleName;
            if (modules[currentModule].show) {
                modules[currentModule].show();
            }

            // ส่ง event แจ้งการเปลี่ยนโมดูล
            if (window.EventBus) {
                window.EventBus.emit('router:changed', { module: moduleName });
            }

            console.log(`[Router] Navigated to: ${moduleName}`);
        },

        /**
         * ได้โมดูลปัจจุบัน
         */
        getCurrent() {
            return currentModule;
        }
    };
})();

// Export
window.Router = Router;