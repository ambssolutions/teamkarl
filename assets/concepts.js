/* Team K concept switcher: a small floating control on every concept page
   that lets the viewer jump to any other concept type or back to the gallery.
   Rendered in a shadow root so it never inherits or leaks a concept's styles. */
(function () {
  var CONCEPTS = [
    ['01-classic-harcourts', 'classic', 'Classic', 'Corporate'],
    ['02-editorial-luxury', 'luxury', 'Luxury', 'Editorial'],
    ['03-coastal-eastern-beaches', 'lifestyle', 'Lifestyle', 'Coastal'],
    ['04-bold-navy', 'bold', 'Bold', 'Dark Premium'],
    ['05-personal-karl', 'personal', 'Personal', 'Storytelling'],
    ['06-results-data', 'results', 'Results', 'Data-driven'],
    ['07-minimal-swiss', 'minimal', 'Minimal', 'Swiss Grid'],
    ['08-warm-community', 'friendly', 'Friendly', 'Community'],
    ['09-split-sell-buy', 'interactive', 'Interactive', 'Split Screen'],
    ['10-bento-modern', 'modern', 'Modern', 'Bento Grid'],
    ['11-original-demo', 'original', 'Original', 'First Demo'],
    ['12-animated-motion', 'animated', 'Animated', 'Motion-rich'],
    ['13-cinematic-scroll', 'cinematic', 'Cinematic', 'Scroll Story'],
    ['14-kinetic-type', 'kinetic', 'Kinetic', 'Interactive'],
    ['15-glass-aurora', 'glass', 'Glass', 'Aurora'],
    ['16-brutalist-blocks', 'brutalist', 'Brutalist', 'Bold Blocks'],
    ['17-illustrated-playful', 'illustrated', 'Illustrated', 'Playful'],
    ['18-local-explorer', 'local', 'Local', 'Suburb Explorer']
  ];
  var current = document.documentElement.getAttribute('data-concept');
  var i = CONCEPTS.findIndex(function (c) { return c[0] === current; });
  if (i < 0) return;
  var href = function (c) { return '/designs/' + c[0] + '/'; };
  var prev = CONCEPTS[(i + CONCEPTS.length - 1) % CONCEPTS.length];
  var next = CONCEPTS[(i + 1) % CONCEPTS.length];
  var cur = CONCEPTS[i];

  var host = document.createElement('div');
  host.setAttribute('data-concept-switcher', '');
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '.bar{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:2px;' +
    'font:500 13px/1 Poppins,system-ui,-apple-system,Segoe UI,sans-serif;color:#fff;background:rgba(7,20,40,.92);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);border-radius:999px;' +
    'padding:4px;box-shadow:0 12px 32px -12px rgba(0,0,0,.5)}' +
    'a,button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;color:#fff;white-space:nowrap}' +
    'a:hover,button:hover{background:rgba(255,255,255,.12)}' +
    'a:focus-visible,button:focus-visible{outline:2px solid #00ADEF;outline-offset:1px}' +
    '.arrow{width:34px;padding:0;justify-content:center;font-size:15px}' +
    '.tag{color:#00ADEF;font-weight:600}' +
    '.menu{position:absolute;left:0;bottom:calc(100% + 8px);min-width:250px;background:#071428;border:1px solid rgba(255,255,255,.14);' +
    'border-radius:16px;padding:6px;box-shadow:0 20px 40px -16px rgba(0,0,0,.6);display:none;max-height:70vh;overflow:auto}' +
    '.menu.open{display:block}' +
    '.menu a{display:flex;width:100%;box-sizing:border-box;height:auto;padding:9px 12px;border-radius:10px;justify-content:space-between;gap:16px}' +
    '.menu a[aria-current]{background:rgba(0,173,239,.18)}' +
    '.menu small{color:#9FB3CC;font-weight:400}' +
    '.fav{width:34px;padding:0;justify-content:center}.fav svg{width:17px;height:17px}.fav[aria-pressed="true"]{color:#FFD23F}.fav[aria-pressed="true"] svg{fill:currentColor}' +
    '.menu hr{border:0;border-top:1px solid rgba(255,255,255,.12);margin:6px 4px}' +
    '@media (max-width:480px){.bar{left:50%;transform:translateX(-50%);bottom:12px}.label .sub{display:none}}' +
    '@media print{.bar{display:none}}' +
    '</style>' +
    '<nav class="bar" aria-label="Design concepts">' +
    '<a class="arrow" href="' + href(prev) + '" aria-label="Previous concept: ' + prev[2] + '">&#8249;</a>' +
    '<button type="button" class="label" aria-expanded="false" aria-haspopup="true">' +
    '<span class="tag">' + String(i + 1).padStart(2, '0') + '</span> ' + cur[2] +
    '<span class="sub">&nbsp;&middot; ' + cur[3] + '</span> <span aria-hidden="true">&#9662;</span></button>' +
    '<a class="arrow" href="' + href(next) + '" aria-label="Next concept: ' + next[2] + '">&#8250;</a>' +
    '<button type="button" class="fav" aria-pressed="false" aria-label="Add to shortlist" title="Shortlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9z"/></svg></button>' +
    '<div class="menu" role="menu">' +
    '<a role="menuitem" href="/">All concepts <small>gallery</small></a><hr>' +
    CONCEPTS.map(function (c, k) {
      return '<a role="menuitem" href="' + href(c) + '"' + (k === i ? ' aria-current="page"' : '') + '>' +
        String(k + 1).padStart(2, '0') + ' &nbsp;' + c[2] + ' <small>' + c[3] + '</small></a>';
    }).join('') +
    '</div></nav>';

  var btn = root.querySelector('button.label'), menu = root.querySelector('.menu');

  // Shortlist toggle, shared with the gallery via localStorage
  var KEY = 'teamk-shortlist', fav = root.querySelector('.fav');
  function getList() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function paintFav() {
    var on = getList().indexOf(cur[0]) > -1;
    fav.setAttribute('aria-pressed', on);
    fav.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + cur[2] + (on ? ' from' : ' to') + ' shortlist');
    fav.title = on ? 'Shortlisted' : 'Add to shortlist';
  }
  fav.addEventListener('click', function (e) {
    e.stopPropagation();
    var l = getList(), k = l.indexOf(cur[0]);
    if (k > -1) l.splice(k, 1); else l.push(cur[0]);
    try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (err) {}
    paintFav();
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) paintFav(); });
  paintFav();
  function setOpen(o) { menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
  document.addEventListener('click', function () { setOpen(false); });
  root.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  // Leave room at the end of the page so the floating bar never covers footer content:
  // extend the last footer (keeping its background) rather than adding a bare strip.
  var footers = document.querySelectorAll('footer');
  var last = footers[footers.length - 1] || document.body;
  var pad = parseFloat(getComputedStyle(last).paddingBottom) || 0;
  last.style.paddingBottom = (pad + 72) + 'px';
  document.body.appendChild(host);

  // Phones: give small text links (phone numbers, emails, guide links) a ~40px tap area.
  // An absolutely positioned ::after extends the hit box without taking any layout space.
  if (window.matchMedia('(max-width: 768px)').matches) {
    var hs = document.createElement('style');
    hs.textContent = '.tk-hit{position:relative}.tk-hit::after{content:"";position:absolute;left:0;right:0;top:calc(var(--tk-hit) * -1);bottom:calc(var(--tk-hit) * -1)}';
    document.head.appendChild(hs);
    var sel = 'a[href^="tel:"], a[href^="mailto:"], a[target="_blank"], a[href$="index.html"]';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (a) {
      var cs = getComputedStyle(a), h = a.getBoundingClientRect().height;
      if (h === 0 || h >= 40 || cs.position !== 'static' || getComputedStyle(a, '::after').content !== 'none') return;
      a.style.setProperty('--tk-hit', Math.ceil((40 - h) / 2) + 'px');
      a.classList.add('tk-hit');
    });
  }
})();
