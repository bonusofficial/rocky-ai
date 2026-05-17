import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { serializeUser, validateEmail, validateUsername } from "../lib/user";

export const profileRoutes = new Elysia({ prefix: "/profile" })
  .use(requireAuth)

  .get("/", async ({ user, set }) => {
    const fresh = await prisma.user.findUnique({ where: { id: user!.id } });
    if (!fresh) {
      set.status = 404;
      return { error: "USER_NOT_FOUND" };
    }
    return serializeUser(fresh);
  })

  .patch(
    "/",
    async ({ user, body, set }) => {
      const data: { username?: string; email?: string } = {};

      if (body.username !== undefined) {
        if (!validateUsername(body.username)) {
          set.status = 400;
          return { error: "INVALID_USERNAME" };
        }
        data.username = body.username;
      }

      if (body.email !== undefined) {
        if (!validateEmail(body.email)) {
          set.status = 400;
          return { error: "INVALID_EMAIL" };
        }
        data.email = body.email;
      }

      if (Object.keys(data).length === 0) {
        set.status = 400;
        return { error: "NO_FIELDS_TO_UPDATE" };
      }

      try {
        const updated = await prisma.user.update({
          where: { id: user!.id },
          data,
        });
        return serializeUser(updated);
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === "P2002") {
          set.status = 409;
          return { error: "DUPLICATE_FIELD" };
        }
        throw err;
      }
    },
    {
      body: t.Partial(
        t.Object({
          username: t.String({ minLength: 3, maxLength: 32 }),
          email: t.String({ minLength: 3, maxLength: 255 }),
        })
      ),
    }
  )

  .post(
    "/password",
    async ({ user, body, set }) => {
      const u = await prisma.user.findUnique({ where: { id: user!.id } });
      if (!u) {
        set.status = 404;
        return { error: "USER_NOT_FOUND" };
      }
      const ok = await Bun.password.verify(body.currentPassword, u.password);
      if (!ok) {
        set.status = 401;
        return { error: "INVALID_PASSWORD" };
      }
      if (body.newPassword.length < 6) {
        set.status = 400;
        return { error: "PASSWORD_TOO_SHORT" };
      }
      const hashed = await Bun.password.hash(body.newPassword);
      await prisma.user.update({
        where: { id: user!.id },
        data: { password: hashed },
      });
      return { ok: true };
    },
    {
      body: t.Object({
        currentPassword: t.String({ minLength: 1, maxLength: 128 }),
        newPassword: t.String({ minLength: 6, maxLength: 128 }),
      }),
    }
  );