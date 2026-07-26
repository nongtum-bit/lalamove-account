LalaDaily Ultimate - Cloud
=========================

Project Goal
------------
ระบบบัญชีคนขับ Lalamove แบบ Dual Wallet (เครดิตแอป + เงินส่วนตัว) ที่ซิงค์ข้อมูลผ่าน Firebase Authentication + Firestore แบบ Real-time

Current Status (26 Jul 2026) - "LalaDaily Ultimate - Cloud"
----------------------------------------------------------

### Architecture
- **Monolithic Single File**: ทุกอย่างอยู่ใน `index.html` ไฟล์เดียว (ไม่ใช้ modular JS อีกต่อไป)
- **Auth**: Firebase Authentication (Email/Password)
- **Database**: Cloud Firestore (path: `artifacts/{appId}/users/{uid}/data/mainDoc`)
- **UI**: Tailwind CSS + Font Awesome + Chart.js + canvas-confetti
- **Design**: Premium Dark Theme + Glassmorphism + Bottom Sheet (Mobile-first)

### Core Features (ทำงานจริง)

**1. Dual Wallet System**
- เครดิตแอป (Credit) vs เงินส่วนตัว (Personal)
- โอนเงินข้ามกระเป๋า (ถอนเครดิต / เติมเครดิต)
- ระบบปรับปรุงยอด (Adjust Balance) เมื่อยอดไม่ตรงความจริง

**2. Lalamove Module**
- Check-in / Check-out + Live Timer + ค่าแรงเฉลี่ย ฿/ชม.
- บันทึกงานวิ่งละเอียด: Fare + Tip + GP + ระยะทาง + อัตราสิ้นเปลืองหน้าปัด + ราคาน้ำมัน
- คำนวณต้นทุนน้ำมันอัตโนมัติ (ลิตร + ฿/กม.)
- ค่าทางด่วน (เลือกว่าลูกค้าจ่ายหรือคนขับจ่าย)
- แยกประเภท: วิ่งงานปกติ vs โบนัส/ภารกิจ
- Progress Ring เป้าหมายรายวัน + Confetti เมื่อถึงเป้า

**3. Personal Module**
- ติดตามเงินส่วนตัวสะสม
- รายรับ-รายจ่ายวันนี้ (รวมผลกระทบจากงาน Lalamove ที่เป็นเงินสด)
- ใช้ฟังก์ชัน `getPersonalImpact()` แปลงรายการข้ามโมดูลอัตโนมัติ

**4. Analytics & History**
- สลับดู Lalamove / ส่วนตัว
- ช่วงเวลา: 7 วัน / 30 วัน / ระบุเอง
- Bar Chart กำไรสุทธิรายวัน (Chart.js)
- Breakdown สัดส่วนรายรับ-รายจ่าย
- ประวัติรายการจัดกลุ่มตามวัน

**5. Settings & Tools**
- ตั้งเป้าหมายรายวัน / ราคาน้ำมัน / อัตราสิ้นเปลือง / ระยะบำรุงรักษา
- รีเซ็ตระยะทางรถสะสม
- Export CSV ครบทุกฟิลด์ (มี BOM ไทย)
- ล้างข้อมูล Cloud ทั้งหมด
- Logout

### Tech Stack
- Vanilla JS (no framework)
- Tailwind CSS (CDN)
- Firebase Compat SDK v10.8.0 (Auth + Firestore)
- Chart.js
- canvas-confetti
- Font Awesome 6.5.1
- Noto Sans Thai

### Next Priorities
- แยก records ออกเป็น sub-collection (เมื่อข้อมูลเริ่มเยอะ)
- Offline support / IndexedDB fallback
- PWA (Add to Home Screen)
- Monthly P&L Report
- Security Rules แน่นขึ้น

Previous Status (24 Jul 2026)
----------------------------
- LalaDaily Max Pro (localStorage + modular structure)
- มี UI/UX ดี แต่ยังไม่ Cloud Sync
