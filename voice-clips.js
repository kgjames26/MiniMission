/* Voix enregistrées de Mini Mission (Google Cloud Text-to-Speech, générées par tools/voice/generate.mjs).
   - voice/<langue>/index.json associe chaque phrase (normalisée) au code de son fichier : voice/<langue>/<code>.mp3
   - MM.clips.plan(texte ou [morceaux]) donne la liste des fichiers à jouer, ou null s'il en manque un :
     on essaie la phrase entière, puis phrase par phrase (pour les phrases avec un nombre, une ville, une lettre…).
   - S'il manque un seul fichier, ou si la lecture échoue, le jeu reprend la synthèse vocale du navigateur (secours).
   - Si l'adulte a choisi une voix précise du téléphone dans les réglages, on respecte son choix : voix du navigateur. */
(() => {
  const MM = (window.MM = window.MM || {});
  const lang = () => (MM.i18n && MM.i18n.lang) || 'fr';
  const clean = (t) => (MM.voice && MM.voice.clean ? MM.voice.clean(t) : String(t || ''));
  // la même normalisation sert au script de génération (tools/voice/extract.mjs) et au jeu
  function key(t) {
    return clean(t).normalize('NFC').toLowerCase().replace(/[’‘ʼ]/g, "'").replace(/[  \s]+/g, ' ')
      .replace(/\s*([!?;:.,…«»"])\s*/g, '$1').replace(/^[,.\s]+|[,.\s]+$/g, '');
  }
  // découpe en phrases : après . ! ? … (et un » qui suit), devant une espace
  function split(t) {
    const s = String(t || ''), out = [], re = /[.!?…]+(?:\s*»)?(?=\s|$)/g; let last = 0, m;
    while ((m = re.exec(s))) { const end = m.index + m[0].length; out.push(s.slice(last, end).trim()); last = end; }
    if (s.slice(last).trim()) out.push(s.slice(last).trim());
    return out.filter(Boolean);
  }
  const idx = {}; const loading = {};
  function load(l) {
    if (idx[l] || loading[l]) return loading[l];
    return (loading[l] = fetch('voice/' + l + '/index.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null))
      .then((j) => { idx[l] = (j && j.clips) || {}; }).catch(() => { idx[l] = {}; })
      .then(() => { try { window.dispatchEvent(new Event('mm-clips')); } catch (e) {} }));
  }
  function wanted() {
    try { const s = JSON.parse(localStorage.getItem('mini-mission-v1') || '{}'); const v = (s.voices && s.voices[lang()]) || (lang() === 'fr' ? s.voiceName : '');
      return !v || v === 'auto'; } catch (e) { return true; }
  }
  function plan(what) {
    const l = lang(), map = idx[l]; if (!map || !wanted()) return null;
    const parts = (Array.isArray(what) ? what : [what]).map((p) => String(p || '').trim()).filter((p) => key(p));
    if (!parts.length) return null;
    const files = [];
    for (const p of parts) {
      const whole = map[key(p)]; if (whole) { files.push(whole); continue; }
      for (const s of split(p)) { if (!key(s)) continue; const c = map[key(s)]; if (!c) return null; files.push(c); }
    }
    return files.map((c) => 'voice/' + l + '/' + c + '.mp3');
  }
  let token = 0, cur = null;
  function stop() { token++; if (cur) { try { cur.pause(); cur.src = ''; } catch (e) {} cur = null; } }
  // joue les fichiers l'un après l'autre ; onfail() si l'un ne peut pas être lu (le jeu passe alors à la voix du navigateur)
  function play(urls, { onend, onfail } = {}) {
    stop(); const my = token; let i = 0, failed = false;
    const fail = () => { if (my !== token || failed) return; failed = true; cur = null; onfail && onfail(); };   // une seule fois
    const next = () => {
      if (my !== token) return;
      if (i >= urls.length) { cur = null; onend && onend(); return; }
      const a = new Audio(urls[i++]); cur = a; a.preload = 'auto';
      if (i < urls.length) { const pre = new Audio(urls[i]); pre.preload = 'auto'; }
      a.onended = next;
      a.onerror = fail;
      const p = a.play(); if (p && p.catch) p.catch(fail);
    };
    next();
  }
  // has() : y a-t-il des voix enregistrées pour la langue choisie ? (le réglage « Voix » propose alors « Voix du jeu »)
  const has = () => !!idx[lang()] && Object.keys(idx[lang()]).length > 0;
  MM.clips = { key, split, plan, play, stop, load, has, get ready() { return !!idx[lang()]; } };
  load(lang());
  const watch = () => { if (MM.i18n && MM.i18n.onChange) MM.i18n.onChange((l) => load(l)); else setTimeout(watch, 200); };
  watch();
})();
