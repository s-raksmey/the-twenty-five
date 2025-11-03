// lib/email-validator.ts
export class EmailValidator {
  // Common disposable email domains
  private static disposableDomains: string[] = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', 
    '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
    'yopmail.com', 'trashmail.com', 'temp-mail.org',
    'sharklasers.com', 'guerrillamail.net', 'grr.la',
    'pokemail.net', 'spam4.me', 'disposableemail.org'
  ];

  // Suspicious patterns
  private static suspiciousPatterns: RegExp[] = [
    /^test\d*@/i,
    /^fake\d*@/i,
    /^demo\d*@/i,
    /^temp\d*@/i,
    /^spam\d*@/i,
    /^admin\d*@/i,
    /^user\d*@/i
  ];

  static isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return this.disposableDomains.includes(domain);
  }

  static hasSuspiciousPattern(email: string): boolean {
    return this.suspiciousPatterns.some(pattern => pattern.test(email));
  }

  static isLikelyFake(email: string): boolean {
    return this.isDisposableEmail(email) || this.hasSuspiciousPattern(email);
  }
}