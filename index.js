// Carrefour : on règle les feux d'un croisement pour faire passer les voitures sans accident ni bouchon.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Carrefour</span><span class="hint">Clique un feu, ou la flèche du côté d'où viennent les voitures · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="cfCanvas" width="160" height="160" role="img" aria-label="Carrefour"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="cfStats"></div></div>
      <div class="row"><select class="gSel" id="cfMap" aria-label="Carrefour"></select></div>
      <div class="row"><button class="btn main" id="cfNew">NOUVELLE PARTIE</button><button class="btn" id="cfFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Chaque feu passe du vert au rouge quand tu cliques dessus (ou près de sa voie). Au clavier, la flèche montre le côté d'où viennent les voitures : ← celles de gauche, ↑ celles du haut, etc. Deux voitures qui se croisent au milieu, c'est l'accident et la partie s'arrête. Une voiture arrêtée trop longtemps s'impatiente (la pastille jaune puis rouge), klaxonne et te coûte une étoile : à 0 étoile, c'est le bouchon. Les bus sont longs et lents, le tracteur et le vélo très lents ; l'ambulance (gyrophare bleu) est prioritaire : bloquée deux secondes, elle te coûte une étoile. Il arrive de plus en plus de voitures.</div>
      <div class="hint">25 voitures à un carrefour ouvrent le suivant : le passage à niveau (B baisse la barrière avant le train, la cloche prévient), le rond-point (tout le monde y roule au même pas) et l'étoile à six voies (touches 1 à 6).</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 520px;min-width:min(100%,520px);position:relative}
.gameBox canvas{width:min(100%,max(320px,calc(100vh - 200px)));height:auto;aspect-ratio:1;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gameBox:fullscreen{padding:0;display:grid;place-items:center}
.gameBox:fullscreen canvas{width:min(100vw,100vh)}
.gSide{display:flex;flex-direction:column;gap:14px;flex:0 1 320px;min-width:250px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.disabled = o.disabled; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'CARREFOUR', T: { k: '#0c0e10', k2: '#14181c', fill: '#1e2428', fillOn: '#2a3238', hl: '#343c42', line: '#5a6670', acc: '#ffd84a', accL: '#fff6b0', accS: '#c89a1a', accD: '#4a3a08',
  rivet: '#f0f0e8', btn: '#343c42', btnHi: '#5a6670', btnLo: '#14181c', btnHov: '#3e484e', btnHovHi: '#7a8690', text: '#f0f4f4', muted: '#b4c0c4', acc2: '#7ee07a', gold: '#ffd84a',
  orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#0e1214', bgDot: '#1e2428', bgDot2: '#14181c', spark: '#3a3a10', spark2: '#ffd84a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['...kkkkk....', '...kmmmk....', '...kmrmk....', '...kmmmk....', '...kmgmk....', '...kmmmk....', '...kmnmk....', '...kkkkk....', '.....km.....', '.....km.....', '...kkkkk....'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Carrefour : des véhicules arrivent de tous les côtés ; on passe chaque feu au vert ou au rouge.
   Un choc = perdu ; un véhicule qui attend trop longtemps fait perdre une étoile (3 étoiles). On roule à droite.
   Quatre carrefours, chacun débloqué par 25 voitures au précédent : le croisement, le passage à niveau (une barrière et un train),
   le rond-point (on y roule tous au même pas, il faut laisser entrer au bon moment) et l'étoile à six voies.
   Chaque véhicule suit un trajet (une suite de points) : s = la distance parcourue par son avant. ---------- */
const CF = {W: 160, H: 160, C: 80, WAIT: 600, RING: 20, RV: .7, TX: 26, UNLOCK: 25};
const cfs = gstore('carrefour', {games: 0, cars: 0, crashes: 0, map: 0}); cfs.map ??= 0;
let cf = null, cfac = null;
// --- les trajets
function cfPath(pts, o = {}) {  // o.stops : [{s, light}], o.ring : à partir de là, vitesse du rond-point
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return {pts, L, len: L.at(-1), stops: o.stops || [], ring: o.ring ?? Infinity};
}
function cfAt(P, s) {  // le point du trajet à la distance s, et la direction (au-delà des bouts : dans le prolongement)
  const {pts, L} = P; let i = 1; while (i < pts.length - 1 && L[i] < s) i++;
  const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], k = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
  return {x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, a: Math.atan2(y1 - y0, x1 - x0)};
}
const cfLine = (x0, y0, x1, y1) => [[x0, y0], [x1, y1]];
// le croisement : quatre voies droites (E arrive de la gauche, W de la droite, S du haut, N du bas)
const CF_STRAIGHT = {E: cfLine(0, 86, 220, 86), W: cfLine(160, 74, -60, 74), S: cfLine(74, 0, 74, 220), N: cfLine(86, 160, 86, -60)};
const cfCross = extra => Object.fromEntries('EWSN'.split('').map(d => [d, [cfPath(CF_STRAIGHT[d], {stops: [{s: 59, light: d}, ...(extra[d] || [])]})]]));
// le rond-point : on entre en tournant à droite, on tourne dans le sens inverse des aiguilles d'une montre, on sort un, deux ou trois bras plus loin
const CF_ARM = {E: 180, N: 90, W: 0, S: 270};  // l'angle (vers le bas = 90°) du bras d'où arrive chaque voie
function cfRound() {
  const C = CF.C, R = CF.RING, pt = a => [C + R * Math.cos(a * Math.PI / 180), C + R * Math.sin(a * Math.PI / 180)];
  const edge = {180: [[-40, 74], [0, 86]], 0: [[200, 86], [160, 74]], 90: [[74, 200], [86, 160]], 270: [[86, -40], [74, 0]]};  // [bout de la sortie, début de l'entrée]
  const out = {};
  for (const d of 'EWSN') {
    const a = CF_ARM[d], ain = a - 17.5, start = edge[a][1], e = pt(ain), appr = Math.hypot(e[0] - start[0], e[1] - start[1]);
    out[d] = [1, 2, 3].map(k => {  // 1 : à droite, 2 : tout droit, 3 : à gauche
      const b = (a - 90 * k + 360) % 360, aout = b + 17.5 - (b + 17.5 > ain ? 360 : 0), arc = [];
      for (let t = ain; t > aout + .1; t -= 7.5) arc.push(pt(t));
      return Object.assign(cfPath([start, ...arc, pt(aout), edge[b][0]], {stops: [{s: appr - 3, light: d}], ring: appr}), {turn: k});
    });
  }
  return out;
}
// l'étoile : trois routes qui se croisent (0°, 60°, 120°), six voies tout droit
const CF_STAR = [0, 60, 120, 180, 240, 300];
function cfStar() {
  const out = {};
  CF_STAR.forEach((deg, i) => { const a = deg * Math.PI / 180, h = [Math.cos(a), Math.sin(a)], r = [-h[1], h[0]], o = (k, s) => CF.C + h[k] * s + r[k] * 6;
    out['v' + (i + 1)] = [cfPath([[o(0, -115), o(1, -115)], [o(0, 135), o(1, 135)]], {stops: [{s: 115 - 27, light: 'v' + (i + 1)}]})]; });
  return out;
}
// la voie de chaque feu : ses touches, le texte affiché à côté
const CF_ARROW = {E: '←', W: '→', S: '↑', N: '↓', E2: 'J', W2: 'L', S2: 'I', N2: 'K'};
// deux carrefours reliés (x 36-60 et 100-124) : la route du milieu ne tient que deux voitures ; si la file déborde, elle bloque le premier carrefour
const cfTwo = () => { const v = (x0, y0, x1, y1, stops) => [cfPath(cfLine(x0, y0, x1, y1), {stops: stops.map(([s, light]) => ({s, light}))})];
  return {E: v(0, 86, 220, 86, [[27, 'E'], [91, 'E2']]), W: v(160, 74, -60, 74, [[27, 'W2'], [91, 'W']]), S: v(42, 0, 42, 220, [[59, 'S']]), N: v(54, 160, 54, -60, [[59, 'N']]), S2: v(106, 0, 106, 220, [[59, 'S2']]), N2: v(118, 160, 118, -60, [[59, 'N2']])}; };
const CF_MAPS = [
  {id: 'croisement', name: 'Croisement', rec: 'carrefour', lanes: cfCross({}), lights: {E: 1, W: 1, S: 0, N: 0},
    help: ['Clique un feu', 'ou flèche du même côté', 'Pas de choc, pas d\'attente']},
  {id: 'pn', name: 'Passage à niveau', rec: 'carrefour-pn', lanes: cfCross({E: [{s: 14, light: 'B'}], W: [{s: 124, light: 'B'}]}), lights: {E: 1, W: 1, S: 0, N: 0, B: 1}, train: true,
    help: ['Un train passe à gauche', 'Baisse la barrière : B', 'quand la cloche sonne']},
  {id: 'rond', name: 'Rond-point', rec: 'carrefour-rond', lanes: cfRound(), lights: {E: 1, W: 1, S: 0, N: 0},
    help: ['Dans le rond-point,', 'tout le monde roule au même pas :', 'laisse entrer au bon moment']},
  {id: 'etoile', name: 'Étoile à six voies', rec: 'carrefour-etoile', lanes: cfStar(), lights: {v1: 1, v4: 1, v2: 0, v3: 0, v5: 0, v6: 0},
    help: ['Six voies, six feux', 'touches 1 à 6', 'Pas de choc, pas d\'attente']},
  {id: 'deux', name: 'Deux carrefours', rec: 'carrefour-deux', lanes: cfTwo(), lights: {E: 1, W: 1, S: 0, N: 0, E2: 1, W2: 1, S2: 0, N2: 0},
    help: ['Deux carrefours reliés', 'Flèches : le premier', 'J L I K : le second', 'La route du milieu est courte']},
];
const cfMap = () => CF_MAPS[cf?.map ?? cfs.map] || CF_MAPS[0];
const cfOpen = i => i === 0 || (games.best[CF_MAPS[i - 1].rec] || 0) >= CF.UNLOCK;
// --- les véhicules, vus de dessus, tournés vers le haut (y : phares, r : feux arrière, w : vitres, B : toit)
const CF_CAR = ['.kykkyk.', 'kbbbbbbk', 'kbwwwwbk', 'kbwwwwbk', 'kbbbbbbk', 'kbBBBBbk', 'kbBBBBbk', 'kbBBBBbk', 'kbbbbbbk', 'kbwwwwbk', 'kbbbbbbk', '.krkkrk.'];
const CF_BUS = ['.kykkyk.', 'kbbbbbbk', 'kbwwwwbk', 'kbbbbbbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbbbbbbk', 'kbbbbbbk', '.krkkrk.'];
// l'ambulance : blanche, bande et croix rouges, gyrophares bleus (L) qui clignotent
const CF_AMBU = ['.kykkyk.', 'kbbbbbbk', 'kbwwwwbk', 'kbbbbbbk', 'kLbbbbLk', 'kbbRRbbk', 'kbRRRRbk', 'kbbRRbbk', 'kRRRRRRk', 'kbbbbbbk', 'kbbbbbbk', '.krkkrk.'];
// le tracteur : capot vert, cabine, grosses roues arrière noires
const CF_TRAC = ['..kyyk..', '..kGGk..', '.kkGGkk.', 'kk.GG.kk', 'kkGGGGkk', '.kGwwGk.', 'kkGwwGkk', 'kkkGGkkk', 'kkkGGkkk', 'kkkGGkkk', '.krkkrk.'];
// le vélo : deux roues, un cycliste au casque orange
const CF_BIKE = ['.k.', '.k.', 'kok', 'ksk', 'kck', '.k.', '.k.'];
const CF_COLORS = [['#d83a3a', '#a82020'], ['#3a7ad8', '#2050a8'], ['#e8c83a', '#b89020'], ['#4aa84a', '#2a7a2a'], ['#e8e4ec', '#a8a4b0'], ['#8a4ab8', '#5a2a88']];
const cfArt = (rows, pal) => { const c = el('canvas'); c.width = Math.max(...rows.map(r => r.length)); c.height = rows.length; sprite(c.getContext('2d'), rows, 0, 0, pal); return c; };
const CF_BASE = {k: '#14101c', w: '#9ad8f0', y: '#fff6b0', r: '#ff4a3a'};
const CF_IMG = {car: CF_COLORS.map(([b, B]) => cfArt(CF_CAR, {...CF_BASE, b, B})), bus: [cfArt(CF_BUS, {...CF_BASE, b: '#ff8a3a', B: '#e86a1a'})],
  ambu: [cfArt(CF_AMBU, {...CF_BASE, b: '#f4f4f8', R: '#e8303a', L: '#3a6aff'}), cfArt(CF_AMBU, {...CF_BASE, b: '#f4f4f8', R: '#e8303a', L: '#b8e0ff'})],
  trac: [cfArt(CF_TRAC, {...CF_BASE, G: '#3a9a3a', w: '#9ad8f0'})], bike: [cfArt(CF_BIKE, {k: '#14101c', o: '#ff8a3a', s: '#3a7ad8', c: '#e8c83a'})]};
const CF_KIND = {car: {len: 12, v: .8}, bus: {len: 19, v: .6}, ambu: {len: 12, v: 1.35}, trac: {len: 11, v: .32}, bike: {len: 7, v: .5}};
const cfRotCache = new Map();
function cfRot(img, a) {  // le dessin tourné dans la direction a, pixel par pixel (sans flou), mis en cache par 1/32 de tour
  const q = Math.round((a + Math.PI / 2) / (Math.PI / 16)) & 31, key = img; let m = cfRotCache.get(key); if (!m) cfRotCache.set(key, m = []);
  if (m[q]) return m[q];
  const w = img.width, h = img.height, S = Math.ceil(Math.hypot(w, h)) + 2, t = q * Math.PI / 16, co = Math.cos(t), si = Math.sin(t);
  const src = img.getContext('2d').getImageData(0, 0, w, h).data, c = el('canvas'); c.width = c.height = S; const g = c.getContext('2d'), out = g.createImageData(S, S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const dx = x + .5 - S / 2, dy = y + .5 - S / 2, sx = Math.floor(dx * co + dy * si + w / 2), sy = Math.floor(-dx * si + dy * co + h / 2);
    if (sx >= 0 && sy >= 0 && sx < w && sy < h) for (let k = 0; k < 4; k++) out.data[(y * S + x) * 4 + k] = src[(sy * w + sx) * 4 + k]; }
  g.putImageData(out, 0, 0); return (m[q] = c);
}
// --- le décor de chaque carrefour
function cfGround(road, deco) {  // road(x, y) : chaussée ; autour, 4 pixels de trottoir ; arbres et maisons là où il reste de l'herbe
  const c = el('canvas'); c.width = CF.W; c.height = CF.H; const g = c.getContext('2d'), r = seeded(5), W = CF.W, side = new Uint8Array(W * W);
  px(g, '#3a7a3a', 0, 0, W, W); for (let i = 0; i < 500; i++) px(g, r() < .5 ? '#4a8a3a' : '#2f6a32', Math.floor(r() * W), Math.floor(r() * W));
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { if (road(x, y)) { side[y * W + x] = 2; continue; } for (let d = 1; d <= 4 && !side[y * W + x]; d++) if (road(x + d, y) || road(x - d, y) || road(x, y + d) || road(x, y - d)) side[y * W + x] = 1; }
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const s = side[y * W + x]; if (s === 1) px(g, (x + y) % 8 ? '#8a8a92' : '#6a6a72', x, y); else if (s === 2) px(g, r() < .06 ? '#44444e' : '#3a3a44', x, y); }
  const free = (x, y, m) => { for (let j = -m; j <= m; j++) for (let i = -m; i <= m; i++) { const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= W || Y >= W || side[Y * W + X]) return false; } return true; };
  const tree = (x, y) => { if (!free(x, y, 6)) return; px(g, '#1e4a22', x - 4, y - 3, 9, 7); px(g, '#1e4a22', x - 3, y - 4, 7, 9); px(g, '#2f7a32', x - 3, y - 3, 7, 6); px(g, '#4aa84a', x - 2, y - 3, 3, 2); px(g, '#26401e', x - 3, y + 4, 7, 1); };
  const house = (x, y, c1, c2) => { if (!free(x + 10, y + 8, 12)) return; px(g, '#14101c', x - 1, y - 1, 22, 18); px(g, c1, x, y, 20, 8); px(g, c2, x, y + 8, 20, 8); for (let i = 0; i < 20; i += 3) px(g, '#14101c', x + i, y + 7, 1, 1); px(g, '#e8e4ec', x + 14, y + 2, 3, 3); };
  deco(g, {tree, house, side, r});
  return c;
}
const cfDash = (g, x0, y0, x1, y1, col, keep) => { const n = Math.hypot(x1 - x0, y1 - y0); for (let k = 0; k < n; k++) if (k % 10 < 5) { const x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n; if (keep(x, y)) px(g, col, x, y); } };
const CF_GROUND = {
  croisement: cfGround((x, y) => (y >= 68 && y < 92) || (x >= 68 && x < 92), (g, {tree, house}) => {
    cfDash(g, 0, 79.5, 160, 79.5, '#d8d8d8', x => x < 60 || x > 100); cfDash(g, 79.5, 0, 79.5, 160, '#d8d8d8', (x, y) => y < 60 || y > 100);
    for (let i = 69; i < 92; i += 3) { px(g, '#e8e8e8', i, 61, 2, 5); px(g, '#e8e8e8', i, 94, 2, 5); px(g, '#e8e8e8', 61, i, 5, 2); px(g, '#e8e8e8', 94, i, 5, 2); }
    house(14, 14, '#c85a3a', '#a8442a'); house(118, 124, '#6a5aa8', '#54468a'); [[48, 22], [30, 50], [120, 30], [140, 52], [24, 120], [48, 142], [130, 100]].forEach(p => tree(...p)); }),
  pn: cfGround((x, y) => (y >= 68 && y < 92) || (x >= 68 && x < 92), (g, {tree, house}) => {
    cfDash(g, 0, 79.5, 160, 79.5, '#d8d8d8', x => (x < 60 || x > 100) && (x < 16 || x > 36)); cfDash(g, 79.5, 0, 79.5, 160, '#d8d8d8', (x, y) => y < 60 || y > 100);
    for (let i = 69; i < 92; i += 3) { px(g, '#e8e8e8', i, 61, 2, 5); px(g, '#e8e8e8', i, 94, 2, 5); px(g, '#e8e8e8', 61, i, 5, 2); px(g, '#e8e8e8', 94, i, 5, 2); }
    // la voie ferrée : ballast, traverses, deux rails (encastrés dans la route au passage)
    for (let y = 0; y < 160; y++) { const onRoad = y >= 68 && y < 92; if (!onRoad) for (let x = 17; x < 36; x++) px(g, (x * 7 + y * 3) % 5 ? '#7a6e60' : '#5a5048', x, y);
      if (!onRoad && y % 4 === 0) px(g, '#5a3a22', 18, y, 17, 2); px(g, onRoad ? '#9a9aa4' : '#c8c8d0', 21, y, 1, 1); px(g, onRoad ? '#9a9aa4' : '#c8c8d0', 30, y, 1, 1); }
    for (let k = 0; k < 12; k += 2) { px(g, '#e8e8e8', 12, 80 + k, 2, 1); px(g, '#e8e8e8', 38, 68 + k, 2, 1); }  // les lignes d'arrêt avant la voie ferrée
    house(118, 124, '#6a5aa8', '#54468a'); house(110, 14, '#c85a3a', '#a8442a'); [[52, 22], [58, 50], [140, 52], [52, 120], [56, 142], [130, 100], [8, 120], [8, 40]].forEach(p => tree(...p)); }),
  rond: cfGround((x, y) => { const d = Math.hypot(x + .5 - 80, y + .5 - 80); return d >= 12 && d < 28 || (d >= 12 && ((y >= 68 && y < 92) || (x >= 68 && x < 92))); }, (g, {tree, house, r}) => {
    for (let y = 60; y < 100; y++) for (let x = 60; x < 100; x++) { const d = Math.hypot(x + .5 - 80, y + .5 - 80); if (d < 12) px(g, d > 10 ? '#8a8a92' : d < 4 ? '#4ab8e8' : d < 5 ? '#c8c8d0' : (x * 3 + y) % 7 ? '#3a8a3a' : '#ff7ab0', x, y); }  // l'îlot : bordure, pelouse fleurie, fontaine
    px(g, '#d8f4ff', 79, 78, 2, 2);
    cfDash(g, 0, 79.5, 160, 79.5, '#d8d8d8', x => x < 50 || x > 110); cfDash(g, 79.5, 0, 79.5, 160, '#d8d8d8', (x, y) => y < 50 || y > 110);
    house(14, 14, '#c85a3a', '#a8442a'); house(118, 124, '#6a5aa8', '#54468a'); [[48, 22], [30, 50], [120, 30], [140, 52], [24, 120], [48, 142], [130, 100]].forEach(p => tree(...p)); }),
  deux: cfGround((x, y) => (y >= 68 && y < 92) || (x >= 36 && x < 60) || (x >= 100 && x < 124), (g, {tree, house}) => {
    cfDash(g, 0, 79.5, 160, 79.5, '#d8d8d8', x => x < 28 || (x > 68 && x < 92) || x > 132); for (const cx of [47.5, 111.5]) cfDash(g, cx, 0, cx, 160, '#d8d8d8', (x, y) => y < 60 || y > 100);
    for (const L of [36, 100]) { for (let i = 1; i < 24; i += 3) { px(g, '#e8e8e8', L + i, 61, 2, 5); px(g, '#e8e8e8', L + i, 94, 2, 5); } for (let i = 69; i < 92; i += 3) { px(g, '#e8e8e8', L - 7, i, 5, 2); px(g, '#e8e8e8', L + 26, i, 5, 2); } }
    house(70, 10, '#c85a3a', '#a8442a'); house(70, 132, '#6a5aa8', '#54468a'); [[14, 20], [14, 46], [142, 20], [146, 46], [14, 118], [18, 146], [140, 118], [146, 146], [80, 50], [80, 112]].forEach(p => tree(...p)); }),
  etoile: cfGround((x, y) => [0, 60, 120].some(d => { const a = d * Math.PI / 180; return Math.abs(-(x + .5 - 80) * Math.sin(a) + (y + .5 - 80) * Math.cos(a)) < 12; }), (g, {tree, house}) => {
    for (const d of [0, 60, 120]) { const a = d * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); cfDash(g, 80 - c * 120, 80 - s * 120, 80 + c * 120, 80 + s * 120, '#d8d8d8', (x, y) => Math.hypot(x - 80, y - 80) > 34); }
    [[20, 20], [140, 30], [20, 140], [140, 128], [80, 18], [80, 142], [12, 80], [148, 80]].forEach(p => tree(...p)); house(118, 2, '#c85a3a', '#a8442a'); house(20, 142, '#6a5aa8', '#54468a'); }),
};
// --- l'état d'une partie
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function cfNew(map = cfs.map) {
  const g = cf?.g, M = CF_MAPS[map] || CF_MAPS[0], lanes = Object.keys(M.lanes);
  cf = renew(cf, {g, map: CF_MAPS.indexOf(M), mode: 'ready', tick: 0, seen: 0, t: 0, cars: [], light: {...M.lights}, next: Object.fromEntries(lanes.map((d, i) => [d, 30 + i * 80])),
    passed: 0, stars: 3, dead: 0, crash: null, record: false, rnd: seeded(Date.now() % 1e9), id: 0, honk: [], train: M.train ? {in: 900, y: -999} : null, siren: 0});
  cfInfo();
}
function cfSpawn(d) {
  const r = cf.rnd, M = cfMap(), x = r(), late = cf.t > 60 * 20;
  const kind = cf.id === 0 ? 'car' : x < .1 ? 'bus' : x < .16 && late && !cf.cars.some(c => c.kind === 'ambu') ? 'ambu' : x < .22 ? 'trac' : x < .3 ? 'bike' : 'car';  // la première voiture passe vite ; une seule ambulance à la fois
  const K = CF_KIND[kind], last = cf.cars.filter(c => c.lane === d).reduce((m, c) => Math.min(m, c.s - c.len), 1e9);
  if (last < 4) return false;  // la file arrive au bord : il attendra son tour
  const paths = M.lanes[d], P = paths.length > 1 ? paths[r() < .35 ? 0 : r() < .62 ? 1 : 2] : paths[0];
  const diff = Math.min(1, cf.t / (60 * 150)), vmax = kind === 'car' ? K.v + r() * .35 + diff * .25 : K.v + diff * .15;
  cf.cars.push({id: cf.id++, lane: d, P, s: 0, len: K.len, v: 0, vmax, kind, col: Math.floor(r() * CF_COLORS.length), wait: 0, angry: 0});
  return true;
}
const cfBody = c => [0, .5, 1].map(k => cfAt(c.P, c.s - c.len * k));  // l'avant, le milieu, l'arrière
const cfOut = c => { const b = cfAt(c.P, c.s - c.len); return c.s > 60 && (b.x < -4 || b.y < -4 || b.x > CF.W + 4 || b.y > CF.H + 4); };
function cfBeep(f, d, type = 'square', slide = 0, vol = .04) { try { cfac ??= new AudioContext(); const o = cfac.createOscillator(), g = cfac.createGain(), t = cfac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(cfac.destination); o.start(t); o.stop(t + d); } catch {} }
function cfToggle(d) { if (cf.mode !== 'play' || !(d in cf.light)) return; cf.light[d] ^= 1; cfBeep(d === 'B' ? (cf.light.B ? 520 : 260) : cf.light[d] ? 660 : 330, .05, 'square', 0, .03); }
function cfDie(at) {
  cf.mode = 'over'; cf.dead = 0; cf.crash = at || null;
  cfs.games++; cfs.cars += cf.passed; if (cf.crash) cfs.crashes++; cf.record = best(cfMap().rec, cf.passed); saveGames(); cfInfo(); cfMapList();
  cfBeep(cf.crash ? 120 : 300, .6, 'sawtooth', 40, .08);
}
function cfUpdate() {
  if (cf.mode === 'over') { cf.dead++; return; }
  if (cf.mode !== 'play') return;
  cf.t++;
  const M = cfMap(), diff = Math.min(1, cf.t / (60 * 150)), nl = Object.keys(M.lanes).length;
  // chaque voie a son propre flot, régulier : jamais de vague puis de vide, et un carrefour tout au vert finit vite en accident
  for (const d in M.lanes) if (--cf.next[d] <= 0) cf.next[d] = cfSpawn(d) ? Math.round((230 - 120 * diff) * nl / 4 * (.7 + cf.rnd() * .6)) : 15;
  for (const c of cf.cars) {
    if (c.s >= c.P.ring) { c.v = CF.RV; c.s += c.v; continue; }  // dans le rond-point, tout le monde roule au même pas
    // jusqu'où avancer : la ligne d'arrêt de chaque feu rouge pas encore passé, le véhicule de devant sur la même voie
    let lim = 1e9;
    for (const st of c.P.stops) if (!cf.light[st.light] && c.s <= st.s + 1) lim = Math.min(lim, st.s);
    for (const o of cf.cars) if (o !== c && o.lane === c.lane && o.s > c.s) lim = Math.min(lim, o.s - o.len - 3);
    const want = Math.max(0, Math.min(c.vmax, (lim - c.s) * .12));
    c.v = want < c.v ? want : Math.min(want, c.v + .03);
    c.s += c.v;
    const patience = c.kind === 'ambu' ? CF.WAIT / 5 : CF.WAIT;  // l'ambulance est prioritaire : la bloquer deux secondes coûte une étoile
    if (c.v < .05) { if (++c.wait > patience) { c.wait = 0; c.angry = 90; cf.stars--; cf.honk.push({c, t: 40, txt: c.kind === 'ambu' ? 'PRIORITÉ !' : 'TÛT !'}); cfBeep(400, .2, 'square', 380, .06); if (cf.stars <= 0) return cfDie(); } } else c.wait = Math.max(0, c.wait - 2);
    if (c.angry) c.angry--;
  }
  // un choc : deux véhicules de voies différentes qui se touchent
  const bodies = cf.cars.map(cfBody);
  for (let i = 0; i < cf.cars.length; i++) for (let j = i + 1; j < cf.cars.length; j++) { if (cf.cars[i].lane === cf.cars[j].lane) continue;
    for (const p of bodies[i]) for (const q of bodies[j]) if (Math.hypot(p.x - q.x, p.y - q.y) < 6.5) return cfDie({x: (p.x + q.x) / 2, y: (p.y + q.y) / 2}); }
  // le train : la cloche sonne 4 secondes avant, puis il traverse ; un véhicule sur la voie ferrée à ce moment-là, c'est l'accident
  const T = cf.train;
  if (T) {
    if (T.y > -999) { T.y += 2.2; for (const b of bodies) for (const p of b) if (Math.abs(p.x - CF.TX) < 7 && p.y > T.y - 70 && p.y < T.y) return cfDie({x: CF.TX, y: p.y});
      if (T.y > CF.H + 80) { T.y = -999; T.in = 700 + Math.floor(cf.rnd() * 500); } }
    else if (--T.in <= 0) { T.y = 0; cfBeep(220, .5, 'sawtooth', 200, .05); }
    else if (T.in < 240 && T.in % 30 === 0) cfBeep(T.in % 60 ? 1320 : 1100, .08, 'triangle', 0, .04);
  }
  // l'ambulance : une sirène deux tons, douce
  if (cf.cars.some(c => c.kind === 'ambu') && ++cf.siren % 40 === 0) cfBeep(cf.siren % 80 ? 960 : 720, .3, 'triangle', 0, .015);
  const before = cf.cars.length; cf.cars = cf.cars.filter(c => !cfOut(c));
  if (cf.cars.length < before) { cf.passed += before - cf.cars.length; cfBeep(880, .03, 'square', 0, .02); }
  for (const h of cf.honk) h.t--; cf.honk = cf.honk.filter(h => h.t > 0);
}
// les feux de chaque voie : le boîtier à droite de la voie, un peu avant la ligne d'arrêt ; la barrière à part
function cfLights() {
  const M = cfMap(), out = [];
  const seen = new Set();
  for (const d in M.lanes) for (const st of M.lanes[d][0].stops) { if (st.light === 'B' || seen.has(st.light)) continue; seen.add(st.light); const P = M.lanes[d][0], p = cfAt(P, st.s), h = [Math.cos(p.a), Math.sin(p.a)];
    out.push({id: st.light, x: p.x - h[0] * 7 - h[1] * 12, y: p.y - h[1] * 7 + h[0] * 12, key: CF_ARROW[st.light] || st.light.slice(1), P, st}); }
  if ('B' in cf.light) out.push({id: 'B', x: 8, y: 58, key: 'B'});
  return out;
}
function cfDraw() {
  const g = cf.g, {W, H} = CF, M = cfMap();
  for (; cf.seen < cf.tick; cf.seen++) if (cf.mode === 'over') cfUpdate();
  g.imageSmoothingEnabled = false;
  g.drawImage(CF_GROUND[M.id], 0, 0);
  // les lignes d'arrêt, blanches au vert, rouges au rouge (la barrière n'en a pas : elle a ses bras)
  for (const L of cfLights()) { if (L.id === 'B') continue; const p = cfAt(L.P, L.st.s + 1), n = [-Math.sin(p.a), Math.cos(p.a)], col = cf.light[L.id] ? '#e8e8e8' : '#c83a3a';
    for (let k = -5; k <= 5; k += .5) px(g, col, p.x + n[0] * k, p.y + n[1] * k); }
  // les véhicules (une ombre décalée), puis ceux qui klaxonnent
  for (const c of cf.cars) { const m = cfAt(c.P, c.s - c.len / 2), imgs = CF_IMG[c.kind], img = cfRot(c.kind === 'car' ? imgs[c.col] : c.kind === 'ambu' ? imgs[(cf.tick >> 3) % 2] : imgs[0], m.a), S = img.width;
    g.save(); g.globalAlpha = .3; g.globalCompositeOperation = 'source-over'; g.filter = 'brightness(0)'; g.drawImage(img, Math.round(m.x - S / 2) + 1, Math.round(m.y - S / 2) + 2); g.restore();
    g.drawImage(img, Math.round(m.x - S / 2), Math.round(m.y - S / 2));
    if (c.wait > (c.kind === 'ambu' ? CF.WAIT / 10 : CF.WAIT * .5) && (cf.tick >> 3) % 2) { const x = Math.round(m.x), y = Math.round(m.y) - 12; px(g, '#14101c', x - 2, y - 1, 5, 6); px(g, c.wait > (c.kind === 'ambu' ? CF.WAIT / 6 : CF.WAIT * .8) ? '#ff4a3a' : '#ffd84a', x - 1, y, 3, 3); px(g, '#ffd84a', x - 1, y + 4, 3, 1); } }
  for (const h of cf.honk) { const m = cfAt(h.c.P, h.c.s - h.c.len / 2); pxFont(g, h.txt, m.x, m.y - 10 - (40 - h.t) / 8, '#ffd84a', 8, 'center'); }
  // le train et la barrière
  const T = cf.train;
  if (T) {
    const warn = T.y > -999 || T.in < 240, blink = warn && (cf.tick >> 4) % 2;
    if (T.y > -999) for (let k = 0; k < 3; k++) { const y1 = T.y - k * 24, y0 = y1 - 22; px(g, '#14101c', CF.TX - 6, y0 - 1, 12, 24); px(g, k ? '#3a6aa8' : '#c83a3a', CF.TX - 5, y0, 10, 22); px(g, k ? '#5a8ac8' : '#e85a4a', CF.TX - 5, y0, 3, 22);
      for (let w = 3; w < 20; w += 5) px(g, '#9ad8f0', CF.TX - 3, y0 + w, 6, 2); if (!k) { px(g, '#fff6b0', CF.TX - 4, y1 - 1, 2, 1); px(g, '#fff6b0', CF.TX + 2, y1 - 1, 2, 1); } }
    // les deux bras de la barrière, chacun en travers de la voie qui arrive (rouge et blanc), ou levés le long du trottoir
    for (const [x, y, dy] of [[15, 93, -1], [37, 66, 1]]) { px(g, '#14101c', x - 1, y - 1, 3, 3);
      for (let k = 1; k <= 12; k++) { const c = (k >> 2) % 2 ? '#e8e8e8' : '#d83a3a'; if (cf.light.B) px(g, c, x - dy * k, y, 1, 1); else px(g, c, x, y + dy * k, 2, 1); } }
    // le signal : deux feux rouges qui clignotent quand le train arrive
    px(g, '#14101c', 40, 54, 13, 7); px(g, blink ? '#ff4a3a' : '#4a1a1a', 42, 56, 3, 3); px(g, warn && !blink ? '#ff4a3a' : '#4a1a1a', 48, 56, 3, 3);
  }
  // les feux : poteau, boîtier, rouge en haut, vert en bas, et la touche à côté
  for (const L of cfLights()) { const x = Math.round(L.x) - 3, y = Math.round(L.y) - 4, on = cf.light[L.id];
    if (L.id === 'B') { px(g, '#14101c', x, y, 8, 9); px(g, on ? '#2a2a32' : '#d83a3a', x + 1, y + 1, 6, 7); px(g, '#e8e8e8', x + 2, y + 4, 4, 1); }
    else { px(g, '#14101c', x, y, 6, 9); px(g, '#2a2a32', x + 1, y + 1, 4, 7); px(g, on ? '#4a1a1a' : '#ff4a3a', x + 2, y + 2, 2, 2); px(g, on ? '#7ee07a' : '#1a3a1a', x + 2, y + 5, 2, 2); }
    if (cf.mode === 'play') pxFont(g, L.key, x + 3, y + (L.y < 80 ? -2 : 18), '#ffffff', 8, 'center'); }
  if (cf.crash) { const {x, y} = cf.crash, f = Math.min(6, cf.dead >> 2); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; px(g, i % 2 ? '#ffd84a' : '#ff8a3a', x + Math.cos(a) * f * 1.5 - 1, y + Math.sin(a) * f * 1.5 - 1, 3, 3); } px(g, '#ffffff', x - 2, y - 2, 4, 4); }
  // l'affichage : voitures passées, étoiles
  px(g, 'rgba(10,8,16,.75)', 0, 0, W, 14);
  pxFont(g, cf.passed + (cf.passed > 1 ? ' voitures' : ' voiture'), 4, 10, '#ffffff', 8);
  for (let i = 0; i < 3; i++) { const x = W - 34 + i * 10; const c = i < cf.stars ? '#ffd84a' : '#3a3440'; px(g, c, x + 2, 3, 3, 7); px(g, c, x, 5, 7, 3); px(g, c, x + 1, 9, 2, 2); px(g, c, x + 4, 9, 2, 2); }
  if (cf.mode === 'ready') gameText(g, W, [[M.name.toUpperCase(), '#ffd84a', 8], ...M.help.map(t => [t, '#ffffff']), ['Record ' + (games.best[M.rec] || 0), '#ffd84a'], ['Espace : jouer', '#b8b0c8']], 46);
  if (cf.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace : reprendre', '#b8b0c8']], 76);
  if (cf.mode === 'over' && cf.dead > 40) gameText(g, W, [[cf.crash ? 'ACCIDENT !' : 'BOUCHON !', '#ff4a3a', 12], [cf.passed + (cf.passed > 1 ? ' voitures passées' : ' voiture passée'), '#ffffff'], [cf.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best[M.rec] || 0), '#ffd84a'],
    ...(CF_MAPS[cf.map + 1] && !cfOpen(cf.map + 1) ? [[CF.UNLOCK + ' voitures : ' + CF_MAPS[cf.map + 1].name.toLowerCase(), '#7ee07a']] : []), [cf.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 52);
  if (cf.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Carrefour, ' + M.name.toLowerCase() + ' : ' + (cf.mode === 'play' ? cf.passed + ' voitures passées, ' + cf.stars + ' étoiles, feux verts : ' + (Object.keys(cf.light).filter(d => cf.light[d] && d !== 'B').map(d => ({E: 'gauche', W: 'droite', S: 'haut', N: 'bas', E2: 'gauche du second', W2: 'droite du second', S2: 'haut du second', N2: 'bas du second'})[d] || 'voie ' + d.slice(1)).join(', ') || 'aucun') + (cf.train ? ', barrière ' + (cf.light.B ? 'levée' : 'baissée') : '') : cf.mode === 'over' ? 'partie finie avec ' + cf.passed + ' voitures' : cf.mode === 'pause' ? 'pause' : 'prêt'));
}
function cfInfo() {
  const M = cfMap();
  $('cfStats').replaceChildren(...[['Record (' + M.name.toLowerCase() + ')', (games.best[M.rec] || 0) + ' voitures'], ['Parties', cfs.games], ['Voitures passées', cfs.cars], ['Accidents', cfs.crashes]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
function cfMapList() {  // la liste des carrefours : ceux pas encore ouverts disent ce qu'il faut faire
  $('cfMap').replaceChildren(...CF_MAPS.map((m, i) => { const o = el('option', '', cfOpen(i) ? m.name + ' · record ' + (games.best[m.rec] || 0) : m.name + ' · ' + CF.UNLOCK + ' voitures au ' + CF_MAPS[i - 1].name.toLowerCase()); o.value = i; o.disabled = !cfOpen(i); return o; }));
  $('cfMap').value = String(cf?.map ?? cfs.map);
}
function cfStart() {
  if (cf.mode === 'ready' || cf.mode === 'pause') { cf.mode = 'play'; return true; }
  if (cf.mode === 'over' && cf.dead > 60) { cfNew(cf.map); cf.mode = 'play'; return true; }
  return false;
}
// les flèches pointent le côté d'où viennent les voitures : ← les voitures de gauche, ↑ celles du haut… ; B la barrière ; 1 à 6 les voies de l'étoile
const CF_KEYS = {ArrowLeft: 'E', ArrowRight: 'W', ArrowUp: 'S', ArrowDown: 'N', q: 'E', a: 'E', d: 'W', z: 'S', w: 'S', s: 'N', b: 'B', j: 'E2', l: 'W2', i: 'S2', k: 'N2', 1: 'v1', 2: 'v2', 3: 'v3', 4: 'v4', 5: 'v5', 6: 'v6'};
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !cf || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === ' ' || k === 'Enter') { e.preventDefault(); if (!e.repeat) cfStart(); return; }
  if (CF_KEYS[k]) { e.preventDefault(); if (!e.repeat) cfToggle(CF_KEYS[k]); }
  if ((k === 'p' || k === 'Escape') && cf.mode === 'play') cf.mode = 'pause';
});
// à la souris ou au doigt : le feu le plus proche de l'endroit touché change (son boîtier ou sa ligne d'arrêt)
{ const cv = $('cfCanvas');
  cv.onpointerdown = e => { e.preventDefault(); if (!cf || cfStart()) return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * CF.W, y = (e.clientY - r.top) / r.height * CF.H, M = cfMap();
    const near = L => { if (L.id === 'B') return Math.min(Math.hypot(x - L.x, y - L.y), Math.abs(x - CF.TX) < 14 && y > 60 && y < 100 ? 0 : 1e9);
      const p = cfAt(L.P, L.st.s - 14); return Math.min(Math.hypot(x - L.x, y - L.y), Math.hypot(x - p.x, y - p.y)); };
    cfToggle(cfLights().sort((a, b) => near(a) - near(b))[0].id); }; }
$('cfNew').onclick = () => { cfNew(cf.map); $('cfNew').blur(); };
$('cfMap').onchange = () => { const i = +$('cfMap').value; if (!cfOpen(i)) return cfMapList(); cfs.map = i; saveGames(); cfNew(i); cfInfo(); };
$('cfFs').onclick = () => { $('cfFs').blur(); if (document.fullscreenElement) document.exitFullscreen(); else $('cfCanvas').parentElement.requestFullscreen?.().catch(() => {}); };
function cfCheck() {  // vérification de chaque carrefour ; renvoie 'ok' ou ce qui ne va pas
  const keep = cf, realBest = {...games.best}, realStats = {...cfs}, bad = [], run = n => { for (let i = 0; i < n && cf.mode === 'play'; i++) cfUpdate(); };
  const fresh = m => { cf = null; cfNew(m); cf.mode = 'play'; for (const d in cf.next) cf.next[d] = 1e9; if (cf.train) cf.train.in = 1e9; };
  const car = (lane, o = {}) => { const M = CF_MAPS[cf.map], c = {id: cf.id++, lane, P: M.lanes[lane][o.turn ?? 0], s: 0, len: 12, v: 0, vmax: 1, kind: 'car', col: 0, wait: 0, angry: 0, ...o}; cf.cars.push(c); return c; };
  // croisement : arrêt au rouge sans passer la ligne, départ au vert ; deux voitures qui se croisent au vert se percutent ; tout au vert finit en accident
  fresh(0); cf.light.E = 0; const a = car('E'); run(300); if (!(a.s <= 59.01 && a.s > 57)) bad.push('arrêt au rouge');
  cf.light.E = 1; run(400); if (cf.passed !== 1) bad.push('départ au vert');
  fresh(0); cf.light = {E: 1, W: 1, S: 1, N: 1}; car('E', {s: 40, v: 1}); car('S', {s: 40, v: 1}); run(200); if (!(cf.mode === 'over' && cf.crash)) bad.push('choc au milieu');
  let allGreen = 1e9; for (const seed of [1, 2, 3]) { cf = null; cfNew(0); cf.rnd = seeded(seed); cf.mode = 'play'; cf.light = {E: 1, W: 1, S: 1, N: 1}; let i = 0; for (; i < 60 * 40 && cf.mode === 'play'; i++) cfUpdate(); allGreen = Math.min(allGreen, cf.crash ? 0 : i); }
  if (allGreen) bad.push('tout au vert sans accident');
  // l'ambulance bloquée au rouge coûte une étoile en 2 secondes
  fresh(0); cf.light.E = 0; car('E', {kind: 'ambu', vmax: 1.35}); run(60 * 4); if (cf.stars !== 2) bad.push('ambulance prioritaire');
  // passage à niveau : la barrière baissée arrête avant la voie ferrée ; une voiture arrêtée sur la voie quand le train passe, c'est l'accident
  fresh(1); cf.light.B = 0; const b = car('E'); run(300); if (!(b.s <= 14.01 && b.s > 12)) bad.push('barrière');
  fresh(1); car('E', {s: 30, vmax: 0}); cf.train.in = 1; run(200); if (!(cf.mode === 'over' && cf.crash)) bad.push('train');
  fresh(1); cf.light.B = 0; car('E', {s: 10, vmax: 0}); cf.train.in = 1; run(200); if (cf.mode !== 'play' || cf.train.y !== -999) bad.push('train qui passe sans accident');
  // rond-point : une voiture entre, fait le tour par la droite et sort à gauche, tout droit ou à droite ; deux qui arrivent ensemble se percutent
  for (const turn of [0, 1, 2]) { fresh(2); const c = car('E', {turn}); let near = 1e9; for (let i = 0; i < 900 && !cf.passed && cf.mode === 'play'; i++) { cfUpdate(); const p = cfAt(c.P, c.s); near = Math.min(near, Math.hypot(p.x - 80, p.y - 80)); }
    const end = c.P.pts.at(-1); if (cf.passed !== 1 || near > 22) bad.push('rond-point ' + turn); if (turn === 1 && end[0] < 150) bad.push('tout droit'); }
  fresh(2); cf.light = {E: 1, W: 1, S: 1, N: 1}; const e2 = car('E', {turn: 2, v: CF.RV, vmax: CF.RV}); e2.s = e2.P.ring; const n2 = car('N', {turn: 1, v: CF.RV, vmax: CF.RV}); n2.s = n2.P.ring - 31.4; run(900);  // la deuxième entre au moment où la première passe devant elle if (!(cf.mode === 'over' && cf.crash)) bad.push('choc au rond-point');
  // étoile : chaque voie passe tout droit ; tout au vert finit en accident
  fresh(3); for (const d in cf.light) cf.light[d] = 1; for (const d in CF_MAPS[3].lanes) { cf.cars = []; const c = car(d); cf.passed = 0; run(500); if (cf.passed !== 1) bad.push('étoile ' + d); }
  cf = null; cfNew(3); cf.rnd = seeded(2); cf.mode = 'play'; for (const d in cf.light) cf.light[d] = 1; run(60 * 40); if (!cf.crash) bad.push('étoile tout au vert');
  fresh(4); cf.light.E2 = 0; const t1 = car('E'); run(400); if (!(t1.s <= 91.01 && t1.s > 89)) bad.push('second feu');
  fresh(4); for (const d in cf.light) cf.light[d] = 1; for (const d in CF_MAPS[4].lanes) { cf.cars = []; car(d); cf.passed = 0; run(500); if (cf.passed !== 1) bad.push('deux ' + d); }
  fresh(4); for (const d in cf.light) cf.light[d] = 0; cf.light.E = 1; car('E', {s: 80}); car('E', {s: 65}); car('E', {s: 50}); run(300); cf.light.N = 1; car('N', {s: 40, v: 1}); run(300); if (!(cf.mode === 'over' && cf.crash)) bad.push('file qui déborde');
  games.best = realBest; Object.assign(cfs, realStats); cf = keep;
  return bad.length ? bad.join(', ') : 'ok';
}
$('cfCanvas').__cf = {st: () => cf, check: cfCheck, maps: CF_MAPS, force: i => { cfs.map = i; cfNew(i); }};  // pour l'auto-test
console.assert(cfCheck() === 'ok', 'carrefour', cfCheck());
ctx.onOpen(() => {
  if (!cf || !cf.g) { cfNew(cfOpen(cfs.map) ? cfs.map : 0); cf.g = $('cfCanvas').getContext('2d'); cfMapList(); }
  gameLoop(cf, 'carrefour', cfUpdate, cfDraw); cfInfo();
});
}
