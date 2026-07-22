const Storage = (() => {
    const PREFIX = 'lalamove_';

    return {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(PREFIX + key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(PREFIX + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        remove(key) {
            localStorage.removeItem(PREFIX + key);
        },
        exportAll() {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(PREFIX)) {
                    data[key] = localStorage.getItem(key);
                }
            }
            return data;
        }
    };
})();

window.Storage = Storage;