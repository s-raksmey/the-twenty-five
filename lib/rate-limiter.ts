// lib/rate-limiter.ts
export class AuthRateLimiter {
  private static attempts = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  static checkRateLimit(identifier: string): {
    allowed: boolean;
    remaining: number;
  } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or expired window
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return { allowed: true, remaining: 99 }; // maxAttempts - 1
    }

    if (record.count >= 100) {
      return { allowed: false, remaining: 0 };
    }

    // Increment attempt count
    record.count++;
    return { allowed: true, remaining: 100 - record.count };
  }

  static cleanup() {
    const now = Date.now();
    // Use Array.from to avoid downlevel iteration issues
    Array.from(this.attempts.entries()).forEach(([key, value]) => {
      if (now > value.resetTime) {
        this.attempts.delete(key);
      }
    });
  }
}
