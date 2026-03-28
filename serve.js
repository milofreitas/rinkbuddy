const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Stripe setup
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); console.log('[startup] Stripe initialized successfully'); }
  catch(e) { console.error('[startup] Stripe require failed:', e.message); }
} else {
  console.log('[startup] STRIPE_SECRET_KEY not set — Stripe disabled');
}

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_PLACEHOLDER';
// STRIPE_WEBHOOK_SECRET env var is needed for webhook signature verification
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:8080';

const PORT = process.env.PORT || 8080;
const HTTPS_PORT = 8443;
const DIR = path.dirname(__filename || __dirname);
const ACCOUNTS_DIR = path.join(DIR, 'accounts');
const accountsDirExisted = fs.existsSync(ACCOUNTS_DIR);
fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
const FEEDBACK_DIR = path.join(DIR, 'feedback');
fs.mkdirSync(FEEDBACK_DIR, { recursive: true });

// Startup diagnostics for Railway volume persistence
function countAccounts() {
  try { return fs.readdirSync(ACCOUNTS_DIR).filter(f => f.endsWith('.json')).length; } catch { return 0; }
}
const startupAccountCount = countAccounts();
console.log(`[startup] Accounts directory ${accountsDirExisted ? 'EXISTS' : 'CREATED'}: ${ACCOUNTS_DIR}`);
console.log(`[startup] Accounts found: ${startupAccountCount}`);

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.mov': 'video/quicktime', '.webm': 'video/webm',
};

// ── Helpers ──
const ALLOWED_ORIGINS = ['https://www.rinkbuddy.com', 'https://rinkbuddy.com', 'http://localhost:8080', 'https://localhost:8443'];

function getCorsOrigin(req) {
  const origin = req?.headers?.origin;
  return (origin && ALLOWED_ORIGINS.includes(origin)) ? origin : ALLOWED_ORIGINS[0];
}

function jsonRes(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': res._corsOrigin || '*' });
  res.end(body);
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ═══════════════════════════════════════════════════════════════
// VISUAL SKILL IDENTIFICATION GUIDES — fed to Claude Vision API
// ═══════════════════════════════════════════════════════════════

const FOUNDATIONS_VISUAL_GUIDE = `VISUAL SKILL IDENTIFICATION GUIDE — FOUNDATIONS:

LOCOMOTION SKILLS:
• Marching on Ice: Skater lifts feet up/down like walking but on ice. Knees come up high, arms out to sides for balance. Feet alternate. No glide — choppy steps. Distinguish from stroking by lack of glide.
• Forward Stroking: Skater pushes off to the side (not backward) with one foot while gliding on the other. Look for: full leg extension of the pushing leg to the side/behind, smooth weight transfer, alternating feet rhythmically. Arms relaxed at sides. Knee of gliding leg is bent. Between frames: skater covers distance, alternating which leg extends.
• Backward Stroking: Same as forward but traveling backward. Skater faces camera but moves away. C-cut pushes — foot traces a C-shape on ice. Weight on balls of feet. Look over shoulder periodically. Between frames: skater's back is to direction of travel.
• Forward Swizzles: Both feet on ice, toes point outward, feet push apart making a lemon/diamond shape, then toes point inward to bring feet together. Repeated pattern. Between frames: feet go wide then narrow in a rhythmic pattern. No feet leave the ice.
• Backward Swizzles: Same as forward but reversed — heels point outward, feet push apart, heels in to close. Traveling backward.
• Forward Crossovers: Skater on a curve. Outside foot literally lifts and crosses OVER the inside foot, placing it down on the other side. Look for: one foot visibly on top of/crossing the other, body leaning into the circle, pumping motion. In 2-3 frames you see: normal stance → foot lifting over → foot placed on far side. Distinguish from stroking by the crossing motion and circular path.
• Backward Crossovers: Same crossing motion but traveling backward on a curve. Cross-under push is key — the inside foot pushes under and extends while the outside foot crosses over.
• Rocking Horse: One forward swizzle then one backward swizzle, rocking back and forth. Feet stay on ice, making alternating lemon shapes.
• Forward Slalom: Skater weaves side-to-side on two feet. Both feet parallel, knees drive direction changes. S-pattern on ice.

BALANCE SKILLS:
• Two-Foot Glide: Both feet on ice, parallel, gliding forward. Knees slightly bent, arms out to sides. No pushing — just gliding. Distinguish from stroking: no leg extension or push-off visible.
• Backward Two-Foot Glide: Same but traveling backward. Weight on balls of feet, knees bent.
• One-Foot Glide: One foot on ice, other foot lifted off. Gliding on single blade. Free leg may be extended or beside skating leg. Arms out for balance.
• Dip: Deep knee bend while gliding on two feet. Skater gets very low — almost sitting. Arms forward. Both feet on ice. Between frames: skater descends then rises.
• Two-Foot Hop: Skater bends knees then jumps straight up, both feet leave ice simultaneously, lands on both feet. Small jump, not traveling far. Arms help with lift.
• Falling & Getting Up: Skater bends knees and goes down to side onto hip. Gets up via hands-and-knees position, one foot up, push to stand.
• Forward Spiral: One foot on ice, free leg extended BEHIND at hip height or ABOVE while gliding forward. Back arched, arms extended. Sustained position for 3+ seconds. Very distinctive — looks like an arabesque. Distinguish from simple one-foot glide by the high free leg.
• Lunge: Deep forward lunge while gliding. Front knee deeply bent, back leg extended behind with knee nearly touching ice. Arms out. Very low position.
• Shoot the Duck: Gliding on one foot in a DEEP squat — thigh nearly parallel to ice. Free leg extended straight forward. Arms forward for balance. Very distinctive low position.

STOPS:
• Snowplow Stop: Both feet on ice, toes angled inward (pigeon-toed), forming a V or pizza shape. Knees bent, pressing inside edges into ice. Gradual deceleration. Between frames: feet angle in, skater slows.
• T-Stop: One foot glides forward, other foot drags PERPENDICULAR behind (forming a T shape). Weight mostly on front foot. Back foot scrapes ice. Between frames: back foot visible dragging sideways.
• Hockey Stop: Both feet turn 90° sideways to direction of travel SIMULTANEOUSLY. Body leans away from travel direction. Ice spray/shavings visible. Rapid stop — dramatic deceleration in 2-3 frames. Very distinctive sideways body position with spray.

EDGES:
• Forward Outside Edge: Gliding on one foot, blade tilted to outer edge. Body leans slightly outward from the curve being traced. Sustained arc. Free leg may be extended.
• Forward Inside Edge: Gliding on one foot, blade tilted to inner edge. Body leans slightly inward toward center of curve. Sustained arc.
• Backward Outside/Inside Edge: Same as forward edges but traveling backward.
• Edge Control: Alternating between inside and outside edges. Weaving serpentine pattern.

TURNS:
• Forward-to-Backward Transition: Skater faces forward, then pivots on both feet to face backward. Open hips, rotate. Between frames: facing forward → rotating → facing backward. Speed maintained through transition.
• Forward Outside 3-Turn: On one foot, forward outside edge, skater rotates upper body, then turns on the blade from forward to backward. The trace on ice looks like the number "3." Between frames: forward glide → rotation → now skating backward on same foot. Key: single foot throughout.
• Forward Inside 3-Turn: Same as outside but starting on inside edge, ending on backward outside edge.`;

const FIGURE_VISUAL_GUIDE = `VISUAL SKILL IDENTIFICATION GUIDE — FIGURE SKATING:
(Also includes all foundation skills above)

JUMPS — All jumps land the same way: backward, on one foot, outside edge, free leg extended behind.
Two categories: TOE JUMPS (toe pick stabs ice for launch) and EDGE JUMPS (no toe pick, launch from edge only).
Key: if free leg reaches BACK and STABS ice before takeoff = toe jump. If free leg SWINGS FORWARD = edge jump.

• Waltz Jump (edge, easiest): Forward outside edge takeoff, half rotation (180°), land backward. Skater steps forward, swings free leg up and forward, small hop with half turn, lands backward. Low height, graceful. Between frames: forward step → airborne facing sideways → landed backward.
• Toe Loop (toe): Backward outside edge + toe pick. Skater reaches back with free foot and picks into ice, vaults up. Lands on SAME foot. Often used as 2nd jump in combinations. Between frames: skating backward → toe stab → airborne → landed backward same foot.
• Salchow (edge): Backward INSIDE edge takeoff. Free leg swings forward in a scooping motion from behind. Legs form triangular shape at takeoff. Lands on OTHER foot. Between frames: backward glide → free leg scoops forward → airborne → landed on opposite foot.
• Loop (edge): Backward OUTSIDE edge, legs crossed/close together in almost seated position at takeoff. Springs up from the edge. Lands on SAME foot, same edge. Between frames: seated-looking position → springs up → airborne → landed same foot. Distinctive crossed-leg takeoff.
• Flip (toe): Backward INSIDE edge + toe pick with other foot. Between frames: backward glide on inside edge → reaches back with toe pick → airborne → lands on other foot. Similar to Lutz but different entry edge.
• Lutz (toe): Long backward OUTSIDE edge entry, then toe pick. Counter-rotational — skater curves one way but rotates the other. Distinctive long backward entry. Between frames: long backward curve → toe stab → rotates AGAINST the curve direction → lands. Hardest toe jump.
• Axel (edge, hardest): The ONLY forward-takeoff jump. Forward outside edge, 1.5 rotations for single. Skater faces forward, steps onto forward edge, swings free leg up, rotates 1.5 times. EASY TO IDENTIFY: only jump where skater faces forward at takeoff. Between frames: forward step → big upward swing → 1.5 rotations → landed backward.
• Double/Triple versions: Same entries but more rotations. Higher, faster, tighter air position (arms pulled in tight, legs crossed in air). Double = 2 rotations (axel = 2.5). Triple = 3 (axel = 3.5).

SPINS — Skater rotates in place. Between frames: same location on ice but body orientation changes dramatically.
• Two-Foot Spin: Both feet on ice, rotating in place. Simpler, slower. Arms may be wide then pulled in.
• Upright Spin (Scratch Spin): One foot, standing tall, arms pulled in tight against body. Very fast rotation. Free foot pressed against ankle/calf. Between frames: same spot, body blurs from rotation speed.
• Sit Spin: Low squatting position on one foot while spinning. Skating leg deeply bent (thigh parallel to ice), free leg extended forward. Arms may be forward or wrapped. Very distinctive low position while spinning.
• Camel Spin: Free leg extended BEHIND at hip height or above, torso horizontal — body forms a T-shape. Spinning on one foot. Very distinctive horizontal body position. Between frames: T-shape rotates in place.
• Layback Spin: Upright spin but back arches backward, head tilts back. Free leg behind. Arms may frame face or extend. Distinctive backward lean while spinning.
• Combination Spin: Changes positions during one spin — e.g., starts camel, transitions to sit, finishes upright. Look for position changes while maintaining the spin.
• Flying Spin: Enters with a JUMP into spin position. Airborne briefly then lands spinning. Between frames: preparation → jump → airborne in spin position → spinning on ice.

STEPS & TURNS:
• 3-Turn: Single foot, turns from forward to backward (or vice versa) — blade traces a "3" on ice. Upper body rotates first, then hips follow. Between frames: gliding one direction → rotation on single foot → now facing opposite direction, same foot.
• Mohawk: Two-foot turn. Weight transfers from one foot to the other, heel-to-heel, changing direction. Both feet briefly on ice during turn. Between frames: forward on one foot → both feet on ice briefly → backward on other foot.
• Bracket: Like a 3-turn but AGAINST the curve (counter-rotational). Harder. Same single-foot turn but body rotates against the direction of the curve.
• Step Sequence: Rapid series of turns, steps, and edges covering the full ice surface. Multiple skills in quick succession — 3-turns, mohawks, crossovers, edges all combined. Very busy footwork, changing direction frequently.

OTHER MOVES:
• Spread Eagle: Both feet on ice, toes turned outward (180° turnout), gliding on a curve. Looks like a ballet second position on ice. Arms wide. Distinctive wide stance with extreme turnout.
• Ina Bauer: One foot forward, one backward, knees bent, gliding on a curve. Often with dramatic back arch. Distinctive split-stance position.`;

const HOCKEY_VISUAL_GUIDE = `VISUAL SKILL IDENTIFICATION GUIDE — HOCKEY:
(Skaters wear full hockey gear: helmet, gloves, pads, carry a stick)

SKATING STANCE & MOVEMENT:
• Hockey Ready Stance: Athletic position — knees bent ~90°, back straight but leaning forward, hands on stick in front. Weight on balls of feet. Head up. Stick blade on ice. Looks like a quarterback under center. Distinguish from casual standing by deep knee bend.
• Forward Stride: Powerful side-push with full leg extension, skating leg deeply bent. Arms swing diagonally (not side-to-side). Stick in one hand or two during stride. Between frames: alternating leg extension with forward travel. Look for: deep knee bend on gliding leg, full extension of pushing leg, diagonal arm swing. More powerful/lower than figure skating stroking.
• Backward Stride: Facing forward but traveling backward. C-cut pushes — feet trace C-shapes. Weight on balls of feet. Stick on ice in front for defense. Between frames: moving backward while facing forward, alternating C-cut pushes.

STARTS:
• V-Start: From standstill, toes point outward in V-shape. Short choppy strides, body very low. First 3 steps build speed. Between frames: wide V stance → explosive short steps → gradually lengthening strides.
• Power Start: From standstill, first 3 strides explosive. Body extremely low, almost horizontal. Full blade digs into ice. Between frames: dramatic forward lean → powerful short pushes → body rises as speed builds. Key: body angle nearly 45° to ice on first steps.
• Crossover Start: First step crosses over for lateral explosion. Starting from standstill, one foot crosses over the other to generate sideways then forward momentum. Between frames: standstill → crossover step → explosive acceleration.

STOPS:
• Hockey Stop: Both feet turn 90° to travel direction simultaneously. Shaving/spraying ice. Weight shifts away from direction of travel. Upper body stays facing forward while lower body turns sideways. ICE SPRAY is the key visual indicator. Between frames: skating forward → feet rotate sideways → ice spray → stopped. Very dramatic and fast.
• One-Foot Stop: All weight on one stopping foot, angled to direction of travel. Other foot may be slightly lifted. Less spray than two-foot stop.
• Power Slide Stop: Full body turns, both feet slide. Maximum ice spray. More dramatic than regular hockey stop.
• Snowplow Stop: Toes angled inward, gentle pressure. Slower stop. No dramatic spray.
• Backward Snowplow Stop: Moving backward, push toes outward. Gentle stop.

CROSSOVERS:
• Forward Crossovers: On a curve/circle, outside foot lifts and crosses over inside foot. Body leans into the turn. Used for acceleration on curves. Pumping action generates speed. Between frames: normal stance on curve → outside foot crossing over → push under with inside foot → repeat. Key: visible crossing of feet + circular path.
• Backward Crossovers: Same motion but traveling backward. Cross-under push generates power. Important for defensive skating. Between frames: backward on curve → feet cross → push and separate → repeat.

TRANSITIONS & TURNS:
• Forward-to-Backward Pivot: Hips open, feet pivot from forward to backward skating without losing speed. Upper body may stay facing same direction. Stick stays on ice. Between frames: skating forward → hip rotation → now traveling backward. Smooth, speed maintained.
• Backward-to-Forward Pivot: Reverse — from backward to forward. Explosive forward stride usually follows immediately. Between frames: backward skating → pivot → explodes forward.
• Mohawk Turn: Heel-to-heel step turn. Quick direction change. Stay low through the turn. Between frames: forward → brief two-foot moment → backward. Quick and low.
• Tight Turns: Deep edge work on a very small radius. Extreme knee bend, body leans significantly into turn. Between frames: straight skating → dramatic lean → tight curve → exit. Edge angle is extreme.

EDGE WORK & AGILITY:
• Inside/Outside Edges: Slalom-like weaving. Body alternates leaning left and right. Serpentine pattern. Between frames: lean one way → straight → lean other way.
• Lateral Movement: Defensive shuffles — moving sideways without turning. Pushing with inside edges. Low stance maintained. Between frames: moving sideways while facing same direction. Used when defending.
• Quick Feet Agility: Rapid short strides, direction changes. Very quick foot movement, low body. Between frames: rapid foot position changes.

STICK & PUCK SKILLS:
• Stick Grip & Stance: Top hand at butt end, bottom hand halfway down shaft. Blade flat on ice. Arms in front of body. Distinctive hockey-player posture.
• Puck Handling/Dribble: Stick moves puck side-to-side with wrist rolls. Head UP (not looking down). Puck visible on stick blade moving forehand to backhand. Between frames: puck shifts from one side of blade to other.
• Wrist Shot: Puck pulled back toward body, then wrists snap forward. Follow-through toward target. Weight transfers from back to front foot. Stick blade stays low. Between frames: wind-up → release → follow-through pointing at target.
• Slap Shot: Big wind-up — stick goes UP behind/above shoulder. Stick comes down and hits ice BEHIND puck, then follows through high. Most dramatic shooting motion. Between frames: high backswing → stick strikes ice → follow-through overhead.
• Snap Shot: Quick release with minimal backswing. Stick flexes and snaps. Less dramatic than slap shot but faster release. Between frames: slight backswing → quick snap → puck gone.
• Passing (Forehand/Backhand): Sweeping motion with follow-through toward target. Forehand = blade faces target naturally. Backhand = blade reversed, wrist rolled.
• Receiving: Soft hands — stick blade cushions incoming puck. Blade gives with the pass rather than being rigid. Between frames: puck approaching → blade makes contact → puck controlled.

DEFENSIVE SKILLS:
• Gap Control: Skating backward maintaining distance from attacker. Not too close, not too far. Between frames: backward skating, mirroring forward skater's movements.
• Angling: Body positioned to steer puck carrier toward boards. Cutting off skating lanes with body position. Between frames: lateral positioning, closing angles.`;


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

  // CORS
  res._corsOrigin = getCorsOrigin(req);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': res._corsOrigin,
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

      const { frames, skills, discipline, batchContext } = await readBody(req);
      if (!frames || !frames.length) return jsonRes(res, 400, { error: 'No frames provided' });

      const skillList = (skills || []).map(s => `- ${s.name} (${s.type}, id:${s.id})`).join('\n');
      const batchInfo = batchContext ? `\nYou are analyzing sequence ${batchContext.batchIndex + 1} of ${batchContext.totalBatches}, covering ${batchContext.timeRange[0].toFixed(1)}s to ${batchContext.timeRange[1].toFixed(1)}s of the video.` : '';

      // Build content blocks: text prompt + images
      const content = [];
      // Build discipline-specific visual guide
      const disc = discipline || 'foundations';
      const visualGuide = disc === 'hockey' ? HOCKEY_VISUAL_GUIDE : (disc === 'figure' ? FIGURE_VISUAL_GUIDE : FOUNDATIONS_VISUAL_GUIDE);

      content.push({
        type: 'text',
        text: `You are an elite-level ice skating judge and coach with 20+ years of experience analyzing ${disc} skating. You are reviewing sequential video frames extracted at ~1 frame per second from a skating session.${batchInfo}

TASK: Analyze the SEQUENCE of frames to identify skating skills. These frames are consecutive — use MOTION ANALYSIS across frames:
1. Scan ALL frames to understand the overall movement trajectory
2. Look for TRANSITIONS between frames: changes in body position, foot placement, direction, posture
3. A skill happens over 2-5 consecutive frames — identify the START frame
4. Report the timestamp where the skill is most clearly visible

MOTION ANALYSIS — compare consecutive frames:
- Body position change: rotating? shifting weight? extending a leg?
- Foot tracking: crossing over? turning? leaving the ice?
- Direction change: forward→backward = turn. straight→curved = edge work
- Height change: lower = preparation/sit spin. higher = jump/extension
- Speed: motion blur = fast. sharp/clear = slow/stationary
- Ice spray/shavings = stopping or sharp edge work

${visualGuide}

FRAME QUALITY — handle these common issues:
- SKIP frames where the camera is blocked by a body/hand/clothing filling most of the frame
- SKIP selfie-style frames showing only the skater's face/upper body with no view of skating
- SKIP upside-down or severely tilted frames (phone orientation issue)
- SKIP frames that are entirely blurry with no identifiable content
- If the skater is SMALL in a wide-angle rink shot, you CAN still detect skills — focus on body posture, leg angles, and motion between frames even at a distance
- When MULTIPLE skaters are visible, focus on the PRIMARY subject (typically the most centered or closest skater). Ignore background skaters at the far end of the rink

WHAT IS NOT A SKILL — skip:
- Standing still, waiting, or chatting
- Slow straight gliding without visible technique
- Walking without glide
- Spectators, coaches, or background skaters (focus on primary subject only)
- Unclear/blurry frames where technique cannot be determined
- Skater just coasting with no active technique

Available skills to match:
${skillList}

RESPOND with a JSON array:
[{"timestamp": <seconds>, "skillId": "<exact id>", "skillName": "<name>", "confidence": <0.0-1.0>, "note": "<specific visual evidence: what you see in which frames>"}]

CONFIDENCE:
- 0.9+ = unmistakable multi-frame evidence (airborne jump, fast spin, clear crossover sequence)
- 0.7-0.89 = body position strongly matches across 2+ frames
- 0.5-0.69 = single frame match or partially obscured
- Below 0.5 = do NOT report

RULES:
- Fewer accurate detections >> many wrong ones
- Must cite frame evidence in note (e.g. "frames 3.0s-5.0s show...")
- Do NOT label every frame — only report CLEAR skills
- If nothing is clear, return []
Return ONLY the JSON array.`
      });

      frames.forEach((f, i) => {
        const dt = i > 0 ? (f.timestamp - frames[i-1].timestamp).toFixed(1) : '0.0';
        content.push({
          type: 'text',
          text: `Frame ${i + 1}/${frames.length} at ${f.timeLabel} (${f.timestamp.toFixed(1)}s, +${dt}s since prev):`
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
        max_tokens: 8192,
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
        apiReq.setTimeout(180000, () => { apiReq.destroy(); reject(new Error('API timeout')); });
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

    // ── Health Check ──
    if (route === '/api/health' && req.method === 'GET') {
      const accountCount = countAccounts();
      return jsonRes(res, 200, {
        status: 'ok',
        uptime: process.uptime(),
        accountCount,
        accountsDir: ACCOUNTS_DIR,
        accountsDirExists: fs.existsSync(ACCOUNTS_DIR),
        stripeConfigured: !!stripe,
        timestamp: new Date().toISOString()
      });
    }

    // ── Create Checkout (alias for /api/create-checkout-session) ──
    if (route === '/api/create-checkout' && req.method === 'POST') {
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

    // ── Check Subscription ──
    if (route === '/api/check-subscription' && req.method === 'POST') {
      const { token } = await readBody(req);
      const account = findByToken(token);
      if (!account) return jsonRes(res, 401, { error: 'Invalid session' });

      return jsonRes(res, 200, {
        ok: true,
        tier: account.tier || 'free',
        isPro: account.tier === 'pro',
        subscribedAt: account.subscribedAt || null,
        stripeCustomerId: account.stripeCustomerId || null
      });
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
