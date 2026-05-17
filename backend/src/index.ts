import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { resolve } from "node:path";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./routes/auth";
import { profileRoutes } from "./routes/profile";
import { catalogRoutes } from "./routes/catalog";
import { adminRoutes } from "./routes/admin";

const port = Number(Bun.env.PORT ?? 3001);
const host = Bun.env.HOST ?? "0.0.0.0";

const UPLOADS_ROOT = resolve(import.meta.dir, "..", "uploads");
const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const app = new Elysia()
  .use(
    cors({
      origin: (Bun.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
      credentials: true,
    })
  )
  .get("/", () => ({
    message: "Rocky AI API",
    endpoints: {
      health: "/health",
      database: "/health/db",
      auth: ["/auth/register", "/auth/login", "/auth/me"],
      profile: ["/profile"],
      catalog: ["/categories", "/products", "/products/:idOrSku"],
      admin: [
        "/admin/categories",
        "/admin/products",
        "/admin/stock",
        "/admin/stock/pools",
      ],
    },
  }))
  .get("/health", () => ({ status: "ok", service: "backend" }))
  .get("/uploads/*", async ({ params, set }) => {
    const rel = (params as { "*": string })["*"] ?? "";
    if (rel.includes("..") || rel.includes("\0")) {
      set.status = 400;
      return { error: "BAD_PATH" };
    }
    const full = resolve(UPLOADS_ROOT, rel);
    const { sep } = require("node:path");
    if (!full.startsWith(UPLOADS_ROOT + sep) && full !== UPLOADS_ROOT) {
      set.status = 400;
      return { error: "BAD_PATH" };
    }
    const file = Bun.file(full);
    if (!(await file.exists())) {
      set.status = 404;
      return { error: "NOT_FOUND" };
    }
    const ext = rel.split(".").pop()?.toLowerCase() ?? "";
    const type = MIME[ext];
    if (type) set.headers["content-type"] = type;
    set.headers["cache-control"] = "public, max-age=86400";
    return file;
  })
  .get("/health/db", async ({ set }) => {
    try {
      const result =
        await prisma.$queryRaw<Array<{ ok: number | bigint | string }>>`SELECT 1 AS ok`;
      const ok = Number(result[0]?.ok ?? 0);
      return {
        status: "ok",
        database: ok === 1 ? "connected" : "unexpected",
      };
    } catch (error) {
      set.status = 500;
      return {
        status: "error",
        database: "disconnected",
        message:
          error instanceof Error ? error.message : "Unknown database error",
      };
    }
  })
  .use(authRoutes)
  .use(profileRoutes)
  .use(catalogRoutes)
  .use(adminRoutes)
  .listen({ port, hostname: host });

console.log(`Elysia is running at http://${app.server?.hostname}:${port}`);
