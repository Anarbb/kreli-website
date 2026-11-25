// Picks the page language (?lang=, then the site's saved choice, then the browser) and wires the EN/FR buttons.
(function () {
  var root = document.documentElement;
  var supported = ['en', 'fr'];
  var lang = null;
  try {
    var q = new URLSearchParams(location.search).get('lang');
    if (supported.indexOf(q) > -1) lang = q;
    if (!lang) {
      var saved = localStorage.getItem('kreli_lang');
      if (supported.indexOf(saved) > -1) lang = saved;
    }
  } catch (e) { /* storage can be blocked: fall through */ }
  if (!lang) lang = (navigator.language || 'fr').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';

  function apply(l) {
    root.classList.add('js');
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    var buttons = document.querySelectorAll('.langs button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-l') === l ? 'true' : 'false');
    }
    try { localStorage.setItem('kreli_lang', l); } catch (e) { /* ignore */ }
  }
  // Runs from <head>: set the language before first paint so the other one never flashes.
  root.classList.add('js');
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);
  document.addEventListener('DOMContentLoaded', function () { apply(lang); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.langs button');
    if (b) apply(b.getAttribute('data-l'));
  });
})();
