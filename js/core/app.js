/**
 * App (Core Layer)
 * 
 * จุดเริ่มต้นของแอพพลิเคชัน
 * รับผิดชอบ:
 * - โหลดโมดูล Lalamove
 * - เรียกใช้ LalamoveUI
 */

const App = (() => {
    return {
        init() {
            console.log('%c[LalaDaily] Initializing modular application...', 'color:#10b981');

            if (window.LalamoveModule) LalamoveModule.init();
            if (window.LalamoveUI) LalamoveUI.init();

            // Router setup
            if (window.Router) {
                Router.register('lalamove', {
                    show: () => document.getElementById('module-lalamove').classList.add('active'),
                    hide: () => document.getElementById('module-lalamove').classList.remove('active')
                });
                Router.register('personal-finance', {
                    show: () => document.getElementById('module-personal-finance').classList.add('active'),
                    hide: () => document.getElementById('module-personal-finance').classList.remove('active')
                });
            }

            console.log('%c[LalaDaily] Application initialized successfully (Modular v2).', 'color:#10b981');
        }
    };
})();

window.App = App;
window.addEventListener('load', () => App.init());