/* Pepsoma review comments → Google Sheet.
   The store's review mode (store/js/review.js) posts every new, edited or deleted comment here.

   Setup (once):
   1. Make a new Google Sheet (sheets.new). Name it e.g. "Pepsoma review comments".
   2. Extensions → Apps Script. Delete what's there, paste this whole file, click Save.
   3. Deploy → New deployment → gear icon → Web app.
        Execute as: Me
        Who has access: Anyone
      Click Deploy, allow access when Google asks, and copy the Web app URL (ends in /exec).
   4. Put that URL in SHEET_URL at the top of store/js/review.js and push.
   5. Password for the "Everyone" view: Project Settings (gear) → Script properties → Add script property,
      Property: ADMIN_KEY, Value: the password. It lives only here, never in this file (the repo is public).

   After editing this script you must redeploy, or the live URL keeps running the old code:
   Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy. That keeps the same URL.

   Anyone with the URL can add comments (that's how review mode works). Reading them all back needs ADMIN_KEY. */

const SHEET_NAME = 'Comments';
const HEADERS = ['ID', 'Time', 'Name', 'Page', 'Element', 'Comment', 'Status', 'Device', 'Selector', 'Last updated'];

function doPost(e) {
  let data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: String(err) }); }
  if (data.list) return list_(data.key);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    const ids = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map((r) => String(r[0])) : [];

    (data.save || []).forEach((c) => {
      const row = [c.id, new Date(c.at), c.by, c.page, c.what, c.body, c.done ? 'Done' : 'Open', c.device, c.sel, new Date()].map(safe_);
      const i = ids.indexOf(String(c.id));
      if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
      else { sh.appendRow(row); ids.push(String(c.id)); }
    });

    // bottom-up so earlier row numbers stay valid
    const remove = new Set((data.remove || []).map(String));
    for (let i = ids.length - 1; i >= 0; i--) if (remove.has(ids[i])) sh.deleteRow(i + 2);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser is a quick check that the deployment works.
function doGet() {
  return ContentService.createTextOutput('Pepsoma review sheet is running.');
}

// Every comment, for the "Everyone" view. Sent as a POST so the password never sits in a URL.
function list_(key) {
  const want = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!want) return json_({ ok: false, locked: true, error: 'No password set: add the ADMIN_KEY script property.' });
  if (String(key || '') !== want) return json_({ ok: false, locked: true, error: 'Wrong password.' });
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME); // not sheet_(): reading shouldn't create it
    const last = sh ? sh.getLastRow() : 0;
    const rows = last > 1 ? sh.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];
    const text = (v) => String(v).replace(/^'(?=[=+\-@])/, ''); // undo safe_
    return json_({
      ok: true,
      comments: rows.map((r) => ({ id: text(r[0]), at: r[1] instanceof Date ? r[1].toISOString() : text(r[1]), by: text(r[2]), page: text(r[3]), what: text(r[4]), body: text(r[5]), done: r[6] === 'Done', device: text(r[7]), sel: text(r[8]) })),
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(6, 420);
    sh.getRange('F:F').setWrap(true);
  }
  return sh;
}

// a comment starting with = + - @ would otherwise run as a formula
function safe_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
