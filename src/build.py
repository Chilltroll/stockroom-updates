#!/usr/bin/env python3
"""Builds the local (Windows) version of Stock Room from the Claude page source."""
import re, sys, pathlib
here = pathlib.Path(__file__).parent
src = (here / "index.src.html").read_text()
shim = (here / "shim.js").read_text()
VERSION = re.search(r'const VERSION = "([0-9.]+)"', (here / "server.js").read_text()).group(1)
shim = shim.replace("__STOCKROOM_VERSION__", VERSION)

def sub(old, new, count=1):
    global src
    n = src.count(old)
    if n < 1 or (count and n != count):
        sys.exit(f"build: expected {count or 'some'} of {old[:70]!r}, found {n}")
    src = src.replace(old, new)

# A. invoice card: paste text from Claude instead of reading photos in the page
sub('''        <h2>Scan an invoice</h2>
        <p>Take or upload a photo of a supplier invoice. Claude reads the product lines and fills in name, quantity, selling price and expiry for you to check before anything is saved.</p>
        <div class="drop" id="scanDrop">''',
'''        <h2>Add an invoice from Claude</h2>
        <p>Send a photo of the invoice to Claude in chat. Claude replies with a block of text for Stock Room: copy it, paste it here and tap Load items. You check every line before anything is saved.</p>
        <div class="field"><label for="impText">Text from Claude</label><textarea id="impText" class="bulk" spellcheck="false" placeholder='Paste the block that starts with {"supplier"'></textarea></div>
        <div class="actions"><button class="primary" type="button" id="impGo">Load items</button></div>
        <div class="drop" id="scanDrop" hidden>''')
sub('<button class="primary" type="button" id="scanGo">Read invoice</button>',
    '<button class="primary" type="button" id="scanGo" hidden>Read invoice</button>')

# B. import handler (reuses the scanner's review-and-save screen)
sub('''  function renderScan() {''', '''  function normName(s) { return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9%.]+/g, ""); }
  function loadImport(res) {
    const byName = {};
    state.items.forEach((it) => { byName[normName(it.name)] = it.id; });
    const ids = new Set(state.items.map((i) => i.id));
    const rows = res && Array.isArray(res.items) ? res.items : Array.isArray(res) ? res : [];
    scanSupplier = res && typeof res.supplier === "string" ? res.supplier.trim() : "";
    scanLines = rows.filter((r) => r && String(r.name || "").trim()).map((r) => ({
      include: true,
      name: String(r.name).trim().slice(0, 120),
      qty: Math.max(0, Math.round(Number(r.quantity != null ? r.quantity : r.qty) || 0)),
      price: price(r.price),
      expiry: /^\\d{4}-\\d{2}-\\d{2}$/.test(String(r.expiry || "")) ? String(r.expiry) : "",
      type: String(r.type || "").trim() || $("#scanType").value.trim(),
      ingredients: String(r.ingredients || "").trim(),
      match: r.match && ids.has(String(r.match)) ? String(r.match) : (byName[normName(r.name)] || ""),
    }));
    if (!scanLines.length) { scanStatus("No products found in that text. Copy the whole block Claude sent, including the curly brackets."); return; }
    if (!$("#scanSup").value.trim() && scanSupplier) {
      const known = suppliers().find((s) => s.toLowerCase() === scanSupplier.toLowerCase());
      $("#scanSup").value = known || scanSupplier;
    }
    const m = scanLines.filter((l) => l.match).length;
    scanStatus(`Loaded ${scanLines.length} product${scanLines.length === 1 ? "" : "s"}${m ? `, ${m} matched to items you already stock` : ""}. Check them below.`);
    renderScan();
  }
  $("#impGo").addEventListener("click", () => {
    const raw = $("#impText").value.trim();
    if (!raw) { scanStatus("Paste the text from Claude first."); $("#impText").focus(); return; }
    let res = null;
    const tryParse = (t) => { try { return JSON.parse(t); } catch (e) { return null; } };
    res = tryParse(raw);
    if (!res) { const a = raw.indexOf("{"), b = raw.lastIndexOf("}"); if (a >= 0 && b > a) res = tryParse(raw.slice(a, b + 1)); }
    if (!res) { const a = raw.indexOf("["), b = raw.lastIndexOf("]"); if (a >= 0 && b > a) res = tryParse(raw.slice(a, b + 1)); }
    if (!res) { scanStatus("That text couldn't be read. Copy the whole block Claude sent and paste it again."); return; }
    loadImport(res);
    $("#impText").value = "";
  });

  function renderScan() {''')

# C. messages that pointed at claude.ai
src = re.sub(r'toast\("Open this page on claude\.ai while signed in to [^"]*"\)', 'toast("Can\'t reach the Stock Room computer, so this wasn\'t saved.")', src)
sub('"Open this page on claude.ai while signed in to see and update the shared stock."',
    '"Can\'t reach the Stock Room computer. Check it\'s switched on with Stock Room open, and that this device is on the pharmacy Wi-Fi."')
sub('''const NO_SCAN = "Invoice reading isn't available in this view. Open Stock Room at claude.ai in Chrome, Safari or Edge while signed in. If it still doesn't work, send the invoice photo to Claude in chat and it will add the items for you.";''',
    '''const NO_SCAN = "Send the invoice photo to Claude in chat and paste the reply above.";''')

# D. phones + backup card in Settings
sub('''      <div class="card" id="bkCard">''', '''      <div class="card" id="devCard">
        <h2>Phones and backups</h2>
        <p>Phones on the pharmacy Wi-Fi open Stock Room at this address. Add it to the home screen to use it like an app.</p>
        <div id="devAddr" class="addr">Looking up address…</div>
        <p>A backup is saved on the Stock Room computer every day. You can also keep your own copy, for example on a USB stick.</p>
        <div class="actions">
          <a class="primary btnlink" href="/api/backup" download>Download backup</a>
          <span class="filebtn overlay">Restore from backup<input id="restoreFile" type="file" accept=".json,application/json" aria-label="Choose a backup file to restore"></span>
        </div>
        <div id="restoreBox"></div>
        <div id="updWrap" hidden>
          <h3 class="subhead">Automatic updates</h3>
          <p id="updState" class="hint">Checking…</p>
          <div class="field"><label for="updSource">GitHub username for updates</label>
            <div class="inline"><input id="updSource" autocomplete="off" spellcheck="false" placeholder="e.g. herbapharmacy"><button class="ghost" type="button" id="updSave">Save</button></div></div>
          <div class="actions"><button class="ghost" type="button" id="updCheck">Check for updates now</button><button class="primary" type="button" id="updInstall" hidden>Install now</button></div>
          <div id="updMsg"></div>
        </div>
        <div id="quitWrap" hidden>
          <p>Stock Room keeps running in the background on this computer, so phones still work when you close this window. It stops by itself when the computer is shut down.</p>
          <div class="actions" style="margin-top:12px"><button class="ghost" type="button" id="quitAsk">Stop Stock Room</button></div>
          <div id="quitBox"></div>
        </div>
      </div>
      <div class="card" id="bkCard">''')

# E. full document, head extras, shim before the app script
extra_css = '''
html, body { margin: 0; }
body { -webkit-text-size-adjust: 100%; }
[hidden] { display: none !important; }
img { max-width: 100%; }
#netbar { position: sticky; top: 0; z-index: 50; background: var(--bad); color: #fff; padding: 10px 16px; font-weight: 700; font-size: 0.9rem; text-align: center; }
.whoami { position: fixed; inset: 0; z-index: 60; background: rgba(15, 25, 17, 0.55); display: grid; place-items: center; padding: 16px; }
.whoami .card { width: min(420px, 100%); }
.addr { font-family: var(--font-num); font-weight: 700; font-size: 1.05rem; background: var(--sunk); border: 1px solid var(--line); border-radius: var(--r); padding: 10px 14px; overflow-wrap: anywhere; }
.btnlink { text-decoration: none; display: inline-block; }
#updbar { position: sticky; top: 0; z-index: 49; background: var(--brand, #2a6334); color: #fff; padding: 10px 16px; font-weight: 700; font-size: 0.9rem; text-align: center; }
#updbar button { margin-left: 10px; background: #fff; color: #2a6334; border: 0; border-radius: 999px; padding: 6px 14px; font: inherit; cursor: pointer; }
.subhead { font-size: 1rem; margin: 22px 0 6px; }
#updState { margin-bottom: 12px; }
.inline { display: flex; gap: 8px; flex-wrap: wrap; }
.inline input { flex: 1 1 200px; min-width: 0; }
'''
src = src.replace("</style>", extra_css + "</style>", 1)
first_script = src.index("<script>")
src = src[:first_script] + "<script>\n" + shim + "\n</script>\n" + src[first_script:]

dev_js = '''
<script>
(function () {
  fetch("/api/info").then((r) => r.json()).then((i) => {
    const el = document.getElementById("devAddr");
    el.textContent = i.addresses && i.addresses.length ? i.addresses.join("  or  ") : "This computer isn't connected to a network, so phones can't reach it yet.";
  }).catch(() => {});
  const isHost = ["localhost", "127.0.0.1", "[::1]"].indexOf(location.hostname) >= 0;
  const qw = document.getElementById("quitWrap"), qb = document.getElementById("quitBox");
  if (isHost) qw.hidden = false;
  const uw = document.getElementById("updWrap"), us = document.getElementById("updState"), ui = document.getElementById("updSource"), um = document.getElementById("updMsg"), ub = document.getElementById("updInstall");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function showUpd(u) {
    if (!u) return;
    let t = "This is version " + u.version + ". ";
    if (!u.source) t += "Automatic updates are off: add the pharmacy's GitHub username below to turn them on.";
    else {
      t += "Updates come from github.com/" + u.source + " and are checked every 3 hours.";
      if (u.lastCheck) t += " Last checked " + new Date(u.lastCheck).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + ": " + (u.lastResult || "");
    }
    us.textContent = t;
    if (document.activeElement !== ui) ui.value = u.source ? (u.source.endsWith("/stockroom-updates") ? u.source.slice(0, -18) : u.source) : "";
    ub.hidden = !u.ready;
    um.innerHTML = u.ready ? '<div class="notice">Version ' + esc(u.ready.version) + ' is ready' + (u.ready.notes ? ': ' + esc(u.ready.notes).replace(/([^.!?])$/, "$1.") : '.') + ' It installs by itself once nobody has used Stock Room for 10 minutes, or tap Install now. It takes a few seconds and nothing is lost.</div>' : "";
  }
  async function updCall(body) {
    const r = await fetch("/api/update", body ? { method: "POST", headers: { "Content-Type": "application/json", "X-Stockroom": "update" }, body: JSON.stringify(body) } : { cache: "no-store" }).catch(() => null);
    if (!r) return null;
    const j = await r.json().catch(() => null);
    if (!r.ok) { um.innerHTML = '<p class="notice">' + esc((j && j.error) || "That didn't work.") + '</p>'; return null; }
    showUpd(j); return j;
  }
  if (isHost) { uw.hidden = false; updCall(); setInterval(() => updCall(), 60000); }
  document.getElementById("updSave").addEventListener("click", async () => { us.textContent = "Saving…"; await updCall({ action: "source", source: ui.value }); setTimeout(() => updCall(), 8000); });
  document.getElementById("updCheck").addEventListener("click", async (e) => { e.target.disabled = true; us.textContent = "Checking GitHub…"; await updCall({ action: "check" }); e.target.disabled = false; });
  ub.addEventListener("click", async () => { ub.disabled = true; const j = await updCall({ action: "install" }); if (j) um.innerHTML = '<p class="hint">Installing. Stock Room will be back in a few seconds…</p>'; ub.disabled = false; });
  document.getElementById("quitAsk").addEventListener("click", () => {
    qb.innerHTML = '<div class="notice">Stop Stock Room? Phones won\\'t be able to use it until you open it again from the desktop icon.</div><div class="actions"><button class="danger" type="button" id="quitYes">Yes, stop it</button><button class="ghost" type="button" id="quitNo">Cancel</button></div>';
  });
  qb.addEventListener("click", async (e) => {
    if (e.target.id === "quitNo") qb.innerHTML = "";
    if (e.target.id === "quitYes") {
      e.target.disabled = true;
      const r = await fetch("/api/quit", { method: "POST", headers: { "X-Stockroom": "quit" } }).catch(() => null);
      if (!r || !r.ok) { qb.innerHTML = '<p class="notice">Couldn\\'t stop it from here.</p>'; return; }
      window.STOCKROOM_STOPPED = true;
      const ov = document.createElement("div");
      ov.className = "whoami";
      ov.innerHTML = '<div class="card"><h2>Stock Room has stopped</h2><p>Everything is saved. You can close this window.</p><p>To start it again, double-click the Stock Room icon on the desktop.</p></div>';
      document.body.appendChild(ov);
    }
  });
  const box = document.getElementById("restoreBox"), inp = document.getElementById("restoreFile");
  let pending = null;
  inp.addEventListener("change", async () => {
    const f = inp.files[0]; inp.value = ""; if (!f) return;
    try { pending = JSON.parse(await f.text()); } catch (e) { box.innerHTML = '<p class="notice">That file isn\\'t a Stock Room backup.</p>'; return; }
    if (!pending || typeof pending.items !== "object") { box.innerHTML = '<p class="notice">That file isn\\'t a Stock Room backup.</p>'; pending = null; return; }
    const n = Object.keys(pending.items).length;
    box.innerHTML = '<div class="notice">Replace all current stock, sales and settings with this backup (' + n + ' items)? A copy of the current data is kept first.</div><div class="actions"><button class="danger" type="button" id="doRestore">Yes, restore</button><button class="ghost" type="button" id="noRestore">Cancel</button></div>';
  });
  box.addEventListener("click", async (e) => {
    if (e.target.id === "noRestore") { pending = null; box.innerHTML = ""; }
    if (e.target.id === "doRestore" && pending) {
      e.target.disabled = true;
      const r = await fetch("/api/restore", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pending) }).catch(() => null);
      box.innerHTML = r && r.ok ? '<p class="hint">Restored. Reloading…</p>' : '<p class="notice">Restore failed. Check the Stock Room computer is on.</p>';
    }
  });
})();
</script>
'''
head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2a6334">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Stock Room">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
'''
# move <title>, font links and <style> into the head
style_end = src.index("</style>") + len("</style>")
head_part, body_part = src[:style_end], src[style_end:]
out = head + head_part + "\n</head>\n<body>\n" + body_part + dev_js + "</body>\n</html>\n"
(here / "index.html").write_text(out)
print("built index.html", len(out), "bytes")
