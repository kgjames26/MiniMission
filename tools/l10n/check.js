// Vérifie qu'une traduction couvre tous les livres, pages, mondes et devinettes du français.
global.window = global; global.MM = {}; require('../../story.js'); require('../../rose-worlds.js');
for (const l of process.argv.slice(2)) { require('../../story-' + l + '.js'); const X = MM.STORY_L10N[l]; const miss = [];
  for (const [id, b] of Object.entries(MM.STORY)) { const t = X.story[id]; if (!t) { miss.push('book ' + id); continue; } if (t.pages.length !== b.pages.length) miss.push(`pages ${id} ${t.pages.length}/${b.pages.length}`); if (b.title && !t.title) miss.push('title ' + id); }
  for (const id of Object.keys(X.story)) if (!MM.STORY[id]) miss.push('extra ' + id);
  for (const [k, w] of Object.entries(MM.ROSE_WORLDS)) { const t = X.worlds[k]; if (!t) { miss.push('world ' + k); continue; } for (const f of ['name','chip','on','intro','outroAll']) if (!t[f]) miss.push(k + '.' + f);
    if (t.riddles.length !== w.riddles.length) miss.push(`riddles ${k} ${t.riddles.length}`); t.riddles.forEach((r, i) => { if (!r || r.length !== 3 || r[1].length !== 3) miss.push(`riddle ${k}#${i}`); }); }
  console.log(l, miss.length ? miss : 'OK'); }
