/**
 * Event Bus (Core Layer)
 * 
 * ใช้สำหรับการสื่อสารระหว่างโมดูลต่าง ๆ โดยไม่ให้โมดูลรู้จักกันโดยตรง
 * หลักการ: Publish / Subscribe
 * 
 * ตัวอย่างการใช้งาน:
 *   eventBus.emit('transaction:added', { module: 'lalamove', data: record });
 *   eventBus.on('transaction:added', handler);
 */

const EventBus = (() => {
    const events = {};

    return {
        /**
         * สมัครฟัง event
         * @param {string} eventName - ชื่อ event
         * @param {Function} handler - ฟังก์ชันที่ต้องการให้ทำงานเมื่อ event เกิดขึ้น
         */
        on(eventName, handler) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(handler);
        },

        /**
         * ยกเลิกการสมัครฟัง event
         * @param {string} eventName
         * @param {Function} handler
         */
        off(eventName, handler) {
            if (!events[eventName]) return;
            events[eventName] = events[eventName].filter(h => h !== handler);
        },

        /**
         * ส่ง event ไปยังผู้ที่สมัครฟัง
         * @param {string} eventName
         * @param {any} data - ข้อมูลที่ต้องการส่งไปด้วย
         */
        emit(eventName, data) {
            if (!events[eventName]) return;
            events[eventName].forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`[EventBus] Error in handler for "${eventName}":`, error);
                }
            });
        },

        /**
         * ล้าง event ทั้งหมด (ใช้ตอนทดสอบหรือรีเซ็ต)
         */
        clear() {
            Object.keys(events).forEach(key => delete events[key]);
        }
    };
})();

// Export สำหรับใช้ในโมดูลอื่น
window.EventBus = EventBus;