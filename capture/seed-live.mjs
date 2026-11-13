// Seeds the isolated demo stack (API :3100, survey-api stand-in :4600) with two Sampling projects for the video.
const API = 'http://localhost:3100/api/v1';
const OP = 'http://localhost:4600/v1/operator/pollflow';
const login = await (await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'qa@example.com', password: 'TestPass123!' }) })).json();
const tok = login.data.accessToken;
const me = await (await fetch(`${API}/auth/me`, { headers: { authorization: `Bearer ${tok}` } })).json();
const ws = me.data.workspaces[0].id;
const base = `${API}/workspaces/${ws}/sampling`;
async function call(method, path, body) {
  const r = await fetch(`${base}${path}`, { method, headers: { authorization: `Bearer ${tok}`, ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} ${r.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text).data : null;
}
const AGE = [[18, 29, 'Ålder 18–29'], [30, 44, 'Ålder 30–44'], [45, 64, 'Ålder 45–64'], [65, 79, 'Ålder 65–79']];
const SHARE = [20, 25, 32, 23];
const GENDER = [['male', 'Man'], ['female', 'Kvinna']];
function ageGender(total) {
  const out = [];
  AGE.forEach(([lo, hi, name], i) => GENDER.forEach(([key, g]) => {
    out.push({ name: `${name} · ${g}`, kind: 'hard', target_completes: Math.round((total * SHARE[i]) / 200), expression: { all: [{ age_between: [lo, hi] }, { answered: { question_key: 'gender', option_keys: [key] } }] } });
  }));
  return out;
}

const whole = (await call('GET', '/projects/3/balancing?language=sv')).scopes.find((s) => s.parent_quota_id === null);
const def = (dim) => { const d = whole.dimensions.find((x) => x.dimension === dim); return d && (d.definitions.find((x) => x.is_default) ?? d.definitions[0])?.key; };
// B: live — the Live chapter.
const b = await call('POST', '/projects', { name: 'Mediavanor Q4', countries: ['SE'], loi: 10, field_days: 7, expected_ir: 75, target_completes: 1200 });
await call('POST', `/projects/${b.project_id}/quotas/batch`, { quota_group: { name: 'Ålder × Kön' }, create: ageGender(1200) });
await call('PATCH', `/projects/${b.project_id}`, { quality_check: true, min_quality_score: 30, entry_url: 'https://survey.example.com/s/mediavanor?pid={pid}' });
const key = def('county');
if (key) await call('PUT', `/projects/${b.project_id}/balances`, { parent_quota_id: null, definition: key, strength: 50, enabled: true });
await call('POST', `/projects/${b.project_id}/price-request`, {});
const offer = await fetch(`${OP}/projects/${b.project_id}/price`, { method: 'PUT', headers: { 'content-type': 'application/json', 'x-api-key': 'local-fake', authorization: 'Basic ' + Buffer.from('local-fake:local-fake').toString('base64'), 'x-acting-user': 'staff@example.com' }, body: JSON.stringify({ price_per_complete: 42, currency: 'SEK' }) });
console.log('offer', offer.status, (await offer.text()).slice(0, 120));
const accepted = await call('POST', `/projects/${b.project_id}/price/accept`, {});
console.log('B after accept:', accepted.status, accepted.price_status);
if (accepted.status !== 'active') {
  const live = await call('PATCH', `/projects/${b.project_id}`, { status: 'active' }).catch((e) => e.message);
  console.log('B go live:', typeof live === 'string' ? live : live.status);
}
console.log(JSON.stringify({ ws, a: a.project_id, b: b.project_id }));
