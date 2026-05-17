import type { User } from "../../generated/prisma/client";

export function serializeUser(u: User) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    credit: u.credit,
    totalCredit: u.totalCredit,
    rank: u.rank,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export type SerializedUser = ReturnType<typeof serializeUser>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,32}$/;

export function validateEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function validateUsername(value: string): boolean {
  return USERNAME_RE.test(value);
}
