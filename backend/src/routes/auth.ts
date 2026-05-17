import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";
import { authPlugin, requireAuth } from "../lib/auth";
import { serializeUser, validateEmail, validateUsername } from "../lib/user";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)

  .post(
    "/register",
    async ({ body, jwt, set }) => {
      const { username, email, password } = body;

      if (!validateUsername(username)) {
        set.status = 400;
        return { error: "INVALID_USERNAME" };
      }
      if (!validateEmail(email)) {
        set.status = 400;
        return { error: "INVALID_EMAIL" };
      }
      if (password.length < 6) {
        set.status = 400;
        return { error: "PASSWORD_TOO_SHORT" };
      }

      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { email: true, username: true },
      });
      if (existing) {
        set.status = 409;
        return {
          error:
            existing.email === email ? "EMAIL_TAKEN" : "USERNAME_TAKEN",
        };
      }

      const hashed = await Bun.password.hash(password);
      const user = await prisma.user.create({
        data: { username, email, password: hashed },
      });

      const token = await jwt.sign({ sub: user.id, rank: user.rank });
      return { token, user: serializeUser(user) };
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 32 }),
        email: t.String({ minLength: 3, maxLength: 255 }),
        password: t.String({ minLength: 6, maxLength: 128 }),
      }),
    }
  )

  .post(
    "/login",
    async ({ body, jwt, set }) => {
      const { identifier, password } = body;

      const user = await prisma.user.findFirst({
        where: { OR: [{ email: identifier }, { username: identifier }] },
      });
      if (!user) {
        set.status = 401;
        return { error: "INVALID_CREDENTIALS" };
      }

      const ok = await Bun.password.verify(password, user.password);
      if (!ok) {
        set.status = 401;
        return { error: "INVALID_CREDENTIALS" };
      }

      const token = await jwt.sign({ sub: user.id, rank: user.rank });
      return { token, user: serializeUser(user) };
    },
    {
      body: t.Object({
        identifier: t.String({ minLength: 1, maxLength: 255 }),
        password: t.String({ minLength: 1, maxLength: 128 }),
      }),
    }
  )

  .use(requireAuth)
  .get("/me", async ({ user, set }) => {
    const fresh = await prisma.user.findUnique({ where: { id: user!.id } });
    if (!fresh) {
      set.status = 404;
      return { error: "USER_NOT_FOUND" };
    }
    return serializeUser(fresh);
  });