import { clearSessionCookie, getAuthStore, getClientIp, getSessionIdFromCookie, setSessionCookie, sendWebhook } from '../_lib/auth';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const store = getAuthStore();
  const username = (req.body?.username || '').toString().trim();
  const ip = getClientIp(req);

  if (!username) {
    res.status(400).json({ error: 'Please enter a Discord username.' });
    return;
  }

  const sessionId = getSessionIdFromCookie(req);
  const currentSession = sessionId ? store.sessions.get(sessionId) : null;

  if (currentSession?.username === username) {
    currentSession.lastSeen = Date.now();
    currentSession.ip = ip;
    sendWebhook(username, ip);
    res.json({ user: currentSession.user });
    return;
  }

  if (store.usernameSessions.has(username)) {
    const existingSessionId = store.usernameSessions.get(username)!;
    const existingSession = store.sessions.get(existingSessionId);
    if (existingSession && existingSession.active) {
      res.status(409).json({ error: 'This username is already active on another device. Please log out from the current device first.' });
      return;
    }
    store.usernameSessions.delete(username);
  }

  const user = {
    username,
    id: username,
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  };

  const newSessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const sessionData = {
    user,
    username,
    active: true,
    ip,
    createdAt: Date.now(),
    lastSeen: Date.now(),
  };

  store.sessions.set(newSessionId, sessionData);
  store.usernameSessions.set(username, newSessionId);

  setSessionCookie(res, newSessionId);
  sendWebhook(username, ip);
  res.json({ user });
}
