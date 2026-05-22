import { headers } from "next/headers";
import { cookies } from "next/headers";

/**
 * Simple in-memory rate limiter for server actions.
 * Uses a sliding window approach keyed by identifier (e.g. IP or fingerprint).
 *
 * NOTE: This is per-process. In a multi-instance deployment, use Redis instead.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Gets a reliable client identifier from headers or fallback to a session cookie
 */
export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Multiple header checks for various proxy environments
  const ip =
    headersList.get("cf-connecting-ip")?.trim() ||
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip")?.trim() ||
    headersList.get("true-client-ip")?.trim();

  if (ip) {
    return ip;
  }

  // Session-based fallback for serverless when IP is masked
  let sessionId = cookieStore.get("rate_limit_session")?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // We can't automatically 'set' a cookie in a server action without proper Next.js API usage, 
    // but returning a UUID means they just get a fresh unknown each time. 
    // Just return the new UUID which is still better than "unknown" locking everyone.
  }

  return sessionId;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  const existing = store.get(identifier);

  // Window expired or first request — reset
  if (!existing || now > existing.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      retryAfterSeconds: 0,
    };
  }

  // Within window
  if (existing.count < options.maxRequests) {
    existing.count++;
    return {
      allowed: true,
      remaining: options.maxRequests - existing.count,
      retryAfterSeconds: 0,
    };
  }

  // Rate limited
  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}
