// 공통 틀 — 슬라이드 넘기기, 단계 펼치기, 발표 메모, 전체 보기, 도식 열기(D).
// 모듈 전용 동작은 모듈 원본의 <script data-module>에 두고, 아래 이벤트를 받아 쓴다.
//   slide 'deck:step'  detail { step, active }  — 그 슬라이드의 단계가 바뀔 때
//   document 'deck:pause' detail { paused }     — 움직임 멈춤(P)을 바꿀 때
(function () {
  'use strict';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var $ = function (id) { return document.getElementById(id); };
  var prev = $('prev'), next = $('next'), count = $('count'), prog = $('prog');
  var notes = $('notes'), notesBody = $('notesBody');
  var noteBtn = $('noteBtn'), ovBtn = $('ovBtn'), pauseBtn = $('pauseBtn'), themeBtn = $('themeBtn'), fsBtn = $('fsBtn');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrowMq = window.matchMedia('(max-width: 760px)');
  var i = 0, cur = 0, paused = false;

  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function isNarrow() { return narrowMq.matches; }
  function isOverview() { return document.body.classList.contains('ov'); }
  window.Deck = {
    esc: esc,
    reduce: reduce,
    isPaused: function () { return paused; },
    isNarrow: isNarrow,
    isOverview: isOverview,
    isCurrent: function (s) { return slides[i] === s; }
  };

  // 공식 로고 — 파일에 한 번만 들어 있는 것을 <img data-logo> · <image data-logo>에 채운다(deck/build.py)
  try {
    var logos = JSON.parse(($('logos') || {}).textContent || '{}');
    document.querySelectorAll('[data-logo]').forEach(function (e) {
      var src = logos[e.dataset.logo];
      if (src) e.setAttribute(e.tagName.toLowerCase() === 'img' ? 'src' : 'href', src);
    });
  } catch (e) {}

  // 슬라이드별 단계 수 = 안에 있는 data-at / data-only / data-dim / data-goto 의 최댓값 (data-steps로 직접 줄 수도 있다)
  slides.forEach(function (s) {
    var n = +(s.dataset.steps || 0);
    s.querySelectorAll('[data-at],[data-only],[data-dim],[data-goto]').forEach(function (e) {
      n = Math.max(n, +(e.dataset.at || e.dataset.only || e.dataset.dim || e.dataset.goto));
    });
    s.steps = n;
  });

  // 움직임을 줄이는 설정이면 SMIL 점을 없앤다 (SMIL은 CSS 미디어 쿼리를 따르지 않는다)
  if (reduce) document.querySelectorAll('.dot').forEach(function (d) { d.remove(); });

  // ---------- 단계 상태 적용 ----------
  function applyStep(s, c, active) {
    s.dataset.cur = c;
    s.querySelectorAll('[data-at]').forEach(function (e) { e.classList.toggle('vis', c >= +e.dataset.at); });
    s.querySelectorAll('[data-only]').forEach(function (e) { e.classList.toggle('vis', c === +e.dataset.only); });
    s.querySelectorAll('[data-dim]').forEach(function (e) { e.classList.toggle('dimmed', c < +e.dataset.dim); });
    s.querySelectorAll('[data-goto]').forEach(function (e) {
      var g = +e.dataset.goto;
      e.classList.toggle('now', c === g);
      e.classList.toggle('done', c > g);
    });
    if (s.dataset.paintAt) s.classList.toggle('painted', c >= +s.dataset.paintAt);
    var dots = s.querySelector('.dots');
    if (dots) {
      if (!dots.childElementCount && s.steps) {
        var lab = document.createElement('span');
        lab.className = 'lab'; lab.textContent = '단계';
        dots.appendChild(lab);
        for (var k = 0; k <= s.steps; k++) {
          var b = document.createElement('button');
          b.type = 'button'; b.dataset.step = k;
          b.setAttribute('aria-label', k === 0 ? '처음 상태' : k + '단계');
          dots.appendChild(b);
        }
      }
      dots.querySelectorAll('button').forEach(function (b) {
        var k = +b.dataset.step;
        b.classList.toggle('now', k === c);
        b.classList.toggle('done', k < c);
      });
    }
    s.dispatchEvent(new CustomEvent('deck:step', { detail: { step: c, active: active } }));
  }

  function render() {
    var s = slides[i];
    slides.forEach(function (x, k) {
      x.classList.toggle('on', k === i);
      if (isNarrow() || isOverview()) applyStep(x, x.steps, false);
    });
    if (!isNarrow() && !isOverview()) applyStep(s, cur, true);
    count.textContent = (i + 1) + ' / ' + slides.length + (s.steps ? ' · ' + cur + '/' + s.steps : '');
    prev.disabled = i === 0 && cur === 0;
    next.disabled = i === slides.length - 1 && cur === s.steps;
    var frac = (i + (s.steps ? cur / (s.steps + 1) : 0)) / (slides.length - 1 || 1);
    prog.style.width = Math.min(100, frac * 100) + '%';
    var t = s.querySelector('template.note');
    notesBody.innerHTML = t ? t.innerHTML : '';
    try { history.replaceState(null, '', '#' + (s.dataset.id || 's' + (i + 1)) + (cur ? '-' + cur : '')); } catch (e) {}
  }

  function go(n, c) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    cur = Math.max(0, Math.min(slides[i].steps, c));
    closePop();
    render();
  }
  function fwd() {
    if (isOverview()) return;
    if (cur < slides[i].steps) go(i, cur + 1);
    else if (i < slides.length - 1) go(i + 1, 0);
  }
  function back() {
    if (isOverview()) return;
    if (cur > 0) go(i, cur - 1);
    else if (i > 0) go(i - 1, slides[i - 1].steps);
  }

  // ---------- 누르면 열리는 설명 (.hot[data-info] → 같은 슬라이드의 <template data-info="키">) ----------
  var pop = null, selHot = null;
  function closePop() {
    if (pop) { pop.remove(); pop = null; }
    if (selHot) { selHot.classList.remove('sel'); selHot = null; }
  }
  function openPop(h) {
    var s = h.closest('.slide'), key = h.dataset.info;
    var t = s.querySelector('template[data-info="' + key + '"]');
    var box = h.closest('.ovw') || s.querySelector('.content');
    if (!t || !box) return;
    closePop();
    pop = document.createElement('div');
    pop.className = 'pop open'; pop.setAttribute('role', 'dialog');
    pop.innerHTML = '<h4>' + esc(t.dataset.title || key) + '<button type="button" aria-label="닫기">✕</button></h4>' + t.innerHTML;
    box.appendChild(pop);
    selHot = h; h.classList.add('sel');
    pop.querySelector('button').addEventListener('click', closePop);
  }
  document.querySelectorAll('.hot[data-info]').forEach(function (h) {
    function act(e) { e.stopPropagation(); if (selHot === h) closePop(); else openPop(h); }
    h.addEventListener('click', act);
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(e); } });
  });
  document.addEventListener('click', function (e) { if (pop && !e.target.closest('.pop')) closePop(); });

  // ---------- 자세히 보기 (도식) ----------
  // 도식은 이 파일 안에 gzip + base64로 들어 있다(deck/build.py). 열 때 풀어서 iframe srcdoc으로 띄운다.
  var archOv = $('archOv'), archFrame = $('archFrame'), archTitle = $('archTitle'), archBack = null, archCache = {};
  function isArchOpen() { return !archOv.hidden; }
  function archText(key) {
    if (archCache[key]) return Promise.resolve(archCache[key]);
    var el = $('arch-' + key), b64 = el ? el.textContent.trim() : '';
    if (!b64) return Promise.reject(new Error('도식이 들어 있지 않다 — deck/build.py를 실행한다'));
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('이 브라우저는 도식을 열 수 없다 — 최신 Chrome · Edge로 연다'));
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text().then(function (t) { archCache[key] = t; return t; });
  }
  function openArch(key) {
    var el = $('arch-' + key);
    if (!el || isOverview()) return;
    closePop();
    archBack = document.activeElement;
    archTitle.textContent = el.dataset.title || '';
    archOv.hidden = false;
    $('archClose').focus();
    archText(key).then(function (t) {
      if (!archOv.hidden) archFrame.srcdoc = t;
    }).catch(function (err) {
      archFrame.srcdoc = '<p style="font: 15px sans-serif; padding: 24px">' + esc(err.message) + '</p>';
    });
  }
  function closeArch() {
    if (!isArchOpen()) return;
    archOv.hidden = true;
    archFrame.removeAttribute('srcdoc');
    if (archBack && archBack.focus) archBack.focus();
  }
  // iframe 안에서 누른 Esc도 닫기로 받는다. 도식 쪽이 먼저 쓴 Esc(검색 닫기 등)는 건드리지 않는다
  archFrame.addEventListener('load', function () {
    try {
      archFrame.contentDocument.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !e.defaultPrevented) closeArch();
      });
    } catch (e) {}
  });
  $('archClose').addEventListener('click', closeArch);
  document.querySelectorAll('.more[data-arch]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); openArch(b.dataset.arch); });
  });

  // ---------- 단계 칸 · 단계 점 클릭 ----------
  document.querySelectorAll('[data-goto]').forEach(function (e) {
    e.addEventListener('click', function () { go(slides.indexOf(e.closest('.slide')), +e.dataset.goto); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.dots button');
    if (b) go(slides.indexOf(b.closest('.slide')), +b.dataset.step);
  });

  // ---------- 전체 보기 ----------
  function toggleOv(force) {
    var on = force === undefined ? !isOverview() : force;
    document.body.classList.toggle('ov', on);
    ovBtn.setAttribute('aria-pressed', String(on));
    render();
    if (on) slides[i].scrollIntoView({ block: 'center' });
    else window.scrollTo(0, 0);
  }
  slides.forEach(function (s, k) {
    s.addEventListener('click', function () { if (isOverview()) { i = k; cur = 0; toggleOv(false); } });
  });

  // ---------- 메모 · 움직임 · 화면 색 · 전체 화면 ----------
  function toggleNotes() {
    notes.hidden = !notes.hidden;
    document.body.classList.toggle('notes-on', !notes.hidden);
    noteBtn.setAttribute('aria-pressed', String(!notes.hidden));
  }
  function togglePause() {
    paused = !paused;
    document.body.classList.toggle('paused', paused);
    document.querySelectorAll('svg').forEach(function (s) {
      try { paused ? s.pauseAnimations() : s.unpauseAnimations(); } catch (e) {}
    });
    pauseBtn.setAttribute('aria-pressed', String(paused));
    document.dispatchEvent(new CustomEvent('deck:pause', { detail: { paused: paused } }));
  }
  function currentTheme() {
    var t = document.documentElement.dataset.theme;
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var t = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('hadoop-edu-theme', t); } catch (e) {}
  }
  try { var saved = localStorage.getItem('hadoop-edu-theme'); if (saved) document.documentElement.dataset.theme = saved; } catch (e) {}
  function toggleFs() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) {
        var p = document.documentElement.requestFullscreen();
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) {}
  }

  prev.addEventListener('click', back);
  next.addEventListener('click', fwd);
  ovBtn.addEventListener('click', function () { toggleOv(); });
  noteBtn.addEventListener('click', toggleNotes);
  pauseBtn.addEventListener('click', togglePause);
  themeBtn.addEventListener('click', toggleTheme);
  fsBtn.addEventListener('click', toggleFs);

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (isArchOpen()) {
      if (e.key === 'Escape') { e.preventDefault(); closeArch(); }
      return;
    }
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.target.closest('button, [role="button"]'))) { e.preventDefault(); fwd(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); back(); }
    else if (k === 'Home') { go(0, 0); }
    else if (k === 'End') { go(slides.length - 1, slides[slides.length - 1].steps); }
    else if (k === 'o' || k === 'O') { toggleOv(); }
    else if (k === 'n' || k === 'N') { toggleNotes(); }
    else if (k === 'p' || k === 'P') { togglePause(); }
    else if (k === 't' || k === 'T') { toggleTheme(); }
    else if (k === 'f' || k === 'F') { toggleFs(); }
    else if (k === 'd' || k === 'D') { if (slides[i].dataset.arch) openArch(slides[i].dataset.arch); }
    else if (k === 'Escape') { if (isOverview()) toggleOv(false); else closePop(); }
  });

  // 터치: 좌우로 밀어 넘긴다 (좁은 화면은 세로 스크롤이라 쓰지 않는다)
  var tx = null, ty = null;
  document.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; } }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null || isNarrow() || isOverview() || isArchOpen()) { tx = null; return; }
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? fwd() : back(); }
    tx = null;
  }, { passive: true });

  if (narrowMq.addEventListener) narrowMq.addEventListener('change', function () { render(); });

  // 주소의 #M1-02-3 (슬라이드 ID-단계) 또는 #s3-1 (순번-단계)로 바로 연다
  var h = (location.hash || '').slice(1), m;
  if ((m = /^(M\d+-\d+)(?:-(\d+))?$/.exec(h))) {
    var k = slides.findIndex(function (s) { return s.dataset.id === m[1]; });
    if (k >= 0) { i = k; cur = Math.min(slides[i].steps, parseInt(m[2] || '0', 10)); }
  } else if ((m = /^s(\d+)(?:-(\d+))?$/.exec(h))) {
    i = Math.max(0, Math.min(slides.length - 1, parseInt(m[1], 10) - 1)); cur = Math.min(slides[i].steps, parseInt(m[2] || '0', 10));
  }
  render();
})();
