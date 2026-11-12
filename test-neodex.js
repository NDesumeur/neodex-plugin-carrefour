// lancé par le test « local » de NeoDex : part, laisse passer les voitures de l'axe vert et vérifie qu'au moins une est passée
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('cfCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('cfCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'carrefour-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await shot('0-depart');
  await key(' ');
  await sleep(4500); await shot('1-trafic');
  const first = await label();
  if (process.env.NEO_SHOTS) { await sleep(5000); await shot('2-file'); await key('ArrowUp'); await key('ArrowDown'); await sleep(4000); await shot('3-fin'); }
  const n = +(/(\d+) voitures passées/.exec(first) || [])[1];
  if (!(n >= 1)) throw new Error('aucune voiture passée : « ' + first + ' »');
  return first;
};
