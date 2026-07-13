import { clearSessionCookie, getAuthStore, getSessionIdFromCookie } from '../_lib/auth';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const store = getAuthStore();
  const sessionId = getSessionIdFromCookie(req);
  if (sessionId) {
    const session = store.sessions.get(sessionId);
    if (session?.username) {
      store.usernameSessions.delete(session.username);
    }
    store.sessions.delete(sessionId);
  }

  clearSessionCookie(res);
  res.json({ success: true });
}
