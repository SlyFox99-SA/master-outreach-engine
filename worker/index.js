function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: cors() });
}
function ghHeaders(env) {
  return {
    'Authorization': 'token ' + env.GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'outreach-save-api'
  };
}
function ghBase(env) {
  return 'https://api.github.com/repos/' + env.GITHUB_OWNER + '/' + env.GITHUB_REPO + '/contents/';
}
async function ghRead(env, path) {
  const res = await fetch(ghBase(env) + path + '?ref=' + env.GITHUB_BRANCH, { headers: ghHeaders(env) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('read ' + path + ': ' + (await res.text()));
  const j = await res.json();
  const content = atob((j.content || '').replace(/\n/g, ''));
  return { sha: j.sha, data: JSON.parse(content) };
}
async function ghWrite(env, path, data, message, sha) {
  const pretty = JSON.stringify(data, null, 2) + '\n';
  const encoded = btoa(unescape(encodeURIComponent(pretty)));
  const body = { message: message, content: encoded, branch: env.GITHUB_BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(ghBase(env) + path, {
    method: 'PUT',
    headers: Object.assign({ 'Content-Type': 'application/json' }, ghHeaders(env)),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('write ' + path + ': ' + (await res.text()));
  return res.json();
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors() });

    if (url.pathname === '/api/orders' && request.method === 'GET') {
      const brand = String(url.searchParams.get('brand') || '').replace(/[^a-z0-9-]/gi, '');
      if (!brand) return json({ ok: false, error: 'Missing brand' }, 400);
      try {
        const cur = await ghRead(env, 'data/orders-' + brand + '.json');
        return json({ ok: true, brand: brand, orders: cur ? (cur.data.orders || []) : [] });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    if (url.pathname === '/api/order' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Invalid JSON' }, 400); }
      const brand = body.brand, order = body.order;
      if (!brand || !order) return json({ ok: false, error: 'Missing brand or order' }, 400);
      const safeBrand = String(brand).replace(/[^a-z0-9-]/gi, '');
      if (!safeBrand) return json({ ok: false, error: 'Invalid brand' }, 400);
      const path = 'data/orders-' + safeBrand + '.json';
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const cur = await ghRead(env, path);
          const existing = cur ? (cur.data.orders || []) : [];
          if (order.ref && existing.some(function (o) { return o.ref === order.ref; })) {
            return json({ ok: true, brand: safeBrand, ref: order.ref, deduped: true });
          }
          existing.push(order);
          await ghWrite(env, path, { brand: safeBrand, orders: existing }, 'order ' + (order.ref || '?') + ' for ' + safeBrand, cur ? cur.sha : null);
          return json({ ok: true, brand: safeBrand, ref: order.ref, count: existing.length });
        } catch (e) {
          if (attempt === 3) return json({ ok: false, error: String(e.message || e) }, 500);
          await new Promise(function (r) { setTimeout(r, 250 * (attempt + 1)); });
        }
      }
    }

    if (url.pathname === '/api/save' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Invalid JSON' }, 400); }
      const brand = body.brand, data = body.data, message = body.message;
      if (!brand || !data) return json({ ok: false, error: 'Missing brand or data' }, 400);
      const safeBrand = String(brand).replace(/[^a-z0-9-]/gi, '');
      if (!safeBrand) return json({ ok: false, error: 'Invalid brand' }, 400);
      const path = 'data/config-' + safeBrand + '.json';
      try {
        const cur = await ghRead(env, path);
        if (!cur) return json({ ok: false, error: 'Config not found: ' + path }, 404);
        await ghWrite(env, path, data, message || ('update ' + safeBrand + ' from seller dashboard'), cur.sha);
        return json({ ok: true, brand: safeBrand });
      } catch (e) { return json({ ok: false, error: String(e.message || e) }, 500); }
    }

    return json({ ok: false, error: 'Not found' }, 404);
  }
};