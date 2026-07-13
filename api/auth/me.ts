import { getAuthStore, getSessionIdFromCookie } from '../_lib/auth';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const store = getAuthStore();
  const sessionId = getSessionIdFromCookie(req);
  const session = sessionId ? store.sessions.get(sessionId) : null;

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({ user: session.user });
}
