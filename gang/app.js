// Page logic (kept out of the HTML so the CSP can forbid inline scripts).
(async () => {
  const S = window.VanetrappaSocial;
  const $ = (id) => document.getElementById(id);
  $('get-app').href = S.config.appStoreUrl || '../';
  const code = S.codeFromUrl();
  if (!code) { $('status').textContent = 'Länken saknar kod. Be om en ny inbjudan.'; $('open-app').hidden = true; return; }
  $('code').textContent = S.formatCode(code);
  $('open-app').href = (S.config.appScheme || 'vanetrappa') + '://join?c=' + code;
  if (!S.configured()) return;
  const p = await S.preview(code).catch(() => null);
  if (!p) { $('status').textContent = 'Inbjudan hittades inte – koden kan ha bytts. Be om en ny.'; return; }
  if (p.kind === 'duo') {
    $('emoji').textContent = p.owner_avatar || '🫶';
    $('title').textContent = (p.owner_name || 'En vän') + ' vill följa varandra med dig';
    $('sub').textContent = 'Ni ser varandras framsteg i appen och kan heja på varandra – aldrig hur mycket någon använder.';
    document.title = 'Följ ' + (p.owner_name || 'en vän') + ' – Vanetrappa';
    return;
  }
  $('emoji').textContent = p.emoji;
  $('title').textContent = p.name;
  $('sub').textContent = (p.owner_name ? p.owner_name + ' bjuder in dig. ' : '') + p.member_count + (p.member_count === 1 ? ' medlem' : ' medlemmar') + ' trappar ner tillsammans.';
  document.title = p.name + ' – Vanetrappa';
})();
