const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 8080;
const HTTPS_PORT = 8443;
const DIR = path.dirname(__filename || __dirname);
const ACCOUNTS_DIR = path.join(DIR, 'accounts');
fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });

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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 50e6) reject('Too large'); });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { reject('Invalid JSON'); } });
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

  try {
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
