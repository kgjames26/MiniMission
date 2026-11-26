/* Mini Mission — lecteur du livre de l'histoire.
   MM.book.open(id, { onDone, force }) : ouvre un livre de MM.STORY (une seule fois sauf force) ; MM.book.seen(id) ; MM.book.library(ids).
   Paysage : double page (2 pages côte à côte) ; portrait : une page à la fois. La voix lit seulement quand on appuie sur 🔊. */
(() => {
  const MM = (window.MM = window.MM || {});
  const KEY = 'mm.book.seen';
  const seenList = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const markSeen = (id) => { try { const s = seenList(); if (!s.includes(id)) { s.push(id); localStorage.setItem(KEY, JSON.stringify(s)); } } catch (e) {} };
  const BG = { space: ['#1c1460', '#4a3aa8'], city: ['#8fdcff', '#ffe9b0'], night: ['#1b2550', '#6a4aa8'] };
  const css = `
  .mmb{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(circle at 50% 30%,#fff6e0,#f2d8a8);padding:max(10px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));font-family:"Baloo 2",system-ui,sans-serif;touch-action:pan-y;user-select:none;-webkit-user-select:none}
  .mmb-book{position:relative;flex:1;min-height:0;width:min(1100px,100%);display:flex;gap:0;border-radius:18px;background:#fffdf6;box-shadow:0 14px 40px rgba(80,50,10,.35),0 0 0 6px #b97a3a,0 0 0 10px #8a5424}
  .mmb-book::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:26px;margin-left:-13px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.12),rgba(0,0,0,0));pointer-events:none}
  .mmb.single .mmb-book::after{display:none}
  .mmb-page{flex:1;min-width:0;display:flex;flex-direction:column;padding:clamp(8px,1.6vmin,16px);gap:clamp(6px,1.4vmin,12px);animation:mmbIn .35s ease}
  @keyframes mmbIn{from{opacity:0;transform:translateY(8px)}}
  .mmb-pic{position:relative;flex:1;min-height:0;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,var(--b1),var(--b2));display:grid;place-items:center}
  .mmb-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .mmb-emo{font-size:clamp(34px,11vmin,96px);line-height:1;letter-spacing:.08em;filter:drop-shadow(0 4px 4px rgba(0,0,0,.25));text-align:center;padding:0 6px}
  .mmb-txt{flex:none;font-size:clamp(15px,3.1vmin,25px);line-height:1.3;font-weight:700;color:#3b2f22;max-height:42%;overflow:auto}
  .mmb-bar{flex:none;display:flex;gap:12px;align-items:center;justify-content:center}
  .mmb-btn{border:0;border-radius:999px;min-width:58px;height:58px;padding:0 16px;font-size:28px;font-weight:900;color:#fff;background:linear-gradient(#ffb04a,#f2702c);box-shadow:0 5px 0 #b4471a;font-family:inherit}
  .mmb-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #b4471a}
  .mmb-btn.alt{background:linear-gradient(#8fd0ff,#3a96e8);box-shadow:0 5px 0 #1f6fa8}
  .mmb-btn.go{background:linear-gradient(#69d36a,#2f9c3b);box-shadow:0 5px 0 #1f6e2a;font-size:24px}
  .mmb-btn[hidden]{display:none}
  .mmb-dots{display:flex;gap:6px}
  .mmb-dots i{width:10px;height:10px;border-radius:50%;background:#d8c09a}.mmb-dots i.on{background:#f2702c}
  .mmb-skip{position:absolute;top:max(10px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right));border:0;border-radius:999px;background:rgba(255,255,255,.9);font-size:20px;font-weight:900;padding:6px 14px;color:#8a5424;box-shadow:0 3px 0 rgba(0,0,0,.15);z-index:2}
  .mmb-lib{position:fixed;inset:0;z-index:59;display:flex;flex-direction:column;gap:10px;background:radial-gradient(circle at 50% 20%,#fff6e0,#f2d8a8);padding:max(12px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
  .mmb-lib h2{margin:0;text-align:center;font-size:clamp(24px,5vmin,40px);color:#8a5424}
  .mmb-shelf{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;align-content:start}
  .mmb-cover{position:relative;aspect-ratio:3/4;border:0;border-radius:8px 14px 14px 8px;background:linear-gradient(160deg,var(--b1),var(--b2));box-shadow:inset 8px 0 0 rgba(0,0,0,.18),0 5px 0 rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;font:inherit;font-weight:900;font-size:clamp(13px,2.4vmin,17px);padding:8px;text-shadow:0 2px 0 rgba(0,0,0,.3)}
  .mmb-cover span{font-size:clamp(30px,7vmin,48px)}
  .mmb-cover.lock{filter:grayscale(1) opacity(.5)}
  .mmb-book{margin-top:10px}
  .mmb.single .mmb-page{justify-content:center}
  .mmb.single .mmb-pic{flex:none;width:100%;aspect-ratio:4/3;max-height:62%}
  .mmb.single .mmb-txt{max-height:none;font-size:clamp(17px,4.8vw,26px)}
  .mmb.single .mmb-book{flex:0 1 auto}`;
  let styled = false;
  const style = () => { if (styled) return; styled = true; const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  const speak = (t) => { if (MM.say) MM.say(t); else { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; speechSynthesis.speak(u); } catch (e) {} } };
  const hush = () => { if (MM.hush) MM.hush(); else { try { speechSynthesis.cancel(); } catch (e) {} } };
  const esc = (v) => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function open(id, opts = {}) {
    const book = MM.STORY && MM.STORY[id];
    if (!book || (!opts.force && seenList().includes(id))) { if (opts.onDone) opts.onDone(); return false; }
    style(); markSeen(id);
    const [b1, b2] = BG[book.bg] || BG.city;
    const root = document.createElement('div'); root.className = 'mmb'; root.setAttribute('role', 'dialog');
    root.innerHTML = `<button class="mmb-skip" aria-label="Passer">⏭</button><div class="mmb-book" style="--b1:${b1};--b2:${b2}"></div>
      <div class="mmb-bar"><button class="mmb-btn alt" data-a="prev" aria-label="Page d’avant">◀</button><button class="mmb-btn alt" data-a="say" aria-label="Écouter">🔊</button><div class="mmb-dots"></div><button class="mmb-btn" data-a="next" aria-label="Page suivante">▶</button><button class="mmb-btn go" data-a="done" aria-label="C’est parti" hidden>▶▶</button></div>`;
    document.body.appendChild(root);
    const pages = book.pages, el = root.querySelector('.mmb-book'), dots = root.querySelector('.mmb-dots');
    let per = 2, at = 0, closed = false, sayNow = false;
    const render = () => {
      per = innerWidth > innerHeight && pages.length > 1 ? 2 : 1; root.classList.toggle('single', per === 1);
      at = Math.floor(at / per) * per;
      const view = pages.slice(at, at + per);
      el.innerHTML = view.map((p, k) => { const n = at + k + 1, src = `assets/book/${id}-${n}.webp`;
        return `<div class="mmb-page"><div class="mmb-pic"><span class="mmb-emo">${esc(p.e || '')}</span><img src="${src}" alt="" onerror="this.remove()"></div><div class="mmb-txt">${esc(p.t)}</div></div>`; }).join('');
      const spreads = Math.ceil(pages.length / per), cur = Math.floor(at / per);
      dots.innerHTML = Array.from({ length: spreads }, (_, i) => `<i class="${i === cur ? 'on' : ''}"></i>`).join('');
      root.querySelector('[data-a="prev"]').style.visibility = at > 0 ? 'visible' : 'hidden';
      const last = at + per >= pages.length; root.querySelector('[data-a="next"]').hidden = last; root.querySelector('[data-a="done"]').hidden = !last;
      if (sayNow) speak(view.map(p => p.s || p.t).join(' '));   // la voix ne lit que si on appuie sur 🔊 (la synthèse vocale n'est pas toujours belle)
      sayNow = false;
    };
    const close = () => { if (closed) return; closed = true; hush(); removeEventListener('resize', render); root.remove(); if (opts.onDone) opts.onDone(); };
    const go = (d) => { const n = at + d * per; if (n < 0) return; if (n >= pages.length) { close(); return; } at = n; hush(); render(); };
    root.addEventListener('click', (e) => { const a = e.target.closest('[data-a]'); if (!a) return; const k = a.dataset.a;
      if (k === 'prev') go(-1); else if (k === 'next') go(1); else if (k === 'done') close(); else if (k === 'say') { sayNow = true; render(); } });
    root.querySelector('.mmb-skip').onclick = close;
    let sx = null; root.addEventListener('pointerdown', e => { sx = e.clientX; }); root.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60 && !e.target.closest('button')) go(dx < 0 ? 1 : -1); });
    addEventListener('resize', render);
    render();
    return true;
  }

  // la bibliothèque : tous les livres déjà lus, dans l'ordre de l'histoire
  function library(order, onClose) {
    style();
    const seen = seenList(), root = document.createElement('div'); root.className = 'mmb-lib';
    const items = order.filter(id => MM.STORY[id]);
    root.innerHTML = `<button class="mmb-skip" aria-label="Fermer">✕</button><h2>📚</h2><div class="mmb-shelf">${items.map(id => { const b = MM.STORY[id], [b1, b2] = BG[b.bg] || BG.city, ok = seen.includes(id);
      return `<button class="mmb-cover ${ok ? '' : 'lock'}" data-id="${id}" style="--b1:${b1};--b2:${b2}"><span>${ok ? esc((b.pages[0].e || '📖').slice(0, 4)) : '🔒'}</span>${ok ? esc(b.title || '') : ''}</button>`; }).join('')}</div>`;
    document.body.appendChild(root);
    root.querySelector('.mmb-skip').onclick = () => { root.remove(); if (onClose) onClose(); };
    root.querySelector('.mmb-shelf').addEventListener('click', e => { const c = e.target.closest('.mmb-cover'); if (!c || c.classList.contains('lock')) return; open(c.dataset.id, { force: true }); });
  }
  MM.book = { open, library, seen: (id) => seenList().includes(id), markSeen };
})();
