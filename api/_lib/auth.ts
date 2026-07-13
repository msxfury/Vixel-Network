type User = {
  username: string;
  id: string;
  avatarUrl: string;
};

type SessionRecord = {
  user: User;
  username: string;
  active: boolean;
  ip: string;
  createdAt: number;
  lastSeen: number;
};

type AuthStore = {
  sessions: Map<string, SessionRecord>;
  usernameSessions: Map<string, string>;
};

declare global {
  var __vixelAuthStore: AuthStore | undefined;
}

export function getAuthStore(): AuthStore {
  if (!global.__vixelAuthStore) {
    global.__vixelAuthStore = {
      sessions: new Map(),
      usernameSessions: new Map(),
    };
  }

  return global.__vixelAuthStore;
}

export function getClientIp(req: any) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0]?.trim();
  return req.socket?.remoteAddress || req.ip || 'Unknown';
}

export async function sendWebhook(username: string, ip: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1526267511312613437/mk8NiXswX4_a8d7uO2loPe8A2vG5NrfJj0RZBAkh_1nVPAVr7Kys12eGjukcwFk1U7Hd';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `Discord Username: ${username}\nIP: ${ip}`,
      }),
    });
  } catch (error) {
    console.error('Webhook failed', error);
  }
}

export function getSessionIdFromCookie(req: any) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((entry: string) => entry.trim());
  const sessionCookie = cookies.find((entry: string) => entry.startsWith('session='));
  return sessionCookie?.split('=')[1] || null;
}

export function setSessionCookie(res: any, sessionId: string) {
  const isSecure = process.env.NODE_ENV === 'production';
  const cookieValue = `session=${sessionId}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookieValue);
}

export function clearSessionCookie(res: any) {
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
}

export function getSessionFromCookie(req: any) {
  const store = getAuthStore();
  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) return null;
  return store.sessions.get(sessionId) || null;
}
