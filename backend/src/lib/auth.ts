import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const JWT_SECRET = Bun.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export const jwtPlugin = jwt({
  name: "jwt",
  secret: JWT_SECRET,
  exp: "7d",
});

export type AuthUser = {
  id: string;
  rank: "Member" | "Admin";
};

async function resolveUser(
  token: string | undefined,
  verify: (t: string) => Promise<unknown>
): Promise<AuthUser | null> {
  if (!token) return null;
  const payload = (await verify(token)) as
    | { sub?: string; rank?: string }
    | false
    | null;
  if (!payload || typeof payload === "boolean" || !payload.sub) return null;
  const rank =
    payload.rank === "Admin" || payload.rank === "Member"
      ? payload.rank
      : "Member";
  return { id: String(payload.sub), rank };
}

function bearerFromHeader(h: string | undefined): string | undefined {
  if (!h || !h.startsWith("Bearer ")) return undefined;
  return h.slice(7).trim() || undefined;
}

/**
 * Optional auth: populates `user` (may be null). Use this on routes that
 * change behavior based on auth state but don't require it.
 */
export const authPlugin = new Elysia({ name: "auth-optional" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ jwt, headers }) => {
    const user = await resolveUser(
      bearerFromHeader(headers.authorization),
      (t) => jwt.verify(t)
    );
    return { user };
  });

/**
 * Required auth: 401 if missing/invalid. Self-contained — does not chain
 * `authPlugin` so the derive/onBeforeHandle scopes apply correctly to
 * routes one level up.
 */
export const requireAuth = new Elysia({ name: "auth-require" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ jwt, headers }) => {
    const user = await resolveUser(
      bearerFromHeader(headers.authorization),
      (t) => jwt.verify(t)
    );
    return { user };
  })
  .onBeforeHandle({ as: "scoped" }, ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "UNAUTHORIZED" };
    }
  });

/**
 * Admin-only: 401 if missing, 403 if not Admin.
 */
export const requireAdmin = new Elysia({ name: "auth-admin" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ jwt, headers }) => {
    const user = await resolveUser(
      bearerFromHeader(headers.authorization),
      (t) => jwt.verify(t)
    );
    return { user };
  })
  .onBeforeHandle({ as: "scoped" }, ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "UNAUTHORIZED" };
    }
    if (user.rank !== "Admin") {
      set.status = 403;
      return { error: "FORBIDDEN" };
    }
  });