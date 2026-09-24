/* When a demo is opened full screen from the feedback page (?from=feedback), show a pill that returns to it. */
(function () {
  if (!/[?&]from=feedback(&|$)/.test(location.search)) return;
  var a = document.createElement('a');
  a.href = '../index.html#step1';
  a.textContent = '← Back to design feedback';
  a.setAttribute('style', 'position:fixed;left:16px;bottom:16px;z-index:85;padding:13px 18px;border-radius:999px;background:#1b1a17;color:#fff;font:600 14px/1 "DM Sans",system-ui,sans-serif;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.2)');
  document.body.appendChild(a);
})();
