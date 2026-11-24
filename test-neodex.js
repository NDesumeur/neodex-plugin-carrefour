// lancé par le test « local » de NeoDex : les règles de chaque carrefour, une partie au croisement (des voitures passent),
// chacun des quatre carrefours joué un moment, le plein écran et la place prise à la taille de la fenêtre (avec NEO_SHOTS : garde des images)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('cfCanvas').getAttribute('aria-label')`);
  const C = code => pj(`(() => { const T = document.getElementById('cfCanvas').__cf, cf = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('cfCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'carrefour-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('règles : ' + chk);
  await C('T.force(0); return 0;'); await sleep(200); await shot('0-depart');
  await key(' '); await sleep(4500); await shot('1-trafic');
  const first = await label(), n = +(/(\d+) voitures passées/.exec(first) || [])[1];
  if (!(n >= 1)) throw new Error('aucune voiture passée : « ' + first + ' »');
  // chaque carrefour : on le lance, on fait venir un véhicule spécial, on regarde un moment (le train arrive tout de suite au passage à niveau)
  const names = ['croisement', 'pn', 'rond', 'etoile', 'deux'], kinds = ['ambu', 'bus', 'trac', 'bike'];
  for (let i = 0; i < 5; i++) {
    await C(`T.force(${i}); const c = T.st(); c.mode = 'play'; if (c.train) c.train.in = 150; return 0;`);
    await sleep(2500);
    await C(`const c = T.st(), d = Object.keys(T.maps[${i}].lanes)[1]; c.cars.push({id: 999, lane: d, P: T.maps[${i}].lanes[d][0], s: 0, len: ${[12, 19, 11, 7][0]}, v: 0, vmax: .8, kind: '${kinds[0]}', col: 0, wait: 0, angry: 0}); return 0;`);
    await sleep(1600);
    if (i === 1) { await C(`const c = T.st(); c.light.B = 0; c.cars = c.cars.filter(k => !(k.lane === 'E' ? k.s > 15 && k.s - k.len < 37 : k.lane === 'W' && k.s > 123 && k.s - k.len < 145)); c.train.y = 95; c.train.in = 0; return 0;`); await sleep(150); }
    await shot('2-' + names[i]);
    const m = await C('return T.st().map;'); if (m !== i) throw new Error('carrefour ' + i + ' pas chargé');
  }
  // un de chaque véhicule spécial, à l'arrêt devant un feu rouge, pour l'image
  await C(`T.force(0); const c = T.st(); c.mode = 'play'; for (const d in c.next) c.next[d] = 1e9; c.light = {E: 0, W: 0, S: 0, N: 0};
    ['E', 'W', 'S', 'N'].forEach((d, i) => c.cars.push({id: 900 + i, lane: d, P: T.maps[0].lanes[d][0], s: 50, len: [12, 19, 11, 7][i], v: 0, vmax: .8, kind: ['${kinds.join("','")}'][i], col: 0, wait: 0, angry: 0})); return 0;`);
  await sleep(700); await shot('3-vehicules');
  await C('T.force(0); return 0;');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('cfFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('cfCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && Math.abs(r.height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas la hauteur');
  const L = await pj(`(() => { const r = document.getElementById('cfCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('cfCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'règles ok · ' + first + ' · 5 carrefours joués · plein écran · carrefour ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
