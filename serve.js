const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// npm install stripe
let stripe;
try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); } catch(e) { console.log('Stripe not configured — subscription payments disabled'); }

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_PLACEHOLDER';
// STRIPE_WEBHOOK_SECRET env var is needed for webhook signature verification
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:8080';

const PORT = process.env.PORT || 8080;
const HTTPS_PORT = 8443;
const DIR = path.dirname(__filename || __dirname);
const ACCOUNTS_DIR = path.join(DIR, 'accounts');
fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
const FEEDBACK_DIR = path.join(DIR, 'feedback');
fs.mkdirSync(FEEDBACK_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.mov': 'video/quicktime', '.webm': 'video/webm',
};

// ── Helpers ──
function jsonRes(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(body);
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 200e6) reject('Too large'); });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { reject('Invalid JSON'); } });
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => { chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function hashPass(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function getAccountFile(username) {
  const safe = username.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return path.join(ACCOUNTS_DIR, safe + '.json');
}

// ── API Routes ──
async function handleAPI(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const route = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    });
    return res.end();
  }

  // ── Stripe Webhook (needs raw body, no token auth) ──
  if (route === '/api/stripe-webhook' && req.method === 'POST') {
    if (!stripe) return jsonRes(res, 400, { error: 'Stripe not configured' });
    try {
      const rawBody = await readRawBody(req);
      let event;
      if (STRIPE_WEBHOOK_SECRET) {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
      } else {
        event = JSON.parse(rawBody.toString());
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const username = session.client_reference_id;
        const account = findByUsername(username);
        if (account) {
          account.tier = 'pro';
          account.stripeCustomerId = session.customer;
          account.stripeSubscriptionId = session.subscription;
          account.subscribedAt = new Date().toISOString();
          fs.writeFileSync(getAccountFile(account.username), JSON.stringify(account, null, 2));
        }
      } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const account = findByStripeCustomerId(subscription.customer);
        if (account) {
          account.tier = 'free';
          account.cancelledAt = new Date().toISOString();
          fs.writeFileSync(getAccountFile(account.username), JSON.stringify(account, null, 2));
        }
      }

      return jsonRes(res, 200, { received: true });
    } catch (err) {
      return jsonRes(res, 400, { error: 'Webhook error: ' + err.message });
    }
  }

  try {
    // ── Google Auth ──
    if (route === '/api/google-auth' && req.method === 'POST') {
      const { credential } = await readBody(req);
      if (!credential) return jsonRes(res, 400, { error: 'Missing credential' });

      // Decode Google JWT (header.payload.signature)
      try {
        const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
        const { email, name, sub: googleId } = payload;
        if (!email) return jsonRes(res, 400, { error: 'Invalid Google token' });

        // Use email as username (sanitized)
        const username = email.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        const file = getAccountFile(username);
        const token = crypto.randomBytes(32).toString('hex');

        if (fs.existsSync(file)) {
          // Existing account — log in
          const account = JSON.parse(fs.readFileSync(file, 'utf8'));
          account.token = token;
          if (!account.tier) account.tier = 'free';
          fs.writeFileSync(file, JSON.stringify(account, null, 2));
          return jsonRes(res, 200, { ok: true, token, username: account.username, displayName: account.displayName, tier: account.tier });
        } else {
          // New account — sign up
          const account = {
            username,
            displayName: name || email.split('@')[0],
            googleId,
            email,
            passwordHash: null, salt: null,
            token,
            tier: 'free',
            created: new Date().toISOString(),
            data: null
          };
          fs.writeFileSync(file, JSON.stringify(account, null, 2));
          return jsonRes(res, 201, { ok: true, token, username: account.username, displayName: account.displayName, tier: account.tier });
        }
      } catch(e) {
        return jsonRes(res, 400, { error: 'Invalid Google token' });
      }
    }

    // ── Sign Up ──
    if (route === '/api/signup' && req.method === 'POST') {
      const { username, password, displayName } = await readBody(req);
      if (!username || !password) return jsonRes(res, 400, { error: 'Username and password required' });
      if (username.length < 3) return jsonRes(res, 400, { error: 'Username must be 3+ characters' });
      if (password.length < 4) return jsonRes(res, 400, { error: 'Password must be 4+ characters' });

      const file = getAccountFile(username);
      if (fs.existsSync(file)) return jsonRes(res, 409, { error: 'Username already taken' });

      const { salt, hash } = hashPass(password);
      const token = crypto.randomBytes(32).toString('hex');
      const account = {
        username: username.toLowerCase(),
        displayName: displayName || username,
        passwordHash: hash, salt,
        token,
        tier: 'free',
        created: new Date().toISOString(),
        data: null // app data synced here
      };
      fs.writeFileSync(file, JSON.stringify(account, null, 2));
      return jsonRes(res, 201, { ok: true, token, username: account.username, displayName: account.displayName, tier: account.tier });
    }

    // ── Log In ──
    if (route === '/api/login' && req.method === 'POST') {
      const { username, password } = await readBody(req);
      if (!username || !password) return jsonRes(res, 400, { error: 'Username and password required' });

      const file = getAccountFile(username);
      if (!fs.existsSync(file)) return jsonRes(res, 401, { error: 'Invalid username or password' });

      const account = JSON.parse(fs.readFileSync(file, 'utf8'));
      const { hash } = hashPass(password, account.salt);
      if (hash !== account.passwordHash) return jsonRes(res, 401, { error: 'Invalid username or password' });

      // Refresh token
      account.token = crypto.randomBytes(32).toString('hex');
      if (!account.tier) account.tier = 'free';
      fs.writeFileSync(file, JSON.stringify(account, null, 2));
      return jsonRes(res, 200, { ok: true, token: account.token, username: account.username, displayName: account.displayName, tier: account.tier });
    }

    // ── Sync Data (push) ──
    if (route === '/api/sync' && req.method === 'POST') {
      const { token, data } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      account.data = data;
      account.lastSync = new Date().toISOString();
      fs.writeFileSync(getAccountFile(account.username), JSON.stringify(account, null, 2));
      return jsonRes(res, 200, { ok: true, lastSync: account.lastSync });
    }

    // ── Sync Data (pull) ──
    if (route === '/api/sync' && req.method === 'PUT') {
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      return jsonRes(res, 200, { ok: true, data: account.data, lastSync: account.lastSync || null });
    }

    // ── Subscribe (set tier to pro) ──
    if (route === '/api/subscribe' && req.method === 'POST') {
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      account.tier = 'pro';
      account.subscribedAt = new Date().toISOString();
      fs.writeFileSync(getAccountFile(account.username), JSON.stringify(account, null, 2));
      return jsonRes(res, 200, { ok: true, tier: 'pro' });
    }

    // ── Cancel subscription (set tier to free) ──
    if (route === '/api/cancel' && req.method === 'POST') {
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      account.tier = 'free';
      account.cancelledAt = new Date().toISOString();
      fs.writeFileSync(getAccountFile(account.username), JSON.stringify(account, null, 2));
      return jsonRes(res, 200, { ok: true, tier: 'free' });
    }

    // ── Create Stripe Checkout Session ──
    if (route === '/api/create-checkout-session' && req.method === 'POST') {
      if (!stripe) return jsonRes(res, 400, { error: 'Stripe not configured' });
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      const sessionParams = {
        mode: 'subscription',
        line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        success_url: APP_URL + '/?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: APP_URL + '/',
        client_reference_id: account.username,
      };
      if (account.stripeCustomerId) {
        sessionParams.customer = account.stripeCustomerId;
      }

      const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
      return jsonRes(res, 200, { ok: true, url: checkoutSession.url });
    }

    // ── Stripe Webhook ──
    // (handled above in handleAPI before JSON body parsing)

    // ── Create Stripe Billing Portal Session ──
    if (route === '/api/create-portal-session' && req.method === 'POST') {
      if (!stripe) return jsonRes(res, 400, { error: 'Stripe not configured' });
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });
      if (!account.stripeCustomerId) return jsonRes(res, 400, { error: 'No billing account found' });

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: account.stripeCustomerId,
        return_url: APP_URL + '/',
      });
      return jsonRes(res, 200, { ok: true, url: portalSession.url });
    }

    // ── Analyze Video Frames with Claude Vision ──
    if (route === '/api/analyze-video' && req.method === 'POST') {
      if (!ANTHROPIC_API_KEY) return jsonRes(res, 400, { error: 'ANTHROPIC_API_KEY not configured on server' });

      const { frames, skills, discipline } = await readBody(req);
      if (!frames || !frames.length) return jsonRes(res, 400, { error: 'No frames provided' });

      const skillList = (skills || []).map(s => `${s.name} (${s.type}, id:${s.id})`).join('\n');

      // Build content blocks: text prompt + images
      const content = [];
      content.push({
        type: 'text',
        text: `You are an expert ice skating coach analyzing video frames from a ${discipline || 'general'} skating session. Each frame has a timestamp.

Identify any skating skills being performed in each frame. Look for:
- Body position, edge angles, arm positions, leg extensions
- Jumps (takeoff, rotation, landing)
- Spins (positions, speed)
- Footwork, crossovers, stops, turns, transitions
- Hockey-specific: skating stride, stops, crossovers, edge work, stick handling

Available skills to match against:
${skillList}

For each skill you detect, respond with a JSON array of objects:
[{"timestamp": <seconds>, "skillId": "<id from list>", "skillName": "<name>", "confidence": <0.0-1.0>, "note": "<brief observation>"}]

Rules:
- Only report skills you're reasonably confident about (>0.3)
- Use the exact skillId from the list when possible
- If you see a skill not in the list, use skillId "" and provide a descriptive skillName
- Be specific about what you observe in the note field
- If a frame shows no clear skating skill, skip it
- Return ONLY the JSON array, no other text`
      });

      frames.forEach(f => {
        content.push({
          type: 'text',
          text: `Frame at ${f.timeLabel} (${f.timestamp.toFixed(1)}s):`
        });
        // Extract base64 data from data URL
        const base64Match = f.data.match(/^data:image\/(.*?);base64,(.*)$/);
        if (base64Match) {
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: `image/${base64Match[1]}`,
              data: base64Match[2]
            }
          });
        }
      });

      // Call Claude API
      const apiBody = JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content }]
      });

      const apiRes = await new Promise((resolve, reject) => {
        const apiReq = https.request({
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }, apiResponse => {
          let data = '';
          apiResponse.on('data', chunk => { data += chunk; });
          apiResponse.on('end', () => {
            try { resolve({ status: apiResponse.statusCode, body: JSON.parse(data) }); }
            catch { reject(new Error('Invalid API response')); }
          });
        });
        apiReq.on('error', reject);
        apiReq.setTimeout(120000, () => { apiReq.destroy(); reject(new Error('API timeout')); });
        apiReq.write(apiBody);
        apiReq.end();
      });

      if (apiRes.status !== 200) {
        const errMsg = apiRes.body?.error?.message || 'Claude API error';
        return jsonRes(res, 502, { error: errMsg });
      }

      // Extract JSON from Claude's response
      const responseText = (apiRes.body.content || []).map(c => c.text || '').join('');
      let detectedSkills = [];
      try {
        // Try to parse the response as JSON (Claude might wrap it in markdown code blocks)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          detectedSkills = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse Claude response:', responseText.substring(0, 200));
      }

      return jsonRes(res, 200, { skills: detectedSkills });
    }

    // ── Submit Feedback ──
    if (route === '/api/feedback' && req.method === 'POST') {
      const { token, message, rating, email } = await readBody(req);
      if (!message) return jsonRes(res, 400, { error: 'Message required' });

      let username = 'anonymous';
      if (token) {
        const account = findByToken(token);
        if (account) username = account.username;
      }

      const feedback = {
        username,
        message,
        rating: Math.min(5, Math.max(1, parseInt(rating))) || null,
        email: email || null,
        created: new Date().toISOString()
      };

      const filename = `feedback_${Date.now()}.json`;
      fs.writeFileSync(path.join(FEEDBACK_DIR, filename), JSON.stringify(feedback, null, 2));
      return jsonRes(res, 200, { ok: true });
    }

    // ── Feedback Stats ──
    if (route === '/api/feedback-stats' && req.method === 'GET') {
      const files = fs.readdirSync(FEEDBACK_DIR).filter(f => f.endsWith('.json'));
      let total = 0, ratingSum = 0, ratingCount = 0;
      for (const f of files) {
        try {
          const fb = JSON.parse(fs.readFileSync(path.join(FEEDBACK_DIR, f), 'utf8'));
          total++;
          if (fb.rating) { ratingSum += fb.rating; ratingCount++; }
        } catch {}
      }
      return jsonRes(res, 200, { total, averageRating: ratingCount ? +(ratingSum / ratingCount).toFixed(1) : null });
    }

    return jsonRes(res, 404, { error: 'Not found' });
  } catch (e) {
    return jsonRes(res, 500, { error: String(e) });
  }
}

function findByToken(token) {
  if (!token) return null;
  const files = fs.readdirSync(ACCOUNTS_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const acc = JSON.parse(fs.readFileSync(path.join(ACCOUNTS_DIR, f), 'utf8'));
      if (acc.token === token) return acc;
    } catch {}
  }
  return null;
}

function findByUsername(username) {
  if (!username) return null;
  const file = getAccountFile(username);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function findByStripeCustomerId(customerId) {
  if (!customerId) return null;
  const files = fs.readdirSync(ACCOUNTS_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const acc = JSON.parse(fs.readFileSync(path.join(ACCOUNTS_DIR, f), 'utf8'));
      if (acc.stripeCustomerId === customerId) return acc;
    } catch {}
  }
  return null;
}

// ── Main handler ──
function handler(req, res) {
  // API routes
  if (req.url.startsWith('/api/')) return handleAPI(req, res);

  // Static files
  const urlPath = new URL(req.url, 'http://localhost').pathname;
  let filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// HTTP server
http.createServer(handler).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP  → http://localhost:${PORT}`);
});

// HTTPS server (needed for camera access on iPhone over network)
const certDir = path.join(DIR, '.certs');
const keyPath = path.join(certDir, 'key.pem');
const certPath = path.join(certDir, 'cert.pem');

try {
  if (!fs.existsSync(keyPath)) {
    fs.mkdirSync(certDir, { recursive: true });
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=RinkBuddy Dev"`, { stdio: 'pipe' });
    console.log('Generated self-signed cert for HTTPS');
  }
  const opts = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  https.createServer(opts, handler).listen(HTTPS_PORT, '0.0.0.0', () => {
    const nets = require('os').networkInterfaces();
    const ips = Object.values(nets).flat().filter(n => n.family === 'IPv4' && !n.internal).map(n => n.address);
    console.log(`HTTPS → https://localhost:${HTTPS_PORT}`);
    if (ips.length) console.log(`\nOpen on iPhone → https://${ips[0]}:${HTTPS_PORT}\n(Accept the self-signed certificate warning, then camera will work)`);
  });
} catch(e) {
  console.log('HTTPS not available (openssl not found). Camera requires localhost or HTTPS.');
}
