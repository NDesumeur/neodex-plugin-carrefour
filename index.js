// Carrefour : on règle les feux d'un croisement pour faire passer les voitures sans accident ni bouchon.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Carrefour</span><span class="hint">Clique un feu, ou la flèche du côté d'où viennent les voitures · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="cfCanvas" width="160" height="160" role="img" aria-label="Carrefour"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="cfStats"></div></div>
      <div class="row"><button class="btn main" id="cfNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Chaque feu passe du vert au rouge quand tu cliques dessus (ou près de sa voie). Au clavier, la flèche montre le côté d'où viennent les voitures : ← celles de gauche, ↑ celles du haut, etc. Deux voitures qui se croisent au milieu, c'est l'accident et la partie s'arrête. Une voiture arrêtée trop longtemps s'impatiente (la pastille jaune puis rouge), klaxonne et te coûte une étoile : à 0 étoile, c'est le bouchon. Les bus sont longs et lents. Il arrive de plus en plus de voitures.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,640px);width:auto;aspect-ratio:1;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
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
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
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

/* ---------- Carrefour : des voitures arrivent des quatre côtés d'un croisement ; on passe chaque feu au vert ou au rouge.
   Un choc = perdu ; une voiture qui attend trop longtemps fait perdre une étoile (3 étoiles). On roule à droite ---------- */
const CF = {W: 160, H: 160, ROAD0: 68, ROAD1: 92, STOP: 59, WAIT: 600};
// chaque sens : 'E' arrive de la gauche, 'W' de la droite, 'S' du haut, 'N' du bas ; lane = la coordonnée de sa voie
const CF_DIRS = {E: {lane: 86, h: true, sgn: 1}, W: {lane: 74, h: true, sgn: -1}, S: {lane: 74, h: false, sgn: 1}, N: {lane: 86, h: false, sgn: -1}};
const cfs = gstore('carrefour', {games: 0, cars: 0, crashes: 0});
let cf = null, cfac = null;
// une voiture vue de dessus, tournée vers le haut (y : phares, r : feux arrière, w : vitres, B : toit) ; le bus est plus long
const CF_CAR = ['.kykkyk.', 'kbbbbbbk', 'kbwwwwbk', 'kbwwwwbk', 'kbbbbbbk', 'kbBBBBbk', 'kbBBBBbk', 'kbBBBBbk', 'kbbbbbbk', 'kbwwwwbk', 'kbbbbbbk', '.krkkrk.'];
const CF_BUS = ['.kykkyk.', 'kbbbbbbk', 'kbwwwwbk', 'kbbbbbbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbBBBBbk', 'kbwBBwbk', 'kbBBBBbk', 'kbbbbbbk', 'kbbbbbbk', '.krkkrk.'];
const CF_COLORS = [['#d83a3a', '#a82020'], ['#3a7ad8', '#2050a8'], ['#e8c83a', '#b89020'], ['#4aa84a', '#2a7a2a'], ['#e8e4ec', '#a8a4b0'], ['#8a4ab8', '#5a2a88']];
const cfTurn = (rows, d) => {  // tourne les lignes : N tel quel, S à l'envers, E vers la droite, W vers la gauche
  const h = rows.length, w = rows[0].length;
  if (d === 'N') return rows; if (d === 'S') return rows.slice().reverse().map(r => [...r].reverse().join(''));
  return Array.from({length: w}, (_, i) => Array.from({length: h}, (_, j) => d === 'E' ? rows[h - 1 - j][i] : rows[j][w - 1 - i]).join(''));
};
const cfArt = (rows, pal) => { const c = el('canvas'); c.width = rows[0].length; c.height = rows.length; sprite(c.getContext('2d'), rows, 0, 0, pal); return c; };
const CF_SPR = {};
for (const d of 'NSEW') { CF_SPR[d] = CF_COLORS.map(([b, B]) => cfArt(cfTurn(CF_CAR, d), {k: '#14101c', b, B, w: '#9ad8f0', y: '#fff6b0', r: '#ff4a3a'}));
  CF_SPR[d + 'bus'] = cfArt(cfTurn(CF_BUS, d), {k: '#14101c', b: '#ff8a3a', B: '#e86a1a', w: '#9ad8f0', y: '#fff6b0', r: '#ff4a3a'}); }
// le décor fixe : herbe tramée, trottoirs, chaussée, marquages, passages piétons, arbres et toits dans les coins
const CF_GROUND = (() => { const c = el('canvas'); c.width = CF.W; c.height = CF.H; const g = c.getContext('2d'), r = seeded(5), {ROAD0: a, ROAD1: b, W} = CF;
  px(g, '#3a7a3a', 0, 0, W, W); for (let i = 0; i < 500; i++) px(g, r() < .5 ? '#4a8a3a' : '#2f6a32', Math.floor(r() * W), Math.floor(r() * W));
  px(g, '#8a8a92', 0, a - 4, W, b - a + 8); px(g, '#8a8a92', a - 4, 0, b - a + 8, W);
  for (let x = 0; x < W; x += 8) { px(g, '#6a6a72', x, a - 4, 1, 4); px(g, '#6a6a72', x, b, 1, 4); px(g, '#6a6a72', a - 4, x, 4, 1); px(g, '#6a6a72', b, x, 4, 1); }
  px(g, '#3a3a44', 0, a, W, b - a); px(g, '#3a3a44', a, 0, b - a, W);
  for (let i = 0; i < 400; i++) { const x = Math.floor(r() * W), y = Math.floor(r() * W); if ((y >= a && y < b) || (x >= a && x < b)) px(g, '#44444e', x, y); }
  for (let x = 0; x < W; x += 10) if (x + 5 < a - 8 || x > b + 8) { px(g, '#d8d8d8', x, 79, 5, 1); }
  for (let y = 0; y < W; y += 10) if (y + 5 < a - 8 || y > b + 8) { px(g, '#d8d8d8', 79, y, 1, 5); }
  for (let i = a + 1; i < b; i += 3) { px(g, '#e8e8e8', i, a - 7, 2, 5); px(g, '#e8e8e8', i, b + 2, 2, 5); px(g, '#e8e8e8', a - 7, i, 5, 2); px(g, '#e8e8e8', b + 2, i, 5, 2); }
  const tree = (x, y) => { px(g, '#1e4a22', x - 4, y - 3, 9, 7); px(g, '#1e4a22', x - 3, y - 4, 7, 9); px(g, '#2f7a32', x - 3, y - 3, 7, 6); px(g, '#4aa84a', x - 2, y - 3, 3, 2); px(g, '#26401e', x - 3, y + 4, 7, 1); };
  const house = (x, y, c1, c2) => { px(g, '#14101c', x - 1, y - 1, 22, 18); px(g, c1, x, y, 20, 8); px(g, c2, x, y + 8, 20, 8); for (let i = 0; i < 20; i += 3) px(g, '#14101c', x + i, y + 7, 1, 1); px(g, '#e8e4ec', x + 14, y + 2, 3, 3); };
  house(14, 14, '#c85a3a', '#a8442a'); house(118, 124, '#6a5aa8', '#54468a'); tree(48, 22); tree(30, 50); tree(120, 30); tree(140, 52); tree(24, 120); tree(48, 142); tree(130, 100);
  return c; })();
const cfFront = c => c.s;  // distance parcourue par l'avant depuis le bord d'entrée
function cfRect(c) {  // la boîte de la voiture sur l'écran
  const D = CF_DIRS[c.d], half = 4, f = D.sgn > 0 ? c.s : CF.W - c.s, back = D.sgn > 0 ? f - c.len : f + c.len;
  const lo = Math.min(f, back), hi = Math.max(f, back);
  return D.h ? {x0: lo, x1: hi, y0: D.lane - half, y1: D.lane + half} : {x0: D.lane - half, x1: D.lane + half, y0: lo, y1: hi};
}
const cfHit = (a, b) => a.x0 < b.x1 - 1 && b.x0 < a.x1 - 1 && a.y0 < b.y1 - 1 && b.y0 < a.y1 - 1;
function cfBeep(f, d, type = 'square', slide = 0, vol = .04) { try { cfac ??= new AudioContext(); const o = cfac.createOscillator(), g = cfac.createGain(), t = cfac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(cfac.destination); o.start(t); o.stop(t + d); } catch {} }
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function cfNew() {
  const g = cf?.g;
  cf = renew(cf, {g, mode: 'ready', tick: 0, seen: 0, t: 0, cars: [], light: {E: 1, W: 1, S: 0, N: 0}, next: 30, passed: 0, stars: 3, dead: 0, crash: null, record: false, rnd: seeded(Date.now() % 1e9), id: 0, first: true, honk: []});
  cfInfo();
}
function cfSpawn() {
  const r = cf.rnd, d = cf.first ? (r() < .5 ? 'E' : 'W') : 'EWSN'[Math.floor(r() * 4)], bus = !cf.first && r() < .12;
  cf.first = false;
  const len = bus ? 19 : 12, last = cf.cars.filter(c => c.d === d).reduce((m, c) => Math.min(m, c.s - c.len), 1e9);
  if (last < 4) return false;  // la file arrive au bord : la voiture attendra son tour
  const diff = Math.min(1, cf.t / (60 * 150));
  cf.cars.push({id: cf.id++, d, s: 0, len, v: 0, vmax: (bus ? .6 : .8 + r() * .35) + diff * .25, col: Math.floor(r() * CF_COLORS.length), bus, wait: 0, angry: 0});
  return true;
}
function cfToggle(d) { if (cf.mode !== 'play') return; cf.light[d] ^= 1; cfBeep(cf.light[d] ? 660 : 330, .05, 'square', 0, .03); }
function cfDie(a, b) {
  cf.mode = 'over'; cf.dead = 0; cf.crash = a && b ? {x: (cfRect(a).x0 + cfRect(a).x1) / 2, y: (cfRect(a).y0 + cfRect(a).y1) / 2} : null;
  cfs.games++; cfs.cars += cf.passed; if (cf.crash) cfs.crashes++; cf.record = best('carrefour', cf.passed); saveGames(); cfInfo();
  cfBeep(cf.crash ? 120 : 300, .6, 'sawtooth', 40, .08);
}
function cfUpdate() {
  if (cf.mode === 'over') { cf.dead++; return; }
  if (cf.mode !== 'play') return;
  cf.t++;
  const diff = Math.min(1, cf.t / (60 * 150));
  if (--cf.next <= 0) { cfSpawn(); cf.next = Math.round(110 - 70 * diff + cf.rnd() * 50); }
  for (const c of cf.cars) {
    // jusqu'où avancer : la ligne d'arrêt si le feu est rouge (et qu'on ne l'a pas passée), la voiture de devant
    let lim = 1e9;
    if (!cf.light[c.d] && cfFront(c) <= CF.STOP + 1) lim = CF.STOP;
    for (const o of cf.cars) if (o !== c && o.d === c.d && o.s > c.s) lim = Math.min(lim, o.s - o.len - 3);
    const want = Math.max(0, Math.min(c.vmax, (lim - c.s) * .12));
    c.v = want < c.v ? want : Math.min(want, c.v + .03);
    c.s += c.v;
    if (c.v < .05) { if (++c.wait > CF.WAIT) { c.wait = 0; c.angry = 90; cf.stars--; cf.honk.push({c, t: 40}); cfBeep(400, .2, 'square', 380, .06); if (cf.stars <= 0) return cfDie(); } } else c.wait = Math.max(0, c.wait - 2);
    if (c.angry) c.angry--;
  }
  // un choc au milieu du croisement
  for (let i = 0; i < cf.cars.length; i++) for (let j = i + 1; j < cf.cars.length; j++) { const a = cf.cars[i], b = cf.cars[j]; if (CF_DIRS[a.d].h !== CF_DIRS[b.d].h && cfHit(cfRect(a), cfRect(b))) return cfDie(a, b); }
  const before = cf.cars.length; cf.cars = cf.cars.filter(c => c.s - c.len < CF.W + 2);
  if (cf.cars.length < before) { cf.passed += before - cf.cars.length; cfBeep(880, .03, 'square', 0, .02); }
  for (const h of cf.honk) h.t--; cf.honk = cf.honk.filter(h => h.t > 0);
}
// un feu, posé au bord de la voie, juste avant la ligne d'arrêt
const cfLightPos = d => ({E: [CF.ROAD0 - 9, CF.ROAD1 + 2], W: [CF.ROAD1 + 4, CF.ROAD0 - 10], S: [CF.ROAD0 - 10, CF.ROAD0 - 9], N: [CF.ROAD1 + 4, CF.ROAD1 + 2]})[d];
function cfDraw() {
  const g = cf.g, {W, H} = CF;
  for (; cf.seen < cf.tick; cf.seen++) if (cf.mode === 'over') cfUpdate();
  g.imageSmoothingEnabled = false;
  g.drawImage(CF_GROUND, 0, 0);
  // les lignes d'arrêt, blanches au vert, rouges au rouge
  for (const d of 'EWSN') { const D = CF_DIRS[d], stop = D.sgn > 0 ? CF.STOP + 1 : W - CF.STOP - 2, col = cf.light[d] ? '#e8e8e8' : '#c83a3a';
    D.h ? px(g, col, stop, D.lane - 5, 1, 10) : px(g, col, D.lane - 5, stop, 10, 1); }
  // les voitures (une ombre décalée), puis celles qui klaxonnent
  for (const c of cf.cars) { const r = cfRect(c), spr = c.bus ? CF_SPR[c.d + 'bus'] : CF_SPR[c.d][c.col];
    px(g, 'rgba(0,0,0,.35)', r.x0 + 1, r.y0 + 2, r.x1 - r.x0, r.y1 - r.y0);
    g.drawImage(spr, Math.round(r.x0), Math.round(r.y0));
    if (c.wait > CF.WAIT * .5 && (cf.tick >> 3) % 2) { const x = Math.round((r.x0 + r.x1) / 2), y = Math.round(r.y0) - 6; px(g, '#14101c', x - 2, y - 1, 5, 6); px(g, c.wait > CF.WAIT * .8 ? '#ff4a3a' : '#ffd84a', x - 1, y, 3, 3); px(g, '#ffd84a', x - 1, y + 4, 3, 1); } }
  for (const h of cf.honk) { const r = cfRect(h.c); pxFont(g, 'TÛT !', (r.x0 + r.x1) / 2, r.y0 - 4 - (40 - h.t) / 8, '#ffd84a', 8, 'center'); }
  // les feux : poteau, boîtier, rouge en haut, vert en bas
  for (const d of 'EWSN') { const [x, y] = cfLightPos(d), on = cf.light[d];
    px(g, '#14101c', x, y, 6, 9); px(g, '#2a2a32', x + 1, y + 1, 4, 7); px(g, on ? '#4a1a1a' : '#ff4a3a', x + 2, y + 2, 2, 2); px(g, on ? '#7ee07a' : '#1a3a1a', x + 2, y + 5, 2, 2);
    if (cf.mode === 'play') pxFont(g, {E: '←', W: '→', S: '↑', N: '↓'}[d], x + 3, y + (d === 'S' || d === 'W' ? -2 : 17), '#ffffff', 8, 'center'); }
  if (cf.crash) { const {x, y} = cf.crash, f = Math.min(6, cf.dead >> 2); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; px(g, i % 2 ? '#ffd84a' : '#ff8a3a', x + Math.cos(a) * f * 1.5 - 1, y + Math.sin(a) * f * 1.5 - 1, 3, 3); } px(g, '#ffffff', x - 2, y - 2, 4, 4); }
  // l'affichage : voitures passées, étoiles
  px(g, 'rgba(10,8,16,.75)', 0, 0, W, 14);
  pxFont(g, cf.passed + (cf.passed > 1 ? ' voitures' : ' voiture'), 4, 10, '#ffffff', 8);
  for (let i = 0; i < 3; i++) { const x = W - 34 + i * 10; const c = i < cf.stars ? '#ffd84a' : '#3a3440'; px(g, c, x + 2, 3, 3, 7); px(g, c, x, 5, 7, 3); px(g, c, x + 1, 9, 2, 2); px(g, c, x + 4, 9, 2, 2); }
  if (cf.mode === 'ready') gameText(g, W, [['CARREFOUR', '#ffd84a', 16], ['Clique un feu', '#ffffff'], ['ou flèche du même côté', '#ffffff'], ['Pas de choc, pas d\'attente', '#b8b0c8'], ['Record ' + (games.best.carrefour || 0), '#ffd84a'], ['Espace : jouer', '#b8b0c8']], 48);
  if (cf.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace : reprendre', '#b8b0c8']], 76);
  if (cf.mode === 'over' && cf.dead > 40) gameText(g, W, [[cf.crash ? 'ACCIDENT !' : 'BOUCHON !', '#ff4a3a', 12], [cf.passed + (cf.passed > 1 ? ' voitures passées' : ' voiture passée'), '#ffffff'], [cf.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.carrefour || 0), '#ffd84a'], [cf.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 58);
  if (cf.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Carrefour : ' + (cf.mode === 'play' ? cf.passed + ' voitures passées, ' + cf.stars + ' étoiles, feux verts : ' + ('EWSN'.split('').filter(d => cf.light[d]).map(d => ({E: 'gauche', W: 'droite', S: 'haut', N: 'bas'})[d]).join(', ') || 'aucun') : cf.mode === 'over' ? 'partie finie avec ' + cf.passed + ' voitures' : cf.mode === 'pause' ? 'pause' : 'prêt'));
}
function cfInfo() {
  $('cfStats').replaceChildren(...[['Record', (games.best.carrefour || 0) + ' voitures'], ['Parties', cfs.games], ['Voitures passées', cfs.cars], ['Accidents', cfs.crashes]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
function cfStart() {
  if (cf.mode === 'ready' || cf.mode === 'pause') { cf.mode = 'play'; return true; }
  if (cf.mode === 'over' && cf.dead > 60) { cfNew(); cf.mode = 'play'; return true; }
  return false;
}
// les flèches pointent le côté d'où viennent les voitures : ← les voitures de gauche, ↑ celles du haut…
const CF_KEYS = {ArrowLeft: 'E', ArrowRight: 'W', ArrowUp: 'S', ArrowDown: 'N', q: 'E', a: 'E', d: 'W', z: 'S', w: 'S', s: 'N'};
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !cf || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === ' ' || k === 'Enter') { e.preventDefault(); if (!e.repeat) cfStart(); return; }
  if (CF_KEYS[k]) { e.preventDefault(); if (!e.repeat) cfToggle(CF_KEYS[k]); }
  if ((k === 'p' || k === 'Escape') && cf.mode === 'play') cf.mode = 'pause';
});
// à la souris ou au doigt : le feu le plus proche de l'endroit touché change
{ const cv = $('cfCanvas');
  cv.onpointerdown = e => { e.preventDefault(); if (!cf || cfStart()) return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * CF.W, y = (e.clientY - r.top) / r.height * CF.H;
    const near = d => { const D = CF_DIRS[d], stop = D.sgn > 0 ? CF.STOP - 14 : CF.W - CF.STOP + 14; return D.h ? Math.hypot(x - stop, y - D.lane) : Math.hypot(x - D.lane, y - stop); };
    cfToggle([...'EWSN'].sort((a, b) => near(a) - near(b))[0]); }; }
$('cfNew').onclick = () => { cfNew(); $('cfNew').blur(); };
{  // vérification : une voiture s'arrête au feu rouge sans le passer, repart au vert ; deux voitures qui se croisent au vert se percutent
  const keep = cf, realBest = games.best.carrefour, realStats = {...cfs}; cf = null; cfNew(); cf.mode = 'play'; cf.next = 1e9;
  cf.light.E = 0; cf.cars.push({id: 1, d: 'E', s: 0, len: 12, v: 0, vmax: 1, col: 0, wait: 0, angry: 0});
  for (let i = 0; i < 300; i++) cfUpdate();
  const stopped = cf.cars[0].s <= CF.STOP + .01 && cf.cars[0].s > CF.STOP - 2;
  cf.light.E = 1; for (let i = 0; i < 400; i++) cfUpdate();
  const gone = cf.passed === 1;
  cfNew(); cf.mode = 'play'; cf.next = 1e9; cf.light = {E: 1, W: 1, S: 1, N: 1};
  cf.cars.push({id: 1, d: 'E', s: 40, len: 12, v: 1, vmax: 1, col: 0, wait: 0, angry: 0}, {id: 2, d: 'S', s: 40, len: 12, v: 1, vmax: 1, col: 1, wait: 0, angry: 0});
  for (let i = 0; i < 200 && cf.mode === 'play'; i++) cfUpdate();
  const crash = cf.mode === 'over' && !!cf.crash;
  console.assert(stopped && gone && crash, 'carrefour', {stopped, gone, crash});
  if (realBest === undefined) delete games.best.carrefour; else games.best.carrefour = realBest; Object.assign(cfs, realStats);
  cf = keep;
}
ctx.onOpen(() => {
  if (!cf || !cf.g) { cfNew(); cf.g = $('cfCanvas').getContext('2d'); }
  gameLoop(cf, 'carrefour', cfUpdate, cfDraw); cfInfo();
});
}
