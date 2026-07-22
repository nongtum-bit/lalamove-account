# AI Context - LalaFinance Project

> **ไฟล์นี้สำหรับ AI** ที่เข้ามาทำงานในโปรเจคนี้
> อ่านไฟล์นี้ให้เข้าใจก่อนเริ่มทำงานทุกครั้ง

---

## 1. Project Overview

**ชื่อโปรเจค**: LalaFinance

**เป้าหมายหลัก**:
- สร้างแอพเดียวที่รวม **2 ระบบ** เข้าด้วยกัน:
  1. **Lalamove Work Tracker** — บันทึกงานขับรถลาล่ามูฟ (รายได้, ค่าใช้จ่ายที่เกี่ยวข้องกับงาน, เช็คอิน-เช็คเอาท์, กำไรสุทธิ)
  2. **Personal Daily Finance** — รายรับ-รายจ่ายในชีวิตประจำวัน (แยกจากงานลาล่ามูฟ)

**ลักษณะโปรเจค**:
- Progressive Web App (PWA) แบบ Single Page Application
- Deploy บน GitHub Pages
- ใช้ LocalStorage เป็นหลัก
- มีแผนเชื่อมต่อ Google Sheets แบบอัตโนมัติในอนาคต
- เน้นความยั่งยืนและการขยายตัวได้ (Scalable Architecture)

**ผู้ใช้เป้าหมาย**: คนขับลาล่ามูฟที่ต้องการจัดการการเงินทั้งงานและชีวิตส่วนตัวในที่เดียว

---

## 2. Current Status (อัพเดทล่าสุด: 22 กรกฎาคม 2026)

### สถานะปัจจุบัน

| Phase | ชื่อ | สถานะ | รายละเอียด |
|-------|------|-------|----------|
| **Phase 0** | Foundation & Architecture | ✅ เสร็จ | วางโครงสร้าง Core Layer, Event Bus, Router, Storage |
| **Phase 1** | Lalamove Module | 🔄 กำลังพัฒนา | ย้ายโค้ด Lalamove เข้าโมดูลแล้วบางส่วน (ยังไม่สมบูรณ์ 100%) |
| **Phase 2** | Personal Finance Module | ⏳ ยังไม่เริ่ม | ยังเป็น placeholder |
| **Phase 3** | Cross-cutting Features | ⏳ ยังไม่เริ่ม | Notification, Vibration, Settings |
| **Phase 4** | Google Sheets Integration | ⏳ ยังไม่เริ่ม | ยังไม่ได้เริ่ม |

### สิ่งที่ใช้งานได้ในตอนนี้
- Lalamove พื้นฐาน (เช็คอิน, สรุปวันนี้, แสดงรายการ)
- สามารถสลับระหว่าง Lalamove กับ Personal Finance ได้ (ผ่าน Router)
- โครงสร้างโค้ดแบบ Modular

### สิ่งที่ยังไม่สมบูรณ์
- โค้ด Lalamove ยังย้ายเข้าโมดูลไม่ครบ 100% (Modal, Toast, การแก้ไข/ลบ แบบเต็ม)
- Personal Finance ยังเป็น placeholder
- ยังไม่มีระบบแจ้งเตือนและ Vibration

---

## 3. Architecture (สำคัญมาก)

### Layering (ห้ามละเมิด)

| Layer | ชื่อ | หน้าที่ | ตัวอย่างไฟล์ |
|-------|------|--------|-------------|
| **Core** | Core Layer | ส่วนกลางของระบบ, จัดการการสื่อสาร | `event-bus.js`, `router.js`, `storage.js`, `app.js` |
| **Module** | Domain Module | โมดูลเฉพาะโดเมน (Lalamove / Personal Finance) | `lalamove.js`, `finance.js` |
| **UI** | UI Layer | การแสดงผล, Event Handling | `lalamove-ui.js` |
| **Service** | Service Layer | บริการภายนอก (Google Sheets, Notification) | `google-sheets.service.js` |

### กฎสำคัญ (ห้ามทำผิด)

1. **แต่ละโมดูลห้ามเรียกกันโดยตรง** — ต้องสื่อสารผ่าน `EventBus` เท่านั้น
2. **Core Layer** เป็นคนกลางเท่านั้น
3. **ห้ามใส่ Business Logic** ลงใน UI Layer
4. **ห้ามใส่ UI Logic** ลงใน Core Layer
5. แต่ละโมดูลต้องมีไฟล์แยกชัดเจน (`module-name.js` + `module-name-ui.js`)
6. ใช้ `data-*` attribute ในการจัดการ Event Delegation

### Event Bus Pattern

```js
// ส่ง event
EventBus.emit('transaction:added', { module: 'lalamove', data: record });

// รับ event
EventBus.on('transaction:added', (payload) => {
    // ทำอะไรบางอย่าง
});
```

---

## 4. Development Principles

- **แยกเลเยอร์ชัดเจน** — ทุกครั้งที่เขียนโค้ด ต้องคิดก่อนว่าอยู่ Layer ไหน
- **ย้ำคิดย้ำทำ** — ก่อนเขียนโค้ด ต้องเข้าใจ Requirement ให้ชัดเจนก่อน
- **เขียนโค้ดแบบมีระบบ** — มีคอมเมนต์อธิบาย ใช้ชื่อตัวแปรและฟังก์ชันที่สื่อความหมาย
- **ทำให้เสร็จก่อน** — ทำงานให้เสร็จในระดับที่ใช้งานได้ก่อน แล้วค่อย optimize
- **อัพเดทสถานะ** — ทุกครั้งที่ทำงานเสร็จ ต้องอัพเดท `AI_CONTEXT.md` ด้วย

---

## 5. Module Structure

```
lala-finance/
├── index.html
├── AI_CONTEXT.md                 ← ไฟล์นี้
├── css/
│   └── styles.css
├── js/
│   ├── core/
│   │   ├── app.js
│   │   ├── router.js
│   │   ├── event-bus.js
│   │   └── storage.js
│   ├── modules/
│   │   ├── lalamove/
│   │   │   ├── lalamove.js          ← ตรรกะหลัก
│   │   │   └── lalamove-ui.js       ← UI + Event
│   │   └── personal-finance/
│   │       ├── finance.js
│   │       └── finance-ui.js
│   └── services/
│       ├── google-sheets.service.js
│       └── notification.service.js
```

---

## 6. Next Priorities (สิ่งที่ต้องทำต่อ)

### ลำดับความสำคัญ (เรียงจากสำคัญที่สุด)

1. **ทำให้ Lalamove Module สมบูรณ์ 100%**
   - ย้ายโค้ด Modal, Toast, การแก้ไข/ลบ, การคำนวณ GP + น้ำมัน + สึกหรอ เข้าโมดูลให้ครบ
   - ทดสอบให้ใช้งานได้จริง

2. **สร้าง Personal Finance Module พื้นฐาน**
   - สร้างโครงสร้างโมดูล
   - สร้าง CRUD รายรับ-รายจ่ายพื้นฐาน
   - แยกข้อมูลจาก Lalamove ชัดเจน

3. **พัฒนา Cross-cutting Features**
   - ระบบแจ้งเตือน (Notification)
   - Vibration feedback
   - การตั้งค่าทั่วไป

4. **Google Sheets Integration**
   - เชื่อมต่อแบบอัตโนมัติ (สองทาง)

5. **Polish & Testing**
   - ปรับ UX
   - เพิ่ม Error handling
   - เขียนคอมเมนต์ให้ครบ

---

## 7. Important Notes for AI

- **ห้ามเดา Requirement** — ถ้าไม่แน่ใจ ต้องถามผู้ใช้ก่อน
- **ห้ามเขียนโค้ดแบบมั่ว** — ต้องมีเหตุผลและเป็นไปตาม Architecture
- **ทุกครั้งที่ทำงานเสร็จ** ต้องอัพเดทสถานะในไฟล์ `AI_CONTEXT.md` ด้วย
- **โค้ดที่เขียนต้องอ่านง่าย** และมีคอมเมนต์อธิบาย
- **ถ้าต้องการ refactor โค้ดเก่า** ต้องทำแบบค่อยเป็นค่อยไป ไม่ทำให้ระบบพัง

---

## 8. How to Work with This Project (สำหรับ AI)

1. อ่าน `AI_CONTEXT.md` ให้เข้าใจก่อนทุกครั้ง
2. ตรวจสอบสถานะปัจจุบันในตาราง Phase
3. ทำงานตามลำดับความสำคัญ (Next Priorities)
4. หลังจากทำงานเสร็จ 1 อย่าง ต้องทดสอบและอัพเดทสถานะ
5. ถ้าต้องการเปลี่ยน Architecture ต้องเสนอเหตุผลก่อน

---

## 9. Working Rules (สำคัญ - กฎการทำงาน)

**กฎที่ผู้ใช้กำหนด (22 กรกฎาคม 2026)**:

1. สแกนโค้ดทั้งหมดทุกไฟล์แล้ววิเคราะห์และทำความเข้าใจให้ละเอียดแบบ expert ก่อนลงมือทำ
2. ทำงานให้เสร็จ — คิดเอง ออกแบบเอง และทำเองได้เลย (ผู้ใช้จะทดสอบแล้วสั่งแก้ทีหลัง)
3. หลังจากอัพเดท/แก้ไขทุกครั้ง ต้องอัพเดทไฟล์ `AI_CONTEXT.md` โดย:
   - ห้ามแก้ไขส่วนเดิม
   - ต้องเพิ่มเป็นประวัติการทำงาน (Work History Log)
   - ระบุให้ชัดเจน
4. ทำงานให้เสร็จทุกครั้งก่อนตอบกลับผู้ใช้

---

## 10. Work History Log

**รูปแบบการบันทึก**:
- วันที่และเวลา
- สิ่งที่ทำ
- ไฟล์ที่เปลี่ยนแปลง
- สถานะ
- หมายเหตุ

---

### [2026-07-22 08:20] - สร้างกฎการทำงานและอัพเดท AI_CONTEXT.md

**สิ่งที่ทำ**:
- เพิ่มส่วน "Working Rules" (ข้อ 9) ตามที่ผู้ใช้กำหนด
- เพิ่มส่วน "Work History Log" (ข้อ 10) สำหรับบันทึกประวัติการทำงานในอนาคต

**ไฟล์ที่เปลี่ยนแปลง**:
- `AI_CONTEXT.md` (เพิ่มส่วนใหม่ 2 ส่วน)

**สถานะ**:
- ✅ เสร็จ

**หมายเหตุ**:
- นี่คือการอัพเดทครั้งแรกตามกฎใหม่ที่ผู้ใช้กำหนด
- ต่อจากนี้ทุกการทำงานจะต้องบันทึกในส่วนนี้

---

**ไฟล์นี้ควรถูกอัพเดททุกครั้งที่มีการพัฒนาโปรเจค**