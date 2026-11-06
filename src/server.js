// Herba Pharmacy Stock Room — local server.
// Serves the app to the counter PC and to phones on the same Wi-Fi, keeps the shared
// stock data in one JSON file next to the program, and pushes live updates to every device.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { exec, spawn, spawnSync } from "node:child_process";
import PAGE from "./index.html" with { type: "text" };
import { ICON_192, ICON_512, ICON_180, ICON_ICO } from "./assets.js";

const VERSION = "1.7.1";
const IS_COMPILED = !!process.execPath && !/bun(\.exe)?$/i.test(path.basename(process.execPath));
const BASE_DIR = process.env.STOCKROOM_DIR || (IS_COMPILED ? path.dirname(process.execPath) : process.cwd());
const DATA_DIR = path.join(BASE_DIR, "data");
const DATA_FILE = path.join(DATA_DIR, "stockroom-data.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const KEEP_BACKUPS = 60;
const START_PORT = Number(process.env.STOCKROOM_PORT) || 8080;
const COLLECTIONS = new Set(["items", "sales", "meta"]);
const ID_RE = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;

// ---------- log (Stock Room normally runs with no window, so problems go to data\stockroom.log) ----------
const LOG_FILE = path.join(DATA_DIR, "stockroom.log");
function logLine(text) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > 1000000) fs.renameSync(LOG_FILE, LOG_FILE + ".old");
    const t = new Date(); const stamp = dayStamp(t) + " " + t.toTimeString().slice(0, 8);
    fs.appendFileSync(LOG_FILE, stamp + "  " + String(text).trim() + "\r\n");
  } catch (e) {}
}
if (!globalThis.__stockroomLogPatched) {
  globalThis.__stockroomLogPatched = true;
  const _err = console.error.bind(console);
  console.error = (...a) => { _err(...a); logLine(a.join(" ")); };
}
// Show a message box on the counter PC, so a problem isn't silent when there's no window.
function showError(text) {
  console.error(text);
  if (process.platform !== "win32") return;
  try {
    const msg = String(text).replace(/'/g, "''");
    spawnSync("powershell.exe", ["-NoProfile", "-WindowStyle", "Hidden", "-Command",
      `Add-Type -AssemblyName PresentationFramework; [void][System.Windows.MessageBox]::Show('${msg}', 'Stock Room', 'OK', 'Warning')`], { stdio: "ignore", windowsHide: true });
  } catch (e) {}
}

// ---------- run the newest installed update ----------
// Updates are saved in runtime\updates as stockroom-<version>.js. Whichever file is started,
// the newest version on disk takes over, so an update survives restarts and needs no file swapping.
const UPDATE_DIR = path.join(BASE_DIR, "runtime", "updates");
function cmpVer(a, b) {
  const pa = String(a).split(".").map(Number), pb = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) { const d = (pa[i] || 0) - (pb[i] || 0); if (d) return d > 0 ? 1 : -1; }
  return 0;
}
if (process.argv.includes("--selftest")) { console.log("stockroom-selftest-ok " + VERSION); process.exit(0); }
async function runNewer() {
  if (process.env.STOCKROOM_NO_UPDATES) return false;
  let names = [];
  try { names = fs.readdirSync(UPDATE_DIR).filter((n) => /^stockroom-\d+\.\d+\.\d+\.js$/.test(n)); } catch (e) { return false; }
  const newer = names.map((n) => ({ n, v: n.slice(10, -3) })).filter((f) => cmpVer(f.v, VERSION) > 0).sort((a, b) => cmpVer(b.v, a.v));
  for (const f of newer) {
    const file = path.join(UPDATE_DIR, f.n);
    try { await import(pathToFileURL(file).href); return true; }
    catch (e) {
      logLine("Update " + f.v + " failed to start (" + e.message + "). Using the previous version instead.");
      try { fs.renameSync(file, file + ".failed"); } catch (er) {}
    }
  }
  return false;
}
if (await runNewer()) await new Promise(() => {}); // the newer version is now running this program

// ---------- data ----------
let db = { version: 1, items: {}, sales: {}, meta: {} };
let loaded = false;
function load() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) { saveNow(); loaded = true; return; }
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    for (const c of COLLECTIONS) db[c] = raw && typeof raw[c] === "object" && raw[c] ? raw[c] : {};
    loaded = true;
  } catch (e) {
    const bad = DATA_FILE + ".unreadable-" + Date.now();
    fs.copyFileSync(DATA_FILE, bad);
    showError("Stock Room couldn't read its data file, so it didn't start.\n\nA copy of the file was kept at:\n" + bad + "\n\nYou can put back a copy from the data\\backups folder. Send Claude a photo of this message if you need help.");
    process.exit(1);
  }
}
function saveNow() {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DATA_FILE);
  dailyBackup();
}
let saveTimer = null;
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { saveNow(); } catch (e) { console.error("Save failed:", e.message); } }, 250); }
function dayStamp(d = new Date()) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function dailyBackup() {
  const f = path.join(BACKUP_DIR, `stockroom-${dayStamp()}.json`);
  if (fs.existsSync(f)) return;
  fs.copyFileSync(DATA_FILE, f);
  const all = fs.readdirSync(BACKUP_DIR).filter((n) => /^stockroom-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
  for (const old of all.slice(0, Math.max(0, all.length - KEEP_BACKUPS))) { try { fs.unlinkSync(path.join(BACKUP_DIR, old)); } catch (e) {} }
}

// ---------- live updates ----------
const clients = new Set();
function broadcast(changes) {
  const msg = `event: change\ndata: ${JSON.stringify(changes)}\n\n`;
  for (const res of clients) { try { res.write(msg); } catch (e) {} }
}
setInterval(() => { for (const res of clients) { try { res.write(": ping\n\n"); } catch (e) {} } }, 25000);

function applyOps(ops) {
  const changes = [];
  for (const o of ops) {
    if (!o || !COLLECTIONS.has(o.coll) || !ID_RE.test(String(o.id || ""))) throw new Error("bad path");
    const coll = db[o.coll], id = String(o.id);
    if (o.op === "delete") { delete coll[id]; changes.push({ coll: o.coll, id, data: null }); continue; }
    if (!o.data || typeof o.data !== "object" || Array.isArray(o.data)) throw new Error("bad body");
    if (o.op === "set") coll[id] = o.data;
    else if (o.op === "update") { if (!coll[id]) throw new Error("missing"); coll[id] = Object.assign({}, coll[id], o.data); }
    else throw new Error("bad op");
    changes.push({ coll: o.coll, id, data: coll[id] });
  }
  return changes;
}

// ---------- http ----------
function lanAddresses(port) {
  const out = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    for (const a of list || []) {
      if (a.family === "IPv4" && !a.internal && !/^169\.254\./.test(a.address) && !/vEthernet|VirtualBox|VMware|WSL|Hyper-V/i.test(name)) out.push(`http://${a.address}:${port}`);
    }
  }
  return out;
}
function send(res, code, body, type = "application/json; charset=utf-8", extra = {}) {
  res.writeHead(code, Object.assign({ "Content-Type": type, "Cache-Control": "no-store" }, extra));
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readBody(req, limit = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("too large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
const MANIFEST = JSON.stringify({
  name: "Herba Pharmacy Stock Room", short_name: "Stock Room", start_url: "/", scope: "/", display: "standalone",
  background_color: "#f5f6ef", theme_color: "#2a6334",
  icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }],
});

let PORT = START_PORT;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) return send(res, 200, PAGE, "text/html; charset=utf-8");
    if (url.pathname === "/manifest.webmanifest") return send(res, 200, MANIFEST, "application/manifest+json");
    if (url.pathname === "/favicon.ico") return send(res, 200, Buffer.from(ICON_ICO, "base64"), "image/x-icon", { "Cache-Control": "max-age=86400" });
    if (url.pathname === "/icon-192.png") return send(res, 200, Buffer.from(ICON_192, "base64"), "image/png", { "Cache-Control": "max-age=86400" });
    if (url.pathname === "/icon-512.png") return send(res, 200, Buffer.from(ICON_512, "base64"), "image/png", { "Cache-Control": "max-age=86400" });
    if (url.pathname === "/apple-touch-icon.png") return send(res, 200, Buffer.from(ICON_180, "base64"), "image/png", { "Cache-Control": "max-age=86400" });
    if (url.pathname === "/api/state" && req.method === "GET") return send(res, 200, { items: db.items, sales: db.sales, meta: db.meta });
    if (url.pathname === "/api/info") return send(res, 200, { version: VERSION, port: PORT, addresses: lanAddresses(PORT), dataFile: DATA_FILE });
    if (url.pathname === "/api/events") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive", "X-Accel-Buffering": "no" });
      res.write("retry: 3000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (url.pathname === "/api/write" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      const ops = Array.isArray(body.ops) ? body.ops : [];
      const snapshot = JSON.stringify(db);
      let changes;
      try { changes = applyOps(ops); } catch (e) { db = JSON.parse(snapshot); return send(res, 400, { error: e.message }); }
      saveSoon(); broadcast(changes); lastWrite = Date.now();
      return send(res, 200, { ok: true });
    }
    if (url.pathname === "/api/quit" && req.method === "POST") {
      if (!isLocal(req) || req.headers["x-stockroom"] !== "quit") return send(res, 403, { error: "Stock Room can only be stopped from the Stock Room computer." });
      send(res, 200, { ok: true });
      logLine("Stopped from the Stock Room window.");
      for (const r of clients) { try { r.end(); } catch (e) {} }
      setTimeout(() => process.exit(0), 300);
      return;
    }
    if (url.pathname === "/api/update" && req.method === "GET") return send(res, 200, updateStatus());
    if (url.pathname === "/api/update" && req.method === "POST") {
      if (!isLocal(req) || req.headers["x-stockroom"] !== "update") return send(res, 403, { error: "Updates can only be managed on the Stock Room computer." });
      const body = JSON.parse((await readBody(req)) || "{}");
      if (body.action === "source") {
        const src = normSource(body.source);
        if (src === null) return send(res, 400, { error: "That doesn't look like a GitHub username." });
        upd.source = src; upd.ready = null; upd.lastResult = ""; saveUpdateSettings();
        if (src) checkUpdate().catch(() => {});
      } else if (body.action === "check") {
        await checkUpdate().catch(() => {});
      } else if (body.action === "install") {
        if (!upd.ready) return send(res, 400, { error: "No update is ready." });
        send(res, 200, updateStatus());
        setTimeout(() => restartForUpdate("Installed from the Stock Room window."), 300);
        return;
      }
      return send(res, 200, updateStatus());
    }
    if (url.pathname === "/api/backup") {
      return send(res, 200, JSON.stringify(db, null, 1), "application/json", { "Content-Disposition": `attachment; filename="stockroom-backup-${dayStamp()}.json"` });
    }
    if (url.pathname === "/api/restore" && req.method === "POST") {
      const raw = JSON.parse(await readBody(req, 50 * 1024 * 1024));
      if (!raw || typeof raw.items !== "object") return send(res, 400, { error: "Not a Stock Room backup file" });
      const pre = path.join(BACKUP_DIR, `before-restore-${Date.now()}.json`);
      fs.writeFileSync(pre, JSON.stringify(db));
      for (const c of COLLECTIONS) db[c] = raw[c] && typeof raw[c] === "object" ? raw[c] : {};
      saveNow();
      const msg = `event: reload\ndata: {}\n\n`;
      for (const r of clients) { try { r.write(msg); } catch (e) {} }
      return send(res, 200, { ok: true });
    }
    send(res, 404, { error: "not found" });
  } catch (e) {
    send(res, 500, { error: "server error" });
  }
});

function isLocal(req) { return /^(127\.|::1$|::ffff:127\.)/.test(String(req.socket.remoteAddress || "")); }

// ---------- automatic updates (from the pharmacy's GitHub repository) ----------
const UPDATE_SETTINGS = path.join(DATA_DIR, "update-settings.json");
const QUIET_MS = 10 * 60 * 1000;
let lastWrite = 0;
const upd = { source: "", lastCheck: 0, lastResult: "", ready: null, checking: false };
try { const u = JSON.parse(fs.readFileSync(UPDATE_SETTINGS, "utf8")); if (typeof u.source === "string") upd.source = u.source; } catch (e) {}
function saveUpdateSettings() { try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(UPDATE_SETTINGS, JSON.stringify({ source: upd.source })); } catch (e) {} }
function normSource(v) {
  const s = String(v || "").trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/+$/, "").replace(/^@/, "");
  if (!s) return "";
  const m = s.match(/^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))(?:\/([A-Za-z0-9._-]{1,100}))?$/);
  return m ? m[1] + "/" + (m[2] || "stockroom-updates") : null;
}
function updateStatus() { return { version: VERSION, source: upd.source, lastCheck: upd.lastCheck, lastResult: upd.lastResult, ready: upd.ready, checking: upd.checking }; }
async function checkUpdate() {
  if (!upd.source || upd.checking) return;
  upd.checking = true;
  try {
    const base = (process.env.STOCKROOM_UPDATE_BASE || "https://raw.githubusercontent.com/") + upd.source + "/main/";
    const r = await fetch(base + "latest.json?t=" + Date.now(), { signal: AbortSignal.timeout(20000) });
    if (r.status === 404) throw new Error("Couldn't find Stock Room updates at github.com/" + upd.source + ". Check the username.");
    if (!r.ok) throw new Error("GitHub answered " + r.status + ".");
    const info = await r.json();
    if (!info || !/^\d+\.\d+\.\d+$/.test(String(info.version)) || !/^[a-f0-9]{64}$/.test(String(info.sha256))) throw new Error("The update information on GitHub isn't valid.");
    upd.lastCheck = Date.now();
    if (cmpVer(info.version, VERSION) <= 0) { upd.ready = null; upd.lastResult = "Up to date."; return; }
    if (upd.ready && upd.ready.version === info.version) return;
    const fr = await fetch(base + "stockroom-server.js?t=" + Date.now(), { signal: AbortSignal.timeout(120000) });
    if (!fr.ok) throw new Error("Couldn't download version " + info.version + ".");
    const buf = Buffer.from(await fr.arrayBuffer());
    const sum = crypto.createHash("sha256").update(buf).digest("hex");
    if (sum !== info.sha256) throw new Error("The download for version " + info.version + " was incomplete. It will try again later.");
    fs.mkdirSync(UPDATE_DIR, { recursive: true });
    const test = path.join(UPDATE_DIR, `check-${info.version}.js`);
    fs.writeFileSync(test, buf);
    const t = spawnSync(process.execPath, [test, "--selftest"], { timeout: 30000, windowsHide: true, encoding: "utf8", env: Object.assign({}, process.env, { STOCKROOM_NO_BROWSER: "1", STOCKROOM_NO_UPDATES: "1" }) });
    if (!String(t.stdout || "").includes("stockroom-selftest-ok " + info.version)) { try { fs.unlinkSync(test); } catch (e) {} throw new Error("Version " + info.version + " didn't pass its start-up check, so it wasn't installed."); }
    fs.renameSync(test, path.join(UPDATE_DIR, `stockroom-${info.version}.js`));
    // keep only the two newest updates
    const all = fs.readdirSync(UPDATE_DIR).filter((n) => /^stockroom-\d+\.\d+\.\d+\.js$/.test(n)).sort((a, b) => cmpVer(b.slice(10, -3), a.slice(10, -3)));
    for (const old of all.slice(2)) { try { fs.unlinkSync(path.join(UPDATE_DIR, old)); } catch (e) {} }
    upd.ready = { version: info.version, notes: String(info.notes || "").slice(0, 500) };
    upd.lastResult = "Version " + info.version + " downloaded.";
    logLine("Downloaded update " + info.version + ".");
  } catch (e) {
    upd.lastResult = e.name === "TimeoutError" || /fetch|network|ENOTFOUND|ECONN/i.test(e.message) ? "Couldn't reach GitHub. Is this computer online?" : e.message;
    upd.lastCheck = Date.now();
  } finally { upd.checking = false; }
}
let restarting = false;
function restartForUpdate(why) {
  if (restarting) return; restarting = true;
  logLine("Restarting to install version " + (upd.ready ? upd.ready.version : "?") + ". " + why);
  try { clearTimeout(saveTimer); saveNow(); } catch (e) {}
  for (const r of clients) { try { r.end(); } catch (e) {} }
  server.close(() => {
    try {
      const child = spawn(process.execPath, process.argv.slice(1), { cwd: process.cwd(), detached: true, stdio: "ignore", windowsHide: true, env: Object.assign({}, process.env, { STOCKROOM_NO_BROWSER: "1" }) });
      child.unref();
    } catch (e) { logLine("Restart failed: " + e.message); }
    setTimeout(() => process.exit(0), 100);
  });
  try { server.closeAllConnections && server.closeAllConnections(); } catch (e) {}
}
function startUpdater() {
  setTimeout(() => checkUpdate().catch(() => {}), 30 * 1000);
  setInterval(() => checkUpdate().catch(() => {}), 3 * 60 * 60 * 1000);
  // install when nobody has saved anything for 10 minutes, so a sale is never interrupted
  setInterval(() => { if (upd.ready && Date.now() - lastWrite > QUIET_MS) restartForUpdate("Stock Room was quiet."); }, 60 * 1000);
}

// Keep the desktop icon file up to date, so a new logo arrives with automatic updates.
function refreshIconFile() {
  try {
    const f = path.join(BASE_DIR, "stockroom.ico"), want = Buffer.from(ICON_ICO, "base64");
    if (fs.existsSync(f) && fs.readFileSync(f).equals(want)) return;
    fs.writeFileSync(f, want);
    if (process.platform === "win32") exec("ie4uinit.exe -show", { windowsHide: true }, () => {});
  } catch (e) {}
}

function start(port, triesLeft) {
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && triesLeft > 0) return start(port + 1, triesLeft - 1);
    showError("Stock Room couldn't start: " + e.message); process.exit(1);
  });
  server.listen(port, "0.0.0.0", () => {
    PORT = port;
    const lan = lanAddresses(port);
    console.log("\n  =============================================");
    console.log("   HERBA PHARMACY  -  STOCK ROOM  v" + VERSION);
    console.log("  =============================================\n");
    console.log("   On this computer:   http://localhost:" + port);
    if (lan.length) { console.log("   On phones (Wi-Fi):  " + lan.join("\n                       ")); }
    else console.log("   Not connected to a network: phones can't reach it yet.");
    console.log("\n   Data file:  " + DATA_FILE);
    console.log("   Backups:    " + BACKUP_DIR + "  (one per day)");
    console.log("\n   Stock Room is running. Closing the Stock Room window doesn't stop it,");
    console.log("   so phones keep working. To stop it: Settings > Phones and backups > Stop.\n");
    logLine("Started v" + VERSION + " on port " + port + (lan.length ? " (phones: " + lan.join(", ") + ")" : " (no network)"));
    openWindow(port);
    startUpdater();
    refreshIconFile();
  });
}

// Open Stock Room in its own app window (no tabs or address bar) using Edge or Chrome.
function openWindow(port) {
  if (process.platform !== "win32" || process.env.STOCKROOM_NO_BROWSER) return;
  const url = `http://localhost:${port}`;
  const pf = [process.env["ProgramFiles(x86)"], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean);
  const candidates = [];
  for (const base of pf) {
    candidates.push(path.join(base, "Microsoft", "Edge", "Application", "msedge.exe"));
    candidates.push(path.join(base, "Google", "Chrome", "Application", "chrome.exe"));
  }
  const browser = candidates.find((c) => { try { return fs.existsSync(c); } catch (e) { return false; } });
  if (browser) {
    const profile = path.join(BASE_DIR, "runtime", "window");
    try {
      const child = spawn(browser, [`--app=${url}`, `--user-data-dir=${profile}`, "--window-size=1280,880", "--no-first-run", "--no-default-browser-check"], { detached: true, stdio: "ignore" });
      child.unref();
      return;
    } catch (e) {}
  }
  exec(`start "" "${url}"`);
}

// If Stock Room is already running (opened earlier today), just bring up a window.
async function alreadyRunning(port) {
  try {
    const r = await fetch(`http://127.0.0.1:${port}/api/info`, { signal: AbortSignal.timeout(1200) });
    if (!r.ok) return false;
    const i = await r.json();
    return i && i.version ? true : false;
  } catch (e) { return false; }
}

if (await alreadyRunning(START_PORT)) {
  console.log("\n  Stock Room is already running. Opening its window...\n");
  openWindow(START_PORT);
  setTimeout(() => process.exit(3), 1500);
} else {
  load();
  start(START_PORT, 10);
}
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => { if (loaded) { try { saveNow(); } catch (e) {} } process.exit(0); });
process.on("exit", () => { if (!loaded) return; try { clearTimeout(saveTimer); fs.writeFileSync(DATA_FILE + ".tmp", JSON.stringify(db)); fs.renameSync(DATA_FILE + ".tmp", DATA_FILE); } catch (e) {} });
