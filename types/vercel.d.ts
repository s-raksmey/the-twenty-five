// types/vercel.d.ts
declare global {
  interface Request {
    geo?: {
      country?: string;
      city?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  }
}

export {};