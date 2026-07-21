/**
 * Storage Service (Core Layer)
 * 
 * จัดการการอ่าน/เขียนข้อมูลจาก LocalStorage
 * ในอนาคตจะขยายไปรองรับ Google Sheets sync
 * 
 * หลักการ: แต่ละโมดูลควรมี key ของตัวเอง (เช่น 'lalamove_records', 'finance_records')
 */

const Storage = {
    /**
     * โหลดข้อมูลจาก LocalStorage
     * @param {string} key
     * @param {any} defaultValue - ค่าเริ่มต้นถ้าไม่มีข้อมูล
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`[Storage] Failed to load key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * บันทึกข้อมูลลง LocalStorage
     * @param {string} key
     * @param {any} value
     */
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`[Storage] Failed to save key "${key}":`, error);
            return false;
        }
    },

    /**
     * ลบข้อมูล
     * @param {string} key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`[Storage] Failed to remove key "${key}":`, error);
            return false;
        }
    },

    /**
     * ล้างข้อมูลทั้งหมด (ใช้ด้วยความระมัดระวัง)
     */
    clearAll() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('[Storage] Failed to clear all data:', error);
            return false;
        }
    }
};

// Export
window.Storage = Storage;