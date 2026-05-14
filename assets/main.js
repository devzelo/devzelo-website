/**
 * Devzelo Shared Scripts
 * Includes: Custom Cursor, Nav Scroll, Mobile Menu, GSAP Init, Three.js Particles
 */

// ── Remove nav inert on desktop so all pages have clickable nav ──
(function() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  var nav = document.getElementById('nl');
  if (nav) nav.removeAttribute('inert');
})();

// ── Custom cursor (desktop only) ──
(function() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  var co = document.getElementById('co');
  var ci = document.getElementById('ci');
  if (!co || !ci) return;

  var cx = 0, cy = 0, ox = 0, oy = 0;

  document.addEventListener('mousemove', function(e) {
    cx = e.clientX;
    cy = e.clientY;
    ci.style.left = cx + 'px';
    ci.style.top  = cy + 'px';
  }, { passive: true });

  (function loop() {
    ox += (cx - ox) * 0.1;
    oy += (cy - oy) * 0.1;
    co.style.left = ox + 'px';
    co.style.top  = oy + 'px';
    requestAnimationFrame(loop);
  })();

  // Hover state via delegation — catches nav links, dropdowns, everything
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a,button,.btn,[role="button"]')) {
      document.body.classList.add('cur-hover');
    } else {
      document.body.classList.remove('cur-hover');
    }
  }, { passive: true });
  document.addEventListener('mouseout', function(e) {
    if (!e.relatedTarget || !e.relatedTarget.closest('a,button,.btn,[role="button"]')) {
      document.body.classList.remove('cur-hover');
    }
  }, { passive: true });

  // Click feedback
  document.addEventListener('mousedown', function() { document.body.classList.add('cur-click'); });
  document.addEventListener('mouseup',   function() { document.body.classList.remove('cur-click'); });
})();

// ── Nav scroll ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


// ── GSAP Reveals ──
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  var isMobile = window.matchMedia('(max-width:768px)').matches;

  if (!isMobile) {
    var heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 }});
    heroTl.from('.hero-left > *, .hero-text > *, #article-hero .wrap > *, #blog-hero .wrap > *', { opacity: 0, y: 40, stagger: 0.12, delay: 0.2 })
          .from('.hero-right, .hero-vid-float', { opacity: 0, x: 40, scale: 0.9, duration: 1.5 }, '-=1')
          .from('#nav', { opacity: 0, y: -20, duration: 0.8 }, '-=1.2');
  }

  gsap.utils.toArray('.rv').forEach(function(el) {
    gsap.fromTo(el, { opacity: 0, y: isMobile ? 24 : 48 }, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.7 : 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.wc-grid').forEach(function(grid) {
    gsap.from(grid.querySelectorAll('.wc'), {
      opacity: 0,
      y: isMobile ? 24 : 48,
      duration: isMobile ? 0.6 : 1,
      stagger: isMobile ? 0.08 : 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 88%',
        once: true
      }
    });
  });
}

// ── THREE.JS PARTICLES — idle-deferred, fewer particles on mobile ──
(function() {
  var isMobile = window.matchMedia('(max-width:768px)').matches;

  function initParticles() {
    if (!document.getElementById('webgl')) return;
    if (typeof THREE === 'undefined') {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js';
      s.onload = runThree;
      document.body.appendChild(s);
    } else {
      runThree();
    }
  }

  function runThree() {
    var canvas = document.getElementById('webgl');
    var R = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
    R.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1 : 1.5));
    R.setSize(innerWidth, innerHeight);
    R.setClearColor(0x000000, 0);
    var S = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
    cam.position.z = 80;
    var N = isMobile ? 25 : 60;
    var pos = new Float32Array(N * 3), col = new Float32Array(N * 3), vel = [];
    var pal = [new THREE.Color('#3B82F6'), new THREE.Color('#06b6d4'), new THREE.Color('#6366f1')];
    for (var i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * 190;
      pos[i * 3 + 1] = (Math.random() - .5) * 130;
      pos[i * 3 + 2] = (Math.random() - .5) * 70;
      var c = pal[i % pal.length];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      vel.push({ x: (Math.random() - .5) * .04, y: (Math.random() - .5) * .03 });
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    S.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: .21, sizeAttenuation: true })));
    var mx = 0, my = 0;
    if (!isMobile) {
      document.addEventListener('mousemove', function(e) {
        mx = (e.clientX / innerWidth - .5) * 2;
        my = (e.clientY / innerHeight - .5) * 2;
      }, { passive: true });
    }
    function tick() {
      requestAnimationFrame(tick);
      for (var i = 0; i < N; i++) {
        pos[i * 3] += vel[i].x; pos[i * 3 + 1] += vel[i].y;
        if (Math.abs(pos[i * 3]) > 95) vel[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 65) vel[i].y *= -1;
      }
      geo.attributes.position.needsUpdate = true;
      if (!isMobile) {
        cam.position.x += (mx * 7 - cam.position.x) * .03;
        cam.position.y += (-my * 5 - cam.position.y) * .03;
      }
      cam.lookAt(S.position); R.render(S, cam);
    }
    tick();
    window.addEventListener('resize', function() {
      cam.aspect = innerWidth / innerHeight;
      cam.updateProjectionMatrix();
      R.setSize(innerWidth, innerHeight);
    }, { passive: true });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initParticles, { timeout: isMobile ? 2000 : 3000 });
  } else {
    setTimeout(initParticles, isMobile ? 400 : 800);
  }
})();

// ── Video & Menu Logic ──
(function() {
  const hoverVideo = document.getElementById('hoverVideo');
  const vmodalVideo = document.getElementById('vmodalVideo');
  const heroVidFloat = document.querySelector('.hero-vid-float');
  const hero = document.getElementById('hero');

  if (vmodalVideo) {
    const heroSection = document.querySelector('section[id*="hero"]');
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (hoverVideo && !hoverVideo.src) hoverVideo.src = hoverVideo.dataset.src;
          if (vmodalVideo && !vmodalVideo.src) vmodalVideo.src = vmodalVideo.dataset.src;
          videoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    if (heroSection) videoObserver.observe(heroSection);
    else {
      if (!vmodalVideo.src) vmodalVideo.src = vmodalVideo.dataset.src;
    }

    // Hover logic for the floating video (mostly index)
    if (hoverVideo && heroVidFloat) {
      heroVidFloat.addEventListener('mousemove', (e) => {
        const r = heroVidFloat.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroVidFloat.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.03)`;
      });

      heroVidFloat.addEventListener('mouseenter', () => {
        hoverVideo.style.opacity = '1';
        if (!hoverVideo.src) hoverVideo.src = hoverVideo.dataset.src;
        hoverVideo.play().catch(e => console.warn("Hover video play blocked:", e));
      });

      heroVidFloat.addEventListener('mouseleave', () => {
        heroVidFloat.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
        hoverVideo.style.opacity = '0';
        hoverVideo.pause();
        hoverVideo.currentTime = 0;
      });
    }
  }

  // Modal logic
  const modal = document.getElementById('videoModal');
  const videoTrigger = document.getElementById('videoTrigger');
  if (modal && vmodalVideo) {
    const openModal = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      modal.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
      if (hoverVideo) hoverVideo.pause();
      if (!vmodalVideo.src) vmodalVideo.src = vmodalVideo.dataset.src;
      vmodalVideo.currentTime = 0;
      vmodalVideo.play().catch(e => console.warn("Modal video play blocked:", e));
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('inert', '');
      document.body.style.overflow = '';
      vmodalVideo.pause();
    };

    if (videoTrigger) videoTrigger.addEventListener('click', openModal);
    const aboutPlayBtn = document.getElementById('aboutPlayBtn');
    if (aboutPlayBtn) aboutPlayBtn.addEventListener('click', openModal);
    document.getElementById('vmodalClose')?.addEventListener('click', closeModal);
    document.getElementById('vmodalBd')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  // Mobile Menu logic
  const btn = document.querySelector('.mbt');
  const menu = document.getElementById('nl');
  const hdr = document.getElementById('nav');
  if (btn && menu) {
    if (!window.matchMedia("(max-width:768px)").matches) menu.removeAttribute("inert");

    const openMenu = () => {
      menu.removeAttribute('inert');
      menu.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (hdr) hdr.classList.add('menu-open');
      document.documentElement.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (hdr) hdr.classList.remove('menu-open');
      document.documentElement.style.overflow = '';
      setTimeout(() => { if (window.matchMedia('(max-width:768px)').matches) menu.setAttribute('inert', ''); }, 300);
    };

    btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(); });
  }
})();

// FAQ Logic
window.faq = function(btn) {
  const item = btn.closest('.fi');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.fi').forEach(i => {
    i.classList.remove('open');
    i.querySelector('button').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
};
