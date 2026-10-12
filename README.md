# AI Studio — MVP 1.0

เว็บแอปภาษาไทยสำหรับเขียนบทหนัง ซีรีส์ และการ์ตูน จัดการ Character Bible แบ่งตอน/ฉาก และสร้าง Prompt สำหรับนำไปใช้กับ Google Flow หรือเตรียมเชื่อมต่อ Video API

## สิ่งที่ใช้งานได้ใน MVP
- สร้างและแก้ไขโปรเจกต์ เรื่องย่อ แนวเรื่อง สไตล์ภาพ และอัตราส่วนวิดีโอ
- เพิ่มตอนและฉาก พร้อมระยะเวลา การกระทำ บทพูด มุมกล้อง และ SFX
- จัดเก็บตัวละคร รูปลักษณ์ เสื้อผ้า เสียง และกฎความต่อเนื่อง
- สร้าง Prompt ภาษาไทยอัตโนมัติจากข้อมูลโปรเจกต์/ตัวละคร/ฉาก
- คัดลอก Prompt, ดาวน์โหลด Prompt `.txt`, ส่งออกและนำเข้าโปรเจกต์ `.json`
- บันทึกอัตโนมัติใน localStorage ของเบราว์เซอร์
- Responsive UI สำหรับมือถือและคอมพิวเตอร์
- มี schema ตัวอย่างสำหรับ Supabase พร้อม RLS แบบจำกัดข้อมูลตามผู้ใช้

## สิ่งที่ยังไม่เปิดใช้
- การเข้าสู่ระบบและ cloud sync ผ่าน Supabase ยังไม่เชื่อมใน UI
- Google Flow ยังเปิดผ่านลิงก์และใช้วิธีคัดลอก Prompt ไม่ได้สั่ง Flow โดยตรง
- การสร้างวิดีโอผ่าน API ยังไม่เชื่อม provider
- การรวมคลิป/ตัดต่อวิดีโออัตโนมัติยังไม่อยู่ใน MVP

อย่าแสดงว่ามีวิดีโอถูกสร้างแล้ว หากไม่มีการตอบกลับจากผู้ให้บริการจริง

## เปิดใช้งานบนเครื่อง
ต้องติดตั้ง Node.js รุ่น LTS ก่อน จากโฟลเดอร์โปรเจกต์รัน:

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal

ทดสอบ build สำหรับ production:

```bash
npm run build
npm run preview
```

## Deploy บน Netlify
1. แตกไฟล์ ZIP แล้วอัปโหลดโฟลเดอร์ไปยัง GitHub repository ใหม่
2. ใน Netlify เลือก Add new site → Import an existing project → เลือก repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy site

มี `netlify.toml` ตั้งค่า build และ SPA redirect ไว้แล้ว

## Supabase
ไฟล์ `supabase/schema.sql` เป็นตัวอย่าง schema สำหรับ cloud sync ในขั้นต่อไป ยังไม่จำเป็นสำหรับทดลอง MVP บนเครื่องนี้ หากจะเปิดใช้ ให้ตั้งค่า Supabase Auth, รัน SQL ในโปรเจกต์ที่เลือก, เชื่อม UI ด้วยการตรวจสอบ session และทดสอบ RLS ก่อนใช้งานจริง

ค่าที่ frontend ใช้ได้เฉพาะ URL และ publishable/anon key:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

ห้ามใส่ service_role/secret key ใน frontend, `.env` ที่ commit หรือ GitHub

## เชื่อมต่อ Video API ในอนาคต
ให้สร้าง backend/serverless endpoint เพื่อถือ API key และส่งงานไปยังผู้ให้บริการวิดีโอ ใช้ status tracking และบันทึก URL ของคลิปที่ผู้ให้บริการส่งกลับมา ห้ามส่ง secret key ผ่าน browser หรือตัวแปร `VITE_*`

## หมายเหตุเรื่องการบันทึก
โหมดปัจจุบันเก็บข้อมูลใน browser เครื่องนี้เท่านั้น การล้าง site data หรือเปลี่ยนอุปกรณ์อาจทำให้ข้อมูลหาย ควรส่งออก JSON เป็นระยะจนกว่าจะเปิด cloud sync
