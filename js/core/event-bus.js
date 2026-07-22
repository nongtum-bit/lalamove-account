/**
 * Event Bus (Core Layer)
 * 
 * ใช้สำหรับการสื่อสารระหว่างโมดูลต่าง ๆ โดยไม่ให้โมดูลรู้จักกันโดยตรง
 * หลักการ: Publish / Subscribe
 */

const EventBus = (() => {
    const events = {};

    return {
        on(eventName, handler) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(handler);
        },
        off(eventName, handler) {
            if (!events[eventName]) return;
            events[eventName] = events[eventName].filter(h => h !== handler);
        },
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
        clear() {
            Object.keys(events).forEach(key => delete events[key]);
        }
    };
})();

window.EventBus = EventBus;