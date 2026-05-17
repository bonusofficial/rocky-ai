# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a two-tier app split into independent packages with separate dependency managers:

- **Frontend** (`/`) — SvelteKit 2 + Svelte 5 (runes mode forced via `svelte.config.js`) + Tailwind v4 (via `@tailwindcss/vite`), JS with JSDoc type-checking (`jsconfig.json`, `checkJs: true`). Package manager: **npm**.
- **Backend** (`backend/`) — Elysia (TypeScript) on **Bun**, Prisma 7 against **Supabase Postgres** via the `@prisma/adapter-pg` driver adapter. JWT auth via `@elysiajs/jwt`.

The two trees are fully separate: `backend/` has its own `package.json`, `node_modules/`, and `.git/` (the frontend root is **not** a git repo). Don't try to lint/build them together.

## Frontend commands (run from repo root)

```bash
npm run dev          # vite dev server (5173)
npm run build        # production build
npm run preview      # preview the production build
npm run check        # svelte-kit sync + svelte-check against jsconfig.json
```

No test runner, no linter — `check` (svelte-check) is the only static verification.

## Backend commands (run from `backend/`)

Requires **Bun** ≥ 1.3. Bun-only scripts — do not invoke them with `npm`/`node`.

```bash
bun install
bun run prisma:generate  # regenerate client into backend/generated/prisma
bun run prisma:push      # push schema → Supabase (no migration history)
bun run prisma:migrate   # named migration
bun run prisma:studio    # GUI browser for the DB

bun run dev              # bun run --watch src/index.ts  (Elysia on :3001)
bun run start
```

First-time setup: copy `.env.example` → `.env`, fill `DATABASE_URL` (Supabase URI) + `JWT_SECRET`, then `bun install` → `bun run prisma:generate` → `bun run prisma:push` → `bun run dev`.

## Architecture notes

**Auth flow is BFF-style: SvelteKit holds the cookie, browser never sees the JWT.** Login/register form actions live at `src/routes/login/+page.server.ts` and `src/routes/register/+page.server.ts`. They call backend `/auth/login`/`/auth/register`, receive a JWT, and store it in an HttpOnly `auth_token` cookie. `src/hooks.server.ts` reads the cookie on every request, calls `/auth/me`, and populates `event.locals.user` (plus `event.locals.token` for downstream `+page.server.ts` files). The browser only sees rendered HTML — no `localStorage`, no exposed token. CORS on the backend allows `localhost:5173` for direct calls if ever needed, but the standard path is server-to-server through `src/lib/server/api.ts`.

**Prisma client location is non-standard.** `backend/prisma/schema.prisma` sets `generator client { output = "../generated/prisma" }`, so the client is imported from `../../generated/prisma/client` (see `backend/src/lib/prisma.ts`) — **not** from `@prisma/client`. The `generated/` directory must be regenerated with `bun run prisma:generate` after schema changes.

**Prisma uses the pg driver adapter.** `backend/src/lib/prisma.ts` instantiates `PrismaClient` with `adapter: new PrismaPg({ connectionString })`. Adapter mode means `schema.prisma` has no `url` on its datasource — the connection string is passed in code from `Bun.env.DATABASE_URL`, and `prisma.config.ts` supplies the URL to the Prisma CLI for `db push` / `migrate`. Keep both paths working when changing DB config. Supabase requires `?sslmode=require` on the URL.

**Hot-reload Prisma singleton.** `prisma.ts` stashes the client on `globalThis` outside production so `bun --watch` reloads don't leak connections — preserve this pattern when editing.

**Auth middleware composition.** `backend/src/lib/auth.ts` exports three plugins: `authPlugin` (derives `user` from Bearer header, may be null), `requireAuth` (401 if missing), `requireAdmin` (403 if rank ≠ Admin). Routes that need auth `.use(requireAuth)` and can treat `user` as non-null. JWT payload is `{ sub, rank, exp }` only — fresh user data is fetched per-request via `/auth/me`, so rank changes propagate without re-login.

**User model.** `users` table: `id` (cuid), `username` + `email` (unique), `password` (Bun.password argon2id hash), `credit` + `totalCredit` (Int, default 0), `rank` (enum `Member`/`Admin`, default `Member`), timestamps. Promote a user to admin via Supabase Studio or `UPDATE users SET rank = 'Admin' WHERE username = '...'`.

**Svelte 5 runes are required.** `svelte.config.js` forces `runes: true` for all non-`node_modules` files. Use `$state`, `$derived`, `$props`, `$effect` — legacy `export let` / reactive `$:` syntax will not work.

**Path aliases.** Only `$lib` (→ `src/lib`) is configured. `$lib/server/*` is server-only (enforced by SvelteKit), so `$lib/server/api.ts` is safe for tokens/secrets.

**Page conventions.** `/profile`, `/history`, and the whole `/admin/**` tree are gated. Auth gate goes in `+page.server.ts` `load`: if `!locals.user` → `redirect(303, '/?login=1&redirectTo=...')`. The home Navbar opens its modal automatically when `?login=1` or `?register=1` is in the URL.
