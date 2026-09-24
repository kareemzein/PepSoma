/* When a demo is opened full screen from the feedback page (?from=feedback), show a pill that returns to it. */
(function () {
  if (!/[?&]from=feedback(&|$)/.test(location.search)) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches || !document.body.animate;
  var a = document.createElement('a');
  a.href = '../index.html#step1';
  a.textContent = '← Back to design feedback';
  a.setAttribute('style', 'position:fixed;left:16px;bottom:16px;z-index:85;padding:13px 18px;border-radius:999px;background:#1b1a17;color:#fff;font:600 14px/1 "DM Sans",system-ui,sans-serif;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.2)');
  document.body.appendChild(a);

  // a full-screen layer in the page's own color: the feedback page grew its preview into it, and shrinks it back on return
  function curtain(color) {
    var c = document.createElement('div');
    c.setAttribute('style', 'position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:' + color);
    document.body.appendChild(c);
    return c;
  }
  function pageColor() { return getComputedStyle(document.body).backgroundColor; }

  var arriving = null;
  try { arriving = sessionStorage.getItem('pepsomaPortalIn'); sessionStorage.removeItem('pepsomaPortalIn'); } catch (e) {}
  if (arriving && !still) {
    var c = curtain(pageColor());
    setTimeout(function () {
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 480, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' })
        .onfinish = function () { c.remove(); };
    }, 120);
  }

  var leaving = null;
  a.addEventListener('click', function (e) {
    var color = pageColor();
    try { sessionStorage.setItem('pepsomaPortalBack', color); } catch (err) {}
    if (still || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    leaving = curtain(color);
    leaving.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-in', fill: 'forwards' })
      .onfinish = function () { location.href = a.href; };
  });
  // browser Back/Forward into this page from memory: drop a leftover curtain
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && leaving) { leaving.remove(); leaving = null; }
  });
})();
