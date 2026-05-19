// Speculative Architecture — folio site

(function () {
  'use strict';

  var tabs = document.querySelectorAll('.tab');
  var folios = document.querySelectorAll('.folio');
  var videos = document.querySelectorAll('.reel__video');
  var dissolves = document.querySelectorAll('[data-dissolve]');
  var navButtons = document.querySelectorAll('[data-goto]');

  function forcePlay(v) {
    if (!v) return;
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {
        setTimeout(function () {
          var p2 = v.play();
          if (p2 && p2.catch) p2.catch(function () {});
        }, 100);
      });
    }
  }

  function playActive() {
    var v = document.querySelector('.folio.is-active .reel__video');
    if (v) forcePlay(v);
  }

  function showFolio(index) {
    index = parseInt(index, 10);
    tabs.forEach(function (t) {
      t.classList.toggle('is-active', parseInt(t.dataset.tab, 10) === index);
    });
    folios.forEach(function (f) {
      f.classList.toggle('is-active', parseInt(f.dataset.folio, 10) === index);
    });
    videos.forEach(function (v) {
      try { v.pause(); } catch (e) {}
    });
    var active = document.querySelector('.folio.is-active .reel__video');
    if (active) {
      try { active.currentTime = 0; } catch (e) {}
      forcePlay(active);
    }
    var isMobile = window.matchMedia('(max-width: 720px)').matches;
    window.scrollTo({ top: 0, behavior: isMobile ? 'auto' : 'smooth' });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showFolio(t.dataset.tab); });
  });
  navButtons.forEach(function (b) {
    b.addEventListener('click', function () { showFolio(b.dataset.goto); });
  });

  dissolves.forEach(function (el, i) {
    setInterval(function () { el.classList.toggle('is-b'); }, 4500 + i * 500);
  });

  function startup() {
    videos.forEach(function (v) {
      v.muted = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.setAttribute('autoplay', '');
    });
    playActive();
    setTimeout(playActive, 100);
    setTimeout(playActive, 500);
    setTimeout(playActive, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startup);
  } else {
    startup();
  }
  window.addEventListener('load', playActive);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      videos.forEach(function (v) { try { v.pause(); } catch (e) {} });
    } else {
      playActive();
    }
  });

  var firstInteract = false;
  function onInteract() {
    if (firstInteract) return;
    firstInteract = true;
    playActive();
  }
  ['touchstart', 'click', 'scroll', 'keydown', 'mousemove'].forEach(function (ev) {
    document.addEventListener(ev, onInteract, { once: true, passive: true });
  });

  setInterval(function () {
    var v = document.querySelector('.folio.is-active .reel__video');
    if (v && v.paused && !document.hidden) {
      forcePlay(v);
    }
  }, 2000);
})();
