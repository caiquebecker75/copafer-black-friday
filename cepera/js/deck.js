/* 75LAB × Cepêra — motor da apresentação
   navegação (teclado, clique, roda, toque), transições, capítulos, contadores,
   cursor, lightbox, 3D/AR sob demanda, fundo vivo e modo rolagem no celular */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const stage = $('#stage');
  const slides = $$('.slide', stage);
  const N = slides.length;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory < 4);
  if (lite) body.classList.add('lite');
  const CH = { 0: ['00', 'Abertura'], 1: ['01', 'Leitura'], 2: ['02', 'Contexto'], 3: ['03', 'Virada'], 4: ['04', 'Solução'], 5: ['04', 'Rastreamento'], 6: ['05', 'Execução'] };
  const pad = n => String(n).padStart(2, '0');

  /* ---------- ícones ---------- */
  $$('.ic[data-i]').forEach(el => {
    const d = window.ICONS[el.dataset.i];
    if (d) el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  });

  /* ---------- tipografia cinética: quebra em palavras ---------- */
  $$('.kt').forEach(el => {
    let i = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(ch => {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--wi', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    };
    walk(el);
  });

  /* ---------- sementes da abertura ---------- */
  const seeds = $('.seeds');
  if (seeds) {
    let h = '';
    for (let k = 0; k < 46; k++) {
      const x = Math.random() * 100, y = 30 + Math.random() * 60, s = 3 + Math.random() * 7;
      h += `<i style="--x:${x}%;--y:${y}%;--s:${s}px;--t:${(4.6 + Math.random() * 2).toFixed(2)}s;--dx:${(Math.random() * 160 - 80).toFixed(0)}px;--dy:${(-60 - Math.random() * 200).toFixed(0)}px"></i>`;
    }
    seeds.innerHTML = h;
  }

  /* ---------- pontos da escala progressiva ---------- */
  $$('[data-dots]').forEach(el => {
    const n = +el.dataset.dots; let h = '';
    for (let k = 0; k < n; k++) h += `<i style="--k:${Math.min(k, 400)}${el.hasAttribute('data-small') ? ';width:3px;height:3px' : ''}"></i>`;
    el.innerHTML = h;
  });

  /* ---------- pacotes no fluxo de rastreamento ---------- */
  const pk = $('.pkts');
  if (pk) {
    const ns = 'http://www.w3.org/2000/svg';
    for (let k = 0; k < 5; k++) {
      const c = document.createElementNS(ns, 'circle'); c.setAttribute('r', '5'); c.setAttribute('class', 'pkt');
      const m = document.createElementNS(ns, 'animateMotion');
      m.setAttribute('dur', '6s'); m.setAttribute('repeatCount', 'indefinite'); m.setAttribute('begin', (k * 1.2) + 's'); m.setAttribute('path', 'M100 48 H1292');
      c.appendChild(m); pk.appendChild(c);
    }
  }

  /* ---------- contadores ---------- */
  const fmt = (v, dec) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  function runCounters(scope) {
    $$('.count', scope).forEach(el => {
      const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      if (RM) { el.textContent = pre + fmt(to, dec) + suf; return; }
      const dur = 1900, t0 = performance.now() + 450;
      el.textContent = pre + fmt(0, dec) + suf;
      const tick = t => {
        const p = Math.min(1, Math.max(0, (t - t0) / dur)); const e = 1 - Math.pow(1 - p, 4);
        el.textContent = pre + fmt(to * e, dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- modo: palco (desktop) × rolagem (celular/tablet retrato) ---------- */
  // rolagem só em telas em pé (celular/tablet em retrato) ou muito estreitas; janelas deitadas usam o palco escalado
  const isFlow = () => innerWidth < 640 || (innerHeight > innerWidth * 1.05 && innerWidth < 1100);
  let flow = isFlow();
  body.classList.toggle('flow', flow);

  function fit() {
    if (flow) { stage.style.transform = ''; return; }
    const k = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.position = 'absolute'; stage.style.left = '50%'; stage.style.top = '50%';
    stage.style.transform = `translate(-50%,-50%) scale(${k})`;
  }

  /* ---------- estado ---------- */
  let cur = 0, busy = false;
  const glow = $('.bg-glow');
  $('#cTot').textContent = pad(N);
  const ticks = $('.chap-ticks');
  slides.forEach((s, i) => { if (s.hasAttribute('data-chapter-open') && i) { const t = document.createElement('i'); t.style.left = (i / (N - 1) * 100) + '%'; ticks.appendChild(t); } });

  function setChrome(i) {
    const s = slides[i];
    const ch = CH[s.dataset.ch] || CH[0];
    $('#hudNum').textContent = ch[0]; $('#hudName').textContent = ch[1];
    $('#cNow').textContent = pad(i + 1);
    $('.progress').style.width = (i / (N - 1) * 100) + '%';
    body.classList.toggle('on-yellow', s.dataset.tone === 'yellow' || (s.hasAttribute('data-opening') && s.classList.contains('done')));
    const o = (s.dataset.orb || '60,40,1,rgba(255,210,31,.16)').split(/,(?![^(]*\))/);
    glow.style.setProperty('--ox', o[0] + 'vw'); glow.style.setProperty('--oy', o[1] + 'vh');
    glow.style.setProperty('--os', o[2]); glow.style.setProperty('--oc', o[3]);
    $$('#idxGrid button').forEach(b => b.classList.toggle('cur-s', +b.dataset.go === i + 1));
  }

  function enter(s) {
    s.classList.remove('is-in');
    void s.offsetWidth;
    requestAnimationFrame(() => { s.classList.add('is-in'); runCounters(s); hooks(s, true); });
  }

  const wipe = $('.wipe');
  function go(n, opts = {}) {
    n = Math.max(0, Math.min(N - 1, n));
    if (flow) { slides[n].scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); return; }
    if (n === cur && !opts.force) return;
    if (busy && !opts.force) return;
    busy = true; setTimeout(() => busy = false, 650);
    const prev = slides[cur], next = slides[n];
    const back = n < cur;
    body.classList.toggle('dir-back', back);
    if (!opts.force && next.hasAttribute('data-chapter-open') && !back && !RM) { wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go'); }
    if (prev !== next) {
      hooks(prev, false);
      prev.classList.remove('is-active'); prev.classList.add('is-leaving');
      setTimeout(() => { prev.classList.remove('is-leaving', 'is-in'); }, 820);
    }
    next.classList.add('is-active');
    enter(next);
    cur = n;
    setChrome(n);
    history.replaceState(null, '', '#/' + (n + 1));
    if (Math.abs(n - idx3d) <= 2) loadMV();
  }
  const opening = $('[data-opening]');
  let introTimer = 0;
  function finishIntro() {
    if (!opening) return;
    clearTimeout(introTimer); opening.classList.add('done');
    if (slides[cur] === opening) body.classList.add('on-yellow');
  }
  const introRunning = () => opening && slides[cur] === opening && !opening.classList.contains('done');
  const next = () => introRunning() ? finishIntro() : go(cur + 1), prev = () => go(cur - 1);

  /* ---------- ganchos por tela (loops que só rodam quando visíveis) ---------- */
  const timers = new Map();
  function hooks(s, on) {
    clearInterval(timers.get(s)); timers.delete(s);
    if (s.hasAttribute('data-reveal')) {
      const lines = $$('.rv-rot span', s), imgs = $$('.rv-ph img', s);
      let k = 0;
      const show = () => {
        lines.forEach((l, j) => { l.classList.toggle('on', j === k); l.classList.toggle('off', j !== k && l.classList.contains('on')); });
        imgs.forEach((im, j) => im.classList.toggle('on', j === k));
      };
      lines.forEach(l => l.classList.remove('on', 'off')); imgs.forEach(im => im.classList.remove('on'));
      if (on) {
        setTimeout(() => { if (s.classList.contains('is-in')) show(); }, 2100);
        timers.set(s, setInterval(() => { k = (k + 1) % lines.length; show(); }, 3200));
      }
    }
    if (s.hasAttribute('data-demo')) {
      const st = $$('.app-st', s); let k = 0;
      st.forEach(x => x.classList.remove('done', 'cur', 'alert'));
      if (on) timers.set(s, setInterval(() => {
        if (k >= st.length + 3) { k = 0; st.forEach(x => x.classList.remove('done', 'cur', 'alert')); return; }
        st.forEach((x, j) => {
          x.classList.toggle('done', j < k && !x.hasAttribute('data-alert'));
          x.classList.toggle('alert', x.hasAttribute('data-alert') && j < k);
          x.classList.toggle('cur', j === k);
        });
        k++;
      }, 900));
    }
    if (s.hasAttribute('data-3d') && on) { loadMV(); setupQR(); }
    if (s.hasAttribute('data-opening')) {
      clearTimeout(introTimer);
      if (on && (RM || flow)) finishIntro();
      else if (on && !s.classList.contains('done')) introTimer = setTimeout(finishIntro, 8300);
    }
  }

  /* ---------- 3D / AR (carregado sob demanda) ---------- */
  const idx3d = slides.findIndex(s => s.hasAttribute('data-3d'));
  const MODELS = {
    a: { src: 'assets/models/modulo-a-experiencia.glb', dim: 'Módulo de chão<br>≈ 72 × 46 × 186 cm', alt: 'Configuração A, módulo de chão com testeira e cartela de ocasião' },
    b: { src: 'assets/models/modulo-b-presenca.glb', dim: 'Expositor compacto<br>≈ 50 × 34 × 142 cm', alt: 'Configuração B, expositor compacto' },
    c: { src: 'assets/models/modulo-c-essencial.glb', dim: 'Kit de gôndola<br>régua · porta-preço · stopper', alt: 'Configuração C, kit de gôndola com régua, porta-preço e stopper' }
  };
  let mvLoaded = false, mv = null;
  function loadMV() {
    if (mvLoaded || idx3d < 0) return; mvLoaded = true;
    const sc = document.createElement('script'); sc.type = 'module'; sc.src = 'vendor/model-viewer.min.js'; document.head.appendChild(sc);
    const slot = $('#mvSlot');
    mv = document.createElement('model-viewer');
    Object.entries({ src: MODELS.a.src, alt: MODELS.a.alt, 'camera-controls': '', 'touch-action': 'pan-y', 'auto-rotate': '', 'auto-rotate-delay': '1500', 'rotation-per-second': '14deg', 'shadow-intensity': '1.1', 'shadow-softness': '.8', exposure: '1.05', 'environment-image': 'neutral', 'camera-orbit': '28deg 76deg auto', 'interaction-prompt': 'none', ar: '', 'ar-modes': 'webxr scene-viewer quick-look', 'ar-placement': 'floor', 'ar-scale': 'fixed', loading: 'eager' })
      .forEach(([k, v]) => mv.setAttribute(k, v));
    mv.style.width = '100%'; mv.style.height = '100%';
    mv.innerHTML = '<button slot="ar-button" class="ar-btn" style="display:flex">▣ Ver no seu espaço</button>';
    mv.addEventListener('load', () => { const l = $('.mv-load'); if (l) l.style.display = 'none'; });
    slot.appendChild(mv);
  }
  $$('.mv-tabs button').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const m = MODELS[b.dataset.model]; loadMV();
    $$('.mv-tabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    $('#mvDim').innerHTML = m.dim;
    if (mv) { mv.setAttribute('src', m.src); mv.setAttribute('alt', m.alt); }
    currentModel = b.dataset.model; setupQR(true);
  }));
  let currentModel = 'a', qrDone = '';
  function setupQR(force) {
    const box = $('#qrBox'); if (!box || !window.qrcode) { if (box && !window.qrcode) setTimeout(setupQR, 400); return; }
    const url = new URL('ar.html?m=' + currentModel, location.href).href;
    if (qrDone === url && !force) return; qrDone = url;
    const q = qrcode(0, 'M'); q.addData(url); q.make();
    box.innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    box.title = url;
  }

  /* ---------- índice ---------- */
  const idx = $('#idx'), grid = $('#idxGrid');
  const groups = {};
  slides.forEach((s, i) => { const c = s.dataset.ch; (groups[c] = groups[c] || []).push([i, s.dataset.title]); });
  Object.keys(groups).forEach(c => {
    const d = document.createElement('div'); d.className = 'idx-ch';
    d.innerHTML = `<b><span>${CH[c][0]}</span>${CH[c][1]}</b>` + groups[c].map(([i, t]) => `<button data-go="${i + 1}"><i>${pad(i + 1)}</i>${t}</button>`).join('');
    grid.appendChild(d);
  });
  const openIdx = () => { idx.classList.add('open'); setTimeout(() => $('#idxClose').focus(), 50); };
  const closeIdx = () => idx.classList.remove('open');
  $('#btnIdx').addEventListener('click', openIdx);
  $('#idxClose').addEventListener('click', closeIdx);
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (e.target.closest('[data-skip]')) { e.stopPropagation(); finishIntro(); return; }
    if (g) { e.preventDefault(); closeIdx(); go(+g.dataset.go - 1); return; }
    const gc = e.target.closest('[data-go-ch]');
    if (gc) { const i = slides.findIndex(s => s.dataset.ch === gc.dataset.goCh); if (i >= 0) go(i); }
  });

  /* ---------- lightbox ---------- */
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let gal = [], gi = 0, lastFocus = null;
  function showLB() {
    const im = gal[gi];
    lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt;
    lbCap.textContent = im.dataset.caption || im.alt;
    $('#lbCount').textContent = gal.length > 1 ? `${gi + 1} / ${gal.length}` : '';
    $('#lbPrev').style.display = $('#lbNext').style.display = gal.length > 1 ? '' : 'none';
  }
  function openLB(im) {
    const sl = im.closest('.slide');
    gal = $$('img.zoom', sl); gi = Math.max(0, gal.indexOf(im));
    lastFocus = document.activeElement; showLB(); lb.classList.add('open'); setTimeout(() => $('#lbClose').focus(), 60);
  }
  const closeLB = () => { lb.classList.remove('open'); if (lastFocus) lastFocus.focus(); };
  $$('img.zoom').forEach(im => {
    im.setAttribute('tabindex', '0'); im.setAttribute('role', 'button');
    im.setAttribute('aria-label', 'Ampliar imagem: ' + im.alt);
    im.addEventListener('click', e => { e.stopPropagation(); openLB(im); });
    im.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openLB(im); } });
  });
  $('#lbClose').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); gi = (gi - 1 + gal.length) % gal.length; showLB(); });
  $('#lbNext').addEventListener('click', e => { e.stopPropagation(); gi = (gi + 1) % gal.length; showLB(); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') closeLB(); });

  /* ---------- teclado ---------- */
  document.addEventListener('keydown', e => {
    if (lb.classList.contains('open')) {
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowRight' && gal.length > 1) { gi = (gi + 1) % gal.length; showLB(); }
      if (e.key === 'ArrowLeft' && gal.length > 1) { gi = (gi - 1 + gal.length) % gal.length; showLB(); }
      if (e.key === 'Tab') { e.preventDefault(); $('#lbClose').focus(); }
      return;
    }
    if (idx.classList.contains('open')) { if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') closeIdx(); return; }
    if (e.target.closest && e.target.closest('input,textarea,model-viewer')) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(k) || (k === ' ' && !e.target.closest('button,[role=button]'))) { e.preventDefault(); flow ? flowStep(1) : next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); flow ? flowStep(-1) : prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(N - 1); }
    else if (k === 'm' || k === 'M') openIdx();
    else if (k === 'f' || k === 'F') toggleFS();
  });
  $('#btnNext').addEventListener('click', e => { e.stopPropagation(); flow ? flowStep(1) : next(); });
  $('#btnPrev').addEventListener('click', e => { e.stopPropagation(); flow ? flowStep(-1) : prev(); });
  function toggleFS() { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
  $('#btnFs').addEventListener('click', toggleFS);

  /* ---------- clique, roda e toque ---------- */
  const INTERACTIVE = '[data-skip],a,button,input,img.zoom,model-viewer,.mv-wrap,.rk,.ag-step,.orb-n,[data-go],.hud,.dock,.idx,.lb';
  $('#deck').addEventListener('click', e => {
    if (flow || e.target.closest(INTERACTIVE)) return;
    if (window.getSelection && String(getSelection()).length) return;
    (e.clientX < innerWidth * 0.28) ? prev() : next();
  });
  let wheelAcc = 0, wheelLock = 0;
  addEventListener('wheel', e => {
    if (flow || lb.classList.contains('open') || idx.classList.contains('open')) return;
    if (e.target.closest && e.target.closest('model-viewer,.mv-wrap')) return;
    e.preventDefault();
    const now = Date.now(); if (now < wheelLock) return;
    wheelAcc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(wheelAcc) > 60) { wheelAcc > 0 ? next() : prev(); wheelAcc = 0; wheelLock = now + 900; }
  }, { passive: false });
  let tx = 0, ty = 0, tt = 0;
  addEventListener('touchstart', e => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  addEventListener('touchend', e => {
    if (flow || lb.classList.contains('open')) return;
    if (e.target.closest && e.target.closest('model-viewer,.mv-wrap')) return;
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt < 700 && Math.max(Math.abs(dx), Math.abs(dy)) > 50) {
      const v = Math.abs(dx) > Math.abs(dy) ? dx : dy; v < 0 ? next() : prev();
    }
  }, { passive: true });
  $$('.rk').forEach(r => r.addEventListener('click', () => r.classList.toggle('flip')));

  /* ---------- modo rolagem ---------- */
  let io = null;
  function setupFlow() {
    slides.forEach(s => s.classList.remove('is-active', 'is-leaving'));
    io = new IntersectionObserver(ents => {
      ents.forEach(en => {
        const s = en.target;
        if (en.isIntersecting && !s.classList.contains('is-in')) { s.classList.add('is-in'); runCounters(s); hooks(s, true); }
        if (en.isIntersecting && en.intersectionRatio > .3) {
          const i = slides.indexOf(s); cur = i; setChrome(i);
          if (Math.abs(i - idx3d) <= 1) loadMV();
        }
      });
    }, { threshold: [0, .3] });
    slides.forEach(s => io.observe(s));
  }
  function flowStep(d) { go(cur + d); }

  /* ---------- cursor personalizado ---------- */
  const fine = matchMedia('(pointer:fine)').matches;
  if (fine && !flow) {
    const c = $('.cur'), d = $('.cur-dot'), lab = $('.cur-label');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => { body.classList.add('has-cursor'); x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px,${y}px)`; });
    const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate(${cx}px,${cy}px)`; lab.style.left = cx + 'px'; lab.style.top = cy + 'px'; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('mouseover', e => {
      const z = e.target.closest('img.zoom');
      const h = e.target.closest('a,button,.ag-step,.orb-n,.rk,[data-go],.mv-wrap');
      c.classList.toggle('zoomc', !!z); lab.classList.toggle('show', !!z);
      c.classList.toggle('hover', !z && !!h);
    });
    document.addEventListener('mouseleave', () => body.classList.remove('has-cursor'));
    document.addEventListener('mouseenter', () => body.classList.add('has-cursor'));
  }

  /* ---------- fundo vivo: sementes de mostarda à deriva ---------- */
  const cv = $('#bg'), cx2 = cv.getContext('2d');
  let W = 0, H = 0, parts = [], raf = 0;
  function sizeBG() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = RM ? 0 : lite ? 24 : flow ? 28 : 64;
    parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (0.6 + Math.random() * 2.2) * dpr, vx: (Math.random() - .5) * .12 * dpr, vy: (-.05 - Math.random() * .18) * dpr, a: .08 + Math.random() * .3, p: Math.random() * 6.28 }));
  }
  function drawBG(t) {
    cx2.clearRect(0, 0, W, H);
    const yel = body.classList.contains('on-yellow');
    for (const p of parts) {
      p.x += p.vx + Math.sin(t / 3000 + p.p) * .08; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      cx2.beginPath(); cx2.arc(p.x, p.y, p.r, 0, 6.283);
      cx2.fillStyle = yel ? `rgba(0,74,0,${p.a * .5})` : `rgba(255,210,31,${p.a})`; cx2.fill();
    }
    raf = requestAnimationFrame(drawBG);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!RM) raf = requestAnimationFrame(drawBG); });

  /* ---------- init ---------- */
  function init() {
    fit(); sizeBG();
    if (!RM) raf = requestAnimationFrame(drawBG);
    const m = location.hash.match(/#\/(\d+)/);
    const start = m ? Math.max(0, Math.min(N - 1, +m[1] - 1)) : 0;
    if (flow) {
      setupFlow(); setChrome(start);
      if (start) setTimeout(() => slides[start].scrollIntoView(), 60);
    } else {
      cur = start; slides[start].classList.add('is-active'); enter(slides[start]); setChrome(start);
      if (Math.abs(start - idx3d) <= 2) loadMV();
    }
  }
  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const f = isFlow();
      if (f !== flow) { location.reload(); return; }
      fit(); sizeBG();
    }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {});
  init();
})();
