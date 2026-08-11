// discord-alternative.com - tiny vanilla JS, no deps
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // ---- mobile nav toggle ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var opened = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- guides tabs ----
  var panels = {};
  var tabs = [];
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    var name = btn.getAttribute('data-tab');
    tabs.push({ name: name, btn: btn });
    var panel = document.getElementById('panel-' + name);
    if (panel) panels[name] = panel;
  });

  function activateTab(name) {
    tabs.forEach(function (t) {
      var on = t.name === name;
      t.btn.classList.toggle('active', on);
      t.btn.setAttribute('aria-selected', on ? 'true' : 'false');
      if (panels[t.name]) panels[t.name].hidden = !on;
    });
  }

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn.getAttribute('data-tab'));
      history.replaceState(null, '', '#' + btn.getAttribute('data-tab'));
    });
  });

  // deep links: #mumble / #ts3 / #ts6 open the matching tab and land on the tab bar
  var tabBar = document.querySelector('.tab-bar');
  function scrollToTabBar() {
    if (tabBar) tabBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function tabFromHash() {
    var h = location.hash.replace('#', '');
    if (!panels[h]) return false;
    activateTab(h);
    requestAnimationFrame(scrollToTabBar);
    return true;
  }
  window.addEventListener('hashchange', tabFromHash);
  tabFromHash();

  // section links: land on the section content, not on its top padding
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || !el.classList.contains('section')) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var pad = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + pad - 84,
        behavior: 'smooth'
      });
      history.replaceState(null, '', '#' + id);
    });
  });

  // any link pointing at a guide tab: open the tab, land on the tab bar
  document.querySelectorAll('a[href^="#mumble"], a[href^="#ts3"], a[href^="#ts6"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = a.getAttribute('href').slice(1);
      if (panels[target]) activateTab(target);
      scrollToTabBar();
      history.replaceState(null, '', '#' + target);
    });
  });

  // buttons with data-tab-link switch tabs and scroll to the tab bar
  document.querySelectorAll('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = a.getAttribute('data-tab-link');
      if (panels[target]) activateTab(target);
      scrollToTabBar();
      history.replaceState(null, '', '#' + target);
    });
  });

  // ---- scroll-spy ----
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // ---- reveal on scroll ----
  var reveals = document.querySelectorAll('.reveal');
  var revealOK = false;
  if ('IntersectionObserver' in window && reveals.length) {
    try {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { ro.observe(el); });
      revealOK = true;
    } catch (e) {}
  }
  if (!revealOK) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- copy buttons ----
  document.querySelectorAll('.snippet').forEach(function (wrap) {
    var pre = wrap.querySelector('pre');
    if (!pre) return;
    var btn = wrap.querySelector('.cpy');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var text = pre.innerText;
      var done = function () {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ---- lazy youtube embeds (load iframe only on play) ----
  document.querySelectorAll('.video[data-yt]').forEach(function (box) {
    var id = box.getAttribute('data-yt');
    var thumb = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    var img = new Image();
    img.onload = function () { box.style.backgroundImage = 'url("' + thumb + '")'; };
    img.src = thumb;
    var play = document.createElement('button');
    play.type = 'button';
    play.className = 'yt-play';
    play.setAttribute('aria-label', 'Play video');
    play.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M9 7.5l8 4.5-8 4.5z" fill="currentColor"/></svg>';
    box.appendChild(play);
    play.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = box.getAttribute('data-title') || 'YouTube video';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(iframe);
    });
  });
})();
