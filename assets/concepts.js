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
    ['10-bento-modern', 'modern', 'Modern', 'Bento Grid']
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
    '<div class="menu" role="menu">' +
    '<a role="menuitem" href="/">All concepts <small>gallery</small></a><hr>' +
    CONCEPTS.map(function (c, k) {
      return '<a role="menuitem" href="' + href(c) + '"' + (k === i ? ' aria-current="page"' : '') + '>' +
        String(k + 1).padStart(2, '0') + ' &nbsp;' + c[2] + ' <small>' + c[3] + '</small></a>';
    }).join('') +
    '</div></nav>';

  var btn = root.querySelector('button'), menu = root.querySelector('.menu');
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
})();
