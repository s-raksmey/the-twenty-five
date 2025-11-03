// lib/auth-adapter.ts
import { db } from '@/app/db';
import { accounts, sessions, users, verificationTokens } from '@/app/db/schema';
import { and, eq } from 'drizzle-orm';
import { Adapter } from 'next-auth/adapters';
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';

const uuid = () => crypto.randomUUID();

export const TursoDrizzleAdapter: Adapter = {
  // CREATE USER
  async createUser(profile: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
    const id = uuid();

    const [row] = await db
      .insert(users)
      .values({
        id,
        name: profile.name ?? null,
        email: profile.email ?? null,
        emailVerified: profile.emailVerified
          ? new Date(profile.emailVerified)
          : null,
        image: profile.image ?? null,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create user');
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email ?? '',
      emailVerified: row.emailVerified,
      image: row.image,
    };
  },

  // GET USER BY ID
  async getUser(id: string): Promise<AdapterUser | null> {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email ?? '',
      emailVerified: row.emailVerified,
      image: row.image,
    };
  },

  // GET USER BY EMAIL
  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email ?? '',
      emailVerified: row.emailVerified,
      image: row.image,
    };
  },

  // GET USER BY ACCOUNT
  async getUserByAccount({
    provider,
    providerAccountId,
  }: Pick<
    AdapterAccount,
    'provider' | 'providerAccountId'
  >): Promise<AdapterUser | null> {
    const rows = await db
      .select({ user: users })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.user.id,
      name: row.user.name,
      email: row.user.email ?? '',
      emailVerified: row.user.emailVerified,
      image: row.user.image,
    };
  },

  // LINK ACCOUNT
  async linkAccount(account: AdapterAccount): Promise<void> {
    await db.insert(accounts).values({
      id: uuid(),
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token ?? null,
      access_token: account.access_token ?? null,
      expires_at: account.expires_at ?? null,
      token_type: account.token_type ?? null,
      scope: account.scope ?? null,
      id_token: account.id_token ?? null,
      session_state: account.session_state ?? null,
    });
  },

  // CREATE SESSION
  async createSession(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }): Promise<AdapterSession> {
    const id = uuid();

    const [row] = await db
      .insert(sessions)
      .values({
        id,
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create session');
    }

    return {
      sessionToken: row.sessionToken,
      userId: row.userId,
      expires: row.expires,
    };
  },

  // GET SESSION + USER
  async getSessionAndUser(
    sessionToken: string
  ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    const rows = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      session: {
        sessionToken: row.session.sessionToken,
        userId: row.session.userId,
        expires: row.session.expires,
      },
      user: {
        id: row.user.id,
        name: row.user.name,
        email: row.user.email ?? '',
        emailVerified: row.user.emailVerified,
        image: row.user.image,
      },
    };
  },

  // UPDATE SESSION
  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
  ): Promise<AdapterSession | null> {
    const expires = session.expires ? new Date(session.expires) : undefined;

    await db
      .update(sessions)
      .set({ expires })
      .where(eq(sessions.sessionToken, session.sessionToken));

    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, session.sessionToken))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      sessionToken: row.sessionToken,
      userId: row.userId,
      expires: row.expires,
    };
  },

  // DELETE SESSION
  async deleteSession(sessionToken: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  },

  // VERIFICATION TOKEN
  async createVerificationToken(
    token: VerificationToken
  ): Promise<VerificationToken | null> {
    await db.insert(verificationTokens).values({
      identifier: token.identifier,
      token: token.token,
      expires: token.expires,
    });
    return token;
  },

  async useVerificationToken({
    identifier,
    token,
  }: {
    identifier: string;
    token: string;
  }): Promise<VerificationToken | null> {
    const rows = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return {
      identifier: row.identifier,
      token: row.token,
      expires: row.expires,
    };
  },
};
