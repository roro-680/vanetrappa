// Helpers for the /gang/ invite page. Mirrors src/domain/social/invite.ts.
// Everything social happens in the app – this page only shows the invite and opens the app.
// All user-provided text is inserted with textContent – never innerHTML.
(function () {
  const config = window.VANETRAPPA || {};
  const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

  let client = null;
  const configured = () => !!(config.supabaseUrl && config.supabaseKey && window.supabase);
  const sb = () => client || (client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }));

  function normalizeCode(input) {
    let s = String(input || '').trim().toUpperCase();
    const m = s.match(/[?&]C=([A-Z0-9-]+)/);
    if (m) s = m[1];
    s = s.replace(/^VT-?/, '').replace(/[\s-]/g, '');
    if (s.length !== 8) return null;
    for (const ch of s) if (!ALPHABET.includes(ch)) return null;
    return s;
  }
  const codeFromUrl = () => normalizeCode(new URLSearchParams(location.search).get('c'));
  const formatCode = (c) => (c && c.length === 8 ? c.slice(0, 4) + '-' + c.slice(4) : c);

  async function preview(code) {
    const res = await sb().rpc('group_preview', { code });
    if (res.error) throw res.error;
    return res.data && res.data[0] ? res.data[0] : null;
  }

  window.VanetrappaSocial = { config, configured, normalizeCode, codeFromUrl, formatCode, preview };
})();
