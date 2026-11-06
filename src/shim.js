// Local stand-in for the Claude page runtime: the same db / user calls the app makes,
// served by the Stock Room program on the pharmacy computer.
(function () {
  const listeners = new Set();
  const cache = { items: {}, sales: {}, meta: {} };
  let ready = null, online = false;

  function banner(show) {
    let b = document.getElementById("netbar");
    if (!b) {
      b = document.createElement("div"); b.id = "netbar"; b.setAttribute("role", "alert");
      b.textContent = "Can't reach the Stock Room computer. Check it's switched on with Stock Room open, and that this device is on the pharmacy Wi-Fi. Changes won't save until it reconnects.";
      document.body.prepend(b);
    }
    b.hidden = !show;
  }
  function updated(v) {
    if (document.getElementById("updbar")) return;
    const b = document.createElement("div"); b.id = "updbar"; b.setAttribute("role", "status");
    b.innerHTML = 'Stock Room has been updated to version ' + v + '. <button type="button">Refresh to see what\'s new</button>';
    b.querySelector("button").addEventListener("click", () => location.reload());
    document.body.prepend(b);
  }
  function fire() { for (const l of listeners) { try { l(); } catch (e) { console.error(e); } } }
  async function fetchState() {
    const r = await fetch("/api/state", { cache: "no-store" });
    if (!r.ok) throw new Error("state " + r.status);
    const s = await r.json();
    cache.items = s.items || {}; cache.sales = s.sales || {}; cache.meta = s.meta || {};
  }
  function connect() {
    if (ready) return ready;
    ready = fetchState().then(() => {
      online = true; banner(false);
      const es = new EventSource("/api/events");
      let first = true;
      es.addEventListener("open", () => {
        if (first) { first = false; return; }
        fetchState().then(() => { online = true; banner(false); fire(); }).catch(() => {});
        fetch("/api/info", { cache: "no-store" }).then((r) => r.json()).then((i) => { if (i && i.version && i.version !== window.STOCKROOM_VERSION) updated(i.version); }).catch(() => {});
      });
      es.addEventListener("change", (ev) => {
        let ch; try { ch = JSON.parse(ev.data); } catch (e) { return; }
        for (const c of ch) { if (!cache[c.coll]) continue; if (c.data == null) delete cache[c.coll][c.id]; else cache[c.coll][c.id] = c.data; }
        fire();
      });
      es.addEventListener("reload", () => location.reload());
      es.addEventListener("error", () => { online = false; banner(true); });
    }).catch((e) => { banner(true); ready = null; setTimeout(() => connect().then(fire).catch(() => {}), 4000); throw e; });
    return ready;
  }

  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const freeze = (o) => JSON.parse(JSON.stringify(o));
  async function write(ops) {
    // apply locally first so the screen updates straight away
    for (const o of ops) {
      const coll = cache[o.coll];
      if (o.op === "delete") delete coll[o.id];
      else if (o.op === "set") coll[o.id] = freeze(o.data);
      else coll[o.id] = Object.assign({}, coll[o.id], freeze(o.data));
    }
    fire();
    let r;
    try { r = await fetch("/api/write", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ops }) }); }
    catch (e) { banner(true); throw { code: "unavailable", message: "offline" }; }
    if (!r.ok) { await fetchState().catch(() => {}); fire(); throw { code: r.status === 400 ? "invalid_argument" : "unavailable", message: "write failed" }; }
  }
  function split(p) { const s = String(p).split("/"); return s; }
  function docSnap(coll, id) { const d = cache[coll] && cache[coll][id]; return { id, exists: !!d, data: () => (d ? freeze(d) : undefined), metadata: { fromCache: false, hasPendingWrites: false } }; }
  function docRef(coll, id) {
    return {
      id, path: coll + "/" + id,
      get: async () => { await connect(); return docSnap(coll, id); },
      set: (data) => write([{ op: "set", coll, id, data }]),
      update: (data) => { if (!cache[coll][id]) return Promise.reject({ code: "invalid_argument", message: "missing" }); return write([{ op: "update", coll, id, data }]); },
      delete: () => write([{ op: "delete", coll, id }]),
      onSnapshot(next, err) {
        let last;
        const run = () => { const d = cache[coll][id]; const k = JSON.stringify(d); if (k === last) return; last = k; next(docSnap(coll, id)); };
        listeners.add(run); connect().then(run).catch(() => err && err({ code: "unavailable" }));
        return () => listeners.delete(run);
      },
    };
  }
  function query(coll, filters) {
    const ops = { "==": (a, b) => a === b, "!=": (a, b) => a !== b, "<": (a, b) => a < b, "<=": (a, b) => a <= b, ">": (a, b) => a > b, ">=": (a, b) => a >= b };
    const match = (d) => filters.every(([f, op, v]) => ops[op] ? ops[op](d[f], v) : true);
    const snap = () => {
      const docs = Object.keys(cache[coll]).sort().filter((id) => match(cache[coll][id])).map((id) => docSnap(coll, id));
      return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } };
    };
    return {
      where: (f, op, v) => query(coll, filters.concat([[f, op, v]])),
      orderBy: () => query(coll, filters), limit: () => query(coll, filters),
      get: async () => { await connect(); return snap(); },
      onSnapshot(next, err) {
        let last;
        const run = () => { const s = snap(); const k = JSON.stringify(s.docs.map((d) => [d.id, cache[coll][d.id]])); if (k === last) return; last = k; next(s); };
        listeners.add(run); connect().then(run).catch(() => err && err({ code: "unavailable" }));
        return () => listeners.delete(run);
      },
    };
  }
  const localDb = {
    collection(p) {
      const coll = split(p)[0];
      const q = query(coll, []);
      return Object.assign(q, { path: coll, doc: (id) => docRef(coll, id || newId()), add: async (data) => { const id = newId(); await write([{ op: "set", coll, id, data }]); return docRef(coll, id); } });
    },
    doc(p) { const s = split(p); return docRef(s[0], s[1]); },
  };

  // Staff name instead of a Claude account
  function getName() { try { return localStorage.getItem("stockroom.staff") || ""; } catch (e) { return ""; } }
  function askName() {
    return new Promise((resolve) => {
      const have = getName(); if (have) return resolve(have);
      const ov = document.createElement("div"); ov.className = "whoami";
      ov.innerHTML = '<form class="card"><h2>Who is using this device?</h2><p>Your name is shown next to stock counts and sales you make.</p><div class="field"><label for="who-name">Your name</label><input id="who-name" autocomplete="given-name" required maxlength="40" placeholder="e.g. Maria"></div><div class="actions"><button class="primary" type="submit">Continue</button></div></form>';
      document.body.append(ov);
      const f = ov.querySelector("form"), i = ov.querySelector("input"); setTimeout(() => i.focus(), 50);
      f.addEventListener("submit", (e) => { e.preventDefault(); const n = i.value.trim().slice(0, 40); if (!n) return; try { localStorage.setItem("stockroom.staff", n); } catch (er) {} ov.remove(); resolve(n); });
    });
  }
  const user = {
    id: () => askName(), me: async () => ({ id: await askName(), name: await askName() }),
    profiles: async (ids) => Object.fromEntries((ids || []).map((id) => [id, { id, name: String(id) }])),
    isOwner: () => true, canEdit: () => true, can: () => true,
  };

  window.claude = {
    use: async (name) => {
      if (name === "db") { try { await connect(); } catch (e) {} return localDb; }
      if (name === "user") return user;
      return null;
    },
  };
  window.STOCKROOM_LOCAL = true;
  window.STOCKROOM_VERSION = "__STOCKROOM_VERSION__";
})();
