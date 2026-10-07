function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}
function json(data, status) { return new Response(JSON.stringify(data), { status: status || 200, headers: cors() }); }
function safeBrand(s) { return String(s || '').replace(/[^a-z0-9-]/gi, ''); }
function bearer(request) {
  const h = request.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
function checkSellerAuth(request, env, brand) {
  let tokens = {};
  try { tokens = JSON.parse(env.SELLER_TOKENS || '{}'); } catch (e) { return false; }
  const expected = tokens[brand];
  if (!expected) return false;
  const got = bearer(request);
  if (!got || got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
function newRef() {
  const d = new Date();
  const ymd = String(d.getUTCFullYear()).slice(2) + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return 'WF-' + ymd + '-' + rand;
}
async function ghRead(env, path) {
  const url = 'https://api.github.com/repos/' + env.GITHUB_OWNER + '/' + env.GITHUB_REPO + '/contents/' + path + '?ref=' + env.GITHUB_BRANCH;
  const res = await fetch(url, { headers: { 'Authorization': 'token ' + env.GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'webforge' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('gh read: ' + (await res.text()));
  const j = await res.json();
  return { sha: j.sha, data: JSON.parse(atob((j.content || '').replace(/\n/g, ''))) };
}
async function ghWrite(env, path, data, message, sha) {
  const body = { message: message, content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n'))), branch: env.GITHUB_BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch('https://api.github.com/repos/' + env.GITHUB_OWNER + '/' + env.GITHUB_REPO + '/contents/' + path, {
    method: 'PUT',
    headers: { 'Authorization': 'token ' + env.GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'webforge', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('gh write: ' + (await res.text()));
  return res.json();
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors() });
    const path = url.pathname;

    // ===== POST /api/order — buyer submits order (no auth, ref is proof of possession) =====
    if (path === '/api/order' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Invalid JSON' }, 400); }
      const brand = safeBrand(body.brand);
      const order = body.order;
      if (!brand || !order) return json({ ok: false, error: 'Missing brand or order' }, 400);
      const ref = String(order.ref || '').slice(0, 40) || newRef();
      order.ref = ref;
      order.createdAt = order.createdAt || new Date().toISOString();
      order.status = order.status || 'new';
      try {
        await env.DB.prepare('INSERT OR IGNORE INTO orders (brand, ref, data, created_at, status) VALUES (?, ?, ?, ?, ?)')
          .bind(brand, ref, JSON.stringify(order), Date.now(), order.status).run();
        return json({ ok: true, brand: brand, ref: ref });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    // ===== GET /api/order?brand=X&ref=Y — buyer tracks a single order (no auth, ref is high entropy) =====
    if (path === '/api/order' && request.method === 'GET') {
      const brand = safeBrand(url.searchParams.get('brand'));
      const ref = String(url.searchParams.get('ref') || '').slice(0, 40);
      if (!brand || !ref) return json({ ok: false, error: 'Missing brand or ref' }, 400);
      try {
        const row = await env.DB.prepare('SELECT data, status FROM orders WHERE brand = ? AND ref = ?').bind(brand, ref).first();
        if (!row) return json({ ok: false, error: 'Order not found' }, 404);
        const order = JSON.parse(row.data);
        order.status = row.status;
        return json({ ok: true, order: order });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    // ===== GET /api/orders?brand=X — seller lists ALL orders (auth required) =====
    if (path === '/api/orders' && request.method === 'GET') {
      const brand = safeBrand(url.searchParams.get('brand'));
      if (!brand) return json({ ok: false, error: 'Missing brand' }, 400);
      if (!checkSellerAuth(request, env, brand)) return json({ ok: false, error: 'Unauthorized' }, 401);
      try {
        const rows = await env.DB.prepare('SELECT data, status FROM orders WHERE brand = ? ORDER BY created_at DESC LIMIT 500').bind(brand).all();
        const orders = (rows.results || []).map(function (r) { const o = JSON.parse(r.data); o.status = r.status; return o; });
        return json({ ok: true, brand: brand, orders: orders });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    // ===== PATCH /api/order?brand=X&ref=Y — seller updates order (auth required) =====
    if (path === '/api/order' && request.method === 'PATCH') {
      const brand = safeBrand(url.searchParams.get('brand'));
      const ref = String(url.searchParams.get('ref') || '').slice(0, 40);
      if (!brand || !ref) return json({ ok: false, error: 'Missing brand or ref' }, 400);
      if (!checkSellerAuth(request, env, brand)) return json({ ok: false, error: 'Unauthorized' }, 401);
      let body; try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Invalid JSON' }, 400); }
      try {
        const row = await env.DB.prepare('SELECT data FROM orders WHERE brand = ? AND ref = ?').bind(brand, ref).first();
        if (!row) return json({ ok: false, error: 'Order not found' }, 404);
        const order = JSON.parse(row.data);
        if (body.status) order.status = body.status;
        if (body.paidAt !== undefined) order.paidAt = body.paidAt;
        if (body.shippedAt !== undefined) order.shippedAt = body.shippedAt;
        if (body.deliveredAt !== undefined) order.deliveredAt = body.deliveredAt;
        if (body.tracking !== undefined) order.tracking = body.tracking;
        if (body.carrier !== undefined) order.carrier = body.carrier;
        await env.DB.prepare('UPDATE orders SET data = ?, status = ? WHERE brand = ? AND ref = ?')
          .bind(JSON.stringify(order), order.status, brand, ref).run();
        return json({ ok: true, brand: brand, ref: ref, status: order.status });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    // ===== POST /api/save — seller saves config to GitHub (auth required) =====
    if (path === '/api/save' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Invalid JSON' }, 400); }
      const brand = safeBrand(body.brand);
      if (!brand || !body.data) return json({ ok: false, error: 'Missing brand or data' }, 400);
      if (!checkSellerAuth(request, env, brand)) return json({ ok: false, error: 'Unauthorized' }, 401);
      const filePath = 'data/config-' + brand + '.json';
      try {
        const cur = await ghRead(env, filePath);
        if (!cur) return json({ ok: false, error: 'Config not found: ' + filePath }, 404);
        await ghWrite(env, filePath, body.data, body.message || ('update ' + brand), cur.sha);
        return json({ ok: true, brand: brand });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    return json({ ok: false, error: 'Not found' }, 404);
  }
};