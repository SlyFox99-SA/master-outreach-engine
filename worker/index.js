export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers: cors });

    let body;
    try { body = await request.json(); } catch (e) { return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: cors }); }

    const { brand, data, message } = body;
    if (!brand || !data) return new Response(JSON.stringify({ ok: false, error: 'Missing brand or data' }), { status: 400, headers: cors });

    const safeBrand = String(brand).replace(/[^a-z0-9-]/gi, '');
    if (!safeBrand) return new Response(JSON.stringify({ ok: false, error: 'Invalid brand' }), { status: 400, headers: cors });

    const filePath = 'data/config-' + safeBrand + '.json';
    const apiUrl = 'https://api.github.com/repos/' + env.GITHUB_OWNER + '/' + env.GITHUB_REPO + '/contents/' + filePath + '?ref=' + env.GITHUB_BRANCH;
    const ghHeaders = {
      'Authorization': 'token ' + env.GITHUB_TOKEN,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'outreach-save-api'
    };

    const getRes = await fetch(apiUrl, { headers: ghHeaders });
    if (!getRes.ok) return new Response(JSON.stringify({ ok: false, error: 'Config not found: ' + filePath }), { status: 404, headers: cors });
    const current = await getRes.json();

    const prettyJson = JSON.stringify(data, null, 2) + '\n';
    const encoded = btoa(unescape(encodeURIComponent(prettyJson)));
    const putRes = await fetch('https://api.github.com/repos/' + env.GITHUB_OWNER + '/' + env.GITHUB_REPO + '/contents/' + filePath, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({
        message: message || ('update ' + safeBrand + ' from seller dashboard'),
        content: encoded,
        sha: current.sha,
        branch: env.GITHUB_BRANCH
      })
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      return new Response(JSON.stringify({ ok: false, error: 'GitHub write failed: ' + err }), { status: 500, headers: cors });
    }
    return new Response(JSON.stringify({ ok: true, brand: safeBrand }), { headers: cors });
  }
};