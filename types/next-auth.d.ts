// types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string | undefined;
      emailVerified: boolean;
      isLikelyFake?: boolean | undefined;
      phoneLogin?: boolean | undefined;
      phoneMasked?: string | undefined;
      phoneLast4?: string | undefined;
    } & DefaultSession['user'];
  }

  interface User {
    emailVerified?: boolean | Date | null;
    isLikelyFake?: boolean;
    phoneLogin?: boolean;
    phoneMasked?: string;
    phoneLast4?: string;
  }

  interface Profile {
    email_verified?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }

  interface Account {
    access_token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string | undefined;
    emailVerified: boolean;
    isLikelyFake?: boolean | undefined;
    phoneLogin?: boolean | undefined;
    phoneMasked?: string | undefined;
    phoneLast4?: string | undefined;
    sub?: string;
  }
}
