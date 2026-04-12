import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { prisma } from "./prisma";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "portal-certidoes-session-secret-change-in-prod";

// ── Password ─────────────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const input = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hash, "hex"), input);
  } catch {
    return false;
  }
}

// ── Session cookie ────────────────────────────────────────────────────────────

function sign(sessionId: string): string {
  const sig = createHmac("sha256", SESSION_SECRET).update(sessionId).digest("hex");
  return `${sessionId}:${sig}`;
}

function unsign(cookie: string): string | null {
  const lastColon = cookie.lastIndexOf(":");
  if (lastColon === -1) return null;
  const sessionId = cookie.slice(0, lastColon);
  const sig       = cookie.slice(lastColon + 1);
  if (!sessionId || !sig) return null;
  const expected  = createHmac("sha256", SESSION_SECRET).update(sessionId).digest("hex");
  return sig === expected ? sessionId : null;
}

export async function createSession(userId: string, role: "client" | "admin"): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      id:        sessionId,
      userId,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return sign(sessionId);
}

export async function getSession(
  cookieValue: string
): Promise<{ id: string; userId: string; role: string } | null> {
  const sessionId = unsign(cookieValue);
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return null;
  }

  return { id: session.id, userId: session.userId, role: session.role };
}

export async function deleteSession(cookieValue: string): Promise<void> {
  const sessionId = unsign(cookieValue);
  if (!sessionId) return;
  await prisma.session.deleteMany({ where: { id: sessionId } });
}
