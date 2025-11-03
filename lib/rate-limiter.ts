// lib/advanced-rate-limiter.ts
export class AdvancedRateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  static checkRateLimit(identifier: string, maxAttempts: number = 100): { 
    allowed: boolean; 
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or expired window
      const resetTime = now + this.WINDOW_MS;
      this.attempts.set(identifier, {
        count: 1,
        resetTime
      });
      return { 
        allowed: true, 
        remaining: maxAttempts - 1,
        resetTime
      };
    }

    if (record.count >= maxAttempts) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    // Increment attempt count
    record.count++;
    return { 
      allowed: true, 
      remaining: maxAttempts - record.count,
      resetTime: record.resetTime
    };
  }

  static cleanup() {
    const now = Date.now();
    for (const [key, value] of this.attempts.entries()) {
      if (now > value.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Run cleanup every hour
setInterval(() => AdvancedRateLimiter.cleanup(), 60 * 60 * 1000);