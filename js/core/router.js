/**
 * Router (Core Layer)
 * 
 * จัดการการสลับระหว่างโมดูลต่าง ๆ
 */

const Router = (() => {
    let currentModule = null;
    const modules = {};

    return {
        register(name, moduleInstance) {
            modules[name] = moduleInstance;
        },
        navigate(moduleName) {
            if (!modules[moduleName]) {
                console.error(`[Router] Module "${moduleName}" not found.`);
                return;
            }

            if (currentModule && modules[currentModule].hide) {
                modules[currentModule].hide();
            }

            currentModule = moduleName;
            if (modules[currentModule].show) {
                modules[currentModule].show();
            }

            if (window.EventBus) {
                window.EventBus.emit('router:changed', { module: moduleName });
            }

            console.log(`[Router] Navigated to: ${moduleName}`);
        },
        getCurrent() {
            return currentModule;
        }
    };
})();

window.Router = Router;