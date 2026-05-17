# Rocky AI API — Elysia + Prisma + Supabase Postgres

Elysia (TypeScript) บน Bun ต่อ Supabase Postgres ผ่าน Prisma 7 driver adapter
(`@prisma/adapter-pg`) มี JWT auth (`@elysiajs/jwt`) และ CORS เปิดให้ SvelteKit
dev server (`http://localhost:5173`)

## สิ่งที่ต้องมี

- `Bun` ≥ 1.3
- โปรเจกต์ Supabase และ connection string (Project Settings → Database →
  Connection string → URI)

## เริ่มใช้งานครั้งแรก

```bash
# 1) ติดตั้ง deps
bun install

# 2) คัดลอก .env.example → .env แล้วใส่ DATABASE_URL กับ JWT_SECRET ของคุณ
cp .env.example .env

# 3) สร้าง Prisma client เข้า ./generated/prisma
bun run prisma:generate

# 4) push schema ขึ้น Supabase (สร้างตาราง users + enum Rank)
bun run prisma:push

# 5) เริ่ม dev server (watch mode, port 3001 ตาม .env)
bun run dev
```

ตรวจ:
- `GET http://localhost:3001/health` → `{ status: "ok" }`
- `GET http://localhost:3001/health/db` → `{ status: "ok", database: "connected" }`

## Auth endpoints

```
POST  /auth/register      { username, email, password }            → { token, user }
POST  /auth/login         { identifier, password }                 → { token, user }
GET   /auth/me            (Bearer token)                           → user

GET   /profile            (Bearer token)                           → user
PATCH /profile            (Bearer) { username?, email? }           → user
POST  /profile/password   (Bearer) { currentPassword, newPassword } → { ok: true }
```

`identifier` ใน `/auth/login` รับได้ทั้ง username หรือ email
รหัสผ่านถูก hash ด้วย `Bun.password` (argon2id)
JWT มี payload `{ sub, rank, exp }` อายุ 7 วัน เซ็นด้วย `JWT_SECRET`

## Schema

```prisma
enum Rank { Member  Admin }

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  password    String
  credit      Int      @default(0)
  totalCredit Int      @default(0) @map("total_credit")
  rank        Rank     @default(Member)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt      @map("updated_at")
  @@map("users")
}
```

ผู้ใช้ใหม่จะถูกตั้ง `rank = Member` โดยอัตโนมัติ
ตั้งใครเป็น Admin: เปิด Supabase Studio → table `users` → แก้ค่า `rank` เป็น `Admin`
หรือรัน:

```sql
UPDATE users SET rank = 'Admin' WHERE username = 'rocky_root';
```

## Scripts

```bash
bun run dev               # watch mode
bun run start             # production run

bun run prisma:generate   # regenerate ./generated/prisma
bun run prisma:push       # push schema → Supabase (no migration history)
bun run prisma:migrate    # create + apply a named migration
bun run prisma:studio     # GUI browser for the DB
```

## หมายเหตุ

- **เปลี่ยน `JWT_SECRET`** ใน production และเก็บใน secret manager
- ถ้าเปลี่ยน `DATABASE_URL` ใหม่ใน `.env` ให้รัน `bun run prisma:generate` แล้ว `bun run prisma:push` อีกครั้ง
- Prisma client ถูก generate ไปที่ `../generated/prisma` (ไม่ใช่ `@prisma/client`)
  ตามที่ตั้งใน `prisma/schema.prisma`
- `docker-compose.yml` เก่าสำหรับ MySQL local ไม่ใช้แล้ว ลบทิ้งได้ถ้าไม่ต้องการ
