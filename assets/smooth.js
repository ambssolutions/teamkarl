/* Buttery smooth wheel scrolling for the animated concepts (same Lenis build as the original demo).
   Desktop mouse/trackpad only: touch devices keep native scrolling, and it is skipped entirely
   when the visitor prefers reduced motion. Synced with GSAP ScrollTrigger when present. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  s.async = true;
  s.onload = function () {
    if (!window.Lenis) return;
    var st = document.createElement('style');
    st.textContent = 'html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}';
    document.head.appendChild(st);
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }

    // In-page links glide too, landing below the fixed header.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      // Let the page's own handler run too (it closes the mobile menu), then Lenis takes over the scroll.
      setTimeout(function () {
      var header = document.querySelector('header');
      var offset = header && getComputedStyle(header).position.match(/fixed|sticky/) ? header.offsetHeight : 0;
      lenis.scrollTo(target, { offset: -offset - 12, duration: 1.2 });
      if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
      }, 0);
    }, true);
  };
  document.head.appendChild(s);
})();
