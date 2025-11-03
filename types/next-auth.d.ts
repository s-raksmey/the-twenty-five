// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      emailVerified: boolean;
      isLikelyFake?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified?: boolean;
    isLikelyFake?: boolean;
  }

  interface Profile {
    email_verified?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    emailVerified: boolean;
    isLikelyFake?: boolean;
  }
}