// @bun
import http from"http";import fs from"fs";import path from"path";import os from"os";import crypto from"crypto";import{pathToFileURL}from"url";import{exec,spawn,spawnSync}from"child_process";var src_default=`<!doctype html>
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
<title>Herba Pharmacy Stock Room</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
/* Layout: Herba Pharmacy look \u2014 cream ground, deep forest green type and pills, leaf-green highlights, green footer band. */
:root {
  --bg: #f5f6ef;
  --surface: #ffffff;
  --sunk: #ecf1e4;
  --fg: #1c3b24;
  --muted: #5c6f60;
  --line: #d9e2cf;
  --accent: #2a6334;
  --leaf: #7cb342;
  --accent-ink: #ffffff;
  --ok: #2a6334; --ok-bg: #e3f0d6;
  --warn: #9a5400; --warn-bg: #fff0d6;
  --bad: #b42318; --bad-bg: #fde6e3;
  --info: #1d5aa3; --info-bg: #e2edfb;
  --font-display: "Montserrat", "Segoe UI", system-ui, sans-serif;
  --font-body: "Nunito Sans", "Segoe UI", system-ui, sans-serif;
  --font-num: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --r: 14px;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f1911; --surface: #16241a; --sunk: #1c2e20; --fg: #e5efe0; --muted: #9db2a0; --line: #2a3f2e;
    --accent: #8fcf5e; --leaf: #8fcf5e; --accent-ink: #0f1911;
    --ok: #8fcf5e; --ok-bg: #1a3020; --warn: #f2b65c; --warn-bg: #33240c;
    --bad: #ff8d82; --bad-bg: #3b1613; --info: #8db9f2; --info-bg: #13243a;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #0f1911; --surface: #16241a; --sunk: #1c2e20; --fg: #e5efe0; --muted: #9db2a0; --line: #2a3f2e;
  --accent: #8fcf5e; --leaf: #8fcf5e; --accent-ink: #0f1911;
  --ok: #8fcf5e; --ok-bg: #1a3020; --warn: #f2b65c; --warn-bg: #33240c;
  --bad: #ff8d82; --bad-bg: #3b1613; --info: #8db9f2; --info-bg: #13243a;
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: 15px; line-height: 1.45; }
.app { max-width: 920px; margin: 0 auto; padding-inline: 16px; padding-block: 20px 64px; display: grid; gap: 18px; }
button, input, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.top { position: relative; overflow: hidden; background: var(--surface); border: 1px solid var(--line); border-radius: 22px; padding: 22px; display: flex; flex-wrap: wrap; gap: 18px; align-items: center; justify-content: space-between; }
.top::after { content: ""; position: absolute; right: -40px; top: -50px; width: 190px; height: 190px; border-radius: 0 100% 0 100%; background: var(--leaf); opacity: 0.12; transform: rotate(-20deg); pointer-events: none; }
.brand { display: flex; gap: 14px; align-items: center; position: relative; }
.brand { flex-direction: column; align-items: flex-start; gap: 10px; }
.wordmark { margin: 0; line-height: 0; }
.wordmark img { display: block; width: clamp(240px, 80vw, 380px); height: auto; }
.foot img { width: 22px; height: 22px; flex: none; background: #fff; border-radius: 6px; padding: 2px; }
.sub { display: inline-block; margin: 0; background: var(--accent); color: var(--accent-ink); font-family: var(--font-display); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px; border-radius: 99px; }
.stats { display: flex; flex-wrap: wrap; gap: 8px; position: relative; }
.stat { background: var(--sunk); border: 1px solid var(--line); border-radius: var(--r); padding: 8px 14px; min-width: 88px; text-align: left; }
.stat b { display: block; font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; font-variant-numeric: tabular-nums; }
.stat span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.stat.bad b { color: var(--bad); } .stat.warn b { color: var(--warn); } .stat.info b { color: var(--info); }
button.stat { cursor: pointer; } button.stat:hover { border-color: var(--accent); }

.tabs { display: flex; gap: 6px; overflow-x: auto; padding: 2px; }
.tabs button { background: var(--surface); border: 1px solid var(--line); border-radius: 99px; padding: 9px 16px; font-family: var(--font-display); font-weight: 700; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg); white-space: nowrap; }
.tabs button:hover { border-color: var(--accent); }
.tabs button[aria-selected="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.foot { background: var(--accent); color: var(--accent-ink); border-radius: 18px; padding: 14px 18px; display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; text-align: center; }
.foot svg { width: 18px; height: 18px; flex: none; }
.foot svg path { fill: var(--accent-ink); opacity: 0.85; }
.badge { display: inline-block; min-width: 20px; padding: 0 6px; margin-left: 4px; border-radius: 99px; background: var(--warn-bg); color: var(--warn); font-family: var(--font-num); font-size: 0.75rem; text-align: center; }
.badge:empty { display: none; }

.toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 12px; }
.search { flex: 1 1 240px; min-width: 0; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border: 1px solid var(--line); background: var(--surface); border-radius: 99px; padding: 6px 12px; font-size: 0.85rem; font-weight: 600; }
.chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
select.chip { padding-right: 8px; }

.list { display: grid; gap: 8px; }
.row { background: var(--surface); border: 1px solid var(--line); border-left: 4px solid var(--line); border-radius: var(--r); padding: 12px 14px;
  display: grid; grid-template-columns: minmax(0,1fr) auto auto; gap: 8px 16px; align-items: center; }
.row.s-out { border-left-color: var(--bad); } .row.s-low { border-left-color: var(--warn); } .row.s-onorder { border-left-color: var(--info); } .row.s-ok { border-left-color: var(--ok); }
.name { font-weight: 700; font-size: 1rem; display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; overflow-wrap: anywhere; }
.meta { color: var(--muted); font-size: 0.82rem; margin-top: 2px; overflow-wrap: anywhere; }
.desc { font-size: 0.85rem; margin-top: 4px; max-width: 65ch; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.price { font-family: var(--font-num); font-size: 0.8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.pe { font-size: 0.7rem; font-weight: 700; padding: 1px 8px; border-radius: 99px; border: 1px solid currentColor; letter-spacing: 0.02em; }
.pe-bad { color: var(--bad); } .pe-soon { color: var(--warn); } .pe-later { color: var(--muted); }
.field textarea { min-height: 70px; resize: vertical; }
.intro { color: var(--muted); margin: 0 0 12px; max-width: 65ch; }
.ghead .val { font-family: var(--font-num); font-weight: 700; font-size: 0.85rem; font-variant-numeric: tabular-nums; }
.oline input[type="date"] { padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); font-size: 0.8rem; }
.vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.scan { border-top: 4px solid var(--leaf); }
.drop { display: grid; justify-items: center; gap: 8px; text-align: center; padding: 18px 14px; border: 2px dashed var(--line); border-radius: var(--r); background: var(--sunk); }
.drop.over { border-color: var(--accent); background: var(--ok-bg); }
.pickrow { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.filebtn.overlay { position: relative; overflow: hidden; }
.filebtn.overlay input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; font-size: 100px; }
.filebtn.overlay:focus-within { outline: 2px solid var(--accent); outline-offset: 2px; }
.thumbs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.thumbs img { width: 84px; height: 84px; object-fit: cover; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); }
.filebtn { display: inline-flex; align-items: center; gap: 8px; background: var(--sunk); border: 1px dashed var(--accent); color: var(--accent); border-radius: 99px; padding: 10px 16px; font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; }
.filebtn svg { width: 18px; height: 18px; fill: currentColor; }
.vh:focus-visible + .hint, .filebtn:focus-within { outline: 2px solid var(--accent); outline-offset: 2px; }
.review { display: grid; gap: 10px; }
.review h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--accent); }
.sline { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; align-items: start; border: 1px solid var(--line); border-radius: var(--r); padding: 12px; background: var(--bg); }
.sline.off { opacity: 0.5; }
.sline input[type="checkbox"] { width: 20px; height: 20px; margin-top: 26px; accent-color: var(--accent); }
.sfields { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; min-width: 0; }
.sfields .wide { grid-column: 1 / -1; }
.sfields select { width: 100%; padding: 9px 11px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.pricenote { display: block; font-size: 0.82rem; padding: 8px 10px; border-radius: 8px; background: var(--sunk); color: var(--muted); }
.pricenote.up { background: var(--warn-bg); color: var(--warn); }
.pricenote.down { background: var(--ok-bg); color: var(--ok); }
.pcount { color: var(--warn); }
.wide:empty { display: none; }
.matchnote { font-size: 0.78rem; color: var(--accent); font-weight: 700; }
.hctl { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.hdates { display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; font-size: 0.85rem; font-weight: 700; color: var(--muted); }
.hdates input { padding: 7px 9px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); font-size: 0.85rem; }
.hsum { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 10px; }
.hsum .stat { background: var(--surface); }
.hprod { margin: 0 0 12px; padding: 10px 14px; background: var(--ok-bg); color: var(--ok); border-radius: var(--r); }
.hday { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; margin-bottom: 12px; }
.hsale { padding: 10px 14px; border-top: 1px solid var(--line); display: grid; gap: 4px; }
.hsale .sh { display: flex; justify-content: space-between; gap: 8px; font-size: 0.82rem; color: var(--muted); font-weight: 600; }
.hsale .sh b { color: var(--fg); font-family: var(--font-num); }
.hsale.is-refund .sh b { color: var(--warn); }
.sl.hit span:first-child { font-weight: 800; }
.sl .hp { color: var(--muted); font-family: var(--font-num); font-size: 0.78rem; }
.till-side > .ghost { justify-self: start; }
.quickbtn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; border: 2px solid var(--accent); background: var(--surface); color: var(--accent); border-radius: var(--r); padding: 11px 14px; font-family: var(--font-display); font-weight: 800; font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; }
.quickbtn:hover { background: var(--ok-bg); }
.quickbtn svg { width: 18px; height: 18px; fill: var(--leaf); }
.qmenu { position: fixed; inset: 0; z-index: 40; background: rgba(15, 25, 17, 0.5); display: grid; place-items: start center; padding: max(16px, env(safe-area-inset-top, 0px)) 16px 16px; overflow-y: auto; }
.qpanel { width: min(920px, 100%); background: var(--bg); border-radius: 20px; padding: 18px; display: grid; gap: 10px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); }
.qhead { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.qhead h2 { margin: 0; font-family: var(--font-display); font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: var(--accent); font-size: 1.15rem; }
.qsec { margin: 8px 0 0; font-family: var(--font-display); font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.qtiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; }
.qtile { position: relative; }
.qadd { width: 100%; height: 100%; min-height: 96px; text-align: left; display: grid; align-content: start; gap: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 12px 40px 12px 12px; }
.qadd:hover, .qadd:focus-visible { border-color: var(--accent); background: var(--ok-bg); }
.qtile.none .qadd { opacity: 0.6; }
.qname { font-weight: 800; line-height: 1.25; overflow-wrap: anywhere; }
.qmeta { font-size: 0.8rem; color: var(--muted); }
.qmeta b { color: var(--fg); font-family: var(--font-num); }
.qin { justify-self: start; font-size: 0.72rem; font-weight: 800; background: var(--accent); color: var(--accent-ink); border-radius: 99px; padding: 2px 8px; }
.qstar { position: absolute; top: 6px; right: 6px; width: 30px; height: 30px; border: 0; border-radius: 99px; background: none; color: var(--line); font-size: 1.15rem; line-height: 1; }
.qstar.on { color: var(--warn); }
.qstar:hover { background: var(--sunk); }
.batches { display: grid; gap: 6px; margin: 4px 0 8px; }
.brow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.brow .bexp { flex: 1 1 150px; min-width: 0; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); }
.brow .bqty { width: 84px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); text-align: right; }
.brow .bx { color: var(--muted); font-weight: 700; }
.flabel { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.bline { font-size: 0.8rem; margin-top: 3px; color: var(--muted); }
.bline span { font-family: var(--font-num); color: var(--fg); }
.oline .q input[type="date"] { width: 150px; text-align: left; font-weight: 500; }
.wo { display: inline-flex; gap: 6px; flex-wrap: wrap; }
.ing { font-size: 0.82rem; margin-top: 3px; overflow-wrap: anywhere; }
.ing span { font-weight: 800; color: var(--accent); }
label.check { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; text-transform: none; letter-spacing: 0; color: var(--fg); font-weight: 600; }
label.check input { width: 18px; height: 18px; accent-color: var(--accent); }
.till { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 16px; align-items: start; }
.till-main, .till-side { display: grid; gap: 10px; min-width: 0; }
.till-side { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 14px; }
.sideh { margin: 0; font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
.modes { display: flex; gap: 4px; background: var(--sunk); padding: 4px; border-radius: 99px; width: fit-content; max-width: 100%; }
.mode { border: 0; background: none; border-radius: 99px; padding: 8px 16px; font-family: var(--font-display); font-weight: 700; font-size: 0.78rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); }
.mode[aria-checked="true"] { background: var(--accent); color: var(--accent-ink); }
.till.refund .mode[aria-checked="true"] { background: var(--warn); color: var(--surface); }
.cresults { display: grid; gap: 6px; }
.cresults:empty { display: none; }
.cres { display: flex; justify-content: space-between; gap: 10px; align-items: center; width: 100%; text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 10px 12px; }
.cres:hover, .cres:focus-visible { border-color: var(--accent); }
.cres .meta { margin: 0; }
.cres b { font-family: var(--font-num); font-variant-numeric: tabular-nums; white-space: nowrap; }
.cartbox { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
.till.refund .cartbox { border-color: var(--warn); }
.cline { display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; gap: 8px 12px; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--line); }
.cline .warnline { grid-column: 1 / -1; font-size: 0.78rem; color: var(--warn); font-weight: 700; }
.cline .stepper input { width: 52px; font-size: 1rem; }
.cline .stepper button { width: 36px; }
.cline .pr { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--muted); }
.cline .pr input { width: 74px; padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); text-align: right; }
.cline .lt { font-family: var(--font-num); font-weight: 700; min-width: 70px; text-align: right; font-variant-numeric: tabular-nums; }
.xbtn { border: 0; background: none; color: var(--muted); width: 28px; height: 28px; border-radius: 99px; font-size: 1.1rem; }
.xbtn:hover { background: var(--bad-bg); color: var(--bad); }
.cdisc { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding: 10px 14px; border-top: 1px dashed var(--line); }
.cdisc .dl { font-family: var(--font-display); font-weight: 700; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.seg { display: inline-flex; background: var(--sunk); border-radius: 99px; padding: 3px; gap: 2px; }
.seg button { border: 0; background: none; border-radius: 99px; min-width: 38px; padding: 6px 10px; font-weight: 800; color: var(--muted); }
.seg button[aria-checked="true"] { background: var(--accent); color: var(--accent-ink); }
#discv { width: 96px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); text-align: right; }
.damt { font-family: var(--font-num); font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
.dtag { color: var(--accent); font-weight: 700; }
.ctotal { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; padding: 14px; background: var(--sunk); }
.ctotal .sum { font-family: var(--font-display); font-weight: 800; font-size: 1.6rem; font-variant-numeric: tabular-nums; }
.ctotal .sum small { display: block; font-family: var(--font-body); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.ctotal .actions { gap: 8px; }
.big { padding: 13px 22px; font-size: 1rem; }
.till.refund .primary.big { background: var(--warn); color: var(--surface); }
.sale { border-top: 1px solid var(--line); padding: 10px 0; display: grid; gap: 4px; }
.sale:first-of-type { border-top: 0; }
.sale .sh { display: flex; justify-content: space-between; gap: 8px; font-size: 0.8rem; color: var(--muted); font-weight: 600; }
.sale .sh b { color: var(--fg); font-family: var(--font-num); }
.sale.is-refund .sh b { color: var(--warn); }
.sl { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 0.86rem; }
.sl span { min-width: 0; overflow-wrap: anywhere; }
.sl .done { color: var(--muted); font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
.sl .ghost { padding: 3px 9px; font-size: 0.75rem; white-space: nowrap; }
.daytotal { display: flex; justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 2px solid var(--leaf); font-weight: 800; }
.daytotal b { font-family: var(--font-num); }
@media (max-width: 720px) { .till { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 480px) {
  .cline { grid-template-columns: minmax(0, 1fr) auto; }
  .cline .nm { grid-column: 1 / -1; }
}
.typechips { display: flex; flex-wrap: wrap; gap: 8px; }
.tchip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: var(--sunk); border-radius: 99px; padding: 4px 6px 4px 12px; font-weight: 600; font-size: 0.85rem; }
.tchip small { color: var(--muted); font-family: var(--font-num); font-weight: 500; }
.tchip button { border: 0; background: none; width: 24px; height: 24px; border-radius: 99px; color: var(--muted); font-size: 1rem; line-height: 1; }
.tchip button:hover { background: var(--bad-bg); color: var(--bad); }
.tchip .tc-spacer { width: 6px; }
.tchip.renaming { padding: 3px 4px 3px 4px; border-color: var(--accent); }
.tchip.renaming input { width: 160px; max-width: 50vw; border: 0; background: var(--surface); border-radius: 99px; padding: 5px 10px; font-weight: 600; }
.ghd { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; margin: 14px 0 2px; padding-bottom: 6px; border-bottom: 2px solid var(--leaf); font-family: var(--font-display); font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: var(--accent); font-size: 1.05rem; }
.ghd:first-child { margin-top: 0; }
.ghd small { font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; color: var(--muted); }
.ghd small b { color: var(--warn); }
.tag { font-weight: 600; color: var(--fg); }
.meta .code { font-family: var(--font-num); font-size: 0.78rem; letter-spacing: 0.02em; color: var(--fg); background: var(--sunk); padding: 1px 6px; border-radius: 4px; font-variant-numeric: tabular-nums; }
.pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 99px; }
.p-out { background: var(--bad-bg); color: var(--bad); } .p-low { background: var(--warn-bg); color: var(--warn); }
.p-onorder { background: var(--info-bg); color: var(--info); } .p-ok { background: var(--ok-bg); color: var(--ok); }
.count { display: grid; justify-items: center; gap: 2px; }
.stepper { display: flex; align-items: stretch; border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; background: var(--sunk); }
.stepper button { width: 40px; border: 0; background: transparent; font-size: 1.2rem; font-weight: 700; }
.stepper button:hover { background: var(--line); }
.stepper input { width: 64px; border: 0; border-inline: 1px solid var(--line); background: var(--surface); text-align: center; font-family: var(--font-num); font-weight: 700; font-size: 1.1rem; padding: 8px 2px; font-variant-numeric: tabular-nums; -moz-appearance: textfield; }
.stepper input::-webkit-outer-spin-button, .stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.lvl { font-size: 0.74rem; color: var(--muted); font-family: var(--font-num); }
.ghost { background: none; border: 1px solid var(--line); border-radius: var(--r); padding: 7px 12px; font-weight: 600; font-size: 0.85rem; }
.ghost:hover { border-color: var(--accent); }
.primary { background: var(--accent); color: var(--accent-ink); border: 0; border-radius: var(--r); padding: 10px 16px; font-weight: 700; }
.primary:disabled { opacity: 0.5; cursor: default; }
.danger { background: var(--bad-bg); color: var(--bad); border: 0; border-radius: var(--r); padding: 8px 14px; font-weight: 700; }

.editor { grid-column: 1 / -1; border-top: 1px dashed var(--line); padding-top: 12px; display: grid; gap: 12px; }
.fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.field { display: grid; gap: 4px; min-width: 0; }
.field label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.field input, .field textarea { width: 100%; padding: 9px 11px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.field .hint { font-size: 0.78rem; color: var(--muted); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.actions .spacer { flex: 1; }

.empty { background: var(--surface); border: 1px dashed var(--line); border-radius: var(--r); padding: 28px 20px; text-align: center; color: var(--muted); }
.empty h2 { font-family: var(--font-display); color: var(--fg); margin: 0 0 6px; font-size: 1.3rem; }
.empty p { margin: 0 auto 14px; max-width: 46ch; }

.group { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
.group + .group { margin-top: 12px; }
.ghead { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--sunk); }
.ghead h3 { margin: 0; font-family: var(--font-display); font-size: 1.1rem; }
.ghead small { color: var(--muted); font-weight: 600; margin-left: 6px; }
.oline { display: grid; grid-template-columns: minmax(0,1fr) auto auto; gap: 8px 12px; align-items: center; padding: 10px 14px; border-top: 1px solid var(--line); }
.oline.done { opacity: 0.6; }
.oline .q { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--muted); }
.oline .q input { width: 60px; padding: 6px; text-align: center; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: var(--font-num); font-weight: 700; }
.copybox { width: 100%; min-height: 120px; margin: 0; border: 0; border-top: 1px solid var(--line); padding: 12px 14px; background: var(--sunk); font-family: var(--font-num); font-size: 0.82rem; }

.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 18px; display: grid; gap: 14px; }
.card + .card { margin-top: 14px; }
.card h2 { margin: 0; font-family: var(--font-display); font-size: 1.25rem; }
.card p { margin: 0; color: var(--muted); max-width: 65ch; }
code { font-family: var(--font-num); font-size: 0.85em; background: var(--sunk); padding: 1px 5px; border-radius: 4px; }
textarea.bulk { min-height: 150px; font-family: var(--font-num); font-size: 0.85rem; }

.notice { background: var(--warn-bg); color: var(--warn); border-radius: var(--r); padding: 10px 14px; font-weight: 600; font-size: 0.9rem; }
#toast { position: fixed; left: 50%; bottom: calc(18px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); background: var(--fg); color: var(--bg); padding: 10px 16px; border-radius: 99px; font-weight: 600; font-size: 0.9rem; max-width: calc(100% - 32px); }
.readonly .stepper button, .readonly [data-act="edit"], .readonly [data-act="ordered"], .readonly [data-act="unorder"] { display: none; }
.readonly .stepper input { pointer-events: none; }

@media (max-width: 560px) {
  .row { grid-template-columns: minmax(0,1fr) auto; }
  .row .info { grid-column: 1 / -1; }
  .count { justify-items: start; }
  .oline { grid-template-columns: minmax(0,1fr) auto; }
  .oline .info { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: no-preference) {
  .row, .chip, .stepper button { transition: background-color .15s, border-color .15s; }
}

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
</style>
</head>
<body>


<div class="app" id="app">
  <header class="top">
    <div class="brand">
      <h1 class="wordmark"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAABjCAYAAACyljduAADgbUlEQVR42ux9eXhV1bn++6219z5DBkiAAGEQUBATHIOzlWCd69ThxFqrtdcWWlu1rbbWtrfnnN7bwdahamsLt61abXvNsU6oOJbEAUSJIpIwhCEEMs/Dmfbea32/P/ZJCIoIiBbv77zPs5Q8Odln77XX+tY3vh/hIAFzuHDx4uKBz8le/5ZDgtaJZ1/XFXrnIcs35lNm+uWXU7GKCoUsssgiiyyyyCKLLLL4N8M4WG6kIoLByc8uMMa9RgPhMPxP/LEsuE5ulW6DG9w24zKbwZpAnH1lWWSRRRZZZJFFFllkAeAW/lPeo2+FR0fXNH72id7es5lX54jM73jeMn92hrLIIossssgiiyyyOBhAB8VdMNOixTXGuZ/rHnfz64XPd/jGzJ5gxF+YPvPQh08r9ledBdpUUVEpQpWQJbW1KJ0DlxDV2deXRRZZZJFFFllkkcX/t1iwalWQucT6Xm3DjYc83MLmI1186NIOvuyVHW33tHb/hHmrnwHx5N/+VvD9x17JAzNlZy2LLLLIIossssgii48b4mC5kcVlZSmiOvuIotHNU0b74bgBd3M8oP7ZKIoW1/F/Xf5SvPIhtk8Yq+9UR07booeSoZmRVaSzyCKLLLLIIosssvj/D5VrwxYYtI23zSh7uqVZPp5m3yNdWv6zQ+Pvze6oR1P82Ze39f1P6/qvEQCEWWRnLYssssgiiyyyyCKLjxsHjRI6OT9fhiNh31S8MJB07C5FBEXEgCRh+mW/dtylTaPzK1fn3nlLX+d3ECVduXattXHjz8ctWrTIzL7KLLLIIossssgiiyz+v1KgT55yQ6oKVS4wy7UkG4CC1oAGgQXB0NpIBaWu7nGD/1oZv/325u4rQtE56O+XAWBB9k1mkUUWWWSRRRZZZPGx4KDhga6qCsv0OaUmwAYDAgqQGhjKdXZNBpQSjpWvX2xPkaiL//6oynTtmRR4c9WCm7Ie6CyyyCKLLLLIIossPhYcNB7oqg6Io8YXWEBCaSgNAaihQQzWGpIZUpNQwdF62UAw70+v7Pgf5vb8L15yl8iycmSRRRZZZJFFFllk8XHgoPFAY0axMbFxR3rp2AuPyfGrCeh1NUgQAyDheaMNCSghIZhlSgj9YpvvmJtr9Y/rz5v4CyJKhyor5YRQrnFX7F6XKmKKkWXoyCKLLLLYV9DO4N/+w3NqCBCp7IxmkUUWWQX6I0J3+1p19/l3p2/d2v/pAa1GA6zAJAgYFuUuMRRpQBNMTlMHW7S6zb3uqdJLHgewHKEQelofMGpmFGgwa8oq0FlkkUUW+4ZIBIhGP7wCTcTMrOm90cGsXM4iiyw+EPNQJYDy4Z+rAQUiPlju7+BQoJnp7ooKdw33FvxqxeC5jSmLIRWxlgALAAa0qSHcJMhxAX8OlM1EJqm3+rT/+XX9/8nMl1Ak4pRESp2yCYsVaDHjQHhRssgiiyz+/8OQkrv/MpSZiCKE93aNzcrlLLLI4gNRDewqO8IsQpWVojIU0nQQKNIHhScgHGYRjRI/z+3HhJ92X16eMoNSONDaR2ATgA/CdGAlejEqz0SvY8DVOYDPVVBanpjb98ZTZ/ScM5qO6gGHRRjlYgHKreJ3T34WWWSRRRYfBG1K02YwXOXSefV3Wc/Muj697/ozi9XozS9EP+Ujnz3NmbkATjalI4ssstgLFOmMwU0AQESJkQb6v9sb/bF7oJlBRGDmcG6svRwvPFaext/BzCwWvrr9Z/UqN4dYa60sARIAaTCnIDgFrQTKJkm82gQMDjK01EK7tm5PGkf8pW3i+VxZEiOK2s5rh1130Y7vX70l0ewQpOGHgMkMRwBaAMJlUNYHkkUWWWSxCwQARcyj/nxxKl/niqueuWP90nO/+zXC9XvnDGEWdRUV9O3KyqJLX9j0j1d6abQVIJ90+omgoYRmdq0Rjg0GsinSWWSRhacfQmcCVMQgoo0aZGjpasyeMIa+/cb2HQW+xFMLj5z1j8lEXf9seGDi5zu/3Nk25Vu+viLprI7d7VZUQDFDePo2PlLh8rEr0ETe7FQ1NLjLps0IXDL/QXHegisGf9PRf9OqQVzQkVbaNALCdV14Wi6DwFBawzSB8VrZ7LCp4ZLWiiCg+7Uvt6Up/nmEQg8tWBQxjcC9PYPuwJye3BQMJdHPDC09G0ZnZjWLLLLIIovdHmMAa/RZGm1mchQAH4A0M9PehE1jsZj6BpAfp7zT243RpKQBYgliQEsHMN13fV1WHmeRRRa70aaFAQgTnHKwvdOGZYk5k6T/3MbBxiv/6az94ee2znl16w2TZeK3cWNpX5tzXWiXrIqPXLD823Kg50+/PwVMs/+IqH4o7X5xaW3LDW8O+BSRJK0VSEowOwAIRAIaFhcGbRqjnFZWYry22AcGICR6teSGJE0CSs0NVgOXjg9uCLzJgHLgOgpwFEDaE9TkNWbJlrFkkUUWWez+4DII7FpJcuGksK85y6GQnAokhLYTbm97DnIkC9f0fCfCAcHc9YxjkZ3zLLLIAswMHhI3TF50SiuGFHAgoDmoNiIXXf10fErhrz2n8Zeu3nzyG3+O/1C9Uv8WXzfzmY/1fj9aBZoyzgz2WJGIBA/J4lAoJE+ojPhHJX900Z9e3fbnV7tHBSyRr1n3C226YG1m3MWeIULCIjvVkR6bX/SvfD9d1p92PR2YidJkUnMKhdtxUmH1V6c2/STxcvPxk45YUmyP+zT7fWkiEYTWBM2KtFIMIs66PbLIIoss3iWyiUEsiNykoFxraqC4aQXggrFXcbsowLdcfk6O0fC6M7OgaOvFOXpmioW2lBbEGkoAYpcLaQDZFI4sssgCO5XnoZ8VCQMEwxJoT2hR29Fv9AkH/Ra5T/WYk0a/1ba4fPuK05+tbU/cVPs013zMrtEPpUBfu3Gjr3XmTDcWqSJEy3V4bcQoreuXk7cDA3OE+Ov0m+VKdKdvX7FETMmPyWcaH7J8U9rtWejQ0ZonHVm7bsErPXT78o5RsA0f4CbJb/o1O90CBgAhQAyQEKxZ0iwf9VFO77J4nK6EWQDLFdCkyKEUWHGuxhQLAH74QF3LrxZ85Ypi+EdrBLQN+FxAaIBNQE8AbM5WgmeRRRZZ7BY24EhAvI4tiVNQYYOwd7T6RPwD5nh5VSR5UXnk3PlAgQmkROaPTU8GZ2VvFllksVuMrFZWgCU9K9tIAPTSuq6bl250Lqu1GY5t6jfb7Jm1bvPRlT+c9GrsntuMClTaQAWIoPExkEh8KAU6PTNHBhtA906rwrR7I7inolwnRhtGxfLfxAFoxm1kAnxD5vNP33lufsfxvao2/5fymA2zcjuPaH9y2pRZ+Zf69RnNbYNzNoILt2pBmnNBrtDQLGAICKHZ1DYOGeOvV8aopEMDBPI8/EN+ZAHSaaQIAGoWLFBnEfUB6MsuxyyyyCKLD+MWCu9TjgURaQC6GtEmAM3zlkFWV0EjmmVFyiKLLPYffczXuX2bc5r6p17cExfujt4uo/qNxAVHLbn3jfxn1whMvSG5U2ZFAE8WHWQKNAHQTBPLI3akOqoEwJpB5VeV5wDn8zX4ddFzLdsP/6/u+Lj/tiRch2hSkb/jvLGTVwJwLEFJ+6FKSceV9zDws3ruvycBZ/xzzYNnLt+S+M66fuuQ1mSO6NcGWIO1TvGUnBwxq8D/2o5B7hCBHIKroSDARAwCsWJlwZ9J+vA8HJwh8I9VVIhx7e3D7pOq8nIdiUSyXpAsssgiiz0rwwyK7vchxMxAbYVAeTsiKEckEmFUVGSTnrPIIov3IuT9LxYDQiUlfHPkP0bFkVbpmmVJX/78wCiirt/WNd4/u7fp9HbpCwT9KXT3JvPfRkXQ/lpOD3BH5kIRRuSjT+cg5pDc+WMJ0whhGeawQCSCSBWEqBauDn1BxkKVqKiABoiZIdeAJz7cET+6t7XvJGbfqeua2vIokD8u7ohDNidM+A3A0GmMC4qUL9G5aZRlOrNnHNJls7tq0qTgspNy2hpOp8kbEYbgKMRG5vGPbdt6xkuN1nfqeuVxW9MW4KTUUflwfvKZ4tNeeuLNix70zf5pbyqthCMlBGtNEKeb/c1/vmDsSTMjwSZE+L3hRhoRNgyHBSLZtZpFFllk8R5EAET3X2n+IH5WryYmiyyyyGK38oeqEBYdkVKOAahESBMIC7DKuKzqNd8j5d8SZydemt3EUwsFFfXO2bhxe94RS/LXbZq9uaI05NG3Del7GScqk+dXpQNMYEzMJRYA1MOmfozSc6nGGTYGOCTPXHyTmLaxzOq7dYXetvzVvNdP/X5XJa8Sf+me/IX6Vppf39J7xnoneGiLyIWT0nAVI60ZWmmG9A3LTLAShtSQQsA0Lfi0jUN8SRzudxoPGx14vnjKqAe/MdpfPUSTxMx5t7QNXFe1vu/G+kTB6NNHdS/5yynxy7+4LHfZk/2jy+LsKKEhpSZ2YdEZo3t23Hum/6SpNLZp48Y7fbP2g/g/iyyyyCKLLLLIIot/A7hSltX0iBlXvkBvffo0OgzAM4XXezppFEAYQB0IsV0rj0OVIRmrjTFKdxrn1758rdFqTBNv3f49ffXf/xD84ca2AYpG3QOqQO/xWcDUvGhh4L4FpTlPrX8o9eXZ/zCoOb/8rY7Ul15vtT/XaOeLQWXCVsSQYOIUE4OYJMAkduGwJmItMkWWmhksCUpRQCoalWNgqurtOWl6ztOzZxQ88M3kT167pna0uOer1YmX3ni49NHGwai/OfmLr547pvd7Vcm3nmoyfcgRDGaC1tr0B8V5ExJv3le29Yw7I3PjV10Vzp0+PdqbXY1ZZJFFFllkkUUWB6PCDALCGT00wqFYhRmrjWnx3+QqV4sAmVrtVnGl4f96jVfe61iWguCwA/f0ecaNV//I13hcnxObU2F/bAo0QPjTYzfmXX3xbwYfTdon1TQ5X/vX2oar1sopYsB2AWErg/3kc6VQSCFtSTBLEBOICUy7KvtDZPqSAQUFFhosBDNBg6XMFQpHW9323GnBF46bpv575h8aVz97wynpCIeDFkUHf1W/JrTondGV9SofBANELphclSuVuPJQ+193z1lxPlGtXsXFNJcWOtnVmUUWWWSRRRZZZHEwK9EZCjuK0L2N80tXD7Z8vbmzwRTCSpNhin0i1GCvkFkw5Uwwcjrm+fSdF/3aN1h76HHOnOicA6pAG2GGiEQyCm4Ew7kjYWZx7Pof5Fzc+hvn3gbnvMfbW+5ZMZB7SLtdxMKnlEEBqYQjtU4gKfyAaQHsAqxALEA752UYWni2hAJAmV6LAiDWkIIdHrSFfjU11lq7Oef8NY1tR33m8jnRyPf+9NDRz83VT7YcmlM7GNicIwZSLPJ9hq0hGeSyoAlGiiaOcp7D4h4OhSI8l8jNrsosssgiiyyyyCKLgxjD9WlEUgq9YMvknz7VveYLTelOmAa8Zir72LZDAHBdjZLc6Sg66qyBix8865erFi0yD/StG1EAkUjmAWIQAHjj03eas4jcOl5p/dy6+c5H1jV89Z3EODgsFRkkWbFUSABKgiEBIQCHPN5mAEyccaq/q9iaeaSR4Lne2VOqNSQJQ0gQc589oJelR03uren7n77pn5l379mbb3rr1T8O9J16Rd3lsu369GZ7UZ3Dio08gnKo2CebPjVl+pMVCwt0ybIIhUvCIvphimCyyCKLLLLIIosssviY9GiQUJq39rW5bW6X0iLpOg4M3g/aeAKgSbltbqfh9A3OBoAbFsxiLDzACjS8AkUGgHnhMH1rWV1g28pX5AvMufet7f/Nk83OZXWDlhZCksmWdFiAKA2QDbAxdAlAuBiZEUKA17pkpP6s3/2IchebgYkBSpMQtjRdyW/ZAe7b5n65f2Bm8emnPvq9Hrp10w2rbnxoR1H9qU4q/8p6F3ZxwLaOGCNenieo7vFVFwRvKxujq+ffn8ouxyyyyCKLLLLIIotPDoRhMLlCwgETSO73hTRxQAkJSSkAOLw5z6oGDmh2ghhJ71YUiXBtFezDb/ofWVXf+49Htqcuqxtw3RzkE4k0OWYcXmEgAWxlhoCXn+JiZyI3QWsC2xpsK2ZHa3a0C5ALEi68LjFMLJlYZNzzDDCB2QKrIJhAhjTEloTPiXXlnvHiO8biCr5i/Ff1S/mXHTXzpouL1dO5ut+a6ksOfGWu+StmoK7sQvOShqv8HGYruwyzyCKLLLLIIossPhkgAC5BqEzywv6SzlHmP44gEHue2p6eLQc8tdd4tOeO0Zec+p0EheAOLK03IpFKM7yx748PbeJPbUoarpSmkRQECAlSafCwp5k83ZvJU6KJAChAS0h2MDpHISAJpiKSwiL4c0VL2kFSKeiUBYILjSSgA66QkkCKwEoYWsDlAFzLhHBdBAWZzYkB55Gt8gSX7Ie/cfzpF51I1Pok849745tOcpmfPBFL65iZKoDBM7sg0I1PBFH/xo3X+ppmFqr5FFEIRygUKaUCzBATMbDbZROl+fu9AMI8z4igmkFg4jDCuGrYyCiEw9dhlg0sMICJcgkgLqJo4v2ulUlfZyIwMwiReZKi1e6CVavMiXPLVBS7dv9ZwKtMAJiIMq4DOEYRL5mn7EmJGTM0xR5WQ7GLn4Z5F47uKO2sHmAG1eNcazWecSuIVBlr8wJU7TevYwTzlSCvCRAAEIHBYQGKMCMmCBXqfZ5fRgAeeW9PcDhY1AXjxDHRQSLoebzMKN+Pe6oCUI5yjVitUReqU+34PVWhiIGYpp3S4SNpAhRmFgmsz2nA7PQWLOZTkBKFOEq93+ejsQ5GRYUCM4Ww3Q+8ZseoQn3U+4bBhHlVkqrKNeDln81Fy357KmposTPi4jSvapmsnr/3e20krzHt+m4EZ+KPBCCMZbIfPvN2OiUVAQhhILq/3fkYNA/zZFWkXEcQBSLzxJM4fPg+ymqARXMnKsKHT2XjUEjipMnWCgD5U3ao2Lh2/WT54btNSiwDAFxgLsaFSRAhHA7TvqTThbcu89dNG6djKHURiXh81CPmdx7CchAt+8UjfUFtD5XWxVRFBRSHIRD1Tq/9XYME4hJm6/iqBrE275cq8/AAgBmxHl0ZiumqqnmyqqpaRw9gF0auDEn0FAg0L1axSIhCFTEgBMQAvDBjkdgwsICr52fqgD6Ak3tfEOKQvKaqncqrigSiMaeCQ2ILCt73rF20sAxze17QqKzUYYpQFNHd0yXs5Xp/l4bEI/dfbSxkvtgygbqPKlSl5XVcixjvKuvDiFRVCQAIVRWJ0uICRvNiFcEH78HKSshQ7Ty66/KjZPfMQo7EosMyLhaqRAUq9Ii74/2Xv2HxJIolAOSimS/COeZr2KEQq1CZ96vnVXGmqyf930tRDYVIx2JwdCpNpDPK8xB1234sF9ZQAlAGeWu0Dgf8bDK4JSljpdvl32bdk/Olwc3x6Ju/ufvhzlGh+j7tygAbzNpbE5oAMrBrNSRnjgbPiyykApGEoTWmj5O4eJrZnc/YmBfU65LsbHvmtQbuS/cWjpkwuWww6c7pTargYDDH2ma7iKeTgGtqzYL91C+0Mkg5Bmwi+EibrTarZzf7jh1LO65l5punNTSs/9nh+V9Kdw1uJVroAAsJgIoBauEnZL2stls5hLs1EMGy0rrgkV0QfQ1bdns4qPwARxgDtJ/K00pUyfIqqKoweFFNjTxBPuYvlF7rczenUEf+yk5paUzXHnNMIDVWkke6uAcLb8R9RK4qN0KRiB9o1hFejCmdf8rB2MwvO4GTYkt4zKhcFtYS2tyRr2rDITW3uJQvWBBRLTU1srLS+2htVTtFyqvVnp5xdW0eow6orPyCNeu5W828MWq/29E/ddg9YkkvUNWQ5jyd5mXLlsZvQaEs5sethTU9Kczd/YarBWQpdv1dZes36ND16xON95QSUEH/s7IqKI3APh/0VxYAbW0+W2892Tjn9lK3fVTIiOXHEhUVsY++c2YEKCn3O8d3AD0oCxbgNVU2Y6V/dx8tKAAioaZUzaoy4a+toLtKz3QXY8HHItQJxFzNCrGYCKEONT0Fvm/PulmjoWG/rvf02jMJdTtfrm92gXnuxqfl1JlFekPVAH+QMr3remUCiJfNCxsdRXUciZQIlAOVHaVcOyPP8k2YEIhwOF1VVS6qy8uxvwdhGEx1WGHGSnfYqA1T/4pzzG+n04wGANOABgDXbUyKspmsTawwfEg71ftrgFdW6lvffk4Mumkurmlh1FrGt4e+5N2YBlShQcOzHqmqHAIR5r1V4qoaqtzqaRGFWIUIo4SrwsuMwxfnEVADAJhozZLT9ucZpgH9yUn8+9A1tIDLzesAURiBs9/KZSgmuJI11dTw9RtrVLl1mcQAhuckJ6dDV8RComCG30LkNiA6N3HAtmltCZ3YfaJYilKhaieatSUlqZYZF1J6zID0TcsT34rF3KrDnvbR5SsVqgAcoLB1AW4ST/i2GMnuFn0vh8RJKyZb56cn8vvtu7KJVTbODBFAiAAc/RDK5Qc5DWK1JQLTGtCdhIzEwIEZq3hozVww0MzlkSgCR50rk2uSqvRbIfVibq7xSsGZurYEMhwJudH3afk8j5cZtV2Tgiu2L3G6zUL2bZnsj5SsTXr6GFCw+FXjmoLfiS18ttPR3C8vKC5LRfelffQIA6c8Ui6Ki2eZBQWKAWD7ZKAknRZXr1guX4ynueS+KjdSBUXz/+/2IWIA0HZagDM/7J8C7WVJeMweWnr6c/u42gM+cbRowSrz0V9MC1w35qT0lnXPfO6vDf4HXk9N0AHuNtJMRMIafgBm2qUwkHZNaoaABpkGoGyI5ADGMLvTcvy21J0bjjpqTPXXDst97FjkvQasEH/GhKnB3pwjm/pzDq1t6pnd3NF5Rm9g0tT65Gj0uCmAoMBSEIGgUyCpWGufPtXolF+eV3TpN0flxrB4sXHn/LVi4o/vditiUJ+0xTJv2TIj8MgaufTu693bG0PWDVNiDmgPwi4cFvvbIYwXLDBRuljU1EKXlULQ9Ui/O+TBwx6nSotie+ZLZIaoAkQVwrrwustNt3W1MN76i75+0zMOPoBzRhCgNehPr/5H7gPP/yVZPdIDEAoRrrmG0FHOQAwhALGK93o1OewtRDqAnh0AdO1hd1rpM2p12QKguWyR2p0wXMuw6gBVMYLo/F4O+6fVdhjzj7xn8Kjm3+Ssmfj9+IeOZTGAefOMkm/9XtSFSlU4Ao5EwET0kSjTixYtME888XHrmGPa9vreK9eWWMWvneQ7dftmR0SrU/yxSFkmlFdJVM932Yt9fSRfO2/ePKO8vBylpaUcCoX03s07E3ayMhl72s9rQ2zNidF+0ip5HtAPuiEOQVaVfMWswjQ3up9NBMJhFtH9UPQZTOXLIrJ6/t5/L88LGzWDLTS3ZvFHSUNK8+aFZdG3Srlyr9/ru+ckbEQBjWgU2BuOrQPoCd4LSEYI5XwNzX17u++2Y66MH5Btl1lz++AqlxjyzoZBOLCyGmCmUCwm2mtrqToaZQw5NUiMEKIe49fOA46H9ZkwIAqvfdq8/lP3uiGEUBkKsbexdnlG2huvMgN037KwL6e81KnY2yic5yYl7ziLUJTefba/66vDYYu9Pcw/WPdYbnD2W/H3/s0n2gMtEYup8iU//p8VasvX7ETSlWwaLu2nAq3T7oTcImNh6cX3Rmde+B/zloWNfZFFe/UtT2+8M/+Wvx2V+OG3yw/97eqGV57tDBRaQVM4KQuMtIZlMoGIWAtm9t555r0S71ykzAzJgPAJ79+uRloAoBwYJmOckUYxpzArP75y/vTRt3594ugnQOSYADsM8Th4dsuOnrlr2lLzNvTxZQ2uL7BtwIESlg5oIpclsSANZYvQlIFNXzxp2tkdr/6g8+LOLvx48p9Ti+fSJ5D3mRAKfUEWFJwpjv/lV0/IdZMzDYPjrHZaKSQlkwS5Lrv3db/y5DMzz7f3J4S/6IkngmLukYcEjZw5MIKBAHOSmRkKYCKZAueykfQNsH7pm5HKetx1nU17bMcbsuoHDhs1K/+XHQDgI8I7Wo9b1TswjzRJzcLVUCQBGJSSQ8/iKhBpMx0MqMa5OcntEzEx7YUwhsMZaQAOAKoFaA7tVDA80nRQReVaE/NKrc8MbiwJjpkyg5StWe17e2B/UidcnyESpvbroC/gJ7s75MuvAjBIw4oze/J3xFzsToHmxlDggXUnCHtqxRH+cWOONsiNS2A/7kvBTVumD+kU3MTgxGn5m2ZhVHsrkBqaizCziODAK9KVzFL0tJyqEr4JjmWRy+TLMTjFSu3yDCSlNgOW7E8Orn14nd7max6bqKwg/VEpsnsyJn/Y+3LBYXF9/JhAwJdOu15N877CtfzkHbvsgoQpCwcmj5u25kSgRRCpYcOSmT5gzokREsQl/ODWM04TFJykRwmDvPw2AAomBRJuImkqu2dromtrzcK5+89X//eNjx3r80+clvZLU3BKSTLTjtbCFForV/gcoXtb+e13bnzimh4UhDRVxPbPycAs7mtcfUSeq6al83JzXNUvAnAGHRJCyJ06vGTJpo9EZ9zf/F8butaOvfFGVVNTozJ7e6/WBiPsGcYc4e9tqBpzdK51UjA3N4+Vq7VSJEgltMu8T+85c2Sa5KPRBdO3nWEV1ANIDe3xcDgsIpHIPu2ncDgsgJiB80L+QyeeM88yDUuZri0z85AgX4HP5JTZ3Jno79tU+9WTv9ngKZQhBioItF/vggDwo4Mrj4n385HCkK5Ip234c/xaudqESogUzFSur/HyMb1vzkME5SjXB0rJmsdh4+stp59i+cdOVkqBdCINwfauZACZ96i06HGtxmW9wdrYnDl2WVmZWVNTc+DO6HcZJMwb82ON7eWN6cT0TR0tgYSbGARDsiAdlJYvYFo5iRQPjC4M5pROmNnkcwYHpk+Y+PKpYnqr4t0szoyOE+awGPf2rFMKxk0/RAUCMF3tsnIzvlGwbViW5TpqkBtXFMe+0HrexJC7t/uMM8Y2caUoQ8h3I1oOyU13z0z1xLUyiKTLLNlWGkR2wBdMpDTVOtte7P7P3yeCN1wa+MOR3+z9GI2yrAK9GxgTn5oqqiL3iJ+unPazpFk8dm5+L3zpHU1u7phxff4xVmc8jpTtYJBNLaRJpFNErKDMAFhLQCl4bmJACwFlK5AU0CRgaQWFNLQm3ZIU3ML5sjFlnri+PfXQo4Ud1Zdz+l4Hbz1OFSfFfzn/Vy03X3PzX5n5gSfRuuit9txPr3in5Zp1dmByU18SWgYVfJZUDuuVTdZh095q/MkvTv31NyNXVYkzvx+jxZ/A9RLmnxrRWClzKEShF9+ObMeUM03IYU2SM/qkJgv5iOOUQ4868xnCi9c+/bTv7vPPT++LoLnkwgvF3Wta7nmp1SlP0SCksDy5xwxiCYfTGC01Svw9d9Pd11+Hu69/r+JXWSlLQiXyLJQG//DO3+nbR13eUcc88bHG3kvXNDZf8rmn1owOGHmllm+MobUeJmVhZOgXiaAdBZ0agKN1Z4rUdpMbSQpDMGxAMCzHThw5NbfNMJPvuIm086M3N/VeuaPu7/+oyRtEOXDfNKD2vqiuDS02Ll+RuqNltDol5XquPiU0SO99+jtpAywIigyAHFCqI/WTREvtseOCye+vb6k+afqERz5n4e0rWq/w/7XlrzlLuq7orZwD9dytD5ihG6/c5TCoeA32z0OXF0ZfSN27YdP2UjMwniTEfmiUAkIIEPvhug561sWbclOt20+cGmz67ba2JfOnOq8dTbQhCtANf30259aTnnRp1t3pVVxmLkGNGpmX/cFLA7SkeVHgAbWAK18j+95BlLy4TrywpS9p+gMKaW1mfJwZTw40mASgFSzh4DDLXnfVaYlL3q763ZZyZh+IPjb2mzDKRRRRPXuAjnn27ZVP1nOnaUrDo8bcK5/RCOhdZaqbUqy1s2mUz9/xg/oH6w/1TXz2lClnPEuEngVNTwQXTbooCQC3Prs6OHj20U40Y9hUVlaKSCjEd9Yvu+wv7zy3qBuDObn+AIa0PSYHrnZgmn4Ek/4Vz138n+ULsXDfvJOZzzJz4NInf3FXI712GpQDV0hIKYcPD6UVJias9Oknf/qzkQV4tjS2b4bcggULzLKyRVi4kNwH8OrMR15e8s/tvvThlmFCWj6kaadlKHgn/5ICYwaP2Rj7zI1nPpU7p+NEvsk3DrWJKEX36vmu40IzXePXANRkYZ/8+NvLH9uBHmExgWHAEQDt13Eq4LKNgcRglz8tGk+cUbrtR69UPv7zU0NLBVFb9MRC3wJmvQHgakDjA8LwdaWlVIlS9X3pm3/fy4/FEqPIhNxpQmohAKWBgTSOnDD1X8x8MQGJeQ1VVvW0a1wvY3nvsCw8z3ik8HPyrlcmur+tbMq757HH/zFI9myhACUl2CKQZrBSsJWLQifY/qtjz7o4ObP6dWRyafZLRw2HRQylxguRkLEYSH4Vr55R+cZzjzdj0O+XFhQTtNzFevSqoxiQhoEjrPGPVs7/1mU0b55xRtXP/TV02n4r0Ofynb6ZS5dizvap+uUTP289SBRn5sAdtbHPrGje+sXZf79t5tjgqKP6VRxt8V5oaQ55hiE1Q2gGM2BuNzG2cSwsTUik4ptmPvSN1qMmlGycNbr4rbJRo9YfO3Vy3XqM7jubJtgVt8WMBQjRT7beetemlvpj00gAxJC28B6SAWEA0vSjNDBt8cLv0MJ//LTEAvY2Gk74/bK1Obc83kvTL35p7B/+8eST9lj/DMd1wUQwISAZSEgXruvgcJqEeXNPueBb91c/deePj+L/U8rzJxTG6+uWxl9841tzckSy7Zw51nVTHOr41IT8t2tgTa9vc2d2djtFnb3OpW8PGofWdfbANgMa5igy7T7S0oQic1jV02BASHCmcsYmAsEBAEEmAzKJLlfoTscnRvfp+S1PbSt/Ycz0qqV/d352bu+cGiP3rJyFL7xgLO5ZXHPb5NveeeDT9mP3t9mhZzbp77+Zkrld/V3aoBxuTI3S73T2fWkJnD9G75//xoL72PwkTn4IENGKCgfMgRYOFq3sMzUUa2CEFkgK0OB8C3QiWYUA0Dp69D4XSRYBqbgTKHq9V3BKmwrCFhD2EGEiwD41CoNy8hTOY2ZBRPo9B3tFharjMB+2vlRdfeQo45fr1vzH91/c8eNt9pgZW+KFSPh8QBxAr9LDTjcgw9QydNpagBEUID3WFDzW6+yeKUTVBBgC61tS8Kf5YkIQJ8vWlsDFFz7c/fx5/J2jP+vviSFRF405iPxnzg5tjn6pzdUgoaHZkzZ6H2SKSO3CTQ5rvB+5Ztm2/jhGxfm0l7bv+N7K4ODfrj7lgVvmE21etGpzYCEXGz1Vs2h51TIJ7MwpjVXE1He4kloQH78qlSakpAut96+YVSYy4R2LYPom+c1xkzZv68chHe7nH93odv9ka9Nfvjmt+JZJRJ1uD48G7k4PoIYjXp7hPiFVXOCW1NQYOB5mbXvPtBfbhNmqchUSLgESUM4IbVR796UthusgWeBO/yxyp5XeE918aMEpsmrZPIPmV388TYzK4aXp5/pHbxK95qqW1Q5MvwR4/zSskZ4naQhDmDNlnGfW1rSdMsVf/JVntq5d/XD7KT/+fNFFz5/97JeDz539QOLGmfUuNsGJjtjQUSH0XfUvFG8RAzkNg5sdDLCENr0JFGmCyRrCL6bp8Rz0+e2RoeZ9hNUS78p9LbVRE2tmIWmX0ml2McM/3Td/VMGkKBio3beJ2XDZZVw6qV4C4M2bt5yyKWfg8HcGN7uAFICJXbIW9AgVStnsFsyZtbLpXydFq++PXYvjfJnisb1CD2yjoH2mCyLH2Pj0qDrVKtb31toQluHRpu7ny2UAhgKkHGOYgTGN21YcW4i8S5Y//k7Dj9bE/nb5kV/4fQlRy6oFi4JLJi5w+5c3yjtOmZp8v8vVolZSRdT+/upHyteKTrO9p8XBEOUWec4CaMFwIbhHnxbDW1NBx9UNrlqgMG3xPnmfO0qLzFa8YlMspn694ZF5byXfPLyTOxU0EQw/MJjeGcBTzHMCM4uUsidHCa9VVpbuPw1YNMIvLFrMqKkBz71FfHf9uTPflu3+bV31aZDf9MgDRryS4VANaShXBMccd+pGYCyqq1sSTZs/FDNWB2r1rU/O8JXec098AS/i0uZnF5z31M8u25TqLG+mfqT8aWyItzCkZvgkxIgZZi8MOhwp39HZ5sWbDPMwUxqHbWupOW1iVz2edgWsd/xb5xcd89jZ/MUf1EZq1RRxqf2NV3+/4q0tbx8zmGp1YRgSQu7ctgSGC/hG4ctP6Ib/+QwdsirMYbE3Xv8Ih2nLozW+1Oee7O14+fSLNxndM7Y3N9swDAMMwNFejw1TaAymaMq4MXUl446uDc87xP/K6kKNd2eGE7IK9cetQMsrXf+W4NyWs+X2H1/skKaJiPMtp+RNu2n5egKeJgBLme89rm/wvOXr41+tjecdu7ZDQ/sLmFViN1Fb3uUsGt5h2gVTGixMAZ+FHs26J5VPWzgwv/FfzaeuOHzVrZ+5IvfuG4k6whc0+R6eHldLe//edE5Z6e2Tjg89fuzWge+8uiNw1cpBDTc/7bzh5PtLN3T/gHn5lQsPMLffx4XSKmQqNGFKmStIGkLKJJiHkrg8I1Oz4oBkYtIf4jlbfa5BDgUlkQshWIuhdDYSgEKQJRwBU0h4vmm926gWRfXjXOrevHFe9Imt+rt1CQKYFWQhhJsm6aZIm0KMVKCl1iPDVnB1kiEArSUTNEghwykuQTY4SQJpGsOuA4qPtd1tQO5552Ewbgv/8Qu/3odQSG5BjkU+R5pQQgmGVBBKMugDFeiRv/ftXKUasJIOK621Sz60pzXabRHYnjvqa5tf3vLZ+zr7v3HV2PyHn1395ZwxG2vScxcu2pm+wUytrVcEk9ga0LLAJYshWAtoFnu+j90rA97rlwBLsCu0C+JuFUD3IAPaV7hjK9/Y2dNe/grzl09dTFtGM4v5me6bzKC9LTQlAp/UeJL847IfUfLG54v6Xmq7Ls2jmQzP16eIQJJ3eXcEQCoF13TVdgT8z72VOvG3MTz35HWdFg69SAMfkwKdqY5K+JThWmBhSGkaUuj9KTkZaX+TF5p1HJu1ZXKHiqNjYANq003HDPR0PN64/uH/eGF26IHStYdaobe+MSo/FwMgJEe69cGppCRmYUoBHwnWRuZVa5AJhrCEmRacSKfoQ6ThaGnAkX6fYCgtWIihmhQCoFggRwkWya4e5JMOh8Nin4yrcuCRyN8UM1tXLr/juMZkB0vLgqFJuBCgEZ3BRjK1asNSW1UXb+9uO5OZHyai9L58bRD5w/NBQrp+CBbSJw1hCs0mmPReZH6/34wNJSM63ENp7kEPNqc7pm1d2/HjLd0tF8Z4x1UD5Zevi2xo1uWRq8SeIwOlIBJIDfTOdH2KSRjC0ELwCKocCcC2WPW5cWPzxrZLmHldJFLOF8wF7UtBXc+MLS7m1oCZje+8/vfPU0AQKQOGS0KTAMEathsVlIYEuz768AVTTNiAeTxICx0w+zc++qOz25IdLHNyDJnSQgv57o+DGBCAUELy5lR7UWzzP88CcN/g81s+VB522eIyvNn/MtfzW4e8ueYfv3psw8pL16tOOJTUUikmg8gwpCBtkGKGFrx7mUsEkwwIDSjtaFfbrE0XmxO9gGaYKWP6FN/YiwaAX9ZFox0M0MNHTo+tat/yH6u43+cjgiaRWRSew1CToxqd1uCqt2vOBLBq75/qKivlNqQruTLn0ldvvazV7WXLZ0lFJEwXcAMCbBnQNmNWwVQxZ8as38ynQMOCcDiIWmiEwwREGO/SuLL4GBXol50rnM/8eVFfm+VY/1jweLCyMa3PS4XsvOkwb5sck8AKHH4f7Tj3q7h7DfNT1dsHv74k3nz9C4kxAR0IKqFSEkygPb48BmkJoXLB5CnUQgsBQehnUv/qDVrbawd/1NnVe96OdPpra37x5bUIheAiZDy7uR83WIvruKzgaw8Wnffi2Lc7f/ViX86ktpSt3tzmfPr5w0snLyaq/5iLNA4IqDyiPDfaSgV7fIq1V6TJvHM2mTw9jIUAqw8jFCe4oC5oAKRsEBtemDFT7coyCYIL4bLznhAUg8IIUxWusqrF9NQ33z7tmppm57t16XyXSAtBAxLSBLSEsnwgDbDemYiiRnRW54xZQBBgFsSQXhWYUPBSnwEt/YAAC50ioV1RgLQMPma464tGpR6qDFsVPS0M5IB0jyYtvcJWzV4jnvdz+hLvcujvVKV5qGAXSdMgQlqSljAYMHzMzdKvHukMjkm+3fa/9yT7v3F2IP/eqmXhvBAjESMM52d3TUg7uSiyDW1DaheaDc+j/r5G5R5d45laAwWQLZgTENAwDB8EDN7cCbetPz03wa3POwtSZyMS2RhmFohEAERpr0OIDDqnvtk8+n/XJZ+68czJ7Xr7p5OOJFhSMImMWSpGOJYy964F2CRqcgNo7+i7mJl/WVEbc96Y0v+x1CEwg2rQQlEAVmowLTSTZsmaJdT+iIARf0NE0OwSgUm4LiQB5ANsp1/9K14nUxvp/lu2vTzupkNOu7142WV6bfmE9xqanHalckm7GoYwoVlmonQSxARlGdCwEDD9+3OzQ/9QnCYb0oRmwUITmHa+dq1cGOyS4pQGQ5SilLCXGjQDoraiQ8yJRZ1NkcjEwV77/AEwwYHQiqBN8b4rmIXAIMepflv97PojMbakMtxXVxHdr0JJhiZik7RrAtIEw4AWav8dbdKAZCKZdokJYCkghaub3BZ+fEfnUTmvBJ68oCp2Aaho9VH1J8rqw6e/7xeNO/54sY4I0iRbkEsMYkWZvUJDKRUAGxIdji3WN26dg1kQ0Wi1Bva1mK4MIcyQncDYtnjPaT3dA6CgIEozDMuAw0NShaAFoTc1QHZn2xEAEIvF9nufVVWF5bc6OvwVqI4/lFj9mSTTRWnXZTKFZJLQmnZ627GzPooZ0FKoDmNQNmza/Gkiuu/+hqi9/xse1FOxUJdXsr571f3/80jLmjM3J7dqw5RssisJGtLxwYWAgpHJLNYZjlV6j7jVxNAGg7UWYIBsDUkEM+DTzkBSUy5RP+BnhMWFTxT7l+SeW/10cP2z69IdFw+qhJIaGbcCgZUDYSnaxO14bUvtFcx8NxHFw8ziA9k4qhpcVNzj3NoiQ+vaG09wdFpL6Zea2Qukag1OMxspSdNGF3XOO3r+m755YaNmwQKc9au3qeTulYhGs2kc/06I++fPT4XuuCG1wH/TwIYZF3WEpsTsZ2ZR+uEKsr93cm26/+T89H1Xhe0ws/jdQtr+vUPybq44afxXzp+kHD+npOEkNGkffCwgYe8U8OQOV45wJktAU6bNNyko4VmJZDuSTIPrEz79QIM8dvFrLc+U3viXUGROhbtJL+FPv/rPdHja5wNXPDDKf0Vh3oOXlk+78PKJA8+NCTqyps/MW1rTcAmHIRCJfPLML++eCTiUYUoB6VWlaQIUYdjY8JQXgpCGDwBCO05GmMPGvhmctSZpgtQ+MFnQQnvKeibnGlBgbYHJsjBMI5CRX7UhE30nj66O3Oc+kU6ctna7E6nptyCFIwHH01gdgF0JKAJDgwnQMKDJhCYxPFgIkJCe8GENZu21qNQAtIQnmlJglWAyFBybBudgU0/ZmU+mMQtW7YwLDSxc7IxDr2KwGCLg1CAw0fA6056eB4YEaRNMLpRUUBLDw1MV0tAiDRZeHjWpIDQsKEPCFoJEasAAgurp7kL5dE3Pf3cxT7wxrzhe0l5rjVRp5lDM7sWAYijS2gcttCeoiaBJQhsKWqZBYBAbYKHAQu9mKO9Aoow7hxhKENiwYLNAikGWTJuD8YD7fAem/GtD30+iP4vqwqV3meNCHcEhiu29jWpv2tQN1NSode0th65N+CklLAY0udoHkVkbWgowSQj2fnakAjQR0g5v0cacp9y+8sq6mB1F5OOhsSPwlbjO8+k6lIarAQgoosx87zq8ch2GlgCT3CmVPC0KlPFYacnQrKEhAWFCsYBiAcfVEEQSfs0v96yhJ954/Od/T6z6VM386r67KPIeo4GkzxjyzjEYmhxocsEgkEsQcEGk2KMI3Ve30c6aPWH6/FozBCsCKbC3ugAIhtRwDMAMFNkAOIZ9UqQ49lsnn8H456qnZ6+JN03VSjHIJxzT9KbNBLTJEOQNJg0mDQGWdiqFDYm2E1/b9tjMT79cSCHmvU4jyEEBp4u2a29PM6uMguaYGpzJux56Toa3txgSzN7wbs4bDO++AA1DawAKjlBwJHt1O2xBu1KQNGRCpJwlba8Uv/raMzc/wDwufdljek96etEPfqC1cgMN8a68Qe2A4AW/GOylMLKANiQkCdGj+rE+UX/mG2gqBsIIV4b3KZ2heclEOQ7X6OWDdQWr2tdMcP0AsY9c04LDLrRwM+vLAcCc5DRUQExmZqOk5Jr9Phfnz4+qWO04m0D8dvPmQ+vNTmapFCuCk5FNRAwWGecFA8TeeyESYiCRoG3uwPyVumEGouChfgBgUBnvfdolg1FZyfjrxtjVS7e/cebmno2uNAQxs1QQcISBlPBIOFikAWnDZMDQGiYBQmsIHhoMaAVo5en9QkOThIKE7WhAmEK7SE0CBipQSu7sKYqI+LBDj3xwKueDhUOudKEyQ0sXpKRQSaV2WD1H3NH60onMTGWRiP+Dcqai8+erSq5E3ca3L92c6gAZBitSAGto0gAraFJ6TP44mlow9fZzUVhXVQ48WVycvP7u89NRRHVWhf03K9AZCc4UJR0l0pSpDmYARFEdHR6kC35VGdzU8MsZV9d/u/qyuUUXfml8os5v5ghFSqU4gV0JB3g3ESEeJpFhYjCrIRIqkkRiwAjqf3Ub4xa9mXzgZ42DP1p0zM09x8xdlT4x+rd0wRvT3crKa3JbYhXrQydM+I8vTEn98ZD8AaM1nvclRNjM0Lt9YmMYTJmJ2MXs4IyzYui42OmBbqnZ12YCpSloAZD2hAwL7xQcascu5FDsN21apDJ+lMxOj6n+6J+THImopasaQtsUcrUplXIFGUwAex41Hla4UmCRAOQgiBIwlNw53MxQEoYyYCgJYgnBBoQ2QMoCaT+E9kO4PmhTmv/C5ByqDXNtXkkf0LwbhWJo3vS75k5BwGEBrckNsNSaDZ1iQ6fZ0GkWrJg0WGgCsQaLFCBdgBwwbLAGGALESkJLty4eGP+Lms1XvzV3odNrdRhDh8HOzZQgpl3f2/BQBsAWXGFACc1Cv99gBttMSLHUCqarIbQFZBjRSNhwiSF8hmxLGfrVjYOfeSTJR1x//vXp6tJyNbIJzQfbb2GyV27RYDa2bum/sF8BJEizZ454yp+gzJpR0DSyvJUIUusWWL5/re8+hipi9rzyyL+1gRHhXa8/MwQDUjELB2w6YNLMxOzZWQxtaKUN5WqpXJbeS88EJmj4/57MgjAE3Fqnxf9MzfIrF1UuoPOePtHc7V6md0U5dpGHvO9OyN35zWmIwS+zB3jY5tr5IddwQeASlOy1YRUJz5OdK7cxGLLNbr2wjxMjGgB4HJTsuoDjQrsuWHtpFcTsuR9NoXoNx7e5q//su+++Po0P4QWld+3xkc/ofacNoW022NYGO7vYzwRo0syCmUEMqRhSeca9KzFsqCowJEyjLd7lvrCl5rPxdc+durhmsRuqrJTvZ8HFYjEXgL1pe6OwtcowpGXoHDKddWhIPhDrPicx7vXWzZ8GIoxx+9joa1oDyrlcrVj39kW2pQMgdj33764LnuAph8qSsIUeDUDVRe/5MB5KjkXrlGadV1tb9+m2/i6ClMQZG50Mr1mFdBUkdu4XMEAaQgO8o697UtW2zccCAGpqhl4q1yCyl1Eyj/lmCTpnvvxmzU/qUk3atKQgDAUUKaO0e0q8YIbQGopTzIarXdNRynKUMoeGrRQppYg0C9IE0oKgBYgFEwRoKH7HMYS4Y2aRBiB/NOPT1TPGTHyTyCBAK+9d6+GIHBkWmgY66PXaNeUA5JMtNSi/N+x7P52E2aOvewWNhzR0NJ2aVElmrQW09x6ZGEoKBkmaaRWmzjq1/EUi4vIIdLZ48CBToPcWWoV0NPjDjthrxw5cHqBnrzlp0hfPGef0B7lPsiRNYl/L33eKRwMSli2FpjH84g4/P7Kx/79+s37g5/KMl9zHvuLPK/yUzcc/FXe/9/KAfuCqkq4/HrX12otmFPzGsXsOeeylZ4syi/ITNfnzUC4QqhTAWPLYkfceG8omMjSLUCVLMBMqWYZ2M+ZVQYYqWQKQmkZM+C6H+VA3SQVNSjg2C4SHXDnA9smVVv4dsfQaYFJ7wveFHcpiEiBi4Xl+SHjXIAVQGkLlgHS+Rtqv4BrKEdrd03ApMzL/1qRcV2rXFq6rOK0U/BZCESNKpU6+PZYBIA+5e/WylVDk+pTQPkHKyCFX5pErc71hBkjJUaR1UGshtBIEZkAwQY5I99AgmCaJLYM+ru2wr36G22euHo1B73DcywXPBNIWiBks2Pt+Y/dDGwHSsMgVfuXInIwXzfUStVkBmqFNlzQsrkXh6Dc2dv+QOSzQU2Yt3/49394r0BGORb89+Awwc3vcOLMnrSF3iXkSiA2QIwBWGS+TBNgAswCkRJMy0TYozmfmvOrqXbvGHSxwJcO1vAwKZQ4NEsogoUwSacsQWppCMZFLrN4vL9mTU5A9NMhr2xsvffSMFcc8c/5KJ3MYHpTQUPt8b3Wl3+LXfv7P/vVA0ea+lgt69AAkyV2uI0hAZvTGkaKLAZDroDPdhzW9PeXMPDqW6Vb5UZhMLAHlI3J8QjjWzneqTBLaIKENkCuZbOm6rtSa8D4+HmYSPhP1vm7jjY6Nn2NmEaut/aC9XTB67JgCdhxIfr8sRgaIuNXp5zcbG05nhlHecN8+PWP06fsdAMbWRO/prek+EIjebzYNkhhkF6/XvVMAAK+Hz9/vAvswLzPC4Rg/DhzephKfcoUaKtDw1hZrkJQQLkPq9zrNSEK357jY0LrpC8yMRXMXuuBlhtftdS+9pxUVgpmtpa888pO3dPN4bWgGSOjdKDKKAGKtpSaGFSTtCGEkhMyx/TLXDuwc2pKWIkEshPD5hWuQ0FKTKxzXIUdpudO6LVsMhMNfMRFB1zETpj001TeOoFxIkKeskwkNCcNniB6nj1sH2256tPvN4ydOLEuVnh8y3k8hisCLmL+wftUXG0RiHAutJXaWnCjhTXAuAuKwvDGPhMxZb4JB/6d4n/8PYJ9YU399Y5WDsatk6VdvVDd9dcqouUTv/Lmr5etd2vzj8lYabXvuG+EJ1L3RLIYyiQRs0pAGg7VNZsDE26256h++9I8i2zvpJ5MKf3rfkkju9Pv/2nvBqh3BsjLgqqt+ZNx33303/7xt3Ruvk/8wANsjXkrEQa5FM1VWVojQMacZNGt+2nNxPJ0WOML5IK8USU9Ex8eBP7e0W1afT24MXsWf8row7smS1z6DXa9UPwAiG4wMRSszoC2Ak7AMVwVM0sL1KB22bL3X/+eGcU70duB4p2X8oA4WMflIaoaGhCsZxApAKlNBYkO7pH1QYvwoE4YmuHIfZDhpaAgIzTCFgXHpBI3B1r4LUvVGZNWTXG2fudeX8mtgLLkplR7odoUpDWYhoImJmJhJsa0EBWSO3xzb5ybR7uYzDB9J1wazkXHlsUeBBVsg5dOtBflTNsf5s9W5838NDgvsVWIpg0hDaoKpHORZ8UHBKqVVJvAwZPxlDkWhSfulKEyafrMtqZhMk7zwqAAoCDIUABuGYmqDxZtsnAycVlCAAvdQX/5eh8sjGXfy1q6u2U1uToFiyYZWAiN0JaEE8siBZoUBHvKreZ4Xw9XCZYGmQZ77WCpVBqAq02zhoNpxlisxisxu0yWHWZIWlKG0l2Am0myx1HCDPv/YlAl/a7wDZBqc6Va/i7hiQxCxcrcb8bzn62svZo6sqohVCODgbOSk1b4r0CWhWo5V1DiPv710xsb+lglKONpQUmgCwBrCZ4FsB/lmDrkGMJhKgEYo0X5tiKS2Ud/deNp9O6pmA3gtjAhFD5hs3hkJyUn72ZJmh3aVLQBh7kL5o1mSYZBh+HP9OXnN6V4MUlpLCEGKvXKJjNNFEyBBMuH0453+HRe90d95GKLRDWEOi+hQoVbGsGJmIoAXb1s+K93bfzSzBkjulmCPAQhpUL9O0baWxk8ByLM7R6X3tmaHWdNVVdPMemBsS1/H8TYcCJZi944ozwPrCIU2HXcAyBNKc4xt+zvNtVWiNAquv3rV0X0BzkXKVYLMnbqyJLCjMHPCVGxta0La2NlmjUEQBNFl96K9r/sEeF6ijnmAAUTc6g9IP5jHy4yiWDm3/57oCWDSa10bT+0QCQ4oQUoQmBhDGcbEAAsCs9YWDDGe80AJf2vZzJJBE7RDJRNx9kKKgkAMU5u+XN+Yho6OiW81bCQrNyD9Rs7YHH/A57ANI81BADqMKtGCjSgNfcaYUhejlXMu+d+Xm+oWbIs3zRAMrYGMIi+glSY2Wa1Dl/XmjrdP+MXPoiv+UHxherfNZ5ipLlZBzOz/0nO3f6HB6YYBECnOpCFm2kMpjZmjxvNxhx72MBG5YWYrCrKRxT66aD0M5hXTyHdwIDz5+6RAx+6b7xyDw7gS34eFw1J+XhS8miZWLupOpZi7HqnebsEICNaCiLQF9wPJMbTnVdN+sABcJAGvjp4MKyBX7dAutHFzfqKVayMtkbpLbxpz0RHFg0siEUV/vd+9//77CUBsKLMhGj24rTNm0FxabITGlch48fbRN2/aeoqd0MV3bhEmszUFtg3IkYWC5KnHLAASYPIOwxV5c1XZ1MqJkbe/fWq3MItG6zj6U8G4Y/qxsxmTZGgFQMJ1mW+qXW9uc8cUpdmEcIikkIBgKOHl6wllkA1GH/xHfvfN2i8PDto8yRTpdnPzsvwOX4KB1O0DekZzb1xAjIEiSd7ySQLSD78eRFpLQOViRg6L00anN06e6FQZg4aTVsm+fYl1eKWNzNI05Wgnr/n5LQ3xJc1RRGbMIAzEM4s+6LKO8y5lley1lSehwY5WRYVCXn10zv+eM3bg+hWpQKHPbwuJ8YQUIJAmF+tcn/9Qs7/Z+PzWHnXui9vT89amAZZpaJXjzSUpQFuQHIAy4rpRB2jNpoEZBgA3sodt6yVgZ5piaUAouIJ0PkNcNpPuuqB0+qK6ri4dCABMQaE5oWwkyUoG2DK6fGk1/oStzX0VL7YGPrumywfX1PBRCrbthzIkDG0CwgGEpHe2tLsoOyrdc/4LquXRQbGXi5GiADMz/eCt7Rc0JQMgK6C1SknSFgCGMG04tsQ5MzW3bOvnl+xiIYQDLWwI7QccTYKVapQFees7kqUAqipinjPo31nUO8KKZkDTRHts/GeXfO/i3oKcBp0yDMWDKi/guDaILAS4f9CnVG5TOq/XPa69o+2ry9avvPS1vq2WkmlmdmgoUEcEuC5ApqQeu5s7e1uPBCBiFTHt6Rvj6KA5NzL1E6z2vbVMVQSCEca1PQ0nd5ipAFKshhgWKFM4pW2F06ceO7At0elfPbjBJD+gM3vFlUTQKdVlDsod3U1nAnjtyZri3TL77PuTeUY/MVhJUCGN7bvtsh+fWYspW339Tb78fGentR4HpJHIc2xZ5NZu+dSavo3nVg1unLetv1ULC0ILB0bGh+AKQGsmJlK9Opn/atvy8wBsKEXpkNVIyJTVUjhMiEb1utb1xTtSnQIByawlefRmOxXynfKMhHY1d6a7pj2w5blTr/z+miXhGyNibwyKilhMxCq2pWbV/vPCFuoeA3YVsZkJkCmAGEIP0QpqgBSBXYzxBY7o6akpbj8+3r6/myg6J+ows7zi1bvO39bXCClM0lp6u4EzSSM24/SiYweoj/LWpreDDAZDA9r0ns6O8+b+lkMebHlrGoAOAG410Qcy9Rxes5Hix0wKvlSN/tPeii1sUn2HsKu0K0hqdsHkpQsKL9cUGswFnC8unHnCupK8yYtHTTryqePyDx2YFwi0JpNJAmCNsLx05piRt7Y+RzRhTsC/vbWkv6P10wMu5xPb7c+9DX3iYUm5ctZyCpXeH/9+zlbfZJnfeFXNH36/Mdl9e2uiSRGR8FhhAOGY0IZJHfFWvNVY/3Wl+x6MVdw+QFy2sx9COCxqWp6Ud1c1yDdQop/offqU2viOozjdqwPSEoOeQQ/iFIQmxaZfTDPGvvztKRc82znvK/4IkI7i/zI8snqttWR9AFS5TCRZZK6VO2aWxBBTgVeEhQ97Ru2TcA0BGtiUsYA2YXPricFrKpflLij4/fN9h335rrh2vvtGR9Bl4TckOkFkvk/kjjPUUSZACUCkIHQAQNCTUWwBcGAETLmq2dXBPvcHXylatHa0UfHCb6q+E1ga2ZDkiBdqDVVWyt21ej4oUTVPLloF0NxoagOzXLet4TcvxsfPMNM2HDJBBoHZflfZ8FBjCIYe0HEBYPHcGue2wRkl1c19f3+zy4EhRkGTH3qEE4x20SwJDiRsWwKuAUI/uSQA+CA0A0JDUkoMWuPweKs+0efwiWQCc9C66Rtzy05oeeZ5Q1SAf9HMPuUqAWuocaDrySGt4TJBa+ICJOjSYvH3nx9d/B2gfMCgl1LqQzmevIwwhCBw00TfPhzCnEMmctLUdhLN6udQZRyxil265VVySIbui5m1V13zu6nFX/vzYfkzvvm7N/p+soEKJEkthr+JCFo5kIaBRJxoi4rnOcxEkchId9gen0CTC6k152qNRH9/41lEjZzpar7TaMiYlV/+ck7Ng+v++U3+x9O/HW213VWTvnqrzpeKtACSAGV0BBYEx2VfwDc51m8cGXst9NqZTT17tae9c4f4Feap27oS53Y5Jsjg4fxGEMN1iAu4j0om5Feb/TmzRIcq9mwbSWANGBIQAh39KWzeNnjJVuY/3xeJ2CO9dQeDC0ICttXHO64vnLJjt3KN11oxmmsDWCalWPaI+8Zj4Yfu+9PbbvPogOHjpHYpswUhpYAChOMq6unuP+UfaCwC0MzMFKmq+uSfYcxUDagtEeQnqn/7uaQbH1aWQF79imlDmXkFcuKYcX/v7u+bYeTknqWdAQUJCWYoeK1UB5wkGgf7T2XmAC2c64ZCIRmLxQ6IrPbuREI62hmdiHdFc2gQwOBuPtoKoB7Aq8x8z3feeuC+/61/6bNtqlMTQ6hMva7ndBDQts1p5aB9cHACAC99u4J2uedwBIhGAf/YMWMpaA7VQ9Me46xC6l4eNN7qbT6dmZ+KRCJ7tXZjFRWKmX3fXL74zPb+dsAyAJcy+be7/S4BAMne+LQ/rq6ZWH3Gwsa96KD5HoS1x2X8KLYct2nH1k9rnWIhBI0QidBpW0/xF4nSSdOfWrNj64nCaZ0O2DxkwBEEwTTdLrvPWLH+ta8x86rySPleff//zP2Gw2VfBzMHK1647aye9ACR9EplAQlTZYrtBQDSerTKFRdNOeqh35xwyX/WYtPW+WKmm4ku0NyFC42aqw4XSBcyfN2EO25wERtWpMAIpQixlwC8xMxyKeqNJ/qbcttfLUtX1t2SAoCrpk2zo9qls445fvnmLZv7m/X2PMs0Ga4iTXIo91uw63Ct0zvz9xuWnPatWOmTodpaM4YMW1Mkwlu+V2fcP396ipmty5b+smJTql3CkspWGf5R0oAgsAOanTuejj5iznMAUihKGJEIHZwRduYDIuzLI+VUxVVi/pIf0YGS/QoMRZBhZtHQUIUqZoogQpGhTjj7kFo2lHYTwc6upfukQL+bX/bZlgfw3KgbueaWf1hX3NTyn7Y9Jd9QiauXdzsupFdftqdQ/U6aBwnyirWGVRENhgmbtJWD5YPSmLC66d4Jp/71/NV/m728AeV0/nzvAT4xyjOASFW1boncJufNg9EL5JgilwcSSQ0/tMEpydr/Xs6docIMAtgU5tCUmRLuQJJ1X9qnYbAAKUDYvNvoBQFCjYZlQ7BMI+33ipjIkfAKJ+JQ0gUpgq187FKuUppEu8gZGIXqgH1cql//BeI3pvT0IvaKEUEOwAKs0nClAbCgI8cqHHJ03h+IqOOmVatG/eQ11yqd9TYV7Md8tQ90i850c2Lhsq/oiX8fYAzcp/MPzdnrBe8IRtpEAMy0sLnZd2Y45IZL24dPnqcafm385c1KTjZUuT8PXpb69g/O/93qxpvOae0LnNLvJpTHP5bZZ0LDNKRMuRakEmduAyYgGm3J8OvynoPNBFI+QGvS7EJayF3GbCxcXENlZZDj8ttFsmmlGmoaFomFnMJzJgQGyscmTq3iX1Rt2vbZ1k5jfJIMLa2U8JoTEZglQZiqH2be69tazmces5IqWAML9zp9o64vNXu9HZjgWgEIxyGIjOecGVqbKKYWdyJ3/tcGOerKPEt8pc9mDfZJhgMmQLAUgy5xS5LnrQOOjEajbxDRwVOPoBlKCKu9wBxzLm9sObFqpnqyHJSsrSUAsC2LCrb0+y9oajICPT1u76+WmhdFjnvs4XnL5m7r7r+5L9WjiEw57Nkmr+AUWnELOfkDTnomgObI/yUSViJeYTfMWdu1rTTpxCHIJ7Az3Zldh8UhNIpPOXzWM/He+JF1bS1ndus+QJDXldAgiDTEYGoQq5sbTn0Ag4dicc26Cef2GRiqUP3wLnaANVxD+LYHk6O/snVrt5rWJx/E0eky1GTeRRnO3PJCcKCxR3X4oCIUSVzGP7zh9Y2rT+pE7wSQqzVDaMrE4kmDhKDuZBw7+ronC0Nid+wl0Uimiattn+IaABxHg8T7Rn5YA1JIanG6sS3edR6ASDQajX9Qy0zWnuLbABQ0DLSfOoBBSEfSnsoMNBhIO6wMCeeQKUWe3rY/qY0RAFGsqV9f2pGTHpXuTSqL8uSIy7Agn8hNUPKkoom/eEGOut30BaannZQWmd7erAWIWHapAXTy4LntQE51tHowo3SJPXV7/Gn4pyJaVc616Bm7NdVS5MgUoOExrUCAyB3y8muDpTgpb9a2X33qyzePo4nbnvzrswEwu4BHvxpZHHFpMTnvEszDjKKla0NyXsc1FFjziFy4cK6+bHGN8v91dWra8ZNErLyaQwCiRDrMYfFlOmblt1b85bENLW1Xtqe6XJbC8Jq2ZN6JT+pWu896s2ugAvyNFxGLJUeew03LzvfhjljyLWBqjyE+l0SCDZCwkSlKlC4gSBtkiqkYtfWcqXMfISLceee1dN31QPQglRcHSPi5FCWc/M8bUzgg5egMRQzNUP9NpCc3Vg4ZkpmGY7TvFwQQRXQ4BcT4MLd39gStH+/qkkuWL4pHiVxmvqbfbc/drPoubRsc5xKlDIaGIOkZg5qwc6YZEBkPJpte2IfcjIPRAZveISzIJe1j9Vx/rg/Ld0QeijScWV5erpnDgj5hCfXRCHMIoKpyqBb0pNMaCv4AYNhAMtejBKLU+75YaWprSHxZjLgUIAgmZMJIrAI7Hay7dAL0wqspfwokHUAbQ55dz5PDBKHzQELBESlo0QuIIFhpDXAyVl1uVwD616zTJI1M0VCmFJ4lpDRAkth1NI0ybH04+vt43lf8sS1bkqEZL/DSgktEXX39Ps9Xvpkid6YhNjSNoZ6iMqekqsounBbPUED10QduMsWQikgQceKvz9KMZAFXzHnY9WJ4mrDxuiA+1RqnUKW+M/ZfzqmopYKx6l++/oFTWHnZF8MMXKSRdhywttBvq7w3MTAaQAv2wpNETBnebc02KZARsMoBdU9BmagpyyQUzzxv+GS6etatviUTz9OfPTRkTgE6i/yp5bnwfzZJAWbX8zHxkDNCMJIOcdowLeAr1rz2Krd6D/eyaNECs6ZsAVpqFoOZxY9qdxzXqoKAwQopLSEMr6pdai1Mvyj05a67fsr0f31nXccRE/rSV/ZrCSEYgjQUSRALYvbp7SLPfLPHncBrQ1ak4xpdWt7BIdrV4/9vEu4g1io/3ht/ZvTc9F3XbvRF58/apbnHL0JwY6hELFahwswiUgVx5mHHrlq7pgVvJbtICoIeypUFQzAIWrupfDbfWFV1GIDquliMSsaN+7itA+xkYfhwR1gmrxdPX3eddT6QrnrlhdO22t15MIQmJqFHNCjSlqQJjj9R7BMrjjv0yNHv9G2lLruVhPYoASEESBLAihvj7blb1i07i5nriMgOxSrNGCo+RB7nyNwIgtTaKcLYvvunT02FOSxAx+iaEZ9exdxPh3p/c3VjY8GJ8DdMGz326bU9rVcPajXMIziUt0/erocDJmGY0LXt7/VoRKMsQegc7CpIIw0JI+Oi5t3rqcQQkGSTw7XtWyc/bG+aBqB2wao/movLFrjvjtYwMy2sqTHKIxEGkfvP9dUnbO1uGqclsykkua4GDb97T457DikGCQlJpJM6JZVSJwBYEolEOBqN7tUaWLr0OmtloFC1LFxIJIRuj/eWtLsDgCHhusrrjOdFx1lD0+QJxavLMLuuaNSrdYFBPtNh77141dgZES0V3u5oyKlEUzGA+kWrFhm/Qb3YBLxvk53CwhPNw26ahBe2rDhqIDkwFtplAXOY40gJAZM1u8TITZnJkqmH3LEe61v+ftttPnHF2QJXercZRZSju1M7RxhxdaUhJ/MO3HnheUbVsjBunX90MoYYPbXsK2bF/PtTIzWow6Ye+kjB2pe/1OZXUpgScBmalMcKQ0KmBwe4vrPpsoex8a5YRcXKecuWGV/6xz8oMjGi6sd8nphZ/OD1v366dqBxnHAdJYSQyjIB5bG4KsU8ysyFMb7wztOoeN2CBYvMiRNfcIc7WR0cbmfy6hqiupK50EFzkQCRhNaADw7sES2F3N3W5bggMmEoE8p14Bo9SMoTcAT9Yvnth/KORgBM++vbpiEB4WoYQbP4eU7NakCvP8gd9iiYdgKuPwVHGLDf9wscmHpoiQrkkYE+10S+SGNs5+VEnSDA+HBn0x1J4I5MOLxSLmyuMRbNLPt6e/e2SU9q+7TOlOGYrE12vY09xI83pETvVE6GaIAyOb8e2yxs7fcYEUjLXttUy1MFn/rvusZfvPzyyzcunnu4iQORU/cxW2oFTYsMisLmSEF/bmpNfBIXCKm1SCgHXVbObuRvptGHZuikHrZmZS/s8TxIxZSWlvKBVQpCGu/nAoXWhF4y0U8GyBAZ6p+UR+nEDCEcuI6J8SJNFpIG6xSm614/UOxMvu1ZiRgAdrViA4DjhZtYZJIPCMRJgAwQk8sY71D1/fbGz71qUsUmG1j8ISfujmGvwb0NYTBAfYgLguE1JXsfoSJgQBIpDeCiK85OleEcxsJhrzBjFvqHtlvBolXCogrnS+98qdZlApEfrAW8tsVeZEQQQ7MLMvzohw4OO2oiu3vVNJx6471DNdypi5RKEREjzIwKes+peyUQ/3LLUTlTTylJM8MaSDpN2pIA0oDtg9AKSpgg4QDsYhQJykm6W4nuT4XD94nqPWjQZWU1+E1+u1iinrI2Y0FgS8vAFf1JP5CbIsOXC1d7QtwhcFDafERBXv/LLmjeYWNfXL21IbGBxuQI7bCUIIcBqRVAQd6YsLGxru5inIoXEuv7fLXNPSoEJA8WaW8hDTBodezHLu7e9ZcVMSigwvuhtlZH589xn+YdW3NWPtcPiHwFd5hjgTNFpRACKT2AnnRnJp8mhpa8Mz/e442G8l5515b0+2lohCpv8xevtwQz60ufue1z3cIBKWYNB0wZ1kZiLUyf9PkDr5wjT2l7PNXwDiXs7cIITCHtaoIQriOgJBEprdK+lGyKN30GnhBIhD6o2PkD36TYKddYQ4s0BxJjPAcFIvxuH93I1IU/X3FF/5+qqjC2cHyLv3sdBogglczQq2aoCqWCSDkwiD1dIFqtsKurmAEIG8wJ17ZdaUPbPk82ZCJD73FuEYEUCCTcuIVRK1cvPwdAbXNNs4m5kaHrD59lkUiEeq4+xyiKRm1mFjeu/vuXu3VCwBBKaSUFwesfnVnZPBQNhADBB7hpTvmSEBIl++qBzpvsBruP7E4smr/YDjHP+t2Tv/hSfDAJskwSpoSrGYIBrZQuGFsopo6d8DqRUIv6Vj7zcteqBX293X4E/JAMaGhoKBKa1aBIFTS9vfw/mPlHt8duN04t+xtv2sN91P71MV2/ahEveOWl2b3JAT98hiYNMbTehTZhcoK1ZYqpecXt8075yv9WgXSkcJ4gumFgX8/loX9WR6vd6mg1hpXu+TvzIqMU5cpQSIaKT3/h5ak1q7b2vHaishNakyGUcCE1wYKBZEBxfaJFrHln3Xxmfn3uwrlUVgO8sGoVxSK18b8dCXNz15YrW+0OkDRgCwBKQbAACZPh2PIIc2z6G6d84cWn8D1MXNSsKih28Og6zBQCRCnVgZkLP7vkF7EtvS1HK6VhSgnWTCP7wbKAAO++CRwBGqwVQUgG8Fd/IDhgpHwqrQGLpMrwUuy7q5gBaci+1AD+9tqSc55MPlOjFKdcgvBCOMwsMsrL+60JDQalAUjWMKUfWhuGYRx5yFGvMvPniShpHChRXkEVKrz+ieDixbc4915U+fmrrOZ/PNMUOKOt31Hk9wuwQyy8bnCZkhzoPZlT2j+cvqBhQRhKNHeQfi7A3729acu6RyfUPRjGIhElYiwLS8yPHvTtvBkgevWF9LJ5y4ylXVAzj86LTOhPFE3LHVewpCH+o+fbMZrIx4z3tswjAoQpfJ4XcZWpk1s2zT1EXVFiWROQHOwXWgsYuzeINAs92s/Gmq7Cmx/aak0gnWJGioYYibxsIIPznH66eCZvmDY19/7efh3PUeM3V2BOsjhvdB68akHsjmxAyaGiGYJw2dUHYZ5WbVUVhcrf/77OLCjT9wIoyZsw+LrU6EnYQMAChj1vAsRee23SAMHQ+78O9qmjpCRLFCp2IIQBmABrG6QlSJnMgAz4Ul0nHznlnXOfvtZXOrjnyt25c1e5BOLZz55l/OkQZ+b6eP402wpC2GliKM8wyniZiuDQGCuxEgDnIzGQn5dTZ8X5eNuVDE0kpQmoFASUsG2N7iS+8Doqf/2b/41sCkVCBh30jDjvRV1pnQKASZjUMeikegzTzHdZ7db3QyQghMT/FZTU9juP2qvQgERZc7pnmrITMAiCDQk1tNpdhSJfkI8+8qi65z//BQlz6pv3j5+6atP2jimD0mGCHsouBKQQfckk6luajnkYjdMA1H4EVsRefzJUVMRExNGGJ5z8tjx09PZ5/Pf7qDyASDNz7vxHb56QchyQkNBa70Ln56lkmSY+7HkoIUn09nVjoFiXNzL/YWpFRbokBCNQsIBrFi8elifRaFQjGrVD3o/m2u7tM3tEElIDwtVQUnj79N3bi7zUK6U1pXwSCXaVACEaifLexP4jkQiVlnamWteDwYzVXctP3R5vn6h1WgtlCMXay+MkQDCLMQMSM4+ashZgnJ1//FsP+h/dBl/H4QzWEiR0hlmIDEndqQGxua3h4hrgzhsqbmhZsGjBHqmZasq8o4tgn2BbtAtNEbHXQ8Imgk4xDh8/2Z0JuPlV0Mjp+EiP8BlbCkQsFkuddsYJz6x5sf6kjU4C0tr53tOOC4AxoAfwTkPdl3DkxXfVLK6x5zLUufX1FqJz0r///orztyT7jnddh6UY7sUBw9Vwcw0dFDlycrDgbxdgyrpQZUhGKXqwpakKtLcHKhAbvOOdF0/fONB0Rp1oAqT0zMB3ayFC7OlK3u81Q2hAJjMcL0FJUB4v9/4etBIKWirUJ7cDELkwZO4ubMEjGtXtXgdlgGxPgRcWDKHhDiZBbda5f+t5cy6Alw5U4wMGEa5amDeYd/JE/8W9FyevOrb48qtnuctOGpOUbMeJLb8iMsGQkMqAUOJdRj3vRt1MA8KLnghmQp6fa9rzRV27XPhbnJYXjcUoxCy+X/7FwCflkArXlnB5dbnevnyxOzip/sXflsz+07VTXvxDMs0bYeVihMa2ayoGEQw/+QCgYNA2Fhz614Hw7FkPnnPIvb+75YgjFv/q6NI/3nLEzN/tdsw+9J6bDnnxDxPZbclBGkoIzewDdGawCU2utoIGNCerb56w8Te3zJryh5+WFD3dXgUabffuUSkTmjK9TRlakhH8pEUGAFSEwD/isGGQGyCPJolGrk8aopFjAaGlHir+i0Q+hJIY/YC/rSwlAK7lHzU27uZCaAMCbsYbKGCwZggHUqV6LjL71089equsrdjzNa99+jqLwYSzv+50NHVf3m0WBDWllEiDHA1AMFhqBiBytDt40sTeZ26rDAVOoZymIr9cMZEcwJSaDAHNyutEByLNpt5iTRy1oi95NKJR3d6QIw6m92vuZVJ2e1UtAaB+pCx2XXr3dvxoPMn/fkMjhpAobmmhSHWVfnXNsrItqbYimKwN7dFrDUVE4WpxmK+A5o6Z9CJiBYIAKi0+YsXkwFgvDc8QGeXRS/FiE7oh1T2meUvtiQDw+0zu+b8HnkpKAkmJPRye/P6H/ogXZVp5QUsRgznTAmHEbwU8ryIxw2Ty8sGEgpKM1+vr5mwGxqOknUKxErdm0SL1nhURCiEGqD811p+9pXvHTNewWTALLQQYBMXqXXUGPHzoCykQJxfvbNhgKGjKRE8+cN6j0agO1ZakEYthNVaP2tKw8bgt6CIEDSbFECSHpaEAiTHa13xKQf5zZ93wm5yZZLTONse+mYsgpDKYlZtJLfF8xmkD2JJqP2QHmiYAwMRZl+1xzc/+j9IAANra2nRIQro7jbLMWSikgCuJc40c+OBffgTQk5cHwozAR7qXyi64jGufesqcLGbcN43GbjGkj5hGUkYISBIiYSrU9m2b87M1T511bSbU3rHsVs3M8p3a9VfVywFDaKWVyHQb14BBgnU8LmbJAnVG2af+l4hUSajk4HNCEKmCxx5LCwA9Pt+ogdSgNgS0JQVLVt6AHh6mct93GI7Lhu2woVyW7DL7NLuWS8QKgsSHq6XRAuQClmWBDLA0NJs0Ymi1h3tTbDKzyWCTwVJrFtplBKRWcLi/r8Ee3ucHBFrTL28rV5f9LtU9ffZXZdWSJf03zeoMXTyl+D/PKvClcwwtWTlsOqYiAUaAIOEDaQEJHwRMCEhISBjs0XRJzZCkIDSzcjXDtUmx5TzbbB9+X3P3F3lciM5sjvgOwYufCE+XADgSiTCB9Ky8v9u5Sxr4jmvv9AETTaUkQxl7OEkJik0XAPz9FtXfWWj+eukNOb4V+fTgPS8XfN7hgPpPFsNDDQ/JYRatWGC5btKQPAiGTV5LYzFiKEBaUCwEUM63Pvcba3vld/3V5dD5m5/ICPjdG8LCdQBleiqlVKIFKD7szjvN/u7LZTic6bqx6yAwk5d3KbCgjM3Q2pAVDvPHq3TtpC3Fgppm/3k4L9jQ2ezvTDogX4C97GQeJrHymocQtMlC7HfSKYGV58+bt7XKF966zH/u09f6FnGZuWrRAjMcDovwsmVGumsSoaJCVWNw1oYuPsFxJZSbFtI2AOWDAQUN5jxDYc7EvAFgUn9B4Hrz2o0P5u7p2z933hq18enzrG4cMf6NDn1qdyIF01EeBZdBENDQJLTP8tGEXKy5aHzL8uZZFwoAmDPReXGc7mM4aQm3H6QBRQJMScAweHtc8tp3ts9nZpl+o4Xwb24wQsOeCBKDQb8FAC+EbtrjGisvj+hwOEyz4E8wwdH03muSl88DAmCZxvCWnVg2a9/l0DzI7zYuD5Qxm/Ca5hGHw2Ies1HGq0wwBDgkvQEKe5XgAgALrxBrFw7m97phhP7geSL0LCoQZTUTTTCCAwPtoX7EGRDsCAEFjwPMEFoZAR9R2l19bP7U2hjO1KiI0VGTDnk7XwYVWArh2hnHqwGwQRCC+xFHXeuWTzOzH/9GppL2klpiZtHatiO3f2DAMwhI7xxae53oTAFt29pJpwnh3e/zx9EyMT6QmAbX8RqbsPSKhTPdlaAIo4OjYAoTSmgo5UJqKWw3rVKmPW31uicuoWi1WxoqNYDYLt8RWhs2b1p0Uy6Hw2Jjz9tn9Mt0DhRrxYIUCQAao8w8+M0ABHvfR2x6ETLy6oDTbgpbe5rJTxbjfZOzd+eFDhmxLWU8GZOD9Y2bLuh14hBaEkkTzIDBAISr8vNHYVzRuH+eFjituTh3UDlwadyogn+MMXLBcIWR8f0MtQvUQukmpz/wfM1TnzYB7GkdEAg5hj8JwHSDhnQyHSOHOlBmGIRAmjlPBuHrSbcSka6pKQPKaj5Sby1F57sr8/P5C4XF2048fv7figMToDV7PgfWGOopxnBVs0zQjtbGi+8CZCj2u5wLFi5WNUjPrO3a/Kl4qhemNIQX2RQQkEizzSZbODznkLdPHn9aDUKV8mBtnLIAZVBgcjiZdE1DuCTJJUHaMEhLg7SQw8Ml8b5DEZEiJkVMjmBSBBIsPVWD5L5HiEZACYJtGnCYvUZQLEiTHB57ui+XBLlCkisEuVKQJoOgJYFZuEqTS7nywCrQRLx4Ljm0eLFzJ322t+7CC9NfW2qIH5da/335ManLvjim94mTrAQJX0LaRKRSjmYMKiEcRUhrCFeDXM2U+b+MK20FlENB5Vg2sekj6IAImtoM+oP5zqbOBdgO39rtm4yi2OZPBBPHEHUYAMyfX+1GL/pG4vq7r08Dp6UMQ1u7ddyOcNKTk3HHF5fh1evy6Z95n9eXLSrky5fdFY9VxGxESQ8PIvZGhBElDuJ1f9LycUKOgh85kHDB5Hi5c8RelxaHIbRg00fq+3+6MTW14o4kiPRxJ+c7e3wq04QmCYILgxilwPZN11+fLiuP2md98dTAznvZdRARP9T2n7lH3R8ZM7l/skRVlfiYu7qN+K5i50Q6aSDXn58rTD9YiYxi4tX4aWawZXqahDsoc9PaBobZLPY6TpPJtjSYQelH3qRoQ5X7zHl3u9+SNU7ZgsVuJBLFL+bPd08qLVUtzNOW1Ko/braDo0k6mg0ihg/SNMDswCXC5IDAMUXiRUHkbHHOVJi5aY+3UBUrF0vW5YmaRP74rb3q0AQxwBYpQSCloB0XbDMK2MEJRbqR6Jz448GxLgAsGD/+lfGFvkYYBgnBmrSGSwJapEGsKJE2aHt3cv5GYMJlf7lS80HBTMEQGsKxgiYI3Ij8Pcq8OoDq6uqoF31BFwxNu1kyGW+jIAFSO10kpejYJwU65dqEIvAdU05OLYgsNksqIgYRCYpGuaO21l9TNbDTUZoZUaojlIQNAKxcNy0YkF5joF0fOpN7LyV9oGzUrOmFIw83ltQg9SowaV1Xw+FxO0mkTaGkCRYCbKcArTjHDGLqpENWHI4JTRWo0DhzhvhszpzXkNJrDeEn8gmlib1ulVoCkKI3NYDWZP9ZNUBRdXW1++/q3Pi5lYUSgDTyA7MT2skoOgrD/QgYYKWhwHDTiXQmSrRL/nAmnxhvrX1ncmt351gImeFsM4cVaCEIylY4suBQFJkFrLULCAmRSZFudTqpUXcdp5mptr1Wl2HGLmtyXEep1b623UIkIjrs9rk99iCEMsHCAqQEOwrHjj1cl46bxWzbkBBex1AWwxYea4XisYWlKW3nIsP3vjdztB29PtSsch9rWHZUF8WnQSkmVwgXXiG6ZA1AcZ4I4sj8GduIyD3lwmJFIL7kuLM3jjVzuzW55Bpe3x3yatwhTOb2VD96erq/YDP7o5Goer970qxp8dyFTgMwmojGaQ1wxkocUqCV1sxaC4uN9LFHnfQvAGhesEoRffTRz2fuvssGQMcXnbZkKo0ZAEwJZobpNR7UHrmIiOsUVnfWX/LgwMppqO2wIwA/8vpD5Y2JjgnQtnIECJmoJlhAScK03GI6csqJ/xOriA3ecNcs/8Gqy9yyYIsmELuJ/kHNDCiGdnWmYP5dg8QHDG/ZikyUl8kAQ4LVh63tyDCbMHuBfSaw3jkIH3BfQ6GboeCOlAAxJBGEGaQDq0C/OyRIpH784qLEn9+6fvRXxk967E+JFy79jzni0tAM/dQ5hamuEr8SOaYpLUNIJYXQZAoNU2hYwoUlhOWXucovZ0mSc7B18LyC9q4vT+puPG9M54NXzgz+ctJxh3/vurH1rtFY5NTW5n8ye8Pz0PHcTMwf7CFwXY/8s/5IcPf2NbTiZMttuO+qAFf+OsiVuTnMTUHm1TmZEWRuCjB/I8Dc6M+H5R9lggypoCmVYZN6Vw79SHFWUkVDeZ8ba1r2KHyVJpiGJyk7HUs+3N53/Xff2Xj1HTN2nDd59hNTmNnn3cvQaMlh5hxmDoSKjs3/Vumx8d+eckey8KZHgre23hjczd0c2GnPeMBDCAHMFGYWvvalArzM19VrfC7OAjCJWY9I4RAE5bos3TQK/eaOcl9eq3e+7kP4nbwQK1lBA2DjrzcYOjzj20U/f2fdNd9fvX3hzWsbv/mTDfXfvP6NuisT21p//vP1O178xyY6pbOfWEgloPxQ0gHcBJSUys+DYnYwXn/WtPG37VhUFozdg8Tflnan93QL3S9fTt/7Xiz1Rmvhp1IiJ4elUq7htZA1lMegANehiTKuxxTkvsAM+sXM81zPm1wfLxT2m6OFi7TyaxLKy1BjHwgklKvR5ys+/JV4/NjrbtpEsdjBUzMu91ISlyDCsVhMtcHvtywrB0pjZP6zl3/pCXbWGq7r7ofsIWTWFpWUhCVXVPhPn/KUrK2MGOx5oY3a0tJE8NzzUszMQd+TKuh7UgV8fmau1FwbcQFIKzcvn7UCMZH+EDNNRGh/tt+JhErp4VV/m7+lb/tEloLJa9PorX+fCTflyLEpH44/onQlETnMDKTahRSy/8jiQ5fmKYsdITKMbrzT3JCsN/e0jHmlZdkFI5XQj1a2ent8aISY5St5r7jPor1kU1PTp5NsQ444/5gZhpRgZs4P5CA/L6+TiDgcDnPmA7uclSo3x0gJxWQKEBTAaucW15qDlg9H5xyydpw7Ki5hgbSEJgIbTAMqhfU7WuauRqK4qroKM2K37KL0+Tqg7j19ZVcMtXNqGzfOtp00vCQQr3LSgsRhomjtVKuoTmWaiAzNt1cgLQRcF/3dvTN/X7P0GMBryLI3cnEg1uyCiLcofVqr0w9IqYeOJk951SAtzTEDBqZOKX4NAJrLmhXCYXE8Jm06Ili0yWQL9jBvzdCkQLBhY3tf12HPoP8QEJgEvU+ba2+/bbffKUrFB8fDTYFGKtvstZKHzxIpJ52WhUWbh//yY0CIY+Lpa6+1Lgyaq2ZNmPz38ciBEqw9PmgDYAkQE8FRjb54wZub1n8pFo3arzBP2drXfmP7YBdLae5C4sfE2oCPDvOP3fDjktP/t/uiXD8mfBLC6iNynQ7IrtaZSHfGsP0w2W28M4CsvKAQ9IhxIJRG46Oa18rKStmDKsJvj09Fyrf6cPgbwcj0ybGvNyx7Yv1RR89c0m6cVlffcyhrMRNalLiSpBQkiUkJEuSwvUqkm7bNKrD6ph12ZHUwT7Qeja7UDFzThqpn1IpDQ+Zzh52GZ2blp8vKiv/vVPLsdhUM6dtQIOC1HTG77PAfzL6sOrV4c++mHPJbknC4o5AmIH/nn5HDzJpYg33WOI6rxCxHSzg6KHaynexm/e6zHaChlQ325WFlh0NbX227juDHWNPAwxvi213V1yVIihGXF8A2kABs9xh3cnqg848N7TedvvqH9W+smfpu3/uBdztnogCxMBhR4mh4mUT0/PSn3PTVtYN9pw0kUmxIKdWIWj/P1hGcYxksco3lY4m6PdqYfaRYZUAg7QNWGDPRKAr9dMoTq9ru2qIMaJHrhWFFAtyo0CUcDOq0lmaeAPcBOhfKSABECmlXnjpG4PMzxH/OIWr93bLf5W6ccl3uzPPuHrj+/R8cd9/9N+euu54vXL+59bwd8TGAKcAOoDJuACEFS8FitEx3XFHc8TIROMxgREAiOit9S33bO9W99md7xWgiGvToXNkPwIWQrtqY8Mk19Z0n0xl4Ej/FQZMHrfa6cDMCcISae9ePz/cFi5BwmXzGTgfvUKNyISBMidGjR2doFUP7uKeJAchQB6zmkgL91Fmf+fz1j/3oW9vdXk8U2q596P1fodLYNTT9ga94m0aDj6r8FhQryvflBfts9whtEshVIhPe2r9tQ+DqaFSDGfFld1/YH3QYLrRwIYkBVxKEIRk20fS8YjW34IjXAHA5qoyyU4t0DWvMHlO0eVrPGOqJdwMi8C6RoniH6pcbGzZ/yjCMezIdYz+aphBDfCnvooaLZfLPpr912ddfb98yRpGtpBZSCdqp42VYc4I+PyaPm+ACQF1pHYFZngsYzwDpukgpIQrwQPdcURAgTrUpaENCmBimBiWQoYlnTpp52zvbt11npulYZQitwILJFS6leUdP16xVjWtKqlHdHK5dJjGCb3pHLRSHI7h25Z9Oa3F6xpJgDSYxFFUISh8fUlS8eMPyl+b5g4HSNGlNnOFeVhkFxCT02Gnu8lnm3k5dBKBg7ThmzUbFi7fO79IDnqI6pCt5W0gxSZnny3/9G0XzX/8mQFGKalSGJBGprz7/y2WjjMAJnY4GsR4uhydm0iKtW9VA4ZvrXzoXRBugmfaU/5907YA24ENagciknZYsQ7suIBmGlDS2b8D6+E7jsLgOIePJz40zzydKV/a/9I/129/5ehv3S8PxOrsow1MApWDqTvfwO9sbvsDMP7ulp2ZUvd15aMp0YLEkFzuL+JVWPME/Whw1YeZSIvR9t/J5/6yauIv/78CZbqM7XR/7rduzxyjlCmQKX7FLU/WDWoGuCIU0EIrz76tkff/tcvWOu/vmLmZjRsHtdNP0+eu/fyc24joogGkDMOpwj3CPMqYHBy1KCAJsBTi7BCFDctmyZVTef4/KK31FAQ/rVas0Ey38BC8aSxIlaZjOlXfrHQApl4m95jHHD/KU7Wb6lDfSNiAseG27Bd7XGlQasOMg4eVcsXAx0rMANqCEDW26JkECkXK11/yyhoYiAbCLtCWx3R2rYfjRmHYJjn8KhH/KrstWjdDWfVBQcEelp83e9lLt/3b/2ank78sZKBNlqHHpwxRYscZQaXxdRzlvx0k+IVcmldtQAKxMAf0GIlZgG6bnPHJtzyX3vdwTWdNr+qXfYHJTAAJDyxEkNOAOYqwI0HHTx/b9k2ESCYexb5QaEACDbOCUNBAGiYS7TY9TW41CAQpoaE2QuZm2b2lIQUIqgiN9IGmDk4Rcy5AnjnWceYfm33b5hMrH65lFR1VVqqmtw5i1h/kK/1SLJy+EfAot0zbG4yfFyQa5UjAAJo/4WmvFAYto9qScbePwdu+QShmNEn991SpzSlHy2UnrxU2NYB9pZpAkzsyRJKYBELa1JkJrNS+aQ7R9f7qgHUBRDICgCNrfr5Jg0IloUs8wi3mRiKiKRFQkEqG60lKjvXacLirt4MK77jLo+uvTG+qeOKLJ7RcwDDWknGS0CAgihmZp9mDw5M+csvKPAEpCtQyv7fPeBiNEwPQ7Y2/5hRG9MZr81Vc+c3i96pm7Vbd53yFMaDnkiaF3nSUMpNpAtgH4JewM5y6T13zN0IR94YYO/zQsSqN1VAdMbk/2TOtPD5IwiJgUmATIJdjaYZ/pI2Grt07FpO0AqBpVGmURLltVZp572FFVleteawGsCcQuAyZ5DekcCIOojwfRkuw92nGcHCKKZ9roHgiHFcnMg4YjkD+Lkqu93JEhmlMBgN8BJv1t3YM/efjNJZd2oV8LsgSzetdhmGZFJO2etF3gz30OADJFXHxiVUQ9w6CSCKQA1KbuDUUpTgEkGUKCyPV4mGECcFn6Tdrs9Py/9t47Pq6rTB9/3vece6eoWbIlW3Zc4hZHSpfTSSxDIHEadbT0JLDYLCGhBDb7g11mhmULCwtLgOzXZoGEUKUAgYQ4ISSW0p1YabbkuHfJtmx1aWbuvee8vz/uSJadglsc2J2Hz8GSIt2599xT3vOW59l6+rjJ963nHWd3DvdYJnAoysSyH31qXd/6egY91N5+cOrPpO5OQgXQx95FfcrkNcYBKCUwWa6KVqHu1Hc+sHtP99kv9+5FdmgoLLjKZ+5ZMCBslWNZR7JTAGDzzB7+cy69doDQ3uXftnX5Gc91b67xxYAhPOImgA3jTVWRuJwxq2a1JvYXrFigWxa2BEg0WoD41Bmzfvfwqq2fBAZKEWZoEwtA1oJJy3bp5TX7drxTrL2diIIRQYpXXyqrLJG1IMNkoyIQsqOGkAXEIufn/AC6P1ynUq/O+XxckZKKFPzOa0osAEqUXPJU44Rn/lS8t/ftOSdrrQpUmC7AsCAW8WVLZvcpP9uzYtHKJ56c/7K/U6BYBJqVtWCHYdlY8rWakivd8pazF/0wWpNy6tue87twoxw7Bewbg5pUvhjYyEgcIUxsO+IpTa9rJB8L8bUQwUCNkf555Ue/3sZEh9TohkQwodWkxZg31IAemRQEBGhBAICQTElrR8q8X5ZMHECfv5Cm7EMSvHhy6/CyJfOzr/R/5s+bciBASURm4cKmV/Uo/vVCMb/mQAnfMjGBizkmYTiMnBxcmxk0EIg2AR8qHX9ofTYLAYiwWIHAHuDgHh0dBMsWovOJdERyuEVgbAiAk58GFpaZyeRGpNvEmuxBFxpx5xGRWGRJMBxYLvHoMxtzENAKgEvRdxy8lwd6oakBdmHvPdX/8GTwtc+ui5ye9d6a0ZYhwmr9noFxPTaY2d4TIOdERXzKU6TLaL5rGBQu4anSP3RGdewPaD36qJVYESZYQRr/hQ8MKOswMUjZHJMYCoQBCggksNaFURmQIUyw++WMSs+eUTXusXNOjXztZP2LZxat/Lj7wAWUBWDTeH0Ku9pa0Ffnk79mzcYzhiJlJZJjw0Jq9CBlGVYcqSohlKjcCocv34uk8Mj8WjewWi0tvf6FX1V2P+Xsp/ogo2yYPG/z5ppiPzeM3mh8zmPd3acB2J46WKX8TYGFSCwIlchqm7rkuqGt7p3pVI7SRFfgCsf94tlu2QQHO3bsCD5zyy2ZbSIz/+6Bf/389tw+0VqTNcEBW89YKCEQa6pAiX82Tt8xGj0+wgiyiMXOcyokFDryBzkQS9YGyoiCVRArCEv48uIVo7qW4T/GBSMQWNajnNB0YCs77Ptor62lFNL2W1uWz9gw1FUDIyAIC1HeKGQYraTYc+TUWXObiWgYSTAobYE0Mo0Jqq2b3VldVrnT6dpabcizZOlAdEaIACNrO7ZM+8n21acCWBWKMByfccGUJQEoBdgvP3zHlZ9befutXtSN66yrSXPQrz393MtrJg/SYNVOHgApBhuCHWNPkgiMI9Zx4mouTfrTzTOueuIzyHNLE0kqCYv6JHXe1yMKQM71izwJgCAvHMM2n8WhAJNFVek4VGmiohknteiXWv9JQma3fPCBpdcMYvf+rgVGrENEwajjRIS+S5S7TW4u23nvntOHR9R5mUIVTD/AzAkT+xYBvU9PrNqjekciiaG6LBiwRgA41jjgwe7d5wL4aeXe7J9dT8uXLeMf3P1Jf/Y/3vnujGPGwQvsSIieENbJBMbwBBOh6ROq1hsIqrpuFKAFYJK6Ougvzk6sX7F502DH/r1lhsmKMI3IrkOEciaLrV07znwOmAxg2+sdowSl+dz+A+IRo8qu+Xgma6beycEJK7QjkCANQTosjiEg+M/ZdXe9sHfTOzZ6vTxKayl5fxiT7Al6sWZPR3KwhE8e3j1M5Gr4xiLCBGMCWBhbyeU8/+QzHr6WJ6659NJAp7+KANLyF2+5sLUHvb9jkT15Ixwoo/TT8qo8b69vQL9ywT5A8y5hcbY+UR29eOlSvayjwyTf0zz5kXteuIfK9eDnnv3xExX+r1b840dLH6tubNSpRMIfYymPUpj89RvIxzRjR/oAyuX4qFGQQxCWqYoVEAte24AOvx/Jd6bXNTSPJoWDhA/ooo6KhowRInqFi4EPWDZsyZDRovkNDsORVCqZ9ou9Gz7w5C4F0jHETZjPOmzKYeBYFRsiyW/8YhkjDJ0EwBoxVW5EnzGx6PfX4PSWm5+4iYHvjkRt6ajea7jCcvgGVP4dMYQNSNwwpkwGOjIM5EoxbMtpv5sjh1XpYLeZenFV6apbn/osPZAURpr+7JtraCAjssr59Cpn4d4sAxKBwB972hfoGDtDWwfmV1f9NhAgiQN53lW3F/lqIZnPrd23c3xPBruhZSwbrTEEaMdu8Jj2D6sFAJanD0Op8UTAp5EBmcCdN1BWRNzNkPKZwDDC6JdC37TYb286/6zU47d99+me9bN88sSxctDZllmBDIk2TDOmT287HegGgHQqJY2HsCkcocOBEbrslBApelUPzAEjIi9CeWBhH+NwNkeYHNGUPx4+c/9/vGs79YEhBkRq1GRQACzUybFqzJs6448QUDKVHBWbqG2rARIYPnXqnAdfHNp87tahnaJ4xGMTqjiJGNOvckXP7Vv9CRFppdYlCseR7pIAojTZ9/3+3+Y/2vvypfv9QUSMgg48eDEHGbZAIEYrh20QUGiEjZGcJ0IQOFIj5bh21qzfLmldJonGRtVE+XhybYLqm0ELW5f4IqLf+tA/js+JhVKKxArsCBtGmARN4yWO2srT9gRZyk6NPSbbB3ePLI5EIpyxOWzq6jznTr/9QgCPjsh2Iy968s87/rioc2B/rUHGMpMK71PsOCeuJtr4YxE3tv+zj/9oj/UYY23QkecyWiHjAJli1wLAxj97mBMioqBfZMJ1y79xSV92QMBjScRCrhFih8tVafe0CeP/CACNiYQdOa9VJ5c6AHqrObImGugpg9qIkrAQVwhgQwyytt8Olz+yq+UqAP89v3VZqMx1DFZS7M3bmeVDGzaUvEtFH3pk3MT1W/btngtYyyN5LwKQFR6yOfx07Yqz95EPG3IeE/ICZsoakLCapSpy58w5s0kkoPr6pG1pSb8xKU4FHN8DxIn6oKWLlwRIp+30U0+pfnT3unk/2f70grs7XvjSU3s2fCq6+Z255rah0NM10sLDgxAVBtHoSmEw4uoTncNQfuU7vE2bAgh5EPLC9YrGtGNYvwDA6gCB8hGoHALl/9nnIPLCz+UcSBjKdy2ymYwI+FXOAscN44D9va7OGS6zkUwkGBLHDLJjRXmWVT+HpSk+FGWRF14LC4SILcD69MjO7rfXjV+a2vpze9vNu49TfloAIiUEJUQ6/BcQEiUkjpAIJCiCJR9DOocX9jB/f70953+elx9/fs1bflLy2cR4pMmOSDHT62yQAPA0aqds3u+/rZsUSJkxBxsBEwmhl6ZWBD2Jffs2f33tPSXpMYb5wA2d+pJkUleWBq3jsn2AVeqg2ldhsOPIfqeC2jbuOlsRJDl6dfkLKChs5IYG2O/uXH7hF574n1999cmlv/9Y648eef9Tt933kWe+88v3r/31n/75nl89cs+OlXXdpldKDcgeZOOFzIZZiC2PlqAsXrSSiHxIknGsh3x75LYkhRs0KK8Op0YUjA6L9XfMuGhoMNuQnT4U4fdn/GxISDv2c6wVGEFpfNzO6+K160CQVCo9+is1gCUiOWPKjKfLVTwHO1JwFxqorDSICPt5GC/v23oOa0fQUe2gsfG41q5oEIY4mulzjAkk8D1l7JALkzXWOhkWFqWsH5AbAKTUSFwJBIIh41eYYj3fqWyqO2/cr4LsxmhTInHgpbTtpfXrR4upY1k/KPbEhP3/Kj5URQpmb7bovWXTukpV7HloBRmJyoqQONZ22MHYy+0vnScilC+sJKTSooiwr6fn0r2coRFdgPx7Vdozpqq6eKnnZylWUbo+Hi0+aA8QsWHesgWybLF293YZMaCTySS9yq5CYQAlNNyfxI5xezO95w95w6SU4oMjZ9bqSBTllZOeTLhnrUYiofLOLUIyyePOPZ+YyEwoLfnFOI4IjKHRJGeiUCmXSDq9Htq4dX09mGXfeFcBfznFxkca3ixa0Z/5CWf7Ljil5seT3XIYCuciWQkLjjVDRzV2mx7J2iHBmC4VEoDIOE6UTp4848nF4+taAFA6nFsFu6dgQL/Sy8lOn0URe/3RIbMj2Gs257p3WwnQMvl7pvA6DukxyucLk4UVi2CQhkZeWKQYoowRDpQwAiEnJ1BmtNGhDYE48KG1gJwwxVYHEejAzftv8nU9kpeuPpLQirjgIICDAOw4YEBItBBYGL4QzGhjWGFSQuSI1XEr7BpDykTEN2iriSflEb0QSfsBfNEe78OTifgxZV2GB1YyrGB9RdawCLEIg62BkMDwiKASgRAYGwifH+szl59akrqrCY+3PzuLlrQ2HvXcoUDoCSsxCEic8qmW+hnDHpmssC9ZkiAgGwyTNb0EVoYpgrCM3UBrRhbKtvZE7T0b3WvvWn3yT9Zm1s5Ifb+tyG5PVjxbJ68sGlq1yrl3SUcMEGrZtP+CTYhMDHxtXGMYZEMeUmEYK1LNhLoK/UhrT0/38NM9/tJVdc4C+XEUIuqbg9UydVZx5NzJ25dPKYqvU0TE7FlwAJCFqAAsxNlsN1b3R8/7em/f3Pp0PdfJYgeLoU/0RkmCUN0KFsOqX6MpAYBEDwWnrerd+q672v5w3i/aHpz/m81PvP3XG5++9jebnzz7+VxHtA+ejaoI5YRhScGSQCgU00EQiNVaVeViQ7VlVb8JPyl1VOM0G3iU+H03MQDNGoGyQhxAyIhrAnECEZh8KrKBwOo8rX/YxNFhEagWWGXDgMWI2zpv1ImR140y1iOlAKCp/dGpL+/ZMtFQACamA6EviwA5G1ERmeBOeCEWK+/44tovlqQglAT4alkV7/pUIvqxx/+n5OJS+/w4KusCxQhiLJSBuAxjPACKvSAj64c7T/7R7tX1uKs9d0UioZPHYQ/KAEiELgLkWAIVaMXGJWuZrRhFVtgqonAt9WEdA2tzUNYDixXrwxQFpc7l48/qTrzv3V/92oYveNFxQ3LQoSjdYrJrIgxAvYTc5KiKTLJ+BkJEIgRlImGuEvmWOA627pYpU6d2ognDJ0+Y+vMyNw6LAFoUbKh4IPsxjJ25wfoIOZJOpyUvtkeBte62vdvPGaBBOEqBRQMcAF4Gp5bPUudUTdoUrrpBjjwLMMgSg6wDJU5Y8CwWg/4QXt78kqMBXPer31Bn3eToK+ZgcoW6QtZHJi8LC/Gfbm2+fFOuMwaHrBU1NowIQ4bGw0XdxFPWgVJy01veokWEli5eqhfUg8sHOoLNyenRa847/YXJ0Un9Why24QkFIhYmMGByqI+Gsbpnw7mrjJlWn9qKL65dWywLRB+RLTF6rn9z65TXzR2Q9me7/HPLq5fPikzNwHeJfBKGAhwNSxa+8QCy5FhDEB8jLBMKFp4VnoRxmDd5TiMT5ZBM/nUdJ/IFCDxmnNBfrD11/Fk4Tvjos4BngwAwolyQImPssXH9/S/HASFCIOpHR5YNMYgE7JKNOeL7miQTJzFxEhN71WbtOAReOch3YTkDEMGShWU55mFAsICKwCAK6xkYI2QtyFohY0Fi/dFmraHACFmTpbgdUnHqV2Xai3iqtAi17bnatmYGUtKKuuPelTnfYSUWUAaDkZCv80AhEcNAA+JCbARiCYE1KI1WqqsqMv3vnTn0N2VTJ/1i4K23FV32p73Bu+48ik7Lu5EsibkQyAoBjtXbLijXA1dUZ4PLJw4Hb63K2QVVw3ZRdeC/pUqhOJ5Vvu+J6xWDs1GABOwQR3SEOjwd/HKXvejfN5Z8P3Vjk3dzx+zglm8evC5IUvimO+/k1mXLPBE4e4fsVfslpqAIFpLPRx+leaG4UjipYkLb17++2a58bqK0Yilm7bvASS6/rSjYVubUyAeiE/GHLaeOH7etPMIIy5vCZVMZAF64e/eQW5YdpHdXShff+lSRbv7A9erNnOUBDmSH+YxcD+WMjbMfuNYGOmeyPGwClbOsA7FM7IvA1wQZVUbIJylpx5baKJ1ePfPJm2dftfoYJo1EnYi07bzFWBBsUUW5L0JihCyBhrWQ5xqyriGTb1Z5ZClHlnNkkSPr+SIQyNhUhEPXW/P6BHeDyzoJBOzev/M9We0TbBBYY0fHxEjeweRIOZ0276zHmSgwNDHSjQ1OZ12dOvm2O82593cFumMDT4P0nlQ+4bESFQ1rbkjySRoMyWf0Z01mfNuW59+LpruN+eOLOpVIHLf9NiQi6bdhhM3LiwCHtXNCJu+y59GYQuC4CAKiGapSvavqnM1vveLy66+ms9q/tuKt6uTnNhzcoY0Jvvi0nAVgVmx4fFrPjr1zx67Qkv80ERGHNQaHc9vPR7yfGsicPPPkRyejFASH7SiHuObhbD8279o0/0npnwZAUnkykP/pXnVux76O03w/CzHhCk2KbJQjKLex3edVv7sbAGZOHBdMjJYizFnP13Tlw7ahNzpAWdXEcb6Ie1GkhJddu2T4UM9mQ/p2wYaNWNLRYUQk1jHU/46sDoQh9lXE67maSjGubPxDhLTkbr7YNuxoin7jC1lGczPc3yl9R+vlrDB539wJM3dpSxglKCcGtAKE2AS+DBt/xpPbnr30zjvT2b3ReT6qmv4qjYAbm5s50ZRSl5eXrz1vbt1vppVPokCTtVqFkQk7EokZm68UOpiNhnXYxWnjp29526wrVgjAkkoVvM9/RdAn+gND6awxuXxEVHgNh9l36sAU9ILeoFwPe9WO7zrWQgcKAb1GhrMVcIyol+LozzngTAREDKM9AAIduBCyx3B09AEVg/VzmBL1MLsk6rOX88EWhkk71o7GIZkCFCufItoO+3Zoc2D8gUrr92e86JZUPaS2qt2iMUVhjclx7j8HFvANKGAwgyzU2BxTSwQSAVuB0lpOLer3Li7tfuTic6Z948OxKSuSP54enXnlVbrjA92yODVwVBETIsAqZTUp2b54abxj4OmX333B1ZeOK0KQAdgDFPn9kQqndKATmPhE2/bPPbSl/+p1filscZlADRJbDSsZgktqj1dqnt7U947vOJ945/cvmNb0y+TZ7kGlJ83g0z6Ys0uQDs5Dau4zO736nmwJFPtsjEGYqyKhv5YsT1T9vXOnnHzvZxpn8pY77qUZdWkBMIxFCxwsagl+iO8EZ1La+9rLi58tNuod+8QN08BF5c0VAViha5ixfkvv9YOTE40NFzdseWj/rWUQ5P4i3BOUY8tWgXxYMMuYg+poMHzsv8IjpBES+KLmUUlu4dmnfn/ZsmVZCYssjzj/wgpJ1s85H//7iyOJ5BOB7lmxe4pfLlasJWOs4agW+ALjj6a4KgjydX3QWlPg+7Q3NwTEVHgQGqWyO3y0LlkWiEjk/Y/851v35fqgYg7ZnD2YEU+IpztlfedX1v7p8ptuikzf/KeBz8z7Qo4AUGsrBN+FFfGIyN458Nh9T3evTWwcGFYCggpsyI2rLJiJ9md7ZJfpuUjEOhf/xxOcamwUHMctILA2AMGEuVfMEM2htzIIBStGCjJFUJSL2vMmzM7NK5/yP1dd9P7vXZUq23j5BZ+L1C3+VqaO6tUXx1w3VbmXmttCWeWc4xYNeFmgODy4EACTP06zCCKkUGFYAGQSSKjzyqbsfkhK+9Zm9pSZeJgjKzYgy4HdZ3om3r/hvncDuK25uZ6h2G7Zt/3avTJYBM1GDJSQgViREilGWWTcL+c4eg8WL3beX7Kg/QfU/DIpNY8g1nAopBgeaYl9z0Nx4F7xk67nL1yy7L7HFiSTuiWdNmMNtBrUCH620r81neY7UqmJz3RuPneAsuQCHBgfJrwkhGBBDivjPP3Zqoue+K/rrossXbLE0LLWzAoRXZ+62RDR0Iqk6Eu02vXZR3/0wLhIvGZ30C9QKlRoZBWKNUUjdlN/l2rbs/5dIvLL+uYU0Jh+hcEe+H/5vtgEarGsfLI0NKRt4gfpO//U9tC1u6wUGzKiAyFlwwONoTEuxPyyYk0gk1HKZ06Y+P8uBtavuG5FhIiyBUunYEC/Jl7Bx1ownw/Daxku+NYPsvmv6YfDD6370PQpb19YNCVaYnp0f5ED5DBkjTm4R7UGROyMeGlR89bM93+82T/ZBOVWyTAbePlF/7VEug/XKFSwxoryMnRGtW9uurjqXVO8tbt9NxLvwDhT4umMAwAuYKGtQbFXDeROAYbyK8rwjc0pHrp+hU7fsDAb7nTNx3wKH1HgHvl+yEF5qdbRmO9DGQeDyBeZ52lWwR4ggDVkp0QD/uDp3HjrlNU3Es0a+N6a7xV3NVXh+xORSa1qi9Q3N3tHPHYJECMgBTcQo5761oPR0qkrBt9N1+x6jb9YKyIrbivu+/aP1u779IvDDkWyQgEZGNeCYSmWUbTDKVItA9l/6ZWdzQ23vdA/lguRWmAS368uWiBJ2bZz5xUDqvgkG0StqzMMVvCsgCCw7NiI8tX08f6jV6BtS/KZ1eMfP3XR8M/XffLajE9vEafUChu/nLn0S881dOVc5yIV00C/YTgq3GFVKAlPVohUKTb3D85tH+g4Sc5ZtfPr2Iy3v4lzPdQDHnX+hm6xETZ062BsgZ4SghbJczSEWhwOKfEDLxgfq+BLa+ru/ET5FffdvOZmnapIHd1BKsxbDX4U78092f5UpH9z1f/4C9//NPXvsXF0y5A7VdkIGfKGrHZ0/m8GIwrMQ8OZ4JS5c8b95IF7fvTQjhfH+xGWIzXjk5Lk2qZaamhoMD9Bf/G6fdumZpGDsoqhNCBBfru3xo3ElLZY8w6n7IXvD0Xj3Ys+Zf5xzXUftMKXkhDBU96XV99fdutTP9y8Y3fXubBWIZ9FQqGK3Ei/w4dHq3eundiKrglP3Hrx7tR5zcdcTBgbM79KpKQ4ZmIq8AIVKIIlG9IK0Yg3WoEJCPycnFYxDX9/1Yc/cfkdu35dv/45XFFxv/PDy1ea1o7W2L1ozo7dnNrrq+SUkk5uSQMeSREXuwrWjpKijIgtwYAc1pgzb96DROS//Sc/KboUs3tuL6poKcrFrx3CgIA55Gt22fY6Wdrb31sHQFpu72IJDF/54L/M7FbDQtYKuzEIDALf43G6CHNn1f7xn/yAV/50eQzAYHZ/7y7lqnk2DCeNONzDQjUw9vR3T9jZ3zMegFTVtr/Cu5lOAp/rL43Ui2STq+65fI/fX20cX1wBWxqRzLYwIrYoXkZnzjhtS5R48EOP/7bkDn8Gvrrk5o88vLrpooeNGfrys7+wf3Lupluv/J9cbHzpRbpTAZ4wqzClRGwQ5meL0AD7aNu57sz9570wseq5B7uXlSzVwJKDCmicmA7yOuv8qptinnNGxSNvmtw1pRu8q3ftig+s77DvL6996L0PJpt37O+9Zh8PG/hGsWiM1RMI434S+mu0q2bEJm791zOm/qyhIeV8qqb+r4b3eXJnJ73hRs+bbiDKa3z9JhjQTWhgAEbhJA0BwTAsGUAHCiAsRutfKOPhm+gok4M89wCFpW3LWlOxNaXn7//u3NqOw72Wq4BPPrO/VxkNT2dgJQBsSHwRKAMZEVYhH6FZEeBwuWSt1WDKwegYnMD35wKrZkdq9h6hrSsiKbrzBgCU5+Q65v5jiKWAAJyzapWTGd7fd66z7/bqClUZqaiY0NxFl27pLVERAL4TCsJAIiAWdGRyaFk7dPatU95J1634cbRrSq9Op/+mNw1Bsi6ZbeH00dyf5DfZHBEZJBr7QF83IkKp1+hoIhIR+cL6gb7aHRucy3qibMj4iixDoJBzfLbi2o59asqv+7PnLb950f242Y5yLwuAv++NUyPadTLrztpjAbCRwMZg9QAYCloTPKNkepGDU1xpS6WagtkVG4ffcvP1/G8Pb/3Xe7KTZxkzCKWckK7LxoFdFr1eAChNoapeWFAVjhiHPIjdgygNDXhnUev8xxZ8Z8UQTnRoMp/rZrSmKDsaDSGjgsWkiDIRsHGh8qlMB0UqrMBAIAxoKxaKxB8KqKZourNw7vk/urbmg/9IRCYpSUkjBaSPnHuWGIhqV2B8/yK5yAchA+DRwx5IIvr2gbu3+MXR8bC+EJgkJBlHqI1nXnfqbtpdHItv2cKK9cDKx5o+3ZHrKVMs1tiAQRpEgDIGviKU+iU4pbpmOwD5fe3W4Hf4j+w5a25597bS/vfpviygCYEKwkPUDoNBPwgDiwFgWSOU9iYYaAax6Rrum3znC7/7dJ387T9tvQMaf4Z+8XDQCNiUFTZP/HTtuP54YzAuIv164NQnO184o8/2ClsiMfkdzwpIO/Zlr1Mtf6Tx7AnX3/Dbv71tSH/48ReGqCltkE579IrrN9r6gZRDgL9283MX7C3NAhkJANZCAZgE2gh8YvKHfbR1djwNAN1vGydENHTLi/fcVZpZd+1wEBC8CERHAOVRt83QY1vapsguiU/61l3UnMvN7B7uu2DADJAiqMAPQA6DAkOzKqr8i2fOG1jIbC/47Gd9fHiRzB43Kbd6qBMD8KGhwlVbBCwgsSLZYoEutQ4AqYleFhFpyoytLUkihRndzQIg3ot9VwauL+Qbm2GloGJQ5MMJfBgRnoYKmls5u9WDYOA7Pxu+vvGHFVf//uv//mhuXaUr0fAALWFAwW616DM5wNEhyWXeiLQk4IDYUk6GI4Oz/rCr99Sa/ssf6RiYO2okpwBJA1TtotNxSzdRLnqKiCcjuSkCQFlLMGLjTqS0a/X6twL4WSqVUsdjLB0p7psyZTjR2KisCH30ond9f+3yn1zVZXcwsYGFc4AxhwmaFAI/AxtxpFhKcMqEWY869PZdn3jsX8szz319+M24/6PB1EhtSCSonJEkyFFjIQwAjS0uPxIzMwweWaKwBkw0jj3FNKyFObIydgEoZF8OD6ZeuK4aHYqdGV+9KR7oAo4Pds+ZJli1yknU1VkAaGtrUrXtiVd4w/ZWgqq6mqQxkYje9HyPfuPSzQ94BfqAGERotBwilV8YU6N5fqH3AxAwS3gkl+NOV+gTYHSemHMZcP3Vl7+Ea1pvCoPgKFvywo4HftaP8zKREuv6+1SOFEAGJJYNuXZ7lk/90eYN77hz4Q13X7F+vQCfC++b0sdk3NMIdUVNYiSL6TXz3hobRYHIzNzT+9vx23BZd1ZTyKzFeZ+eAqygO2vjmzoxn8roD0gmR3IO5EbZWxQsGza4+A79/I7Nl/T4ZXkjODRqxAE4S4JA1GB00IyrqnzhM+mUfOcKyvk3/7R0MBJTe/uNDXWrbZ4lhQBRhFF54VcuWQJIvye8Zb//tt+L/OIfalP9fzFBHTvINjdkrZc12eIoYIOQBSO/yZsIgMACVpjE5XFBKWaMrzZvqZ77b98+44P/TkSDW65LRv++od1H4/GjYkuOykWn8Fqk0u0A1QDSCxSDwvSTo/HRqJfXmFtvvXNok8jEL9//H38zGHiEGAtgQUKQEQXznOXxOiozTz5lRVtTSuO/m6x7i5KZd3826M4NGhV4gTFWQwUjGx0xHH6dcBWyjqWe7sHLAKRm3NDsvZ6YxuEgkw/uSFMTo+Ej9+4WeXhSGFSruOTef3r0ycHBmUzW+o7D5Nu8fihx32CvPMe9N71laMPPPvKZ+hc3rljBaHr1z0iliE6ZvNg8CsDX4hwS5wuZPPK+xWIngumVlQfRcs4tn9w1lccFnbndOhTVEygDFfie2MB769f3/m7hnv/86P0rPla1sCvTexJCJh5iWFjfM/FIidIevVTvTHsRIhwpvdbfsAGqava0VXrN6ithgzDb2MpYx52hqKMH9nSdBeBXg9PWj9R4HdTXN9y5MDvjjt7Zm3bvmt89NEAU1ywCwAjEGhitAGM5nsPwGTr+pADU1NRk1uAHpbmY0gP9AwZsAMsjjCD5YcmvOg5smOZldw11qxf27Hrbt1Kph5csWTJW60GQgKpF0YCyNMCkYW3ugLOfCFYILGT7vWH9zIb2MwH8rBnNb9qakmdskYuLznx6iirdtnbQnoy4thLkdRXyW6S1FjoSlcAHz+GSzFkz5/38fxY8om8M2vwNi+YAn3ngr8L+WPmeboPvAiownpJjUUU6dOtTr2JwH+3SkJcetK+1SB51yaMoHZb0FAzov2bUbbZNNN9AhFALtJ9G5lVcVQRqkLBa7o2v1pRwUBkQSUoONorzjroT5oVk5Cm4AMy8LEpL6q7G5qZEyfSTUqr/pHRmUdWu257dnfvZ88PCRjSIdEj1BwDkyjYpV81b93x2k8hDs+qbh451oz8aNCRgV6xIqhlBx9MRKc0ARTGIkhGFRUDDcZTsVxp7hrleRP6FiIykUiAARaiibyxJD59xzZIrd+SKanNZV7QKQgljUWDD8AlQPEgz0JedOmnyCwDQnUmaCejxlBGjhfJS0ZYtgtHtUYRflQI7pLcG78sI2nYOv+3c0zNzK9ubn0mKcPoo8oWPB0wYiAgRiWfmVEzl4kjE7cgOod8bhM5Tf4EIFAgmllXANQLHie44rarm0QXV0370kZMufYwayBLI/n7PSml64AE5nuPh4L5Jv5brmfJz65j68Y7mGd5WQD/tr5651e+emdUSUprl0y7IakAFlljxuHh8y4LJMx9rSqUxe9EV2PbdP4Zzi0hBkThWqTAKkfcyvt6cZOaB3KDs8PtOfgh9Z7Yj/bwgdcwchwRgycyZjKW/jyyj+hxm71LOxo0df7fqp3/csLXz77qCHiOwfIBgDyQOmTa/x312+973iciLhNRr3nptLagdyywB8Kx1zSFPySAIE+DlMH1SNc4/sw4/ATBz8gRpBbB46rkv3tXyyzWuW3xWIJ5hw4rIwhCbPfFAd3Lv1Qz9h7V7Xn7HnuiQwFNG+1pbFcCSwEEE1eMmPqiIBhYvrXOqlzTLKemFuZuf/X/DmhlQCuLZ0IAe42L2FaHf8+IAMFB5TqwBSR9IewfuvJ4B2Bd2PHvpusG9k42GEAlBKKRG5AgCGTaujqsoUesVE895OpGocZqa2r2ToYfIN1mILnctixU+iNsg4Nd+W2SF9psBvLhryztxDr7e0/P4cF6GPeTVT4XKMG5WWIuGT76MTWcU5QDG0JD2oarK5iqt0dLe8uYV3xFJMilcwdT37xvuv23b83u/9XJuh2jSB0aKAGAHvvVsWeCqC+bMfurTVZc+9qL7YuTc5qLgVx9aBOC7fx22R309kpLiocd/EuT1m8ZIph66x9OfMXLNGM+LFQq5/mgk+f4YV34Qk8C+SlGsvD4x1Fgven51C0uhCezlAg2cQBaOBGrktU8dBRzeJhEawINVpUfReTvoDe17YpAIlAgPABEAaEATNzaKerP6SwmgLBsAiMwNnPeumUX/3nOZ/97e84MrNy2Qt0+2j84pGt7gIkO+LrIhi1SomqUsqcGcIxvs+Isf6x14O1oWBiN6hElJapETk5yVBNTvz/54qVYlQWncASgXhscpzF1mAWAtDYMxZJ1SoDk69gXH29py0vmTot0ZfHifKXZByloyoZkjCk5AMNrakhihbmL00XcDnYlkm9N5SidthxPxI+QEysBogSEFERcCN//viLU1QsSRV0MjC4ghoyO2w5YUd3b01bWgJThSpb7jBisSs26Q9/LqySvH//pdp9a/6zMXXfWhd44/8xPvnLzgH9855ZJ/vHbqpf90dfXF/3BZ/PRPNky69ANfuuBDb/3BVf967v+c++HrPjp1wSPXX59SiUaBrPiK/szy5R6OoxDIG/bor3Fo/lZtbeRRIFiz9eWabbn9js1rmeZ3LbBiCLMUuyUYFy15uQ57Nk+96ouRjblplogODH4JC+gCdaAJjWmHZq9aSzZCsmuwq/KJjU9c0AixeQ7ko0ZEovmHbEXOLbHJZLNd/MVf2nc1ijtvzmn3VwZF/bBWUxBIOEzDNZCjmvq9frRuWvuRR4CpoLRtfA1u6kQCUtOQFCNShP7sedlMBoroIL7rMIrB0AFQrFUOAAY29NpEY0Jp5t6aOfOedCiarzs0I2+GemwfVu/ccLIR/6TBbF/tkOkngmKMMFIaw5PjEzD/zAtajAjVLr6IsaJeWwhlImadS27IeSI25B8es8Z7ZJAlPwYA24esV97aedB4aK4HRERt7tiysM/xAM0GQqEgiwhgAwgY5RSXi049eyUAnPSfKYUkeCuCYkScOJRFoIFAyUGN5BA55JH7IgFbcGB96cHQvB/vfOScu5vaveQo1Q1k6eSlCm0wU2fM2KBFjapVUfgGQaShmSkX5DDE2TMC34+u2JukhDSqhDS+KXtOOhXe5jWz5v027kT3EjlKDpl/khfvKnJjINDDALK//eDzBpiBaXMW/cWvJwCQTCZHZjVPrJo0ENUqIxFSUJZFC1sHyrqkrJNvrrxGs/nfc5R1tLKOZutqFTiGhHJQ8I7RP2FBTLCBIes4yrpaWc0HmovXuTdRRuuwOVqJUspXigkOF1kVFI+L9ZxgD3RKgDQIw+HRtmBAH3mgI38G7zf9gjYAtUdyhW4mxPMrmhzn7vdgxRKsBxKjMkAcACqBWGfnhhHiyxPvdWQLn8Mnvnb9evuOxOMB0Ud9CKhxRyI6labu/NeNe29/epi/vX04EFIWyjCsaAgDiq1tyyj1wHObbxSR+ymVytZd06n664r0CXwm+2jZ3oF5NHHq/p7hKKQklFzn0E5VQvBgJEKAE9gs0OUd7DorYmCocvWfhmd1+WUgxws3e7EgOBAeAjxPxo2vwrRy52EiGli8dJWzLL3M//jSpUaZXqPggwKBsIVVPkaiwGw4byGFm5sFAeznv9cgguyRGDb29C4Ukf8mouCEePFljNAjETiwVpPJQUDNaEY6UT8Eot8d0aYhSU5TOos706/vIf5LWS5ECBA4rn7VnMoVPT1kZVf8PX+44109JsfEgSEhDm0Yi0CGIcwos3GcM3HeS0SneQtWJC2av2EJChRYq0cK1miEDvEgb03eW3iwE0kAsLWyZ6gLm3duucKF8z0/HchRjwuGmPxqtmz+krGqUDbRmHBvqvj1fR9f+bN7dm7c85E+229ZoFiAgAAExAHlzJbhXVOfeO7u94P46ytXrowurVvsLWlddlBBWwpJ1KKddgOVbkXRBOnJAq5D4cMpWGXhCCMILLnWtVWo3AcAy+cs8hrmDLJpaMKk8RObJ3SUfmpbtkeMKyP6J+zbYWzfvfO8/+58+VPbdm+bhrgFWWZPKRCTiGGqRnzvuWUzt4AIz21ZQcHpGZdA2X+ofKSzbMNG7MruI+1qWB95dVEGmGkg049NHetLNBhm6QumurjaHAhmhOqDbYJpm/s6F+wf3A92FcOE9qdVBhoGMJYqi8fTOCp9iogkuSLpIw3rpzIBeYEPMEKCKJsn88tfn9QhESozxrQBWDl2h79bbch0v1WAR8aqli5rXYYlS5Z4H2v5cXM85/7NUCR/8BGGkIKxgFUgslZe3L2x7OfDz9V+sAUvNt8bjay85iHz5uw5YYp2Dbbtz1l/AIonipVRpdp8GjQAA08EmaFIhogskvCQhv3LXlLGHrrquR71Nk0kd4psfKfb/x/Nzz75Ni8IolHHdTO+lxvrjrZk7WvxbJIQEY1EOMHIyVAm4p3aIfsqSSD2qFnawi53rEunlZ7cnxkYaM+IZyOkDxxqWL1OQIGIbHhAFgGUAhkl7vQJJ+mLK2d9//rxF6+BCBVSOAo4DstGAFIMIxZZl3kQcNfUNLoPo9P/ycUzj/lUHWaCHD+TPwlQ8dQBKwC1zKr8Q/O2jV/eZYonWI7bgCwDBmCBCjw14Jdhgyl+S1N28GKkUn+6obkh0tJU7aEhSUD6jTYECc3NvKq+Pvjq/r0XBtEoOBcxhJwy4kAAGAoOOWYdZPVxmig7Y7Bn3N7hrlM8BGGoQEbEv3LQhiUXi+jY8HZbEbiPA0BPeZhXXwUYEgqEKDAuWzKaVcA04lcyYX6OKDGKYEPmM+K8/aZAYrgvZ7Bx19B5zbN2nwRg69Hm7B7L4BEC59gqAKhHs22hhdLY2KgSiYSkUimk29vpEG8jgAQSABJ5qeI3K/XkDQED9y1ZMtxy3bpTB4LMJVlkwMw0mj8LgFnD5DyaGI+bubPnPA0AN9anpKU5nT+AiW8JATQCEYId4cses30pS5ryUs5j34dWmrMIsKd/77m/lz21i2h8WxKg9LEe6w8xwuPn1rAxTTi1rOrXE0zJR3tpiGlMCrANDJR2aE+mB63b2v/uLrv/oV+1Nr78zf/sMEteJVe4CU0oB9z9fX2RMMp8YDSLFVgFS47DZM2mOZjUdejtnTf7bRseWfNM/y7mUiOjiVAESxhwTPnK7Y9+djdlImFoWQAEIfuFW6Imu8UbzkbpjtSC6yIztjYHK+vPFwAYL2zjJsycMEEAwsjcDp/UMiNLLL4YNX/+fC+9qlVGDLW8519W7H/sbVv2dZ5kyQqPFU+xhAAQMszFGek5/7TzNwJAbX2tAEAWygEzQSQAIJaZDkqFJQo1KgF10DgQgDSDAQx7GazdsvFtIvI1IsqNrPUX1VbyKoBunz13d+v+NX7X0F4dssOM3hzYWhIYM+hnKla+9OItH5TUR5Bagltb15k3N5N4EtFhGH6k/jopfFsWLgxaAGxZkIz+fUNDb+NbGv8NN7/v3wE4+bPR8FEu81zmxILLf5v+8XIj1w8N9hpY0VB0VJsnjNgJqkR96KzL7/6nuYs+PpTNqng0Phr6Gc5l+PAvhiiAkjaATye920I0EQUFA7qAIwiIBGN9e2O3SjiIwLKWfbkB6jTeKe9ub2itW7bUQV0rkkk54lShkcO4pEKxr0POltJ7TMEQYHZqIz6//XPRbzVjy/1V+lcvZWI37h5yACcHsIH2NaAUmD2zdXiSfmjt3k/K2cWPNFfuxbOo4aZEitB0jC6DNFsgDImlUyNqdikaVbYjUBoUpEQqX+wcuGGrX0ywQgoWhh0IGRgOwuIdaIA4cshziqQW6H/ZjOv3qpIy8a0NT/v50DANI+tGROUMza3Auo/NzW35OEBNidCNNAMI2NgyHS3TEmRBKgIz6uAjKOsBihFkQspdsiqfZm8BKDBb5Kxrd9jy6s375FQAW1OvYpi84Ta0YgpKogSCpJL1Ko20bWhoMJAko7aWEHLjHjCUmkbMpf+dECNE2pFHNmy4aEemqwyUFRJNB5GDGSukNJdqtyNRMmXlDQASgEUaZCEQxeMp7mgdWA1iBGRHXyyDEIhFkPUA7WCsYU4USnT4lLUd2Z6qtTtfvBiC9vuw5Jjp7A7FVTPa/eFEo/rI7Lc2P9vxUuu2Pb11xvetBrFQyNKjrPBQxLcveJ3Tz3ux9epb6ha/1FZTqxckkrYlnQ4OrEftBMCcte656Jad22MYpyDBmNu1FpZJlNKwmcy+WcBA3pElCUlg8ao65yoUvXS7H3nJcZ23BNazEFKhqIqDHpXFb7Y1xzKOF+afk4DgA0IUtxoVMX03gNzWGTMidyxMm3pZAQB4a/WCvQ/GHu4kj6olzOMgkITzkJisl0PcUac9A1QWf/rTvaAb/JHDeZrSwlph846tF3W5PoFhyIgaEWJRQrCsJRJx6KR4xeq3YeI6JMEJJPLyODGXtRqPmIYWBzI2tQeAMhaGBH7OB2l9yF5ioUTUsOdhX27w3Hv3PX86gGdTSDKQltmYA7ppkfvS5JKXfgi7GxFnKjw7ElQK00BEAMXcJYP2mf7N7/1dbvNv0ulld98HOElJcrg6pySJg1OEUkiN7mOpQ/5bOgUgfaxS2usOL0h07Am+b6rf7A40B3c3PWqu+a9lkWlNL/KZP1lp7l7g00PPvMRoGhMBSEAh8RpXaYMgfdC8pz5QRNiC8nubgI/ideTVlhUw0N83PJzLYc5tN+tMLjP6WZQioPY1DP2D74uSCxb4aEF3Gi0meVeyNFW2LMC1KBjQBfx5dAxUh8SV4sYs+2OqZAkgHyIEPyBQJCLr9nXRhjWbvvK0yLoLiFoBoBVLjn6WpgHpvrWsadDzgJ3eSZ2l9PvfL44DJ4HQKX9uEnFoXaKzuNgC6yT0vECAs4PS7DlFqeZUrvZLX/zh9J1d1+2mccWKI8I2SxY2lNy1Pvd7jrTuM295EsPnLKxtWfW5pruiSDTgqCwsAqwfHoGTex4pTt3zixwtSftjqNAESIdEgiJYC5n7ubbuW5/ZH51sVLFok2HkZcdBFgoKAcVBdhAMrx1os2HIMEVCaYH8WG/u9S/cHRQJOyQSBAfc20QwAjshVswTne7HgS1DiUSCm0YNmQ3+OCd754xBWyWeb2PKdZXyI8ibyczkeoL+fqZ37gwmlAIhH3H4twEo0ISimMm60Dt7ui4mYDlSTfq6LdfxjDvu8NLpE+PVZRHyyHEAIFVbyaPeSoCQaP7fyUSfT0K2JmRka29qH5Gnozw1YsnfPPyd9+0KesAaVgyrsCImzOXVrrZkXK4qr2wtQmX32H3fb1vtXth+1+8mDuodut8Y14nFxSGdJ44k8SWIFceiNopE29A2B25kTP1yPsiv2e5CDz2zcdWleiqWXX3/x2IzZaku7biXho5TFxTfPElfVtOmJtDf9H9z08M/f3b3+roNshPCChSEXtAg8MEOy27pkbY9axd9CW/7dn1lZaaltvagtWUxbuW6uss4mFI6XqJKUS6AZg1DgCULsiHDbxwKU5yKIQABkklCOi2NaLQ3DjTEQBg6aeWk+yJb296SkREBZAFZhlGEATMsmjUp0bDWAEoEnk8zKqd6555+/hYikttfeKJ0yU2Te1rQbADgHGBf3/6BDhVzqo3NWWKlRk/fQgRm7N7Vecpj256dWXX/uatWJJN64YGDgRg/iL/zkW+c020GoZlJhEdzBYkE4AAlVIzpJ828D4CHVHLUbTowuGVfLCPfmpgtKokHrrDjOoo49ApAiCyRE4tGhyj7vm3eHiJ1gBQBRLBGQFE2O3Jd6vnerZcAeLa96fJIMoncuVvb+dq/eZs+HafvmlE2pe+Frp0nCefEMZaMhARAeY1w0lpkddd656crGr95Z+aFgU8Uz3+wlQ6kWh0a2UiPumcIr2aZERPs2Z9waNXSIG+xH7b1Jo1QwDvB8vDrBk0JGhKo8D20Jwh/hcf1dHO9BbWgbvLioDnRbL/f9H3pGGymixqbJX3wweQ113lJAKlUigGgOdXMj3310UBT1iKXgSWfmCJHZzcAEBbJRQRwOQoRurj5etqwYoFqzv9Oc329Tb9G4bAkgNZrljgj37cCWFJ3mV2Rqlclp3ZmWtEJoMDCUcBhoLm5HkAaZGOkKQcI5zXPCKAcQAITlp3wIErlNzvklNX71t/zsefXPnLqzMkd2exwDzEfmFCvzm40Ih4bANDEEPZNzh2WzpfN/3us/7kK+99fmxesutCVJ88uKelAmYF0yusFwQgMzhfKdsdiBmgZWbuF0GSeuust+N5F746l3KKXn5++99nVG019xo9ZZTwlyoeFAsQhG/VMR1BW9Ztn93xJzv3eR65vezhoSzXK0UWpCGTDYiYvbop+c9rl8X/b+s8JWyJRBmCto8j3Hdeh6A2rttXu6Oa3bwpU8V5PC3HoYApYARLmIovVgNZUSkOYGBt6nCkdICncUNtETYD99dBVNS/v7Dp9yJtGyrXKsoDsCHOnCxLi8VEfp586sZ1o7nAyDIMDABowJ2i6mP5+JKCsGMgZoXhUi4ggk9tTUhGtHHhv644//XKDvHUwEEshiXh4sGKBCoQ7ewbxLLIfeELkWw9Sqnf/4hnRO9JvYBYxHYiRCATKEhEpBQArE26+UIlC8ur/rRAGWQIhRwCwt7Jm1FogAOsxXNqV7a4bdAO4cCkwGpA8/ToR/MBgCoppRkn1M8ScC0UQCSBI/Youu7LhP/6H8rRtoQDeAYoxEaCkuBTveeBfSrdu3331kDGGiZXk7XorAGvmPjtIHV7f2X7X0OT/+un64cmLEIG3P4u6uuPSBVfedpvX2JByrk5eFT9/5sK7l7c2f2KL6plntW8dYvYlACkFMlA5GZZne9ad+82Xl1/e0tJyd+ONN6qGMdcq2a3dxa2LM19e96tLg2KlaZgMC5RhgZCFUg6MMhSFi9KqyXcTkZ9obFRN+QEZqf+cYZB8Z/IfXlrZPcn27t1K5KpRY9VaAYtLIgJLBloIJqTL4moZ1zWr/OIXAeCJk1T25fF1AC0Z2fgzE4snBGR2hYJIRIDVB+xCC2QiBJRFYjVNtUFzMryjZCpJaaTlzs2rTtu8e+dphjxopWkkVZVAsDAwfoamlp5s506YvDl/8Bo1KG8tfqq79Zr0LRqMfTggJw4ArBRAGjl/qPhdzd8+beeuPadaIktWQi0VAoQ1hH3ptgN4fsPqRSLy/fr6Zr8mBb7w9iZTOe7jMU088JmnfvqnCSg5rYtzlkSgSBAYm99zLNgPeEhb+XX3c9O33bP3gY888K0/zp49q4WLY9uq4vGhSCCdRQaZAETacWQw6zvGmohbXm7379ob24vek+HoqBMr8vztXZf2de5rx48nfGNBfUo1VKWOaJ1oHpru1CPkqQ7nBx9s1OU5sVkcIGAfABbU1FDLX+EKAwpTGNNEHnAwP+3hru5jmA2ARIIggkGbHfY1QJ4jDBXSHh7xzeWXMjAsswaRbF2RDGjhnWNyHlte8z7z9+Uf/NNlWHjIoxUM6AL+LOrRbFuS4GlFvKk6HjVtw54i0iKiCOKAkYMlHwIHzHHa5inZZpyTKrLy0ce2GQRmRBeFQsoa8vBaxicL57NpDZRlnBvbv3XmotRlf/ulhn1XvK2RMfE2KXcdc+yzH2gpyUq5iQdornKqT9t026z1vQtXmzgb7YLggyxDyAOL5d0DSlZad9GfcPn8iyZf+sx32q7XALwjNe3EClTERghAz571snnqFfMefnLb93Y4FfAcgmUFJRGIEPrVeOzPMMBZ42BQuSLwI+Nhg+EDK4+CCPppWtwOnTuv9nkBkEiB9jYnCAC1d6KhJzYhhowxbEiNVcUSIhGxXNW/w4sUV7Qmk6A8U4YAQBORgQgFqXxUv7aB5i8hrrkOqKurA9GnhhPS6E7viD1XXey/bUNvQCEPVT7s5mYRyeV42ERk9XDx1Bf2Dl0DSd9Vl5Jsc7KeDwndFXAC0NDUxADsn/a3nb+rf2+MyNjAgEAHCmpEkVgDnhQb13f+WW/5o8j7VCpVI+l0yH/esnBhAICkMcFoaoKBBWogaA/HSSOSsYam9OCMadN/VrG15IpB9OZVmoSIwqpeBWYv8KV/OFuz1L50+ec+e8EdH37xrvi4M7cyWk8/PgcbImkAggXJBTYAOs47o+7Xm1/Y++WtuQ4Bq4M4t0ix3aV61DObXvhbEfntouW3aYjYkZzqPS89BKaz7bt3/mvxMDzAYfHNAWHmQCyYCDpn0T3Y2xNeuWn0TLFY5gWSTPI7Tjrn5V8/++huzXqytSL2IEKTPNMECURZAFpKUYTSiP7TBcD2VXV1zvwJF/QjzzKRaEwoIjKfXf2rFx7dtP78/uHhfGSKRzsA1hhT4riZju11aZz5cCLR6CINL92eJhGhW1bd9YEBHnIReMYKqQPEXAIBWYdLuChQ29960uRn8uwLo9ZMKy3xkQQH7XlW7Jr8f2sPWUauGHirTgHDs0ornx2/Z9y8vcF+C9YcMpaEnl62rIeMj/5M5oK7/dWnt7QsXDV13oNF9Y1JU3+vlw3wFfehC866feXu1R/Ynx2o8lxjkTUMpUfqXSFE0KzIguRZfwfW7ut5R1nX6neUOlGUR4qAwIbU0fn7VhYS+AGoKIL+4SHVkx0ID1JEYCJcXH7q5k2NiR+1UMO+xYuvUUdiQE+Z6Mjh7kBCUtBhfjUbgOi4JofTG5gyWDCgC/izuKYzpdove1BfVhrs/QWoD1oqyBgINCAKysYhyoOoHAwELmdJclYGTZHpBhg8tgz/EA/JK9YVFco2kVgY8Cw17IwDJkh705b6SjBmz1HZ2bs5eoz5kiKgJqzK3Uq3evrJBH9hQskfd0wcaN+yM3vqoHYt5XwGcehhBxGciFkv0cgDG+Pv/+bizsd+njrK0L8IhGJKiPD/Zn2q69t7dl20S5WYdUE1Q2kLPyAYhOXa5ImSISbrqgBlYAh0MIDAHtjHmNlq6/GMKG98j7NyHZLgJiKzILlCE0PWZGIVnewCnBO2AGkFSDDiu7FFDqvpJerJRMxb/V/NC9x0C2XH+hiSIDpAP5cUJJKjm8mCuSnete8/Ip+bHLnrV891XQ9dVglrBHAJlsG2DL7uB4htRMqcfb39l6Sq7vnN5s4eLvvXMwTplv7C7DqxaKppUwCb1uefuroHw8UgMWQp5EceOZRZKxounzJx6t53Y+o6oMmmv/qKCStoaDL5MU3JVIpGDKiTamvN4stWOW8vi7U2j5vib+/u1lAqZG+zYXqp9QNAsd3k9/ATG16sl9svuKu+/mFzOmqc6roB77g8bBKcqE0Q2mp4IZH32z3r7n5Mr7x5i99RTGGyMI3QV7OQGs71mPW07x3f2fDI3zxw5Wd+nkx280j4f+34DR5DwKXR4lyPBwtDYCd/LhCw1rCZIZRFKjCnerIBgJpEzYgaKDW1lVPZ1I1Fp2BS5/iSykfd4c3vz4aEdgfMqBHe2zDLHIoYxYjAuP4DSKXwxEcvYqxaNRruHwn6D/iD7dZYgJkOVOqNRAQgQ1GL3b37JjEIrlscHXPwpz1eV/1e9IMdTWQPVgqwAomrIsydMbtlNmbv6i/tjxBRZuz6cDDtxoFxkEql5Obly5Eikm9teOAXpSj6aJfZp8LgZbjEi1iEXghrt9mB4m1Du+sFaE3tykn/pLMdtLZmvvmNWZEv4FNb/jj+g6te7th9VbftNixg4pA6MKSetuDAR0QUWUUYMj1mUIF2eUIY9ENaYUUHu4KJgcF8ENFlgW8QcRyby+ZwYfnZjou+0jU1Nb03fmDAFiSSC3hNY7/QBX8tARMJw2IASjv7aXM2e4SnqgorGEPQegQYqE7JW3KznCq0b1NR+1yRZhFxLDNA5CGgkLSGrA6zIE0cQIQsspr0MEOIYRE2CIOyDPJevfEQE3JMyDGrLA/7kp2BzG4kQPXNTXzHtXvoxV3uALALJCRHy+mQT1AzAPBttzGYQjQ8Y3xw15QiTWrYB7n5TBXRIKvBYqkro/DSpq73PIju01rSC4MRHqojPQ5DMay1CgSBqyysZXCW2AyxQj9HdJYd6zMRlFEhVZZAj8rCahiQuIh4jEAZmVYEmlsevQe4YHBP5afi31uxp3hTbZfTYTqrNm3bXTOc8QGHyJKADEFkxCHoo9zRcuq0SSvG4eT+7jOa5aDCFoKkUsBoo7R8lb5qR9opJUvouiuGzYVo3H1qudoUDxhiIZqy0NqBbxg+XJC21JELsHGQzwbcsnVDT8vq8RXeGzdXDrA1hhFTAijk5toO7/8Af2ZeTCMc5AIAVV3t0phc4yZvm6xXiZmwYXjnxX2cAYkmEYLwyLLAELCM10Wo4Ngj2nH7GtDIr+vDIZJUOj3adrbB5NzV6oLSmh3T9MTnSt1iiPJsNMgB8EM7URQUNA0HGdrb33MRUqiqb77T2wu2na3rj48DKg1b01ZDQDsA0Luq5q4+9eR5j4znchJS1h6yIJDWsj3TSav3vvwBEVE/q+h2bvnJT4oAoPWWdRJYKXGD4Pys54GhiJDnOgZBmQAwFlPKJ+OiMy8ZBIDaptoDEer2hImXxnOKKJuLFd1VGimBKE+0WBB4lDNZSKCtBlkS38vyjOKJ/R+75Po2Sqftb25+DwHNCvkivhHEBzL7o9AgTVAjA588SH5dtrDgUu1YCF7u35Gpk1VOcu8CegD9c57Zs35iTjxAmNhaCIUsswyBkEczyipx2sSTVwDAzstLzSFrmbzWOGAiuW7RPZYAed/sy1+aUz55k6YYCcFqK2BWYEa+8NBIp/TLk8++eFaESB5sWSHehm1ebXu7rHnfVAO02LdesvCf5hfPHJKcMEfYct74VkZArEIRRGMgEkDIKi3CWjNxVENpFofUgQZXtNUSgSuOr8GWibRDFkTMjjJBJjMVZT217e1+VX39KN8gRAiSLNhMBRQM6L9OhAb01KP626ljNF6PbH9amP5qsHN+QoCFcskp8d/Pc4UsxUKqUVdgdZAv6NCAMAIYBA5giUO7RQ7V0FEhf/CrtXwKQEi1xgA7wQQEQ9QEA0T1r2b0yw0L01nGbiLiYzKGGijvQZuPACJ07pzSX811e3eCo0SwVtlQV9ESg9hnUdbssOMrn9vsXQ0AiTAcfuTmjbGCfJGF1VBMijBSwU6MHFkEyoCsgbIEQ4SQUCqADweCCMBRZGJRf4Lv6csm0bpLaib9IJUCDy4qK+pT98V2tFX6P1+bfZ8vdLGfyViIUXaMcUWwQOCrCXaQxo2zTzenwE/mYOkQ6QNKw462fMbmyP8u29xj6zrqAAzmzjqp+OWTiqIQ0iLwIJSDwANZBqzQICDrdw3V3B2cPfvKn60cvOOOE2hLgiC+YQCIIft/h4CeAFbhHKlpq1FtW5/l+mUd3sodT76lK9M3wzO+aI4wuS6E8yTzRAIDrlSlQ7W1ZzxgAh81yTY6jI8a1U55rKKT1BzjEFF2SvnJd8Z9FqsQDnNH5XMmNNgyG5PDvuHu2T/c23paOg3bg/Ljuiel0+mgKd3kJZNJIiJzTuW0O6fFq6zJ+cRj2EFEBMoqNYBhaevc/PZf7H96/sbPfDfYgz246f7vRHDKKQSArNB4Y8cYvRiT22pBMuwjFwx7B/cNSUMDmVQi5VsAH7l4Ydf0oupAjB9WhtgxImlEECMASJR2aUq0Yu9lmLgZAOpR7wHNo2klyUSjAMC8ufP6x0dLIZksePTkaEPPLBFlcjns3t85SUSodf4SW9fa6nzt0ZbgqecffH8WfrU1gYGECQWjPgGyFsQcGbLd86bMe5aeaop8qunPR/1GxoAAWAbguuuui04D9swuq3wxFi0SgQjnCwCttQhEwEQ8bIZpf+/+d/yhZ+XMp2/5dvb8n33Gb2hqMneevDBLELmK5j5/+RkXp84tmce+LyIMsQSIk1eQtYRAEXwmkNKw4sAGDFgXIg4Z0IEmRBaKPEtkWEMQtgAMIg2YwAfgjwn9jxn/tYW0iwIKBnQBh4/r5JFoR+UkWvvMR8Ytmdz6qzOKgj9WO4PKBNmAAgu2Os8/agHyQZwNKZhgcfjpRzK6GREk3wCCUFc+QbMUWVm0HACEBjHBsQR9fNTJSQCoS1G+7cxxg8smxH2CT9ASCkSEBfMGijxaNxSTpzf13vygyGlNDQkrIsemCmJwoJ9EAdYNQ7jsgchCCUBkwwYLYgPfVcag34wv7nGunepuvPKsivefmqKe88//jtoMGxnYsSGIpBcG7dnYJdtVpYCdPEfAyOMaCKyNM2NucWbzO8fH1z5z9rWxq6uPLFcs0dBo6xa3ekh9ZriyJPLLSHZvP2nFUFFR1gORD5BFmFmobW9kfHTNdn4X8T/b4aKUX5hZJw61CaD92W/YeknZjXt3vH9vbtDlSNRK4IfFg/mjE4mIhqZTS6b2Xlhy/lMAgFTqiNKldt98cxA7/XQXAJ923gUPnFxSlUXWkMcsgtBbaFkQkIBYzA5/n6zZveVyEeGBzaVcXTf3uB9y0um0vWL9/ZFPTl1w74zxkx4tiZawWBmjIUxQPihwYNfl9kSe3rDmMyLCO354X273uIBRW8uDQDRgOBAL8YODOI8thwZvRKs9E3X5biDkEH+1xeYMnLK5IuvuZB0nC2NZjcmkFAn9C7BSalxEnehypdQQkuA0kQWlR6/Z3tQUxgwkakoQBayD4JCgGBMjG/jo9/0iAGoBrnOw7F4E9unSbbn91+7J9EOzJhLAUGgQ2DwfYdw4mFcx/fkrMG3d9HVtUjK584iMx+2o5fHvuL6YiEysWP2ixCeCFbYEwJixlinB+rZDD1a29nRfC0BqaxtprGf7KwsW6C9Me9s331N70b/ML56n7IBnYWFsYAVWQGAEikIeeuG8aZN3wryqw2hE4kUQJhcJlJCQiJVXGM0FFFAwoP+SXUWhAACxDVtoMVnm8LDMbC3zcSisIStEFsRWmM3I54RfsxUiS/xKe3AGbrc/++7ywefVTPrKjo8PfOkcvvHqysF1k4tYBzkl1rrGChsQLJENdwA4gEQBG8MB+XAZsY4tmExoEeatQlJWQEYERqACSzowAhMIbCXCja6/o40uXnmyChOkfS2KyYKs5O999HnyfZb/9/CMwXzG74LTZ91T4+7MGDjIaW0sk2VL1ljXsvEhzH5bZFLVk/v7LwNImqiJUxi192FZGaED9yRj3yMpa4nNoTqQ+fs0QsqKRCxZbdlqaxCzHsetBRkr1lgSa70AMS+r5vKAumFc7sG3nzfwsasp8sITpT+I/nzyzXpi4/QBf/lC7zfSPX3z7t75PTlHhB0IrLUj/cRiLZOJu66ZPqn0oSlI9k6a+3a3s7P1iDaNJjTxx98/HFsyeTFdU/HE4zNLs9tdE4hB3NhAGyGxQmIt2IqO2U2DZDfuGaqzxkSaGlLHxUgSpUQYJv/eRxxMYQvHmAGPFgGdmE2RyQqTAZMRkvAeSIwQjDCMsBhLZI6ltKUnVDUWITJgskIwQpJ/bhgQjADGmjApdqh2K6O23QAYt37f9rN7VWAsjBURIzoMdxBgLYmJsLJVReWrTwf6AKAZqSPaJxoJ1t/XH8zGbOf9qOieGC1Zq7RrhCiQgPL3KUaYDCvYbhq0G3dvWQAg5lU41NzcHL4sJiscvj8h5J/xoHdrhWAt4ofVk+f/bJFpIJJLT5ndOFmXGkNWkL8XS9YEEW04MOjhoeDp3Ruv/GVPxwWDLYNU8+Dv/cTj1cF9Gx+NbNm1XcPVlh1tBHLgWTQCZjJKyb5qjO8dMcoPXuVJ0JhwalntnzBuwnJHucYwAhFz4DoQAwfGMGx1SaV/+slnP22tRSLV+IqxW5NICABUVk71YuLkyJAVNaZ/w/FmDVsbi8crAUSAGUH1sgFvD/wJz3VtqvAi1oRrsRjR4d9YRTYwvjmptMLWnnzG74goOK+olOrKew77IEUAvpmqFpowLwOALq+94NlTS6r2ugGESIxRMAfGLAw0/D3oN6t3bj1TgdHQ0HDQ9QabmyP/dF0yumBO3b988JwrvrigukYVWVfBMpmcMWQQANqwsGiDsAh8tOU5ovLRKBBs+O7CddWIMSLWBsZnITAJYse8LhEZIVjLY8YsIXSC5+drwfoqGNAFHAOSBLqx/R/G92BzWWawF8wZjoroCAlHCByzrBQ57JKnHM+owSHrERFm3vGhoLXu6xbUYEZO6KNfvzYCHQQRN7DsGqVjIsphyw6DI4ZVJLBO1OSYDcq9nH8Q+eJXqclDOm0/VIfunVO/5c2+d+Kud5+Vvep9M/T3L5rgmYmlniqLWcUCtoEmKy4sdOhXJQBwQ2+AAWCFNDNHBMolYZctR0lURAIu1azGx0rUhFhEV3HgnhTVaooblD2Bkony4YlFcffT6sEPnVT03fYbx8/A7ACmN+ZozVExWinLLogjZDkqYG2t6yiPuT/rCcC9M3qL8So22yqpc1ZJndNEZJYt7VRz3Wd2nllV3Fwdt+xYoyIk7LJwRDSzirHLGXdXH2Plyq3XS+fGqufXd1ZgaGtVshkqiplOCe2vcIOAo4Z1BMwRUhw1UFERhs3qMvSpUtfMArZqAUgHKh6hQXYpUJoc5SjmiDC7YI6w4Qh7XBaPq0nxiJpBGb64dMjeUN3zxHtPr/js++ZPb3g/TX+8sbFRNfT/be+sM5E5fUEm+8273pFZtzl7VV8umK3MEMcgOgKHXRZ2KMeuKI7krDPF9ZWaNO43+/b9HtcM7wyWfaBOjiSvuwENVg/Nzi5bvNRMwuWZsyuLXphW7DMEOuo6KgJwhBRHSHPMWCewAW/c33vh/R0d81fJsuhBnyWHb9yKCJ3zx+ec0FYtLo9RkSL42iGjHITNFauiRrQmUmrQxKDHVyTWJJ3Whq/bN8yQbsonyFiORwJXURBxHWHlgJQDVo5AaaNclY2o2CBVZo1XjFEis8ON04QoB7LFQbakzIeyVmkVKOWIVlpIacuarVaOiihBpgQA1DffppqaYO7IPPO2nqG+uRTklBsYRykoHXgqYqCILDsEp8pTmFQ0+dtElF2RTOpBXHNE/UUAls16e9/ZibMDAMOzK8p/P1HKFISciBalSasS66qYKCXkODZrVaavr+5H+1ecdta4F/rP64vHACAmxSVlNqaU77pKFLswyoFVGqK0WK1IM/exE6CZE082xrZ/fkf09e5raz30DfiOvqrq2ntnRWZ0xnSxVnCUhqs0XAWQYo4qxyq9M7OnrHX1g//fT+WBaF1rvVtzazTSVebPyPYPlbl+mFwb/l1UaUQVWzgRclVREC/ZNxrWkkMHrqqbeZmIWJw1Z9b6ebpacU65DpPSrFXcOkqzVoa00n7Uqc7FMnUzTnk2HFqv9GanwyQUmq/dTege2hNVRZpYK02u0ogrhyIKYEfnDO948eUz/9/QI7NbkA5S8p/09SfbPtjd3TND51ixOA7DVY5xlWtFKTA75DixnMqdPH7GswSgpq0/l6r8FB3JOK1NJfxvvmPScBKgt6Jm12nFJ20sRxkHYBUhVooiypVo2P8cjwz1Z9T+3bve3yzragGYsetDMZDDHSnvIpqW+/y0hd9seMcHrn7f5EvvPztysplUMlGNixdrFRhlgyz52sIoDaNUvunwFEYKxhNYP8euQ8phq0rjEVVRUqomq3E83zk5uDgyd9U0v/yrtwHZRDLhNo44Zg5nn2WS7264CUCvcj1dRoHDRUY5mkgpUsoVpRQ8RZ7jFGW1KiopmgoitKDARvTXigILx5uI7pvgzB03h8vx+65To4lHKp0ORzLeIAANImHDNnCgiQKJDueGYzxjtwCoW1YXYGnTERoBS6hCfWnFFeP63b5sZp9DvljNCsQgzxpmjbIYl5UTr9BMuWQyySPyxQdC/2nbBCAljbH6js/3fWde3dfumX7jr17clLlsa1f36btdZ2aOSk5bvT9QQjxqpShNMGQBJlQ56Jvl5DZazwZgw+CAYQOfjHBJWdnQlPJxQ1GYHPtZo2PRPU7RlMeeG1y9b9ItFzh//70Jg611E8wvz19UWgl0zaPcfaWxbfNt4Bth6FA6NlRO8bTYyU4s7tCEZghk3FY/Sin0HUr7GEVmpNCH1se+6V7c9h5/3qS9/3zN4M5J22yX73Ceh1IcsuwSW0/Iip0qvZlfrs9F7Ekd/b1FvTSuOQlMQf9MPXTfZSXeDFgYCW+FYG2gCcqLu0Xlwz3d0cHiR9B8fQCs0VZFdpxTnHtuYm5XDrqHCZ4QvLBsnEJm3pmVE7or485+35rWObOLNs+ITHhmfBP2B+/5o9Nat1Q3NDT4YZgaqJD19tndL8bmD8dz88blnpngdTiOh4wwOaIAxdCsotoMDnvTXN1bVjZh4/fa1uVSA08z6mFwZARCsmz+Ej8pi5kI9r+f6v/JJXFbM126ORJkB4XFBUL5XbFsfFciJ0cQdK0d9K+c3Jk5WvnmVCpFU2prNQBy9vZtnKcqV+r4mdbhsDhShAhgsECMBDK5snxwSLydjac1W1zxHk1oyr0R87mtrU3akgtURW74idPU+MfKXVZR7QBgDklhBYFnhjxy3Wll49YAyBypW3yMVzOYgnEPXBQv6c5G2FU5L4fANxYEYlhfxK3m4gG9p28dAPq5OyFIIslblz+xf5rv/tGN1xRrxaMTXFnAOJq1ABFjt1SdtejxxnzRxUxstq1HFukSAGhsbLREJN9b0/i7i4tPvXLX0B6fAglcN6K05+VEs/JdN8LEVDZIQ7s3DGTSE9I2uSaZAwDfeDtmBZXNKqI0uXDZz/rELtvQlhHDSheVSWfJprVD5fsUrQnWmD9jQOPsWxboSXc07zvvwrNS1B58dMDP+UpEgQjQOkYA2CIg3wtM/+CubO8aNRmTzbXzr8l8M/vinjPGz35sSiRXmrNZTysJs6EZ8AJjipWr5pROfaIO2Jf3oB88tluXcWtduQWAiuKTmk/DSctLtC5ywjx1pUzgG6V1oLUTiSo676R57YLKHSPG2WukIcgqTNozOzrlT0U87owsBx6JbxBWiIhhq90SR48TZ3/vLncg+eMfR5nnZz9/9zd2nR2Z9MSQniJirFBeil2zOJ5ijrqKKyOlbWtLZ7wkALB1q3vf+l8cURR0hC86n38efHPVr29fWHU2d2T3a8lkBrQTcRSsCAMBa9Zx0uV+rLu1fYsnSPJY+rE0UZC/Jr7yla/wjc7ZfxCRR/6re8Wl+7bvWLS7q2vKBru7ksYVnbVu95ayjGTBYSkkWCk4WsN6PmKlMUxBxepIhveQgp41ZfZQNbldHnKPzZo897lPTKnvaAB6l6MJ7WgKjowCTaDffTN3oMM7tWj6imK/ZI7yhvZb5cQta1JGfIHVNhZX5VnlF+fwAqylZCr1xnHiF/DG5g6cqA+SvALWndI1/z/u/NJDbXrvOBWPYq6ZsHRj4vZP3rBUnGVL8H8qL3JBUvTVs74Z+cLjX/SwVPQWZKqiCIZLQDQIII5ikwG0ADIJyN2M/fJdjB8AHXna7f33z45sXnSPcxZqJ56N7Zl9GMZ4TLVFKDJ9gOnEcHQ34m4zsDtFKY+Qfs1TcbJR3O7ODXTJufcWzTN3yJmXrO4RABskM3trdvfsR3f4ZliiOc2GrSjxrReI7xfHPENT58Y6LiueuX8uMNwH0D5Az8KADGKYBc+YErT2E6W9MZ4MukOuizx1b4RvvqsnqK1ptA0p8MDNN9Py224zwED5IIj2o1gBQ6hAUTCEQSqCyLMoid+zYfnu2+Ze6TVsfzK6d+qFfkt+IR7BGqlxAeA0avcWL03GqzsQpNLp4BnZUlWDGTKIQZmEYtmMQRYMygT4AdCPR1HL/9DW1p847bSgeUGSb6xvZ/Q/pS741g7sByqmoMvGQz1dKkIQANW2HSiuAfa3tZGHhka017Zh5W2fdN4xaVLRhYAtAQjYzHtRTIK4TESxGQBQAnQTkZVVcNAO98boAqpsq/IqKm6g5YsW4YG5lBsbPHzww3fF+3L/7p/f2FZUDBRXYHduH7TOgthivN0HOFMBL4M/ZKc3DfcnEw2Swghpw9HOb5AmyHKRyWcCtgo7vAFMVYRBYvQ4cVj7MqZHeoD+ixoa+tBUIxg7xkJKLDm8bUrosz9uLus4t3648bT58pSsKrlwjIN2VyjVwwFgpgL+nwD+TFNTpi0FoBaGmhqOJDn/iPCxx79e8g/Xr/AiG5bHp4U/sn2AKjvweTYfkukHwSccnRpjIpFQtzY28hygdC8Qnw30IxQhGoFqBejrRINNyaQkatup5vs1lGpJmzwNS8mhEao+QJeF4gHDeePnmPtIksJbsdXdmpoxrh7I5vccD+HncJhWAAsgaEg1maZ0g3fLC98oOv+3z/hNqQS+jIRzJsD9gFsK+H2hUU8AJAM4ewCcRbR3zF72mvd8xfr7I+f/bCWlmtrDPm9r5DF9RgBK+gCUhbEy+Q72xJ74/Nf7Ezsv9L6/t41QP0N/PXW9e37oePLH/K2MRHOZePhXNV9xG9rTr2SZkRUa6BJQg6mpaXTb2hL5XLeRqj8EYagObgeg7wP6vtPQQO1NTd7rTDz68B9fjH/8HWfSXCA6Gcjlr5NnSUasA1CTgf5lBOlY0VzU1NU13N7Q4IlIND8W/UOi0Zx3rg0RKKRNCVUVj9lTukpkQhkQmx0eMviQ/nMB9FEqRZROB/I6tsQ3d++OP/yv/xo88N3v5gBAhVzcJSuxbepDTz49YTgTkREfYRD3OR5lJ5Pxh6vjE9wrz6rfMBfozveTEKkAECBh1bXzfxiPnNwXNCVuyeIo1sOb7pfI7isRNAp4ABhXEs7LWD+gSoFMBxAngKqBTKqtzUt3NVnU1wO0MPg/b40mEgpNTab+3i//4Cmz+W+94UygxNHBUVUZEWBzwaTiKr2k9p0/Ts+55mMLViR1y8L0ce3nggf6TURzmkwKyCxav95JP/Pp+Hnt9+2hG7ZlX89I+W4TGEehoLZy0QZzedOFfNJTT3dc+Rz8lioIml5R5ccAOPVnNs7rh1L8hzMq9Q8u/Hxu3LcutF94fG/JNx56fmgOxTbKAmy9rHnUUCAAdqxhJo1Q1BCW/j2fBN9emnCabmnyEgA+97mEu/NCGCQSakHNp6gKXbxs8Z/0YlqavR6g3z3+zvjDVTdTI902fH3yHP3Dlz8e+9tTf9T1moY+wLmlv4/WrxCFTSn/lKmrX1fxqfrqa9BdUlfWeg2G9PbbuWT6NzoODdKFz5Xkzz35w0jiwudsKrFGLx94mKquyah76z7ObfWUvW8Qe69uDd9RGpDFi+v0uupPq5b0DfsTn0oW192yNFbz7z/xvzXho3J59f/LXJ5IZ5MJqNSfIE3LYBsOeb+JxOdiiUTSNGxOYOAjtcH5zSlzTedkGkCMN26EPHDQGFmin0KPvW/lkmhDKjWEdLr3EE8v5/uGur9zhcLNy22aIMfqASGC3HS/RD61fPn+jVdemTvQV8CKJDTqoWcsBB68bjo+86X/Kslctndo6eKjM9oZJF+ZIdkttYi0Je7MfZuo76KD+2ws1YxcccVsN5H5kP3W5f3OS9eewWiUHOiN8R1E51wvJRewvpmoP8/TO/a+9DdueSHy4f98KfjE4sfV5FV1FvOPLnzb1NRkmoiQQM1AE9p78Cph4Cvwncic+9drLJrjlS9Zojo/2Imbf7De/e78JRaty3pexZkyyjowOmbym9pRj4s02QWyIkB9qveOlnqcjPt94KDrZQEgAaiaxoRqbEyo5p4Y7ag9STWm2nLzJzdI6xIYAAOvdv01aHQX/PjHUWy9I2hJtZjXcwktn3ult2TpYr3kJx9xLvvZBPk+kd9y4JkFoVE1OswSn2v02z7+LbP32WZn/r5Bdf70+/0L6IYhvHp1NAOgpYuXOuhZbND++jOqvb3BbyCYJsBDIqnQlPby18gBGF4A6HrAphoTuq0xyWl6beM1N+W3/ifmvI82btw4nH+Pr+jf7+CKyKKbFtG9XdW5c+Ze4lz+5JMqz+mc/TMOtvA50+lDx8gRI5lM6vlE+5MAtSNBTWgySC7QSLeMKG3xTVfMdm66eREqJGlf75m3D2xTM9+zhBIVl8gFpSepW255MEeh36n9tZRPJCku0rDzQdSaN54B0I+TW6LPVayViovvVZg6S2o/fbvX1HB0z/ier6fMQqRNK9XxfLR2JQDVtACDuDHJ+H6zRUuLlwRs7UmNkdTOhElLk1yNudH7RMzROMYK+D8Cyecz3Sld82vv+EQPfvpOUXc3yKmNf7csAkYiCff/at8kk0lubGxUImFZ0Ngm+RZ+fQwRg/x1kknh0esTjf589GeHEZVYJXDuXz878mqfARCSItwojaqxMWyj185/dlKSnJQkN0pCJVes0CN/92r3O9brKPm/Hfs1XqXPxvbd6PMeZh81iqh8n/Mr30N430lJskid09gIJSK0Zk2NKxJ+Haot0hgbLvw+KcIiQonGRhV+DQpljw/t/zyX1KENGPt12B9J4VebZ+E9CidHnmHMvSyQFbpOVjmQFTpsxy8KlUyGn/uKcZz/iLFjXCSpd0ldvFGgjmlM48AcGduSB70rjPZfXk3tjVzoRjljk8kkv9q9jf4OHZ/Pk9dooPCdHPSO8mNCXu/vDp4vdDzuMf/u+bXmad40ewWx++icf417TSaTfGR87EKj80Iw+o4OfVcHSBrGrEFjPvPQMT5yj0fqJHvF+jumP+SQNfBwxkDyVdetMX01ZhzIa3z2a4yD42YHjL3HsetFMpnk0b49rHF3kAQNiQglpFFBkjy2JaRRLZAVeoEkNSTJI/0+QvYkrxRGoOPynMkkh+vtUqdOVjkLRPRo3zY2KqxIFhyYh3qgAdTf++UfRO75gNDP3+XrnyUEP3/fUbSE4KfX+pPu+VtJbrj3RwCw4A3o7zc3hSMawVw7/gebG5YuvjZp3aY0vMIo+svHCoEuAWg+HUXKjRyirPlXeuoWgc571+0qgVMHGKI3phhEZDRsPeLtPbYw1FijmSBvUv8xAD7mZymggAIK+KvbQJIM1NJhFP//3zKg/8pSOAosHAWcWBDkIO9sAYdn8h7cjv0djLQ3axgQ7IjxvEZq3BWyoOCNKaCAAv43rt5jpQ0KOAzb97j84gnY3fgvYngV8FeFLkAGjuW9/QUYcMdz3A68wWM4b2yakfa/aSwlBVyESq5HfWFiFVBAAf/LjOdGBTTygTYWiYLtMxY1e0MxXs8YJZyXwiGQ8GhjEbDk5SNgwEJgy2Eb+7UFSDOEQolQeQPSkYA3s4iQADCBPGsIBNTWAGgvDKK/AjT8LzPijtKoHe2DhYU0hKNGmmDTaMkCLYXOKKCAAv6XbRSvkaJBaYsCed3BmHwKET+KKlUywQxBTJSsyWYs1Jhzh1Ght4oNwBYiOUBchHxdPmAVIBqgHKCNqJwhN5stbm6Gqk8d/12mEDYtoIACCiiggAIKKOBNw4K51fKoAKefPX/l9tbB977ct92NOQzyDmhfsY0hDGEbEFv4nB01oIk8sKHwe4qCs8LnlEwbisaLf9XcDIv6FNByfA8tBQO6gAIKKKCAAgoooIA3DS31sA9+/s6id2x6x3fdmszG7f1Tpig9MaekWIwNCABYCQPWGjPswc8YUeUuoVgElkj3kzIGxpSByJqYK8XTp03Z/HcVZz+wuHOJWrZ0aXC8nf4nzIBOIZXnkNQmZAgmKBCY2FoAA8XTqJDCUUABBRRQQAEFFPB/DSn59dxl3pMLUyaN9G9f/XcOUJGLCJFiIWZI8NpZpQLhhsbLbKKpiZtwfNNPT5gBXYv2Ef5aIyCBBSiwcDXrnAREy+YX9OALKKCAAgoooIAC/q+BSJaFqphISpLTqfDHSQDt7e1UU1Mj554bLTvt4l3j5pR/bwswX4sV0/RLo/dV/13RCjU72/Rgfy45cr36Zk7Xtxgismh4Y275hKdwaECISCACDxa5iOMAoNkLK3ljYQgVUEABBRRQQAEF/J/FqAqlgPJZFyIQtDWl/KeG/tb5/Itf/u+bXlIlJS8TlwzvuPfas3/36xVtlwPp02REdTeZwhuuc3DCDegsSFtrHWgNgcVUGncRgOKNP3tgOJlMcnttLTU1NNhkMlngTCyggAKOfhFOf9UeFcMgAYlfNaqaRELSRBavovhYQAEFFFDAG4wRA1iAJcta9bIl6cHvbrzlrY8M4JPr+4HxKsAFFET/P6TurjmNDP630iInZYVONP5nTEQqLvntrU+pn7/f0i/e7c/71afMPz979z862hnTaQXbuYACCjgO604yqSXReNhy4Y2JRjVW2pe5IPdTQAEFFHDibefw/5QCJC9C0yz9p777qY1rYvf0+LhbMtW/7vM///z2G0VAiSefjK2QMU7hEyBcc8I80O1NXZKJFpMi6v7C2l+0bnyp54LdZo9d73XoX25t+edPPPujsypjZY94uUHf0W7c2JJBCWBswZouoIAC/ix8MLOAhP0gm4lkBjPjq6r3bJhdumUJztuPw+QuTySa0PTPE2f8R7Tj4j4/KFNRpwpZu09UwY4uoIACCjhxBjSLAkfMsOd8ZRMPfW1z8cT/ahl8/4r+cTM9X1sEO9xTx1tcdlbFGqRqnN5PDnDXWA/0CRBqO2EGdFNDg01KMnsfgEtnnfvjNdu3fuCPXfsrDPtBW3aH6lg78N6ySPF7KTCIiYIRHxaFusICCijgz0EwUlxNJPA9QmXJFFwei93xfVy2uCnVFBkpTnld47mxUVFDg7l93/cXPruJfvjMrgA6aqBMge2zgAIKKOBEr+qOsQh8AmIxBOJjrwdkpcgY8WT6OKXrpuifz0b78021te68gfu4ofrEirydsJ1BBEg1d8U/1/if5ip39vPrB15I4OHsTx/JrKvOyrDpCbqlh3oAxUBgAA4AHCDQLqCAAgp4bfCBhUbpYD/HnToeHgLBRJfOPKyTeBMSAABvKDbwQo8KtgUTLIb7FMQpSO4WUEABBZxQEMAZQGvARAA/C4gH+P365HIPl5ebxqtrpn/hhRs/Y7/+scbc1XOaBfjuyDbAzQC/0SrBJ9S1UttVn8k/nXye6JH7dj/zlrJ14/7t5cHOhq29eyBGADAEAoaBkBQM6AIKKODPnM4JYhlEAiIL31hdnXNR4UfHNwmoLTXgjaEPfVWskjpnL27mKwETNR5PjAzrTkWIKQ3RNjTMCyiggAIKOHEGNARCAYgsrPiIuw7OKsoMzp6ov/LtU076byLKNjY2qqvvhaTnLxzrKJF6vPHe6DfNOr1FOovalm9Tyxedb+/c9/C5zW3ryj0rhq0lKAWhiCW4hV2rgAIKeF2wIUIQUVb5Qswitpsm5npyJ8fHbWirv2Z/FJT9Nk3LvN411kiNCwCnod3/2v6hyUOdey/pGui1FTDwSssdWK/Q0QUUUEABJwwKxpCPQCwABERUHS9Tl5/qbjwPH13X0Hy2NNanhojoTbMT37TkvuLUy7nzAdCVZACsKAyWAgoo4LgsagQE+SU10VilLuvpOSwaulq0CwCaJB/oX3z6738JAEbWuI6aVbCeCyiggAJOMOQQIlLzwsSiHU177FNP/SduffTzAVrf3Pt70zzQ0phw7+3J6NsXnmwmOu+JRfYPeD2b78ohAaAJQA1UTWH8FFBAAYeBztsuk3XVc+WUa35B20truav/Ynv1vfcKAJsCQOn06+ZBhx7odtSS+MsWL9PTPtQ1YcqMiuzy588IfuBWecCcQicXUEABBZwwbMC8qiIVG9AcKa8SAOgf/B3//uJ3Zn7cnNIXT4F7ytx0/5uZpvD/A9CVWEcfvx0pAAAAAElFTkSuQmCC" alt="Herba Pharmacy" width="720" height="100"></h1>
      <span class="sub">Stock Room</span>
    </div>
    <div class="stats" id="stats"></div>
  </header>

  <nav class="tabs" role="tablist" aria-label="Sections">
    <button role="tab" data-tab="stock" aria-selected="true">Stock</button>
    <button role="tab" data-tab="cash" aria-selected="false">Cashout<span class="badge cartb" id="cartBadge"></span></button>
    <button role="tab" data-tab="hist" aria-selected="false">Sales history</button>
    <button role="tab" data-tab="order" aria-selected="false">Order list<span class="badge" id="orderBadge"></span></button>
    <button role="tab" data-tab="exp" aria-selected="false">Expiring<span class="badge" id="expBadge"></span></button>
    <button role="tab" data-tab="add" aria-selected="false">Add items</button>
    <button role="tab" data-tab="set" aria-selected="false">Settings</button>
  </nav>

  <div id="notice" class="notice" hidden></div>

  <main>
    <section id="tab-stock">
      <div class="toolbar">
        <input id="q" class="search" type="search" placeholder="Search name, ingredient, barcode, type or supplier" aria-label="Search stock" autocomplete="off">
        <div class="chips" id="chips"></div>
      </div>
      <div class="list" id="list"></div>
    </section>

    <section id="tab-cash" hidden>
      <div class="till">
        <div class="till-main">
          <div class="modes" role="radiogroup" aria-label="Cashout mode">
            <button type="button" class="mode" data-act="mode" data-m="sale" role="radio" aria-checked="true">Sale</button>
            <button type="button" class="mode" data-act="mode" data-m="refund" role="radio" aria-checked="false">Refund / return</button>
          </div>
          <input id="cq" class="search" type="search" placeholder="Scan a barcode, or type a product or ingredient" aria-label="Find product to add" autocomplete="off">
          <button type="button" class="quickbtn" data-act="qopen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>Quick Moving Products</button>
          <div id="cresults" class="cresults"></div>
          <div id="cart"></div>
        </div>
        <div class="qmenu" id="qmenu" hidden role="dialog" aria-modal="true" aria-labelledby="qtitle">
          <div class="qpanel">
            <div class="qhead">
              <h2 id="qtitle">Quick Moving Products</h2>
              <button type="button" class="primary" data-act="qclose">Done</button>
            </div>
            <p class="hint" id="qsub">Tap a product to add it to the basket. Tap \u2605 to keep a product on this list.</p>
            <div class="qgrid" id="qgrid"></div>
          </div>
        </div>
        <aside class="till-side">
          <h2 class="sideh">Today's sales</h2>
          <div id="sales"></div>
          <button type="button" class="ghost" data-act="tab" data-t="hist">See earlier sales</button>
        </aside>
      </div>
    </section>

    <section id="tab-hist" hidden>
      <div class="hctl">
        <div class="chips" id="hpresets"></div>
        <div class="hdates">
          <label for="hfrom">From</label><input id="hfrom" type="date">
          <label for="hto">To</label><input id="hto" type="date">
        </div>
      </div>
      <div class="hctl">
        <input id="hq" class="search" type="search" placeholder="Find sales of a product" aria-label="Find sales of a product" autocomplete="off">
        <button type="button" class="ghost" data-act="hdl">Download spreadsheet</button>
      </div>
      <div id="hsum"></div>
      <div id="hlist"></div>
    </section>

    <section id="tab-order" hidden>
      <div id="orders"></div>
    </section>

    <section id="tab-exp" hidden>
      <p class="intro">Batches still on the shelf that have expired or expire within the next 30 days, soonest first. Put these at the front, sell them first, or arrange a return with the supplier. Use "Remove from stock" when a batch is thrown out or sent back.</p>
      <div id="expiring"></div>
    </section>

    <section id="tab-add" hidden>
      <section class="card scan" id="scanCard">
        <h2>Add an invoice from Claude</h2>
        <p>Send a photo of the invoice to Claude in chat. Claude replies with a block of text for Stock Room: copy it, paste it here and tap Load items. You check every line before anything is saved.</p>
        <div class="field"><label for="impText">Text from Claude</label><textarea id="impText" class="bulk" spellcheck="false" placeholder='Paste the block that starts with {"supplier"'></textarea></div>
        <div class="actions"><button class="primary" type="button" id="impGo">Load items</button></div>
        <div class="drop" id="scanDrop" hidden>
          <div class="pickrow">
            <span class="filebtn overlay">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
              Take photo
              <input id="scanCam" type="file" accept="image/*" capture="environment" aria-label="Take a photo of the invoice">
            </span>
            <span class="filebtn overlay">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 12h14l-4.5-6-3.5 4.5-2.5-3z"/></svg>
              Choose from photos
              <input id="scanFile" type="file" accept="image/*" multiple aria-label="Choose invoice photos">
            </span>
          </div>
          <span class="hint">On a computer you can also drag a photo here or paste one (Ctrl+V)</span>
          <div class="thumbs" id="scanThumbs"></div>
          <span id="scanFiles" class="hint">No photo chosen</span>
        </div>
        <div id="scanNote" class="notice" hidden></div>
        <div class="fields">
          <div class="field"><label for="scanSup">Supplier</label><input id="scanSup" list="supplierList" autocomplete="off" placeholder="Blank: read it from the invoice"></div>
          <div class="field"><label for="scanType">Product type for new items</label><input id="scanType" list="typeList" autocomplete="off" placeholder="Optional"></div>
        </div>
        <div class="actions">
          <button class="primary" type="button" id="scanGo" hidden>Read invoice</button>
          <button class="ghost" type="button" id="scanStop" hidden>Stop</button>
          <span id="scanStatus" class="hint" role="status"></span>
        </div>
        <div id="scanReview"></div>
      </section>

      <form class="card" id="addForm" novalidate>
        <h2>Add one item</h2>
        <div class="fields">
          <div class="field" style="grid-column: 1 / -1"><label for="a-name">Item name</label><input id="a-name" placeholder="e.g. Paracetamol 500mg tabs x24" required></div>
          <div class="field"><label for="a-bc">Barcode</label><input id="a-bc" inputmode="numeric" autocomplete="off" placeholder="Type or scan"><span class="hint">The number under the barcode on the box</span></div>
          <div class="field"><label for="a-supplier">Supplier / wholesaler</label><input id="a-supplier" list="supplierList" placeholder="Who you order from"></div>
          <div class="field"><label for="a-type">Product type</label><input id="a-type" list="typeList" autocomplete="off" placeholder="Pick or type a new one"></div>
          <div class="field"><label for="a-on">On shelf now</label><input id="a-on" type="number" inputmode="numeric" min="0" value="0"></div>
          <div class="field"><label for="a-min">Minimum</label><input id="a-min" type="number" inputmode="numeric" min="0" value="2"><span class="hint">Flag for ordering at or below this</span></div>
          <div class="field"><label for="a-rq">Usual order qty</label><input id="a-rq" type="number" inputmode="numeric" min="0" placeholder="Auto"><span class="hint">Leave blank to top up to twice the minimum</span></div>
          <div class="field"><label for="a-price">Selling price (\u20AC)</label><input id="a-price" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0.00"></div>
          <div class="field"><label for="a-exp">Expiry date</label><input id="a-exp" type="date"><span class="hint">For the units above. Add more batches later under Edit.</span></div>
          <div class="field" style="grid-column: 1 / -1"><label for="a-ing">Active ingredient(s)</label><input id="a-ing" autocomplete="off" placeholder="e.g. Paracetamol 500mg, Caffeine 65mg"><span class="hint">For medicines, medical products and supplements. Leave blank for cosmetics and toiletries.</span></div>
          <div class="field" style="grid-column: 1 / -1"><label for="a-desc">Description</label><textarea id="a-desc" placeholder="e.g. Pack of 24, for pain and fever. Keep below 25\xB0C."></textarea></div>
        </div>
        <div class="actions"><button class="primary" type="submit">Add item</button></div>
      </form>

      <div class="card">
        <h2>Add many at once</h2>
        <p>Paste one item per line, straight from a spreadsheet or typed out. Columns: <code>name, supplier, on shelf, minimum, order qty, barcode, product type</code>. Only the name is required; leave a column empty with two commas.</p>
        <div class="field">
          <label for="bulk">Item list</label>
          <textarea id="bulk" class="bulk" placeholder="Ibuprofen 400mg x24, Wholesaler A, 6, 4, 12, 5012345678900, OTC painkillers&#10;Vitamin D3 1000IU, Wholesaler B, 2, 3&#10;Insulin pen needles 4mm, Wholesaler A, 10, 5, 10"></textarea>
          <span class="hint" id="bulkHint">Nothing pasted yet</span>
        </div>
        <div class="actions"><button class="primary" id="bulkAdd" type="button" disabled>Add items</button></div>
      </div>
      <datalist id="supplierList"></datalist>
      <datalist id="typeList"></datalist>
    </section>

    <section id="tab-set" hidden>
      <div class="card" id="devCard">
        <h2>Phones and backups</h2>
        <p>Phones on the pharmacy Wi-Fi open Stock Room at this address. Add it to the home screen to use it like an app.</p>
        <div id="devAddr" class="addr">Looking up address\u2026</div>
        <p>A backup is saved on the Stock Room computer every day. You can also keep your own copy, for example on a USB stick.</p>
        <div class="actions">
          <a class="primary btnlink" href="/api/backup" download>Download backup</a>
          <span class="filebtn overlay">Restore from backup<input id="restoreFile" type="file" accept=".json,application/json" aria-label="Choose a backup file to restore"></span>
        </div>
        <div id="restoreBox"></div>
        <div id="updWrap" hidden>
          <h3 class="subhead">Automatic updates</h3>
          <p id="updState" class="hint">Checking\u2026</p>
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
      <div class="card" id="bkCard">
        <h2>Backups and moving data</h2>
        <p>Download a backup to keep a copy, or to move your stock into the Windows app (Settings \u203A Phones and backups \u203A Restore). To bring data the other way, download a backup in the Windows app and restore it here.</p>
        <div class="actions">
          <button class="primary" type="button" id="bkDl">Download backup</button>
          <span class="filebtn overlay">Restore from backup<input id="bkFile" type="file" accept=".json,application/json" aria-label="Choose a backup file to restore"></span>
        </div>
        <div id="bkBox"></div>
      </div>
      <div class="card">
        <h2>Product types</h2>
        <p>Set up the types you sort stock by, such as OTC painkillers, Vitamins, Skincare or Fridge items. A type you type on an item is added here automatically.</p>
        <form class="actions" id="typeForm" novalidate>
          <div class="field" style="flex:1 1 220px"><label for="t-new">New type</label><input id="t-new" autocomplete="off" placeholder="e.g. Baby care"></div>
          <button class="primary" type="submit" style="align-self:flex-end">Add type</button>
        </form>
        <div class="typechips" id="typeChips"></div>
      </div>
      <div class="card">
        <h2>Suppliers</h2>
        <p>Keep your list of wholesalers here so everyone picks the same name when adding items. Renaming a supplier updates every item that uses it.</p>
        <form class="actions" id="supForm" novalidate>
          <div class="field" style="flex:1 1 220px"><label for="s-new">New supplier</label><input id="s-new" autocomplete="off" placeholder="e.g. AGS Limited"></div>
          <button class="primary" type="submit" style="align-self:flex-end">Add supplier</button>
        </form>
        <div class="typechips" id="supChips"></div>
      </div>
    </section>
  </main>
  <footer class="foot">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAdLUlEQVR42u19eZicVZX375x737eW7s4GCQKCETdIQPADdXSEThxFQbaI1SJ7BBITNkFnxseZ76uqmdEZPwirBEkEDItClbJpwOXBdI/gNwg8CpIoewIoGiBrd1fV+957zvfHW9VL0iySTro61Hmem+qlqnPf+/7ec37n3HPOJYxTyeeVi0WS0696cq8+3z6H1L8HElkZwzkxGMpBHzM/MDG8644l8+fHjXk26zrSeL75n1v01Fxvsv8XZHdtrhkKSP1vAu09/dYL3vcH5JXRpCAYdwDIldSUu8gff8kzxyKcdEdc7YX4yDfXpSjCtilGapue7wjtB248Z891yWqTNtt68ngDQDkHya9Q67z+p49rqhI7IjZE1ESDTdS3PrKZyXv1x/F5INLOAkwzrue4AkA+rwwifeL3q9+t4H191A+AbHMaVzIuqqjzcjgA9BTgWwAYJdkU+TawoWY2YAQlVSEmmtis6n/cAgBx80+xcbeVQKpKzcq5xicAguafIg06BKDBp79FAkdlcb3quJkroannOj41QEtaAGhJCwAtaQGgJS0AtKQFgJa0ANCSFgBa0gJAS1oAaEkLAC1pAaAlLQC0pAWAlrQA0JIWAFrSAkBLWgBoSQsALWkBoCUtALSkBYCWtADQkhYAWtICQEtaAGgBoCUtALSkBYCWtADQku0iBB3SH6DpxL65SxosdC8U6qXwheT7VeXXb4IwIwdFASgUoG++fHoclIirQkRTRKTIK2NVmTAjN2bzzgPoBngWII3WdXaEOVMBIHQPaodVL0FnrIQWi1AAChrW6iK5oOLfPqFi/TO5EsyMqaBVs6AzCtBiEa/ZUs3DMSNNAGKoWhA14RNGLK4mHKSnf/7yZ4699Xy6c6xnVF9u6cFgqz0LAHkFoxtcnAVffyIVGPkmlEols36fG1LrwjUp6esNRdLpWrwp7Neq6UhNytb8RuqPX0aIqelUEAbMxlR9Fd71IWXbIKQ1Q+gNTHZDJth1/dcOeXhjuWurBkqUXwGz6iVoOQfBFloizUHVQ3yQnRS4ai9UnIPCNB0QVEm950qMWz978bP/A1Idi4YRIgAzQ8nUDPEqg+qy4pfp0VyuZLZasG8+8MFdKvrC9Gpc28f76J2i2FNVdleVXUV1Eql0KFEboClAQyiFCrWAsg0YCoGqgplATCACtGEzCFABxBFUEAG00TC/SKBn2JhHjUk/nNWJvyse+sxzw1TXCljMghQJAlXKF0CPT35m/wipM7zISTZs3yWu9UF91HxAUAWYYcLsgAUdo4mAQGBjIa4Wk+s757avvnsJXfPQwcHTG174QBz0H+PFzVLx+4J1FxMqyChUFarJjRs26nqi8Vq/Vm1cohJ0RKwn5oNBADPAtj4MQR3BVamfiH9vbXhvyO335D5WeOAQmh83riEHcBmDWuGka9buXq1EZ3rBfBNm94xrvVAfOwAGaBYgqKqiWTqFCrENrA0QaPxJyq/obF/nHvxNemp1v/71gHpAHDVMgA65caRaf7Z0CIxpy9v7N0BSB6Cp0ASiRGpsCjABwUcMdebxwAR3WrSVL5r9l4caH5730Lxg/TO7U7mrGAHAKVeu2qWqE89yTs/lMLtHVNkEFeeJuCkbNI4xHL0Nswa+8j8EAF9dMfWgqm66zzsfioehsXUPFYDUtYmxKZBNAa7CYLL3hyZzU3u4523Fv390LQB05jvttJmzuAGEuZc/MXWTZs7zHudxmJ0Q9W9QQJWIWy7vlsqYENFXVuxeWDT7xcJ5P586l9o2XVfdLA7URN03E9UpgFqbAawluAq/bINUKa2TvvutWWt+m3gSOQPkTLmrKwKAEy9Zs0/N2H/1grkgA1fr9QTi5vQYxigIRAAt/PmEtezD8799xMs/OOcXU642bZUvVTaqI4ZtugZnBK8CsE04lasabzm4MzSZSy4+7MX7E8LYaV98YhEtmX9IDABfuPy5zqrnb3GY/XBiFrwnopZZaABgwc8m/ZpTOnOimzYjMCf+9eX4ivuQjj8c9cETNWeDYyS81IPUptoAiRkG4e2GJn7zstnPPAQA866ZF6yffI2Uu8iXSiVT+vNHv+wVeZiww1U3NxlJHEMAnP2L3RaHk2oLonVhz7cPX/DxL3ffsrfzLz/o4ab4iEDU9OFir6qcaieSiLyl9HeNTvv3Sz/xyJ+goHlLrrFL5s9zAOkXrnh235oEl5PNHh71b4Sql7cyN2AC6Pyf7X2eM5XLOFRCX3rplUe8MO+8u/c5UjO9y+Oq9yrEoHFwroDCA2pSEwhSs2stUvnLPrHmOw2z0N3djZ4iOQDIXbrmwljNN8Em5Wv9zcV5djQAvvKz/Q7rw4Ye77xLTzDW96b/ZfERz37z7Lv3/iq3u4tqfd6rBxOPCxBAFY4tbJhlaBz8IownnHfJpx/7Y64EA5RQXplTFElOuOSpQyLKfBdB5sCob71PYhNvLZPABFD+p4dP+XP8hz/CyFQVjVNZG2h/6kuLj3rymoV3v/sCpKJLoopTFdJxYA6GBKTUh21s1fMmK9mvfvvTf1za8BbWrixRT5HcyRf9rq3f7nIl2ezcqLJRFaoE4rcUAABg3k/eda/JuI9HfeLIgGxoDLvU3MVHPP69Bcv3PVWD6lIRCX2kjgh2PHRqpgQIngxMqs0AteDGbGXq2Rcd9+vNnStgpy0uabnc5QHg+EtWn+0puExFrXfVt0zwiBsBH4Ogx3AAqIHGll2VRNldv/An+8+/+jN/vIGiiZ82SP05zIZWvXEkFqQWJM07IBYEa+CsVjfCIZBTelMv33/ejw/Zv2c23IyFVxFUKVdS86MLp18VcnQ4M/3VpjoMVN1bRgsAgOXsz13NQGEYZEi8oahGoqn4OwuXH/D1q496ZEUQTfsIxame9MSUFbCIGFEYNPVQA4UhwNrKRjhhPSCym+87+54PHFOc3eM6u2eZchdJZ15t6fx3rgi57+9J40eD7ESrKm8JEBAAyj+WC/781MrHKZDpPlYBwFAoWCXVZg1qdsnizzw6HwAWLn//fwm5f1YSxFVx9aAKjQuTgMQk2MCAXXj+4qN+d0WuBFPOQToLK0xPcbY77dLfTtqEXcsctH0i6lu/U3sITADnV3Sa4v7liDV1lw0DqLBADQBD8NZUN6lDSuctWH5Qz8IffuQdiz/z6NdC1/YJknBluiNloYYg7KEGzTw0eTUSG4kqKkj5yxfe9b++Ve6CzxdAPYXZPpcrmWUXfGDD1Oxfj9S4txS2TbHAzm0OeNVL0xQAUqmOm3xkADIMmHqgzIDI2uomdWr1MJ+p/uac5R/+/BXHPHjvbtk5ByFK/6cNwmrYnjIKFsD4gc826SAyTLBU7VVHbfpPC35y8LWNDKRSqUvyeeUl8w92t12w9+c12nj9zg4CLneVfT4PvvyInod8zTxkw4BUjVcxaAzA2qgX3jud5tjd8qW7PrxsXeWByYuPfPDrxrQdorXgziBMsU0FRjyLCg/7fBMOgljbv0FiSuGL8+/80A/z3XmTZOsQoEnK1G0XTv+i1jZeszODIPF5Z3UyEWloslcZG5AK1X9VH8oAGeNj1mqfClJyauTXPbLw7o8tWHzE/Su/c/SDx1m0HQ4Jf5VqS7HNhEbBomAPsA77W000CCaobJKYszj+xU0/u/P6Faeli0VIvkBULEJzOTW3XTj9S1rbsDRs28VCx8N5ZX87NxpI8Mg/fFTmhTUv/5Gsvt3HqnWesBWTUqhnSyZIW2iNHgoo9Y1vH/PLOwDg3Ls/fnTkav8I1kPBiqjikbhVZIhATbjDCFHEmQ4bSNXc+zaaeEzxmJ/05/PgYlE1VwKXu8jPWfTsDZyedEqtd52jnYQY8tDk3vyKTluc3ePm/ajzy9wml1Y2xa+9bZpE28Sm2TAz4Oi+wASXXHX0L28HgAV3faLTa+1C7+Uom2GOqx4Si6/nizXd/oKKuPSEwEqNuoPobUcv7ir35vPgYkE1XwAVCtDPXrLmTkpNODreSbyDYQCAghTAV39+cnZ973OrYHQviUXxOqFRVRUACDOGiQjq6BFjwmt2a9/9+uLsZdXz7zl2eiXafLYXf5JN8+4igrjiARFXj71zs2zLqohLdQRWa3x/OrXHkVceefOmBghQKNBp008PN603v4TNfCSubBz3EcPhAKjHyctdZT//R4efiqxfVt0cOSK2b/C8Q68KsilmGxi4mrxk2NxmTGrp1UctfxgAFt75qWOd+LOc+sPDNhO4SOCqDqrqiIhUwTSmmoEGQOCr9KtJvXzEolN/0Z/PJ8ywWCQ5+aKnpvXa1P8DzD4u6h/X28lbAaABglKuJGeUP3kfZ+ijccV5vF4GjQ7jBwJA2bIJ0gYSKyD0GJG9NRN2/ODKI299Ov/rM6b85aU/zXEiJ4r4zrA9MOIEcdVDRbwqKaD1pPIdaCwGU9ddqsNareLePd/7kSNRLrpiAZorK5e7yOcWPX1ATKlfi0pWXZTkv+8sAMhrnotUlAV3Hv/+mu97WLwjFTAA+psCfqqqRB6qxqYN2ZDhawJ4eozJ3JFJZe+Y+bYZf1iz4dnJr1RemeViOU68n20zdhc2BBd7+JqHeBVCsk1XnwBt38BjggKFxumOIPB9ese1uZ/OqWtH6cyr6SmSyy16fI63k26Lo36XRJlAOwUAhpqCL95y1L8GHfzvlY01R/zmSY+qCoEEUGtSBjZloF7hqrKWiXsCY3+aCdoftlar1Sh6ZzWuHOohh6rogSbkCWQJ4hTiBOIU0IEE9e2rEFTjzIQwcH1Yem3Xj+c1iHJnXm1PkdzxFz9dRGbK/4l6141LUsiv8ShRrpTjUq4kc8vHrrAZdEa9sQePQjJlPctXATaW2KYtjCHEVQ/v9HkD85Ax5kHD9tnABM5L9Dbn/X5e4/296LtEdBoxApUd5k/G6Y4w8L3IX9t1x78lIOj2nflu01Oc7eYsevanFHR8KqpsGHekkOnVq4N1xsoZSl2E+aVTT4pqvQ9zwLv5yAsx8Tb68tyIL0gMjSIRJVIoGROavTg0e5GlOS726O+rVQm0xrBZzZx5LiBarewnENFejuKZXiQ1rEhl+4itbhIXZsPiF2/53NPF2T+8uXPFLNvT3S1Qpbar/3Jqb7X/Ebap3dRHgnGWUPKai9cwBWf+4POH+lB+Kd6RON1+qVP12AJACigRk+GAwZZBBIhT+MgDikgT8O6YxVYoWwgb69jbw67t+sFvkjqEEspd5I+/9KkjhDvudgkfsONJA7zujexc0Wl7Zve4ud8/4WTO8o1RNXYQ3f4FmDpoiQESKKCklBR3bOF97JAYgYpNGSal5yanJhx8ydFLXskXQN1Q7imSm3PxU1dyeso5Uf96B4wPPsCE18/7X7NsjeRXdNrLjln+u4OOOXB9kA0/42PxKkQEIlUCtsdoEP4Ep5yMOmaHvkd3zCAwiYOz6XByX3/twEfe//ubUOg0s1avlmnTunnvj0755Suv/LWLbHpXkbjutDS5+n+jNYDF2T0uv6LTXn/iTVegxl8JsxlLzKpgIRi8FUZ9K9lGfc4F7alPzf3BKf+7Z3aP60Y3Iwdc2kUVa9w8JqLEhO0EHODVzMEZN58+X0L+jnMO6tQTw+i4ueRttwbE5G1gDNVo1nUnX/ffSabxQuopznZzLnpqCWWmnBX1rWt6r4DfTESlAYIv3jzvOAn0BpB2uGq80+yQvdG4hgktk9fVHZPaDpzywJTeVTNnUnllTs94+/OTXtmoq4TNVHUR0MSNuPjNlIH3zO5xnSs67XUnLbkjJXwoqVmZ6mizquxVWZs9I2h0soos+0idyaanb1pXvaxYLApQRie6+dqz9l5n4L4ehBnWHRis2CEmYJgmyHfanmKPO/fGcyf0Wr2CAj7NRTF87N9C2kBdmElZVPWo60759vLOfN5OWzVTS6WcHLfo2QfIZj/ooj5PaM5qZN7WoHojTgAAZ37//C840os4tHvWeqsKQJq2unj0wgNiAkvw+vxu7Zn9s7/N9nVjFvcUZ7vcomc6ncl0x1HFvxFvq2ndwNeSVeVVCgXlZubMTSdc9+jfHfuxm2LSdrA52KZTxsVeoSxAvWNUk6aGbcMgcerD9szkTZuj7BVf/tY9Hzq7n2bmVnL5rCnPvu8fFhxi0xP29XHNEzVfhJBGc1ttqDY465avfTAS/y8CHMuWEffXoIB7s7yj6RUBkVhrYMl88LoTv/XbXL4Ulotd8clXPP/+zY4eFhdRk5FBBRtl9etGbVLlrrJPSq1yZukJ//XgshMvOs6QPUw8fkg2iFPtbZaDkAUkSuyUWJQMdoKRBMOCwESxvxwAMLPscyXlm87b6xG42o+CzARupqxiVfFBqoPZ4JbtEq3K5/MMAAk7Bs78/r/NjFE7RVRzbMw+ZBgJYXQA4Oq5JIOcZDyWaYv6sD1tEPmu7530jXKuVArLXbn4hMteOKAi+K13sdab5w3psDZywIhGjIrrq0Ul9HVi6YN/NamYlTA7KZBo82PZDB22XRc6V8qZGbkZWqQECBeUFmXWx5tme9FjReTjIHq3TQVQVXjnIc5DRQCoJBem9eWiep9DpcGvt82L2R67BSYISGP/TEDv2X/66tXRqpkFKneRP+6ip28P2qceF/evB7F9zU0MxdZdkImAESkEUfKs6AjGfevYRfIrNlBfe6rN9h9x0znveWqHLGA+n+dugHuKxQE1mH+sFL746LPvr0n1oyLyd6rYX1T2gmKSCQOwSfabFPVmlaJQkcFX1XojABVSUpBu/aDQlmtNAynwSkrJ3tJoAYkAEZ+a0GZ8JTrvxtMKVx58zTXBw/PnubOX/WlKJc68N6r2i2FX/78sqrHf6q66GKg4IBjiSIs4CowJ7ZCfOQeEIVtWscxGB9/rSdwgWjwAY4Ga84hi1mw6JR3Vjfdf98/7bc7ndQfnsikoVy5xwhm6tuwPjAvvunjXjX1uqnr/NgF2997vqYo9QNhNVXeDYlcFJgHogKINTCFbAzY8+DSM7K41HoN611MZAJN4QdJNNykPIyXSpGrkTawNCVsmePnLnpPf/r6Ljj2zF9BXVfVjKfl8novFooylCqW85qm7GzztpZk6EiBGksvvvjv1RPXpdldzHU7jCd7rRBJMdNAJgExQLxPB1CaqbRANAcBYE3iREEAHgTrqIJqiqrsAmGTCgNkmHrF4Dx87iPNKRL7RYveNagkV9ekJbUYr8T/ecPrXLu7M521PoeBzZTBQfoOMektbOvDP6BD2HKQByuYqzlClQqFAq2bOpLUrVxJmJT+f9tJMnbFypTZI5WhISUtmxfKXJ8Sb/dTY1fYS0fdAZX9RHKDAfmzNVA4svHPwtRiasPjXdWMVJCbRAi9Oau943+LcOX3NqgUSQ9RUgQnSYVa8OPIKA4p8oUAAsGrmTAKAoYAZkO7h306bWQdSoahd1OUBrK+PJwDc23jfgp/cPLm2Ye0Bcc3PAnA4GfuhIJ0OfBTBRbEkTOJVw7vsI/GpjvY9Nldqp4KwuHNFwfYkcZCdZy9gJxCCJkAa0DgAegDBFprmjGVX7Vcjf7w4OYkDuy+IEPVXFIQRm0opIDYISJ17ctZBbfvPP3iea1YN0OqbO7Itoly5zGtXrqSeQtE3SlrzpVK4urb+k87FX1Kio5QAX62NnC2t8GE2Y9jFn73h9HNv78zn7VAvqGUCmlo3kJZRP8WkOOjGFpNG1MsBLD/txu/8Q+xlUdjecWDU11evnqJhFkyU1MV6LoDbZ9WPamlpgFF0Yxr2f3hI+o15E292vXKlQTf2glIp89e+DVdTEJ4W9fW5ER4oNdZKNjAHXXfqmY81XK+WBhgFGaOFHHBXc6WSubSrqwLg9C9cu3RTmO04N+rrSyqEdKBY0pswY6vVylwAX+lOPAhpaYBttM8g0vk33HKgC7Gnq0RiDeDVMGtc2eu003qKRLIjtVC5q8ufsHTp7ZRKHxf19XnigVxAYWsYzv9pEvS9S+bP78eWdmKMZdxtzebKZQaAzVEt70x6eU3pnn5v7nEmWN5f0x9OefLJYAAoO0ALzVi5UqFKqV13nSs1+ZMJMgw1Sac1tewj9SbdvmcvpT9Z1xxNtebjd29euT/qi7yr+VpcieOov+ZFaPOO1m3FYlE6CwWzbM6cDUbwT9ZmSIU1AQCDYBSwKkpdzbiM4zg5wzLIGMAYkDEga8DWrv7dy9xwxneU9BSLPp/P83GTM7e6Sm2lTWWNwghgoLAssZLAHJTP53k7k9S3DgAEECXG0DGGl6PdmMVdXV3eGLuMwzSQJL4AYPJeIErvWD195rQGd2gB4E1KI2LnY4rhLeAZ8AbwBurG7nJmYZYAgDHhz11fpBBr4A0ghsSRGJNpczG9BxgMX7cAsE2ydb6+V4MXnn9hTPybYiExOtmpwZPw+AvbFKFRJ6FGiQME1na0OMAoPGvJ/U1a2Q7UjTbGmDnUpABoyTHH9IP4z2RCKLEOzosharQFgNGcutSHJ4JnMNh2TNzD7mgSOCQwUE9gM70EA4jRgTkqoxnLA8YtAFQNVO3AELVQsWNqW3OrEtsuYvpVg2HzU7VwzrYAMGpegBio8vABw9ZXxu6acg36YavAlvNrziKpcbsXIGQi2+AA9WUnMqZtctuYrfTalVOThFNQH5EBMekAGyVOzi5oAWCUxEMGD4RA/bU59lmITQ2w9RtOg/Nrwmbj4zgfIMCWAFAl7ltfG3uzFpsKBWYEANgWAEafwvAWdKZ97AkqcTVh/EOTiZvTCxjHALBDgkAKgKEKbG6CmRm28dY3nLdmiy0AbAMJHHI8XAIAAwGwefPYQyAS9AYDc6tbALRMwOgqf2FATDJUk6igNAcJDCnwqvW5NRAgpuUFjCoFNAba4ABJFBYEazLppIJuB/aQ3NoLIDjVLXcnmzPkMo63gxkKGjZARGFgxnynreKoIlvMLalJbZmAUQRA0kZAGwWhyekzlDJj31uACE6HzE0BKBF8E5aGjGMvIEm5SjZZFCoEglobpCwAFJLSsTFZ8oAD6MDcMCQO0OIAo+hsDyGBSfFl3epnxp6fqPWRjEACfcsEjKIN4GEaoJFy7+JmaC8zdG4NDdDaDh5dA0Ckg9E2TtrvqDFRtT/YESnhr6GaKPbEI7eVa3GA0VxnHWwpT6SqPsxOMNV48wdA9FR3fkUqVypssftSHvYyksyYkRvGG1atKlPjZ0O/bnw/8MYcsHbldAuQ81i5F2PLc6SoBYDRV15DnixS8rFT0rAw99onuq8/470v7dDpJKDyqsqfvfTxz7moBgUxDdsLaHGAUXS1eIgGAAjEPq6qDbMz1m+KHzz+sieXMPMjaYsa4OBiij2xgwP6fdLGOwiAbBAMLgaNsJ8cBEBNfAwgSLFBPKhUnDqOESCqOspabvNEkz976ZPzYDP7+ahfCEMPlWxpgNG1AMKMRjh4ABSGXC0SY8N3IMh+w0uM/lgBpAY6jYEAa+ppgwL0R0P/6AheYy1pJgUAFMvwcG6jJzYZVNUkLeCMwFV6ldgOHq6VeAGqbKgFgG2WWfVAEPcqWHVo0Ddpe8TexeLdxvrtbhDCIf0ZMUgSdcs2cltDrdEwjNSrDn+PDnzKYbC9DREPO0BDSUlUyHhUWl7ANsq0mckiW+DHEJ/k3iuGEkLUc8QtgQyBORk0MOq9nghgImIiNAaNMJgabZW3fg/Xf89U/9smaQ0/bC5CHKpE1c0pDh4F6l26WgB4k1yri3wuVzK3XviuX2m8+XvpSbsHYEsKiCq8grwqmmloZsI0w4ylN5779ldyJTXN1C9onHYIUUIeVJoJuvX5Nf8hHJ6pwK7Dj+ihbb/yUbhNKjEY7uaOSXLm9NXTo2IR2kyHSu0UTaJOvfq5PWux/TCp2z323gdEoSR1WQwAtVggAAJDAYgMKXFgNCUAVIlVk4aZsaufaZuYfGbWFBrNZZOfh4bIKo18RBYpkVeJRMmBTBwEdmPAdN/3z9njv5t17f4/n3kCoNE1fmkAAAAASUVORK5CYII=" alt="" width="22" height="22">
    <span>Herba Pharmacy \xB7 Care that grows with you</span>
  </footer>
  <div id="toast" role="status" hidden></div>
</div>

<script>
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
    b.innerHTML = 'Stock Room has been updated to version ' + v + '. <button type="button">Refresh to see what\\'s new</button>';
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
  window.STOCKROOM_VERSION = "1.7.0";
})();

</script>
<script>
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v, d) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= 0 ? n : d; };

  const state = {
    items: [], ready: false, failed: null, tab: "stock", q: "", filter: "all", supplier: "",
    type: "", group: "", savedTypes: [], savedSuppliers: [], quick: [], renamingSup: null,
    editing: null, confirmDel: null, pending: {}, ordQty: {}, copyOpen: null, canWrite: true, listDirty: false,
  };
  let db = null, user = null, me = null, names = {};
  const timers = {}, chains = {};

  try { const t = localStorage.getItem("stockroom.tab"); if (t) state.tab = t; } catch (e) {}
  try { const g = localStorage.getItem("stockroom.group"); if (g === "type" || g === "supplier") state.group = g; } catch (e) {}
  function productTypes() {
    const all = state.savedTypes.concat(state.items.map((i) => (i.type || "").trim())).filter(Boolean);
    const seen = {}, out = [];
    all.forEach((t) => { const k = t.toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(t); } });
    return out.sort((a, b) => a.localeCompare(b));
  }
  function saveTypes(list) {
    if (!db) return;
    return saveSettings();
  }
  function saveSettings() {
    if (!db) return;
    return queue("settings", () => db.doc("meta/settings").set({ types: state.savedTypes, suppliers: state.savedSuppliers, quick: state.quick }));
  }

  // ---------- derived ----------
  function onHand(it) { return state.pending[it.id] != null ? state.pending[it.id] : num(it.onHand, 0); }
  // ----- batches: each product holds [{exp: "YYYY-MM-DD" | "", qty}] -----
  const validExp = (e) => /^\\d{4}-\\d{2}-\\d{2}$/.test(String(e || "")) ? String(e) : "";
  function getBatches(it) {
    if (Array.isArray(it.batches)) return it.batches.map((b) => ({ exp: validExp(b && b.exp), qty: num(b && b.qty, 0) })).filter((b) => b.qty > 0);
    const q = num(it.onHand, 0);
    return q > 0 ? [{ exp: validExp(it.expiry), qty: q }] : [];
  }
  function tidyBatches(list) {
    const m = {};
    list.forEach((b) => { const e = validExp(b.exp), q = num(b.qty, 0); if (q > 0) m[e] = (m[e] || 0) + q; });
    return Object.keys(m).map((e) => ({ exp: e, qty: m[e] })).sort((a, b) => (a.exp || "9999") < (b.exp || "9999") ? -1 : 1);
  }
  // the fields to save for a batch list: the batches, the total on the shelf, and the earliest date
  function batchPatch(list, it) {
    const bs = tidyBatches(list);
    const total = bs.reduce((x, b) => x + b.qty, 0);
    const dated = bs.filter((b) => b.exp);
    const patch = { batches: bs, onHand: total, expiry: dated.length ? dated[0].exp : (total > 0 ? "" : validExp(it && it.expiry)) };
    if (it && it.onOrder && total > num(it.min, 0)) { patch.onOrder = false; patch.orderedAt = null; }
    return patch;
  }
  // take n units, soonest-expiring first (undated last); returns [remaining, taken]
  function takeFEFO(list, n) {
    const bs = tidyBatches(list).map((b) => Object.assign({}, b)), taken = [];
    for (const b of bs) { if (n <= 0) break; const t = Math.min(b.qty, n); if (t > 0) { b.qty -= t; n -= t; taken.push({ exp: b.exp, qty: t }); } }
    return [bs, taken];
  }
  // set the total: fewer \u2192 remove from soonest-expiring; more \u2192 add to the newest batch
  function batchesForTotal(it, total) {
    const bs = getBatches(it), cur = bs.reduce((x, b) => x + b.qty, 0);
    if (total < cur) return takeFEFO(bs, cur - total)[0];
    if (total > cur) {
      const t = tidyBatches(bs);
      if (t.length) t[t.length - 1].qty += total - cur; else t.push({ exp: validExp(it.expiry), qty: total - cur });
      return t;
    }
    return bs;
  }
  function batchRowHtml(b) {
    return \`<div class="brow"><input type="date" class="bexp" value="\${esc(b ? b.exp : "")}" aria-label="Expiry date"><span class="bx">\xD7</span><input type="number" class="bqty" min="0" inputmode="numeric" value="\${b ? b.qty : ""}" placeholder="Qty" aria-label="Quantity in this batch"><button type="button" class="xbtn" data-act="rmbatch" aria-label="Remove this batch" title="Remove this batch">\xD7</button></div>\`;
  }
  function batchLabel(b) { return b.exp ? new Date(b.exp + "T12:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "no date"; }
  function status(it) {
    const h = onHand(it), m = num(it.min, 0);
    if (it.onOrder && h <= m) return "onorder";
    if (h <= 0) return "out";
    if (h <= m) return "low";
    return "ok";
  }
  const LABEL = { out: "Out of stock", low: "Order", onorder: "On order", ok: "In stock" };
  function suggested(it) { const rq = num(it.reorderQty, 0); return rq > 0 ? rq : Math.max(num(it.min, 0) * 2 - onHand(it), 1); }
  function suppliers() {
    const seen = {}, out = [];
    state.savedSuppliers.concat(state.items.map((i) => (i.supplier || "").trim())).filter(Boolean)
      .forEach((s) => { const k = s.toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(s); } });
    return out.sort((a, b) => a.localeCompare(b));
  }
  function ago(iso) {
    if (!iso) return "";
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    const d = Math.floor(s / 86400);
    return d === 1 ? "yesterday" : d + " days ago";
  }
  function price(v) { const n = parseFloat(String(v == null ? "" : v).replace(",", ".")); return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null; }
  function eur(n) { return "\u20AC" + n.toFixed(2); }
  function daysLeft(it) {
    const p = String(it.expiry || "").split("-").map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
    const d = new Date(p[0], p[1] - 1, p[2]), t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((d - t) / 86400000);
  }
  function fmtDate(s) { const p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function expLabel(n) {
    if (n < 0) return "Expired " + (-n === 1 ? "yesterday" : -n + " days ago");
    if (n === 0) return "Expires today";
    return "Expires in " + n + (n === 1 ? " day" : " days");
  }
  function expClass(n) { return n <= 7 ? "pe-bad" : n <= 30 ? "pe-soon" : "pe-later"; }
  const EXP_DAYS = 30;
  // one entry per batch that has expired or expires within EXP_DAYS
  function expiringItems() {
    const out = [];
    state.items.forEach((it) => {
      if (onHand(it) <= 0) return;
      getBatches(it).forEach((b) => { if (!b.exp) return; const d = daysLeft({ expiry: b.exp }); if (d !== null && d <= EXP_DAYS) out.push({ it, b, d }); });
    });
    return out.sort((a, b) => a.d - b.d);
  }
  function who(id) { if (!id) return ""; if (id === me) return "you"; return names[id] || ""; }

  // ---------- rendering ----------
  function renderStats() {
    const it = state.items;
    const c = { out: 0, low: 0, onorder: 0 };
    it.forEach((i) => { const s = status(i); if (c[s] != null) c[s]++; });
    const need = c.out + c.low;
    $("#stats").innerHTML =
      \`<div class="stat"><b>\${it.length}</b><span>Items</span></div>\` +
      \`<button class="stat warn" data-act="jump" data-f="need"><b>\${need}</b><span>To order</span></button>\` +
      \`<button class="stat bad" data-act="jump" data-f="out"><b>\${c.out}</b><span>Out</span></button>\` +
      \`<button class="stat bad" data-act="jump" data-f="exp"><b>\${expiringItems().length}</b><span>Expiring</span></button>\`;
    $("#orderBadge").textContent = need ? String(need) : "";
    const ne = expiringItems().length;
    $("#expBadge").textContent = ne ? String(ne) : "";
  }

  function renderChips() {
    const f = state.filter;
    const chip = (k, t) => \`<button class="chip" data-act="filter" data-f="\${k}" aria-pressed="\${f === k}">\${t}</button>\`;
    const sup = suppliers();
    const types = productTypes();
    const opt = (v, t, cur) => \`<option value="\${esc(v)}"\${v === cur ? " selected" : ""}>\${esc(t)}</option>\`;
    $("#chips").innerHTML = chip("all", "All") + chip("need", "To order") + chip("out", "Out") +
      (types.length ? \`<select class="chip" id="typeSel" aria-label="Filter by product type">\${opt("", "All types", state.type)}\${types.map((t) => opt(t, t, state.type)).join("")}</select>\` : "") +
      (sup.length ? \`<select class="chip" id="supSel" aria-label="Filter by supplier">\${opt("", "All suppliers", state.supplier)}\${sup.map((s) => opt(s, s, state.supplier)).join("")}</select>\` : "") +
      \`<select class="chip" id="groupSel" aria-label="Organise list">\${opt("", "No grouping", state.group)}\${opt("type", "Group by type", state.group)}\${opt("supplier", "Group by supplier", state.group)}</select>\`;
    $("#supplierList").innerHTML = sup.map((s) => \`<option value="\${esc(s)}">\`).join("");
    $("#typeList").innerHTML = types.map((t) => \`<option value="\${esc(t)}">\`).join("");
    const counts = {};
    state.items.forEach((it) => { const t = (it.type || "").trim(); if (t) counts[t] = (counts[t] || 0) + 1; });
    $("#typeChips").innerHTML = types.length
      ? types.map((t) => \`<span class="tchip">\${esc(t)} <small>\${counts[t] || 0}</small>\${counts[t] ? \`<span class="tc-spacer"></span>\` : \`<button type="button" data-act="deltype" data-t="\${esc(t)}" aria-label="Remove \${esc(t)}" title="Remove">\xD7</button>\`}</span>\`).join("")
      : \`<p>No types yet.</p>\`;
    renderSuppliers(sup);
  }

  function renderSuppliers(sup) {
    const box = $("#supChips");
    const a = document.activeElement;
    if (a && box.contains(a) && a.tagName === "INPUT") return;
    const counts = {};
    state.items.forEach((it) => { const s = (it.supplier || "").trim(); if (s) counts[s] = (counts[s] || 0) + 1; });
    box.innerHTML = !sup.length ? \`<p>No suppliers yet.</p>\` : sup.map((s) => {
      if (state.renamingSup === s) {
        return \`<form class="tchip renaming" data-rename="\${esc(s)}"><label class="vh" for="rn-sup">New name for \${esc(s)}</label><input id="rn-sup" value="\${esc(s)}" autocomplete="off"><button type="submit" title="Save" aria-label="Save new name">\u2713</button><button type="button" data-act="norename" title="Cancel" aria-label="Cancel">\xD7</button></form>\`;
      }
      const n = counts[s] || 0;
      return \`<span class="tchip">\${esc(s)} <small>\${n}</small>
        <button type="button" data-act="rensup" data-s="\${esc(s)}" aria-label="Rename \${esc(s)}" title="Rename">\u270E</button>
        \${n ? "" : \`<button type="button" data-act="delsup" data-s="\${esc(s)}" aria-label="Remove \${esc(s)}" title="Remove">\xD7</button>\`}</span>\`;
    }).join("");
    const inp = $("#rn-sup"); if (inp) { inp.focus(); inp.select(); }
  }

  function editorHtml(it) {
    const id = esc(it.id);
    return \`<form class="editor" data-edit="\${id}">
      <div class="fields">
        <div class="field" style="grid-column:1/-1"><label for="e-name-\${id}">Item name</label><input id="e-name-\${id}" name="name" value="\${esc(it.name)}"></div>
        <div class="field"><label for="e-bc-\${id}">Barcode</label><input id="e-bc-\${id}" name="barcode" inputmode="numeric" autocomplete="off" value="\${esc(it.barcode)}"></div>
        <div class="field"><label for="e-sup-\${id}">Supplier</label><input id="e-sup-\${id}" name="supplier" list="supplierList" value="\${esc(it.supplier)}"></div>
        <div class="field"><label for="e-type-\${id}">Product type</label><input id="e-type-\${id}" name="type" list="typeList" autocomplete="off" value="\${esc(it.type)}"></div>
        <div class="field"><label for="e-min-\${id}">Minimum</label><input id="e-min-\${id}" name="min" type="number" min="0" inputmode="numeric" value="\${num(it.min, 0)}"></div>
        <div class="field"><label for="e-rq-\${id}">Usual order qty</label><input id="e-rq-\${id}" name="reorderQty" type="number" min="0" inputmode="numeric" placeholder="Auto" value="\${num(it.reorderQty, 0) || ""}"></div>
        <div class="field"><label for="e-price-\${id}">Selling price (\u20AC)</label><input id="e-price-\${id}" name="price" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" value="\${price(it.price) != null ? price(it.price).toFixed(2) : ""}"></div>
        <div class="field" style="grid-column:1/-1"><span class="flabel">Batches on the shelf</span>
          <div class="batches" data-batches="\${id}">\${getBatches(it).map((b) => batchRowHtml(b)).join("") || ""}</div>
          <div class="actions"><button type="button" class="ghost" data-act="addbatch" data-id="\${id}">Add batch</button><span class="hint">One line per expiry date. The total on the shelf is the sum of the batches.</span></div>
        </div>
        <div class="field" style="grid-column:1/-1"><label for="e-ing-\${id}">Active ingredient(s)</label><input id="e-ing-\${id}" name="ingredients" autocomplete="off" placeholder="e.g. Clotrimazole 2%" value="\${esc(it.ingredients)}"><span class="hint">For medicines, medical products and supplements. Leave blank for cosmetics and toiletries.</span></div>
        <div class="field" style="grid-column:1/-1"><label class="check" for="e-quick-\${id}"><input type="checkbox" id="e-quick-\${id}" name="quick" \${isQuick(it.id) ? "checked" : ""}> Show in Quick Moving Products</label></div>
        <div class="field" style="grid-column:1/-1"><label for="e-desc-\${id}">Description</label><textarea id="e-desc-\${id}" name="description">\${esc(it.description)}</textarea></div>
      </div>
      <div class="actions">
        <button class="primary" type="submit">Save changes</button>
        <button class="ghost" type="button" data-act="cancel">Cancel</button>
        <span class="spacer"></span>
        \${state.confirmDel === it.id
          ? \`<span>Remove this item for everyone?</span><button class="danger" type="button" data-act="del" data-id="\${id}">Yes, remove</button><button class="ghost" type="button" data-act="nodel">Keep it</button>\`
          : \`<button class="ghost" type="button" data-act="askdel" data-id="\${id}">Remove item</button>\`}
      </div>
    </form>\`;
  }

  function renderList() {
    const el = $("#list");
    const a = document.activeElement;
    if (a && el.contains(a) && (a.tagName === "INPUT" || a.tagName === "TEXTAREA")) { state.listDirty = true; return; }
    state.listDirty = false;

    if (state.failed) { el.innerHTML = \`<div class="empty"><h2>Stock can't load here</h2><p>\${state.failed === "nodb" ? "Can't reach the Stock Room computer. Check it's switched on with Stock Room open, and that this device is on the pharmacy Wi-Fi." : "The stock list stopped updating. Reload the page to reconnect."}</p></div>\`; return; }
    if (!state.ready) { el.innerHTML = \`<div class="empty"><h2>Loading stock\u2026</h2><p>Fetching the latest counts.</p></div>\`; return; }
    if (!state.items.length) {
      el.innerHTML = \`<div class="empty"><h2>No items yet</h2><p>Start with the 50 to 100 lines you order most often. Add them one by one, or paste a whole list in one go.</p><button class="primary" data-act="tab" data-t="add">Add your first items</button></div>\`;
      return;
    }
    const q = state.q.trim().toLowerCase();
    const rows = state.items
      .filter((it) => {
        const s = status(it);
        if (state.filter === "need" && !(s === "low" || s === "out")) return false;
        if (state.filter === "out" && s !== "out") return false;
        if (state.filter === "onorder" && s !== "onorder") return false;
        if (state.supplier && (it.supplier || "").trim() !== state.supplier) return false;
        if (state.type && (it.type || "").trim() !== state.type) return false;
        if (q) {
          const qd = q.replace(/\\s+/g, "");
          const textHit = [it.name, it.supplier, it.type, it.description, it.ingredients].join(" ").toLowerCase().includes(q);
          const codeHit = qd && bc(it.barcode).includes(qd);
          if (!textHit && !codeHit) return false;
        }
        return true;
      })
      .sort((x, y) => String(x.name || "").localeCompare(String(y.name || "")));

    if (!rows.length) { el.innerHTML = \`<div class="empty"><h2>Nothing matches</h2><p>Try a different search or filter.</p></div>\`; return; }

    const rowHtml = (it) => {
      const s = status(it), id = esc(it.id), w = who(it.updatedBy);
      const rq = num(it.reorderQty, 0);
      const dl = daysLeft(it), pr = price(it.price);
      const expPill = dl === null ? "" : \`<span class="pe \${expClass(dl)}" title="Expiry \${esc(fmtDate(it.expiry))}">\${dl <= EXP_DAYS ? expLabel(dl) : "Exp " + esc(fmtDate(it.expiry))}</span>\`;
      const metaBits = [it.barcode ? \`<span class="code">\${esc(it.barcode)}</span>\` : "", it.type && state.group !== "type" ? \`<span class="tag">\${esc(it.type)}</span>\` : "", state.group === "supplier" ? "" : it.supplier ? esc(it.supplier) : "No supplier", it.updatedAt ? "Counted " + ago(it.updatedAt) + (w ? " by " + esc(w) : "") : ""].filter(Boolean);
      return \`<article class="row s-\${s}" data-id="\${id}">
        <div class="info">
          <div class="name">\${esc(it.name || "Unnamed item")} <span class="pill p-\${s}">\${LABEL[s]}</span> \${expPill}</div>
          <div class="meta">\${metaBits.join(" \xB7 ")}</div>
          \${it.ingredients ? \`<div class="ing"><span>Active:</span> \${esc(it.ingredients)}</div>\` : ""}
          \${(() => { const bs = getBatches(it); return bs.length > 1 ? \`<div class="bline">Batches: \${bs.map((x) => \`<span>\${x.qty} \xD7 \${batchLabel(x)}</span>\`).join(" \xB7 ")}</div>\` : ""; })()}
          \${it.description ? \`<div class="desc">\${esc(it.description)}</div>\` : ""}
        </div>
        <div class="count">
          <div class="stepper">
            <button type="button" data-act="dec" data-id="\${id}" aria-label="One less \${esc(it.name)}">\u2212</button>
            <input id="c-\${id}" type="number" inputmode="numeric" min="0" value="\${onHand(it)}" data-count="\${id}" aria-label="On shelf: \${esc(it.name)}">
            <button type="button" data-act="inc" data-id="\${id}" aria-label="One more \${esc(it.name)}">+</button>
          </div>
          <div class="lvl">min \${num(it.min, 0)} \xB7 order \${rq || "auto"}</div>
          \${pr != null ? \`<div class="price">\${eur(pr)}</div>\` : ""}
        </div>
        <button class="ghost" type="button" data-act="edit" data-id="\${id}">\${state.editing === it.id ? "Close" : "Edit"}</button>
        \${state.editing === it.id ? editorHtml(it) : ""}
      </article>\`;
    };

    if (!state.group) { el.innerHTML = rows.map(rowHtml).join(""); return; }
    const field = state.group, none = field === "type" ? "No type set" : "No supplier set";
    const groups = {};
    rows.forEach((it) => { const k = (it[field] || "").trim() || none; (groups[k] = groups[k] || []).push(it); });
    const keys = Object.keys(groups).sort((x, y) => (x === none) - (y === none) || x.localeCompare(y));
    el.innerHTML = keys.map((k) => {
      const list = groups[k];
      const need = list.filter((it) => { const s = status(it); return s === "low" || s === "out"; }).length;
      return \`<h2 class="ghd">\${esc(k)} <small>\${list.length} item\${list.length === 1 ? "" : "s"}\${need ? \` \xB7 <b>\${need} to order</b>\` : ""}</small></h2>\${list.map(rowHtml).join("")}\`;
    }).join("");
  }

  function orderText(sup, list) {
    const d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return \`Order for \${sup} (\${d})\\n\` + list.map((it) => \`\${it.name}  x \${state.ordQty[it.id] != null ? state.ordQty[it.id] : suggested(it)}\`).join("\\n");
  }

  function renderOrders() {
    const el = $("#orders");
    const a = document.activeElement;
    if (a && el.contains(a) && a.tagName === "INPUT") return;
    if (!state.ready) { el.innerHTML = \`<div class="empty"><h2>Loading\u2026</h2></div>\`; return; }
    const need = state.items.filter((it) => { const s = status(it); return s === "low" || s === "out" || s === "onorder"; });
    if (!need.length) { el.innerHTML = \`<div class="empty"><h2>Nothing to order</h2><p>Every item is above its minimum. Items appear here as soon as someone counts them at or below the minimum.</p></div>\`; return; }
    const groups = {};
    need.forEach((it) => { const k = (it.supplier || "").trim() || "No supplier set"; (groups[k] = groups[k] || []).push(it); });
    el.innerHTML = Object.keys(groups).sort((x, y) => x.localeCompare(y)).map((sup) => {
      const list = groups[sup].sort((x, y) => String(x.name).localeCompare(String(y.name)));
      const todo = list.filter((it) => status(it) !== "onorder");
      const done = list.filter((it) => status(it) === "onorder");
      const key = esc(sup);
      const line = (it, isDone) => {
        const id = esc(it.id), q = state.ordQty[it.id] != null ? state.ordQty[it.id] : suggested(it);
        return \`<div class="oline\${isDone ? " done" : ""}">
          <div class="info"><div class="name">\${esc(it.name)} <span class="pill p-\${status(it)}">\${LABEL[status(it)]}</span></div>
          <div class="meta">On shelf \${onHand(it)} \xB7 min \${num(it.min, 0)}\${isDone && it.orderedAt ? " \xB7 ordered " + ago(it.orderedAt) : ""}</div></div>
          \${isDone ? \`<span></span><button class="ghost" type="button" data-act="unorder" data-id="\${id}">Undo</button>\`
            : \`<label class="q" for="oq-\${id}">Qty <input id="oq-\${id}" type="number" min="1" inputmode="numeric" value="\${q}" data-oq="\${id}"></label>
               <button class="ghost" type="button" data-act="ordered" data-id="\${id}">Mark ordered</button>\`}
        </div>\`;
      };
      return \`<section class="group">
        <div class="ghead"><h3>\${key}<small>\${todo.length} to order\${done.length ? ", " + done.length + " on order" : ""}</small></h3>
          \${todo.length ? \`<button class="ghost" type="button" data-act="copy" data-sup="\${key}">Copy order</button>\` : ""}</div>
        \${todo.map((it) => line(it, false)).join("")}\${done.map((it) => line(it, true)).join("")}
        \${state.copyOpen === sup ? \`<textarea class="copybox" id="copybox" readonly aria-label="Order text">\${esc(orderText(sup, todo))}</textarea>\` : ""}
      </section>\`;
    }).join("");
  }

  function renderExpiry() {
    const el = $("#expiring");
    const a = document.activeElement;
    if (a && el.contains(a) && a.tagName === "INPUT") return;
    if (!state.ready) { el.innerHTML = \`<div class="empty"><h2>Loading\u2026</h2></div>\`; return; }
    const list = expiringItems();
    if (!list.length) {
      const dated = state.items.filter((it) => daysLeft(it) !== null).length;
      el.innerHTML = \`<div class="empty"><h2>Nothing expiring soon</h2><p>\${dated ? "No stocked item expires in the next 30 days." : "No items have an expiry date yet. Add one under Edit on any item, using the earliest date on the shelf."}</p></div>\`;
      return;
    }
    const bands = [
      { title: "Expired", test: (d) => d < 0 },
      { title: "This week", test: (d) => d >= 0 && d <= 7 },
      { title: "Within 30 days", test: (d) => d > 7 },
    ];
    el.innerHTML = bands.map((b) => {
      const rows = list.filter((r) => b.test(r.d));
      if (!rows.length) return "";
      const units = rows.reduce((s, r) => s + r.b.qty, 0);
      const total = rows.reduce((s, r) => s + (price(r.it.price) || 0) * r.b.qty, 0);
      return \`<section class="group">
        <div class="ghead"><h3>\${b.title}<small>\${units} unit\${units === 1 ? "" : "s"}</small></h3>
          \${total > 0 ? \`<span class="val" title="Units in these batches \xD7 selling price">\${eur(total)}</span>\` : ""}</div>
        \${rows.map(({ it, b: bt, d }) => {
          const key = esc(it.id + "|" + bt.exp), pr = price(it.price), all = onHand(it);
          const bits = [\`\${bt.qty} of \${all} on shelf\`, it.type ? esc(it.type) : "", pr != null ? eur(pr) + " each" : "", it.supplier ? esc(it.supplier) : ""].filter(Boolean);
          const ctl = state.confirmWo === it.id + "|" + bt.exp
            ? \`<span class="wo"><button class="danger" type="button" data-act="dowo" data-k="\${key}">Remove \${bt.qty}</button><button class="ghost" type="button" data-act="nowo">Keep</button></span>\`
            : \`<button class="ghost" type="button" data-act="askwo" data-k="\${key}" title="Take this batch off the stock count, e.g. when thrown out or returned to the supplier">Remove from stock</button>\`;
          return \`<div class="oline">
            <div class="info"><div class="name">\${bt.qty} \xD7 \${esc(it.name)} <span class="pe \${expClass(d)}">\${expLabel(d)}</span></div>
              <div class="meta">\${esc(fmtDate(bt.exp))} \xB7 \${bits.join(" \xB7 ")}</div></div>
            <label class="q" for="ex-\${key}">Date <input id="ex-\${key}" type="date" value="\${esc(bt.exp)}" data-exp="\${key}"></label>
            \${ctl}
          </div>\`;
        }).join("")}
      </section>\`;
    }).join("");
  }

  function renderTabs() {
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
    ["stock", "cash", "hist", "order", "exp", "add", "set"].forEach((t) => { $("#tab-" + t).hidden = t !== state.tab; });
  }

  function render() {
    document.body.classList.toggle("readonly", !state.canWrite);
    const n = $("#notice");
    n.hidden = state.canWrite;
    n.textContent = state.canWrite ? "" : "You can view stock but not change it. Ask the page owner to give you Contributor access.";
    renderTabs(); renderStats(); renderChips(); renderList(); renderOrders(); renderExpiry();
    if (typeof renderTill === "function") renderTill();
  }

  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }

  // ---------- writes ----------
  function writeErr(e) {
    const code = e && e.code;
    if (code === "invalid_argument") { state.canWrite = false; render(); toast("This change wasn't saved: you have view-only access."); }
    else if (code === "quota_exceeded") toast("The stock list is full. Remove old items to add more.");
    else toast("Couldn't save. Check your connection and try again.");
  }
  function queue(id, fn) {
    chains[id] = (chains[id] || Promise.resolve()).then(fn).catch(writeErr);
    return chains[id];
  }
  function stamp(p) { p.updatedAt = new Date().toISOString(); if (me) p.updatedBy = me; return p; }
  function update(id, patch) { if (!db) return; return queue(id, () => db.collection("items").doc(id).update(stamp(patch))); }

  function commitCount(id) {
    const it = state.items.find((x) => x.id === id);
    const v = state.pending[id];
    if (!it || v == null) return;
    const patch = batchPatch(batchesForTotal(it, v), it);
    update(id, patch).then(() => { if (state.pending[id] === v) delete state.pending[id]; render(); });
  }
  function bump(id, d) {
    const it = state.items.find((x) => x.id === id); if (!it) return;
    state.pending[id] = Math.max(0, onHand(it) + d);
    const inp = document.getElementById("c-" + id); if (inp) inp.value = state.pending[id];
    clearTimeout(timers[id]); timers[id] = setTimeout(() => commitCount(id), 700);
    renderStats();
  }

  function itemFrom(o) {
    return stamp({
      name: o.name.trim(), barcode: bc(o.barcode), supplier: (o.supplier || "").trim(), type: (o.type || "").trim(),
      ...batchPatch(num(o.onHand, 0) > 0 ? [{ exp: o.expiry || "", qty: num(o.onHand, 0) }] : [], { expiry: o.expiry || "" }),
      min: num(o.min, 0), reorderQty: num(o.reorderQty, 0), price: price(o.price), description: (o.description || "").trim(), ingredients: (o.ingredients || "").trim(), onOrder: false, createdAt: new Date().toISOString(),
    });
  }

  function parseBulk(text) {
    return text.split(/\\r?\\n/).map((l) => l.trim()).filter(Boolean)
      .map((l) => l.split(/\\t|,|;/).map((x) => x.trim()))
      .filter((p) => p[0] && !/^(item\\s*)?name$/i.test(p[0]))
      .map((p) => ({ name: p[0], supplier: p[1], onHand: p[2], min: p[3], reorderQty: p[4], barcode: p[5], type: p[6] }));
  }
  function bc(v) { return String(v == null ? "" : v).replace(/\\s+/g, ""); }
  function barcodeTaken(code, exceptId) {
    const c = bc(code); if (!c) return null;
    return state.items.find((x) => x.id !== exceptId && bc(x.barcode) === c) || null;
  }

  // ---------- events ----------
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act, id = b.dataset.id;
    if (act === "inc") bump(id, 1);
    else if (act === "dec") bump(id, -1);
    else if (act === "filter") { state.filter = b.dataset.f; render(); }
    else if (act === "jump") {
      const f = b.dataset.f;
      state.tab = f === "need" ? "order" : f === "exp" ? "exp" : "stock";
      if (state.tab === "stock") state.filter = f;
      saveTab(); render();
    }
    else if (act === "qopen") { openQuick(); }
    else if (act === "qclose") { closeQuick(); }
    else if (act === "qadd") {
      const it = state.items.find((x) => x.id === id);
      if (it) { addToCart(it, true); renderQuick(); toast(\`Added \${it.name}\`); }
    }
    else if (act === "qpin") { setQuick(id, !isQuick(id)); renderQuick(); }
    else if (act === "mode") { till.mode = b.dataset.m; till.confirmRefund = null; saveCart(); renderTill(); $("#cq").focus(); }
    else if (act === "cadd") { const it = state.items.find((x) => x.id === id); if (it) addToCart(it); }
    else if (act === "cinc" || act === "cdec") { const l = till.cart[+b.dataset.i]; if (l) { l.qty = Math.max(1, l.qty + (act === "cinc" ? 1 : -1)); saveCart(); renderTill(); } }
    else if (act === "crem") { till.cart.splice(+b.dataset.i, 1); saveCart(); renderTill(); }
    else if (act === "cclear") { till.cart = []; saveCart(); renderTill(); }
    else if (act === "ccheckout") { checkout(); }
    else if (act === "dtype") { till.disc.type = b.dataset.t; saveCart(); renderCart(); const d = $("#discv"); if (d) d.focus(); }
    else if (act === "dclear") { till.disc.value = ""; saveCart(); renderCart(); }
    else if (act === "askrefund") { till.confirmRefund = b.dataset.k; renderSales(); }
    else if (act === "dorefund") { refundLine(b.dataset.s, +b.dataset.j); }
    else if (act === "rensup") { state.renamingSup = b.dataset.s; renderChips(); }
    else if (act === "norename") { state.renamingSup = null; document.activeElement && document.activeElement.blur(); renderChips(); }
    else if (act === "delsup") {
      const s = b.dataset.s;
      state.savedSuppliers = state.savedSuppliers.filter((x) => x !== s);
      if (state.supplier === s) state.supplier = "";
      saveSettings(); renderChips(); toast("Removed " + s);
    }
    else if (act === "deltype") {
      const t = b.dataset.t;
      state.savedTypes = state.savedTypes.filter((x) => x !== t);
      saveTypes(state.savedTypes); renderChips(); toast("Removed " + t);
    }
    else if (act === "addbatch") {
      const box = document.querySelector(\`[data-batches="\${CSS.escape(id)}"]\`);
      if (box) { box.insertAdjacentHTML("beforeend", batchRowHtml(null)); const r = box.lastElementChild; if (r) r.querySelector(".bexp").focus(); }
    }
    else if (act === "rmbatch") { const r = b.closest(".brow"); if (r) r.remove(); }
    else if (act === "askwo") { state.confirmWo = b.dataset.k; renderExpiry(); }
    else if (act === "nowo") { state.confirmWo = null; renderExpiry(); }
    else if (act === "dowo") {
      const [iid, ex] = b.dataset.k.split("|");
      const it = state.items.find((x) => x.id === iid);
      if (it) {
        const bs = getBatches(it), gone = bs.filter((x) => x.exp === ex).reduce((t, x) => t + x.qty, 0);
        update(iid, batchPatch(bs.filter((x) => x.exp !== ex), it));
        toast(\`\${gone} \xD7 \${it.name} removed from stock\`);
      }
      state.confirmWo = null;
    }
    else if (act === "tab") { state.tab = b.dataset.t; saveTab(); render(); if (state.tab === "hist") openHist(); }
    else if (act === "hp") { hist.preset = b.dataset.p; subscribeHist(); }
    else if (act === "hdl") { downloadHist(); }
    else if (act === "askhrefund") { hist.confirm = b.dataset.k; renderHist(); }
    else if (act === "dohrefund") { refundLine(b.dataset.s, +b.dataset.j); }
    else if (act === "edit") { state.editing = state.editing === id ? null : id; state.confirmDel = null; render(); }
    else if (act === "cancel") { state.editing = null; state.confirmDel = null; render(); }
    else if (act === "askdel") { state.confirmDel = id; render(); }
    else if (act === "nodel") { state.confirmDel = null; render(); }
    else if (act === "del") {
      state.editing = null; state.confirmDel = null;
      queue(id, () => db.collection("items").doc(id).delete()).then(() => toast("Item removed"));
      render();
    }
    else if (act === "ordered") { update(id, { onOrder: true, orderedAt: new Date().toISOString() }); toast("Marked as ordered"); }
    else if (act === "unorder") { update(id, { onOrder: false, orderedAt: null }); }
    else if (act === "copy") {
      const sup = b.dataset.sup;
      const list = state.items.filter((it) => ((it.supplier || "").trim() || "No supplier set") === sup && (status(it) === "low" || status(it) === "out"))
        .sort((x, y) => String(x.name).localeCompare(String(y.name)));
      const text = orderText(sup, list);
      try { await navigator.clipboard.writeText(text); toast("Order copied. Paste it into your email or message."); state.copyOpen = null; }
      catch (e) { state.copyOpen = sup; renderOrders(); const box = $("#copybox"); if (box) { box.focus(); box.select(); } toast("Select the text below and copy it."); }
    }
  });

  document.querySelector(".tabs").addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-tab]"); if (!b) return;
    state.tab = b.dataset.tab; state.copyOpen = null; saveTab(); render();
    if (state.tab === "hist") openHist();
  });
  function saveTab() { try { localStorage.setItem("stockroom.tab", state.tab); } catch (e) {} }

  $("#q").addEventListener("input", (e) => { state.q = e.target.value; renderList(); });
  // A barcode scanner types the number then presses Enter: jump straight to that item's count.
  $("#q").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const code = bc(state.q);
    const exact = code && state.items.find((x) => bc(x.barcode) === code);
    const inputs = document.querySelectorAll("#list [data-count]");
    const target = exact ? document.getElementById("c-" + exact.id) : (inputs.length === 1 ? inputs[0] : null);
    if (target) { target.focus(); target.select(); }
    else if (code && /^\\d{6,}$/.test(code) && !exact) toast("No item has barcode " + code + ". Add it under Add items.");
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.id === "supSel") { state.supplier = t.value; renderList(); return; }
    if (t.id === "typeSel") { state.type = t.value; renderList(); return; }
    if (t.id === "groupSel") { state.group = t.value; try { localStorage.setItem("stockroom.group", state.group); } catch (e) {} renderList(); return; }
    if (t.dataset.count) {
      const id = t.dataset.count; clearTimeout(timers[id]);
      state.pending[id] = num(t.value, 0); t.value = state.pending[id]; commitCount(id); renderStats();
    }
    if (t.dataset.exp) {
      const [iid, ex] = t.dataset.exp.split("|");
      const it = state.items.find((x) => x.id === iid);
      if (it) {
        const bs = getBatches(it).map((x) => x.exp === ex ? { exp: t.value || "", qty: x.qty } : x);
        update(iid, batchPatch(bs, it));
        toast(t.value ? "Batch date changed to " + fmtDate(t.value) : "Batch date removed");
      }
      t.blur(); return;
    }
    if (t.dataset.oq) { state.ordQty[t.dataset.oq] = Math.max(1, num(t.value, 1)); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.count) e.target.blur(); });
  document.addEventListener("focusout", () => { setTimeout(() => { if (state.listDirty) renderList(); }, 0); });

  document.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-edit]"); if (!f) return;
    function editedBatches(form, itemId) {
      const it = state.items.find((x) => x.id === itemId) || {};
      const rows = Array.from(form.querySelectorAll(".brow")).map((r) => ({ exp: r.querySelector(".bexp").value, qty: num(r.querySelector(".bqty").value, 0) }));
      delete state.pending[itemId];
      return batchPatch(rows, it);
    }
    e.preventDefault();
    const id = f.dataset.edit, g = (n) => f.elements[n].value;
    if (!g("name").trim()) { toast("Give the item a name."); return; }
    const dup = barcodeTaken(g("barcode"), id);
    if (dup) { toast("That barcode is already on " + (dup.name || "another item")); return; }
    update(id, { name: g("name").trim(), barcode: bc(g("barcode")), supplier: g("supplier").trim(), type: g("type").trim(), min: num(g("min"), 0), reorderQty: num(g("reorderQty"), 0), price: price(g("price")), ...editedBatches(f, id), description: g("description").trim(), ingredients: g("ingredients").trim() });
    const wantQuick = f.elements["quick"] && f.elements["quick"].checked;
    if (wantQuick !== isQuick(id)) setQuick(id, wantQuick);
    state.editing = null; f.remove(); render(); toast("Saved");
  });

  $("#addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    const name = $("#a-name").value;
    if (!name.trim()) { toast("Give the item a name."); $("#a-name").focus(); return; }
    const dup = barcodeTaken($("#a-bc").value);
    if (dup) { toast("That barcode is already on " + (dup.name || "another item")); $("#a-bc").focus(); return; }
    try {
      await db.collection("items").add(itemFrom({ name, barcode: $("#a-bc").value, supplier: $("#a-supplier").value, type: $("#a-type").value, onHand: $("#a-on").value, min: $("#a-min").value, reorderQty: $("#a-rq").value, price: $("#a-price").value, expiry: $("#a-exp").value, description: $("#a-desc").value, ingredients: $("#a-ing").value }));
      toast("Added " + name.trim());
      $("#a-name").value = ""; $("#a-bc").value = ""; $("#a-price").value = ""; $("#a-exp").value = ""; $("#a-desc").value = ""; $("#a-ing").value = ""; $("#a-on").value = "0"; $("#a-rq").value = ""; $("#a-name").focus();
    } catch (err) { writeErr(err); }
  });

  $("#supForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    const s = $("#s-new").value.trim();
    if (!s) { $("#s-new").focus(); return; }
    if (suppliers().some((x) => x.toLowerCase() === s.toLowerCase())) { toast(s + " is already on the list"); return; }
    state.savedSuppliers = state.savedSuppliers.concat([s]);
    saveSettings(); $("#s-new").value = ""; renderChips(); toast("Added " + s);
  });
  $("#supChips").addEventListener("submit", async (e) => {
    const f = e.target.closest("form[data-rename]"); if (!f) return;
    e.preventDefault();
    const from = f.dataset.rename, to = $("#rn-sup").value.trim();
    state.renamingSup = null;
    if (!to || to === from) { document.activeElement.blur(); renderChips(); return; }
    const clash = suppliers().find((x) => x !== from && x.toLowerCase() === to.toLowerCase());
    const target = clash || to;
    state.savedSuppliers = state.savedSuppliers.filter((x) => x !== from && x !== target).concat([target]);
    if (state.supplier === from) state.supplier = target;
    document.activeElement.blur();
    saveSettings();
    const affected = state.items.filter((it) => (it.supplier || "").trim() === from);
    for (const it of affected) await update(it.id, { supplier: target });
    renderChips(); render();
    toast(clash ? \`Merged \${from} into \${target}\` : \`Renamed to \${target}\` + (affected.length ? \` on \${affected.length} item\${affected.length === 1 ? "" : "s"}\` : ""));
  });

  $("#typeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    const t = $("#t-new").value.trim();
    if (!t) { $("#t-new").focus(); return; }
    if (productTypes().some((x) => x.toLowerCase() === t.toLowerCase())) { toast(t + " is already a type"); return; }
    state.savedTypes = state.savedTypes.concat([t]);
    saveTypes(state.savedTypes); $("#t-new").value = ""; renderChips(); toast("Added " + t);
  });

  $("#bulk").addEventListener("input", () => {
    const n = parseBulk($("#bulk").value).length;
    $("#bulkHint").textContent = n ? \`\${n} item\${n === 1 ? "" : "s"} ready to add\` : "Nothing pasted yet";
    $("#bulkAdd").disabled = !n;
    $("#bulkAdd").textContent = n ? \`Add \${n} item\${n === 1 ? "" : "s"}\` : "Add items";
  });
  $("#bulkAdd").addEventListener("click", async () => {
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    const rows = parseBulk($("#bulk").value); if (!rows.length) return;
    const btn = $("#bulkAdd"); btn.disabled = true;
    let ok = 0;
    for (const r of rows) {
      try { await db.collection("items").add(itemFrom(r)); ok++; btn.textContent = \`Adding\u2026 \${ok}/\${rows.length}\`; }
      catch (err) { writeErr(err); break; }
    }
    if (ok) { toast(\`Added \${ok} item\${ok === 1 ? "" : "s"}\`); $("#bulk").value = ""; }
    $("#bulk").dispatchEvent(new Event("input"));
  });

  // ---------- cashout ----------
  const till = { mode: "sale", cart: [], q: "", sales: [], busy: false, confirmRefund: null, disc: { type: "pct", value: "" } };
  try {
    const c = JSON.parse(sessionStorage.getItem("stockroom.cart") || "null");
    if (c && Array.isArray(c.cart)) { till.cart = c.cart; till.mode = c.mode === "refund" ? "refund" : "sale"; }
    if (c && c.disc && (c.disc.type === "pct" || c.disc.type === "eur")) till.disc = { type: c.disc.type, value: String(c.disc.value || "") };
  } catch (e) {}
  function saveCart() { try { sessionStorage.setItem("stockroom.cart", JSON.stringify({ cart: till.cart, mode: till.mode, disc: till.disc })); } catch (e) {} }
  function subtotal() { return cents(till.cart.reduce((s, l) => s + (l.price || 0) * l.qty, 0)); }
  function discountAmount(sub) {
    if (till.mode === "refund") return 0;
    const v = parseFloat(String(till.disc.value).replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return 0;
    return cents(till.disc.type === "pct" ? sub * Math.min(v, 100) / 100 : Math.min(v, sub));
  }
  function discLabel() {
    const v = parseFloat(String(till.disc.value).replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return "";
    return till.disc.type === "pct" ? \`\${+Math.min(v, 100).toFixed(2)}% off\` : \`\${eur(v)} off\`;
  }
  function saleRatio(s) { const sub = Number(s.subtotal); return sub > 0 ? (Number(s.total) || 0) / sub : 1; }
  const cents = (n) => Math.round((Number(n) || 0) * 100) / 100;
  function cartTotal() { const s = subtotal(); return cents(s - discountAmount(s)); }
  function todayKey(d) { const x = d ? new Date(d) : new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }

  function addToCart(it, fromMenu) {
    const l = till.cart.find((x) => x.id === it.id);
    if (l) l.qty += 1;
    else till.cart.push({ id: it.id, name: it.name || "Unnamed item", qty: 1, price: price(it.price) });
    till.q = ""; $("#cq").value = ""; saveCart(); renderTill();
    if (!fromMenu) $("#cq").focus();
  }

  function renderTill() {
    $("#tab-cash .till").classList.toggle("refund", till.mode === "refund");
    document.querySelectorAll(".mode").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.m === till.mode)));
    const n = till.cart.reduce((s, l) => s + l.qty, 0);
    $("#cartBadge").textContent = n ? String(n) : "";
    renderResults(); renderCart(); renderSales();
  }

  function renderResults() {
    const el = $("#cresults"), q = till.q.trim().toLowerCase();
    if (!q) { el.innerHTML = ""; return; }
    const qd = q.replace(/\\s+/g, "");
    const hits = state.items.filter((it) => String(it.name || "").toLowerCase().includes(q) || (qd && bc(it.barcode).includes(qd)) || String(it.description || "").toLowerCase().includes(q) || String(it.ingredients || "").toLowerCase().includes(q))
      .sort((a, b) => String(a.name).localeCompare(String(b.name))).slice(0, 8);
    el.innerHTML = hits.length ? hits.map((it) => {
      const pr = price(it.price);
      return \`<button type="button" class="cres" data-act="cadd" data-id="\${esc(it.id)}">
        <span><span class="name">\${esc(it.name)}</span><span class="meta">\${onHand(it)} on shelf\${it.barcode ? \` \xB7 <span class="code">\${esc(it.barcode)}</span>\` : ""}</span></span>
        <b>\${pr != null ? eur(pr) : "No price"}</b></button>\`;
    }).join("") : \`<p class="hint">No product matches "\${esc(till.q.trim())}".</p>\`;
  }

  function renderCart() {
    const el = $("#cart");
    const a = document.activeElement;
    if (a && el.contains(a) && a.tagName === "INPUT") return;
    const refund = till.mode === "refund";
    if (!till.cart.length) {
      el.innerHTML = \`<div class="empty"><h2>\${refund ? "Nothing to return yet" : "Basket is empty"}</h2><p>\${refund
        ? "Add the items the customer is returning. They go back into stock when you confirm. To refund a sale from today, use Refund next to it in Today's sales."
        : "Scan a barcode or type a product name above, then tap the product to add it. Stock comes off the shelf when you complete the sale."}</p></div>\`;
      return;
    }
    const sub = subtotal(), damt = discountAmount(sub), total = cartTotal(), noPrice = till.cart.some((l) => l.price == null);
    const discRow = refund ? "" : \`<div class="cdisc">
        <span class="dl">Discount</span>
        <div class="seg" role="radiogroup" aria-label="Discount type">
          <button type="button" data-act="dtype" data-t="pct" role="radio" aria-checked="\${till.disc.type === "pct"}">%</button>
          <button type="button" data-act="dtype" data-t="eur" role="radio" aria-checked="\${till.disc.type === "eur"}">\u20AC</button>
        </div>
        <input id="discv" type="number" min="0" step="\${till.disc.type === "pct" ? "1" : "0.01"}" inputmode="decimal" value="\${esc(till.disc.value)}" placeholder="\${till.disc.type === "pct" ? "e.g. 10" : "e.g. 2.00"}" aria-label="Discount \${till.disc.type === "pct" ? "percentage" : "amount in euro"}">
        <span class="damt" id="damt">\${damt ? "\u2212" + eur(damt) : ""}</span>
        \${till.disc.value !== "" ? \`<button type="button" class="xbtn" data-act="dclear" aria-label="Remove discount" title="Remove discount">\xD7</button>\` : ""}
      </div>\`;
    el.innerHTML = \`<div class="cartbox">\${till.cart.map((l, i) => {
      const it = state.items.find((x) => x.id === l.id);
      const have = it ? onHand(it) : 0;
      const warn = !it ? "This item was removed from stock." : !refund && l.qty > have ? \`Only \${have} on shelf. Stock will go to 0.\` : "";
      return \`<div class="cline">
        <div class="nm name">\${esc(l.name)}</div>
        <div class="stepper">
          <button type="button" data-act="cdec" data-i="\${i}" aria-label="One less \${esc(l.name)}">\u2212</button>
          <input id="cl-q-\${i}" type="number" min="1" inputmode="numeric" value="\${l.qty}" data-cq="\${i}" aria-label="Quantity of \${esc(l.name)}">
          <button type="button" data-act="cinc" data-i="\${i}" aria-label="One more \${esc(l.name)}">+</button>
        </div>
        <label class="pr" for="cl-p-\${i}">\u20AC<input id="cl-p-\${i}" type="number" min="0" step="0.01" inputmode="decimal" value="\${l.price != null ? l.price.toFixed(2) : ""}" placeholder="0.00" data-cp="\${i}"></label>
        <div class="lt">\${eur(cents((l.price || 0) * l.qty))}<button type="button" class="xbtn" data-act="crem" data-i="\${i}" aria-label="Remove \${esc(l.name)}" title="Remove">\xD7</button></div>
        \${warn ? \`<div class="warnline">\${warn}</div>\` : ""}
      </div>\`;
    }).join("")}
      \${discRow}
      <div class="ctotal">
        <div class="sum"><small id="csubl">\${refund ? "To refund" : damt ? \`Subtotal \${eur(sub)} \xB7 \${discLabel()}\` : "Total"}\${noPrice ? " \xB7 some items have no price" : ""}</small><span id="ctot">\${eur(total)}</span></div>
        <div class="actions">
          <button type="button" class="ghost" data-act="cclear">Clear</button>
          <button type="button" class="primary big" data-act="ccheckout" \${till.busy ? "disabled" : ""}>\${refund ? "Return to stock" : "Complete sale"}</button>
        </div>
      </div></div>\`;
  }

  function renderSales() {
    const el = $("#sales");
    const today = todayKey();
    const list = till.sales.filter((s) => s.day === today).sort((a, b) => String(b.at).localeCompare(String(a.at)));
    if (!db) { el.innerHTML = \`<p class="hint">Sales show here once the page is connected.</p>\`; return; }
    if (!list.length) { el.innerHTML = \`<p class="hint">No sales yet today. Completed sales and refunds appear here.</p>\`; return; }
    let net = 0;
    const html = list.map((s) => {
      const isRefund = s.kind === "refund";
      const lines = Array.isArray(s.lines) ? s.lines : [];
      const t = new Date(s.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const w = who(s.by);
      const ratio = saleRatio(s);
      net += isRefund ? -(Number(s.total) || 0) : (Number(s.total) || 0) - lines.reduce((x, l) => x + (Number(l.refunded) || 0) * (Number(l.price) || 0) * ratio, 0);
      return \`<div class="sale\${isRefund ? " is-refund" : ""}">
        <div class="sh"><span>\${t}\${isRefund ? " \xB7 Return" : ""}\${s.discount && s.discount.amount ? \` \xB7 <span class="dtag">\${esc(s.discount.label || "Discount")}</span>\` : ""}\${w ? " \xB7 " + esc(w) : ""}</span><b>\${isRefund ? "\u2212" : ""}\${eur(Number(s.total) || 0)}</b></div>
        \${lines.map((l, j) => {
          const left = (Number(l.qty) || 0) - (Number(l.refunded) || 0);
          const key = s.id + ":" + j;
          let ctl = "";
          if (!isRefund) {
            if (left <= 0) ctl = \`<span class="done">Refunded</span>\`;
            else if (till.confirmRefund === key) ctl = \`<button type="button" class="danger" data-act="dorefund" data-s="\${esc(s.id)}" data-j="\${j}">Refund \${left} \xB7 \${eur(cents(left * (Number(l.price) || 0) * saleRatio(s)))}?</button>\`;
            else ctl = \`<button type="button" class="ghost" data-act="askrefund" data-k="\${esc(key)}">Refund</button>\`;
          }
          return \`<div class="sl"><span>\${Number(l.qty) || 0} \xD7 \${esc(l.name)}\${l.refunded ? \` <span class="done">(\${l.refunded} back)</span>\` : ""}</span>\${ctl}</div>\`;
        }).join("")}
      </div>\`;
    }).join("");
    el.innerHTML = html + \`<div class="daytotal"><span>Takings today</span><b>\${eur(cents(net))}</b></div>\`;
  }

  async function checkout() {
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    if (!till.cart.length || till.busy) return;
    const refund = till.mode === "refund";
    till.busy = true; renderCart();
    const lines = till.cart.map((l) => ({ id: l.id, name: l.name, qty: l.qty, price: l.price != null ? l.price : 0, refunded: 0 }));
    const total = cartTotal();
    try {
      for (const l of lines) {
        const it = state.items.find((x) => x.id === l.id);
        if (!it) continue;
        let bs;
        if (refund) {
          // returned stock goes back to the soonest-expiring batch still on the shelf
          bs = tidyBatches(getBatches(it));
          if (bs.length) bs[0].qty += l.qty; else bs = [{ exp: validExp(it.expiry), qty: l.qty }];
        } else {
          const r = takeFEFO(getBatches(it), l.qty); bs = r[0]; l.fromBatches = r[1];
        }
        const patch = batchPatch(bs, it), next = patch.onHand;
        state.pending[it.id] = next;
        await update(it.id, patch);
        if (state.pending[it.id] === next) delete state.pending[it.id];
      }
      const sub = subtotal(), damt = discountAmount(sub);
      const rec = { kind: refund ? "refund" : "sale", at: new Date().toISOString(), day: todayKey(), lines, subtotal: sub, total };
      if (damt) rec.discount = { type: till.disc.type, value: parseFloat(String(till.disc.value).replace(",", ".")), amount: damt, label: discLabel() };
      if (me) rec.by = me;
      await db.collection("sales").add(rec);
      till.cart = []; till.disc = { type: till.disc.type, value: "" }; saveCart();
      toast(refund ? "Returned to stock" : \`Sale complete \xB7 \${eur(total)}\${damt ? \` (\${eur(damt)} discount)\` : ""}\`);
    } catch (err) { writeErr(err); }
    till.busy = false; render(); renderTill();
  }

  async function refundLine(saleId, j) {
    const s = till.sales.find((x) => x.id === saleId) || hist.sales.find((x) => x.id === saleId);
    if (!s || !db) return;
    const lines = (s.lines || []).map((l) => Object.assign({}, l));
    const l = lines[j]; if (!l) return;
    const left = (Number(l.qty) || 0) - (Number(l.refunded) || 0);
    if (left <= 0) return;
    try {
      const it = state.items.find((x) => x.id === l.id);
      if (it) {
        // put units back into the batches they were sold from
        let bs = getBatches(it), back = left;
        (Array.isArray(l.fromBatches) ? l.fromBatches : []).forEach((fb) => { const t = Math.min(num(fb.qty, 0), back); if (t > 0) { bs.push({ exp: validExp(fb.exp), qty: t }); back -= t; } });
        if (back > 0) { const t = tidyBatches(bs); if (t.length) t[0].qty += back; else t.push({ exp: validExp(it.expiry), qty: back }); bs = t; }
        const patch = batchPatch(bs, it), next = patch.onHand;
        state.pending[it.id] = next;
        await update(it.id, patch);
        if (state.pending[it.id] === next) delete state.pending[it.id];
      }
      l.refunded = (Number(l.refunded) || 0) + left;
      await queue("sale-" + saleId, () => db.collection("sales").doc(saleId).update({ lines, refundedAt: new Date().toISOString() }));
      const back = cents(left * (Number(l.price) || 0) * saleRatio(s));
      toast(\`\${left} \xD7 \${l.name} back in stock \xB7 give back \${eur(back)}\${it ? "" : " (item no longer in the stock list)"}\`);
    } catch (err) { writeErr(err); }
    till.confirmRefund = null; hist.confirm = null; render(); renderTill(); renderHist();
  }

  // ---------- sales history ----------
  const hist = { preset: "7d", from: "", to: "", q: "", sales: [], unsub: null, confirm: null, loading: false, started: false };
  const PRESETS = [["today", "Today"], ["yday", "Yesterday"], ["7d", "Last 7 days"], ["month", "This month"], ["lmonth", "Last month"]];
  function parseDay(v) { const p = String(v || "").split("-").map(Number); return p.length === 3 && p[0] ? new Date(p[0], p[1] - 1, p[2]) : null; }
  function histRange() {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    let a = new Date(t), b = new Date(t); b.setDate(b.getDate() + 1);
    if (hist.preset === "yday") { a.setDate(a.getDate() - 1); b = new Date(t); }
    else if (hist.preset === "7d") a.setDate(a.getDate() - 6);
    else if (hist.preset === "month") a.setDate(1);
    else if (hist.preset === "lmonth") { a = new Date(t.getFullYear(), t.getMonth() - 1, 1); b = new Date(t.getFullYear(), t.getMonth(), 1); }
    else if (hist.preset === "custom") {
      const f = parseDay(hist.from), to = parseDay(hist.to);
      if (f) a = f;
      if (to) { b = new Date(to); b.setDate(b.getDate() + 1); }
      if (b <= a) { b = new Date(a); b.setDate(b.getDate() + 1); }
    }
    return [a, b];
  }
  function lineValue(s, l, qty) { return (Number(l.price) || 0) * qty * saleRatio(s); }
  function saleNet(s) {
    const lines = Array.isArray(s.lines) ? s.lines : [];
    if (s.kind === "refund") return -(Number(s.total) || 0);
    return (Number(s.total) || 0) - lines.reduce((x, l) => x + lineValue(s, l, Number(l.refunded) || 0), 0);
  }
  function openHist() { if (!hist.started) { hist.started = true; subscribeHist(); } else renderHist(); }
  function subscribeHist() {
    const [a, b] = histRange();
    $("#hfrom").value = todayKey(a);
    const last = new Date(b); last.setDate(last.getDate() - 1); $("#hto").value = todayKey(last);
    if (!db) { renderHist(); return; }
    if (hist.unsub) hist.unsub();
    hist.loading = true; hist.sales = []; hist.confirm = null; renderHist();
    hist.unsub = db.collection("sales").where("at", ">=", a.toISOString()).where("at", "<", b.toISOString()).onSnapshot((snap) => {
      hist.sales = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      hist.loading = false; renderHist(); resolveNames();
    }, () => { hist.loading = false; renderHist(); });
  }
  function histFiltered() {
    const q = hist.q.trim().toLowerCase();
    const list = hist.sales.slice().sort((x, y) => String(y.at).localeCompare(String(x.at)));
    if (!q) return list;
    return list.filter((s) => (s.lines || []).some((l) => String(l.name || "").toLowerCase().includes(q)));
  }
  function renderHist() {
    if (!$("#hpresets")) return;
    $("#hpresets").innerHTML = PRESETS.map(([k, t]) => \`<button type="button" class="chip" data-act="hp" data-p="\${k}" aria-pressed="\${hist.preset === k}">\${t}</button>\`).join("")
      + (hist.preset === "custom" ? \`<span class="chip" aria-pressed="true">Custom dates</span>\` : "");
    const sumEl = $("#hsum"), el = $("#hlist");
    if (!db) { sumEl.innerHTML = ""; el.innerHTML = \`<div class="empty"><h2>Sales can't load here</h2><p>Open Stock Room where your stock is stored to see past sales.</p></div>\`; return; }
    if (hist.loading) { sumEl.innerHTML = ""; el.innerHTML = \`<div class="empty"><h2>Loading sales\u2026</h2></div>\`; return; }
    const q = hist.q.trim().toLowerCase();
    const list = histFiltered();
    // summary
    let takings = 0, nSales = 0, units = 0, disc = 0, refunds = 0;
    hist.sales.forEach((s) => {
      const lines = s.lines || [];
      takings += saleNet(s);
      if (s.kind === "refund") { refunds += Number(s.total) || 0; return; }
      nSales++;
      disc += (s.discount && Number(s.discount.amount)) || 0;
      lines.forEach((l) => { const r = Number(l.refunded) || 0; units += (Number(l.qty) || 0) - r; refunds += lineValue(s, l, r); });
    });
    let prod = "";
    if (q) {
      let pu = 0, pv = 0; const names = new Set();
      hist.sales.forEach((s) => (s.lines || []).forEach((l) => {
        if (!String(l.name || "").toLowerCase().includes(q)) return;
        names.add(l.name);
        const n = (Number(l.qty) || 0) - (Number(l.refunded) || 0);
        if (s.kind === "refund") { pu -= Number(l.qty) || 0; pv -= lineValue(s, l, Number(l.qty) || 0); }
        else { pu += n; pv += lineValue(s, l, n); }
      }));
      prod = names.size
        ? \`<p class="hprod"><b>\${esc([...names].slice(0, 3).join(", "))}\${names.size > 3 ? "\u2026" : ""}</b>: \${pu} sold for \${eur(cents(pv))} in this period.</p>\`
        : \`<p class="hprod">No sales of "\${esc(hist.q.trim())}" in this period.</p>\`;
    }
    const tile = (v, l, cls = "") => \`<div class="stat \${cls}"><b>\${v}</b><span>\${l}</span></div>\`;
    sumEl.innerHTML = \`<div class="hsum">\${tile(eur(cents(takings)), "Takings")}\${tile(nSales, "Sales")}\${tile(units, "Items sold")}\${tile(eur(cents(disc)), "Discounts")}\${tile(eur(cents(refunds)), "Refunds", "warn")}</div>\${prod}\`;
    if (!list.length) {
      el.innerHTML = \`<div class="empty"><h2>No sales</h2><p>\${q ? "Nothing matches that product in this period." : "No sales were recorded in this period."}</p></div>\`;
      return;
    }
    const days = {};
    list.forEach((s) => { const k = todayKey(s.at); (days[k] = days[k] || []).push(s); });
    el.innerHTML = Object.keys(days).sort().reverse().map((k) => {
      const ds = days[k], net = ds.reduce((x, s) => x + saleNet(s), 0);
      const label = new Date(k + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      return \`<section class="hday">
        <div class="ghead"><h3>\${label}<small>\${ds.length} record\${ds.length === 1 ? "" : "s"}</small></h3><span class="val">\${eur(cents(net))}</span></div>
        \${ds.map((s) => {
          const isRefund = s.kind === "refund", lines = s.lines || [];
          const t = new Date(s.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
          const w = who(s.by);
          return \`<div class="hsale\${isRefund ? " is-refund" : ""}">
            <div class="sh"><span>\${t}\${isRefund ? " \xB7 Return" : ""}\${s.discount && s.discount.amount ? \` \xB7 <span class="dtag">\${esc(s.discount.label || "Discount")}</span>\` : ""}\${w ? " \xB7 " + esc(w) : ""}</span><b>\${isRefund ? "\u2212" : ""}\${eur(Number(s.total) || 0)}</b></div>
            \${lines.map((l, j) => {
              const left = (Number(l.qty) || 0) - (Number(l.refunded) || 0);
              const key = s.id + ":" + j;
              const hit = q && String(l.name || "").toLowerCase().includes(q);
              let ctl = "";
              if (!isRefund) {
                if (left <= 0) ctl = \`<span class="done">Refunded</span>\`;
                else if (hist.confirm === key) ctl = \`<button type="button" class="danger" data-act="dohrefund" data-s="\${esc(s.id)}" data-j="\${j}">Refund \${left} \xB7 \${eur(cents(lineValue(s, l, left)))}?</button>\`;
                else ctl = \`<button type="button" class="ghost" data-act="askhrefund" data-k="\${esc(key)}">Refund</button>\`;
              }
              return \`<div class="sl\${hit ? " hit" : ""}"><span>\${Number(l.qty) || 0} \xD7 \${esc(l.name)} <span class="hp">\${eur(Number(l.price) || 0)}</span>\${l.refunded ? \` <span class="done">(\${l.refunded} back)</span>\` : ""}</span>\${ctl}</div>\`;
            }).join("")}
          </div>\`;
        }).join("")}
      </section>\`;
    }).join("");
  }
  function csvCell(v) { const t = String(v == null ? "" : v); return /[",\\n;]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; }
  async function downloadHist() {
    const [a, b] = histRange();
    const last = new Date(b); last.setDate(last.getDate() - 1);
    const rows = [["Date", "Time", "Type", "Staff", "Product", "Qty", "Unit price", "Line total", "Qty refunded", "Sale subtotal", "Discount", "Sale total", "Takings after refunds"]];
    histFiltered().slice().reverse().forEach((s) => {
      const d = new Date(s.at), isRefund = s.kind === "refund";
      (s.lines || []).forEach((l, j) => rows.push([
        todayKey(s.at), d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), isRefund ? "Return" : "Sale", (s.by && names[s.by]) || (s.by === me ? "" : who(s.by)) || "",
        l.name, Number(l.qty) || 0, (Number(l.price) || 0).toFixed(2), ((Number(l.price) || 0) * (Number(l.qty) || 0)).toFixed(2), Number(l.refunded) || 0,
        j === 0 ? (Number(s.subtotal != null ? s.subtotal : s.total) || 0).toFixed(2) : "",
        j === 0 && s.discount && s.discount.amount ? Number(s.discount.amount).toFixed(2) : "",
        j === 0 ? (isRefund ? "-" : "") + (Number(s.total) || 0).toFixed(2) : "",
        j === 0 ? cents(saleNet(s)).toFixed(2) : "",
      ]));
    });
    if (rows.length === 1) { toast("No sales in this period to download."); return; }
    const csv = "\\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\\r\\n");
    const name = \`stockroom-sales-\${todayKey(a)}-to-\${todayKey(last)}.csv\`;
    if (window.STOCKROOM_LOCAL) {
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const link = document.createElement("a"); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      toast("Spreadsheet saved to your Downloads folder");
      return;
    }
    if (!dls) { toast("Downloads aren't available in this view. Try a computer browser."); return; }
    try { await dls.save({ filename: name, data: csv }); toast("Spreadsheet saved"); }
    catch (e) { if (!(e && e.code === "declined")) toast("The spreadsheet couldn't be saved here."); }
  }
  $("#hq").addEventListener("input", (e) => { hist.q = e.target.value; renderHist(); });
  ["hfrom", "hto"].forEach((id) => $("#" + id).addEventListener("change", () => {
    hist.preset = "custom"; hist.from = $("#hfrom").value; hist.to = $("#hto").value; subscribeHist();
  }));

  $("#cq").addEventListener("input", (e) => { till.q = e.target.value; renderResults(); });
  $("#cq").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const code = bc(till.q);
    const exact = code && state.items.find((x) => bc(x.barcode) === code);
    if (exact) { addToCart(exact); return; }
    const first = $("#cresults .cres");
    if (first && $("#cresults").querySelectorAll(".cres").length === 1) { first.click(); return; }
    if (code && /^\\d{6,}$/.test(code)) toast("No item has barcode " + code + ". Add it under Add items first.");
  });
  $("#cart").addEventListener("input", (e) => {
    if (e.target.id !== "discv") return;
    till.disc.value = e.target.value; saveCart();
    const sub = subtotal(), damt = discountAmount(sub);
    $("#damt").textContent = damt ? "\u2212" + eur(damt) : "";
    $("#ctot").textContent = eur(cartTotal());
    $("#csubl").textContent = damt ? \`Subtotal \${eur(sub)} \xB7 \${discLabel()}\` : "Total";
  });
  $("#cart").addEventListener("change", (e) => {
    if (e.target.id === "discv") { e.target.blur(); renderCart(); return; }
    const t = e.target;
    if (t.dataset.cq != null) { const l = till.cart[+t.dataset.cq]; if (l) { l.qty = Math.max(1, num(t.value, 1)); saveCart(); t.blur(); renderTill(); } }
    if (t.dataset.cp != null) { const l = till.cart[+t.dataset.cp]; if (l) { l.price = price(t.value); saveCart(); t.blur(); renderTill(); } }
  });
  $("#cart").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT") e.target.blur(); });

  // ---------- quick moving products ----------
  let qSales = null, qLoading = false;
  function isQuick(id) { return state.quick.includes(id); }
  function setQuick(id, on) {
    state.quick = on ? state.quick.filter((x) => x !== id).concat([id]) : state.quick.filter((x) => x !== id);
    saveSettings();
  }
  async function loadQuickSales() {
    if (!db || qLoading) return;
    qLoading = true;
    try {
      const since = new Date(); since.setDate(since.getDate() - 30);
      const snap = await db.collection("sales").where("at", ">=", since.toISOString()).get();
      const units = {};
      snap.docs.forEach((d) => {
        const s = d.data(); if (!s || s.kind === "refund") return;
        (s.lines || []).forEach((l) => { const n = (Number(l.qty) || 0) - (Number(l.refunded) || 0); if (n > 0 && l.id) units[l.id] = (units[l.id] || 0) + n; });
      });
      qSales = units;
    } catch (e) { qSales = qSales || {}; }
    qLoading = false;
    if (!$("#qmenu").hidden) renderQuick();
  }
  function quickList() {
    const byId = Object.fromEntries(state.items.map((it) => [it.id, it]));
    const pinned = state.quick.map((id) => byId[id]).filter(Boolean);
    const sold = Object.entries(qSales || {}).filter(([id]) => byId[id] && !isQuick(id)).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([id, n]) => Object.assign({ _sold: n }, byId[id]));
    return { pinned, sold };
  }
  function renderQuick() {
    const { pinned, sold } = quickList();
    const inCart = Object.fromEntries(till.cart.map((l) => [l.id, l.qty]));
    const tile = (it) => {
      const pr = price(it.price), id = esc(it.id), have = onHand(it), n = inCart[it.id];
      return \`<div class="qtile\${have <= 0 ? " none" : ""}">
        <button type="button" class="qadd" data-act="qadd" data-id="\${id}">
          <span class="qname">\${esc(it.name)}</span>
          <span class="qmeta"><b>\${pr != null ? eur(pr) : "No price"}</b> \xB7 \${have} on shelf\${it._sold ? \` \xB7 \${it._sold} sold\` : ""}</span>
          \${n ? \`<span class="qin">\${n} in basket</span>\` : ""}
        </button>
        <button type="button" class="qstar\${isQuick(it.id) ? " on" : ""}" data-act="qpin" data-id="\${id}" aria-pressed="\${isQuick(it.id)}" aria-label="\${isQuick(it.id) ? "Remove from" : "Keep on"} Quick Moving Products" title="\${isQuick(it.id) ? "Remove from list" : "Keep on list"}">\u2605</button>
      </div>\`;
    };
    let html = "";
    if (pinned.length) html += \`<h3 class="qsec">Pinned</h3><div class="qtiles">\${pinned.map(tile).join("")}</div>\`;
    if (sold.length) html += \`<h3 class="qsec">Best sellers \xB7 last 30 days</h3><div class="qtiles">\${sold.map(tile).join("")}</div>\`;
    if (!html) html = qSales == null
      ? \`<p class="hint">Loading\u2026</p>\`
      : \`<div class="empty"><h2>No quick products yet</h2><p>Products appear here automatically once they've been sold through Cashout. To add one now, open it under Stock \u203A Edit and tick "Show in Quick Moving Products".</p></div>\`;
    $("#qgrid").innerHTML = html;
  }
  function openQuick() { $("#qmenu").hidden = false; renderQuick(); loadQuickSales(); const b = $("#qmenu [data-act=qclose]"); if (b) b.focus(); }
  function closeQuick() { $("#qmenu").hidden = true; $("#cq").focus(); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#qmenu").hidden) closeQuick(); });
  $("#qmenu").addEventListener("click", (e) => { if (e.target.id === "qmenu") closeQuick(); });

  // ---------- invoice scanner ----------
  let sample = null, scanCtl = null, scanTimer = null, scanMax = 5, scanLines = [], scanSupplier = "";
  let scanImgs = [], scanReady = false, scanWhy = "";
  const scanFile = $("#scanFile");
  const NO_SCAN = "Send the invoice photo to Claude in chat and paste the reply above.";

  function scanNote(t) { const n = $("#scanNote"); n.textContent = t || ""; n.hidden = !t; }
  async function initScan() {
    try { sample = window.claude && window.claude.use ? await window.claude.use("sample") : null; } catch (e) { sample = null; }
    if (!sample) { scanWhy = NO_SCAN; return; }
    const caps = await sample.limits().catch(() => null);
    if (!caps || !caps.images) { scanWhy = NO_SCAN; return; }
    scanMax = caps.images.maxCount || 5;
    scanReady = true; scanWhy = "";
  }

  function setScanImages(list) {
    const imgs = Array.from(list || []).filter((f) => f && /^image\\//.test(f.type || "") );
    if (!imgs.length && list && list.length) { toast("That isn't a photo. Choose a JPEG or PNG image."); return; }
    scanImgs = imgs.slice(0, scanMax);
    $("#scanThumbs").innerHTML = "";
    scanImgs.forEach((f) => { const im = document.createElement("img"); im.alt = "Invoice photo"; try { im.src = URL.createObjectURL(f); } catch (e) {} $("#scanThumbs").append(im); });
    const n = scanImgs.length;
    $("#scanFiles").textContent = !n ? "No photo chosen"
      : (n === 1 ? "1 photo ready" : \`\${n} photos ready (pages of one invoice)\`) + (imgs.length > scanMax ? \`. Only the first \${scanMax} will be read.\` : "");
    if (n && !scanReady && scanWhy) scanNote(scanWhy); else scanNote("");
  }
  scanFile.addEventListener("change", () => { setScanImages(scanFile.files); scanFile.value = ""; });
  $("#scanCam").addEventListener("change", (e) => { const f = Array.from(e.target.files || []); setScanImages(scanImgs.concat(f)); e.target.value = ""; });
  const drop = $("#scanDrop");
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => { if (e.dataTransfer && e.dataTransfer.files.length) setScanImages(e.dataTransfer.files); });
  document.addEventListener("paste", (e) => {
    if (state.tab !== "add" || !e.clipboardData) return;
    const files = Array.from(e.clipboardData.files || []).filter((f) => /^image\\//.test(f.type));
    if (files.length) { e.preventDefault(); setScanImages(files); toast("Photo pasted"); }
  });

  function scanStatus(t) { $("#scanStatus").textContent = t; }
  function scanBusy(on) {
    $("#scanGo").disabled = on; $("#scanStop").hidden = !on;
    clearInterval(scanTimer);
    if (on) { const t0 = Date.now(); scanStatus("Reading invoice\u2026"); scanTimer = setInterval(() => scanStatus(\`Reading invoice\u2026 \${Math.round((Date.now() - t0) / 1000)} s\`), 1000); }
  }
  const SCAN_ERR = {
    not_granted: "Claude wasn't allowed to read the photo. Reload the page, tap Read invoice again and choose Allow when asked. You can also change this in the page's Permissions menu.",
    sampling_disabled: "Claude isn't available on this account, so invoices can't be read here.",
    rate_limited: "Too many requests right now. Wait a minute and try again.",
    session_expired: "Your Claude session has expired. Sign in again, then retry.",
    image_rejected: "That photo couldn't be read. Use a JPEG or PNG under 20 MB.",
    images_unavailable: "Photos can't be sent to Claude from this view.",
    invalid_json: "Couldn't pick out the product lines. Try a sharper, well-lit photo showing the item rows.",
    empty_completion: "Couldn't pick out the product lines. Try a sharper, well-lit photo showing the item rows.",
    refused: "Claude couldn't process this photo. Try a different photo of the invoice.",
  };

  function scanPrompt() {
    const list = state.items.slice(0, 600).map((it) => \`\${it.id} | \${String(it.name || "").slice(0, 80)}\`).join("\\n") || "(empty)";
    return [
      "This is a photo of a supplier invoice delivered to a community pharmacy in Malta. Extract the products that were delivered.",
      "Rules:",
      "- One entry per product. If the same product appears on several lines (for example a paid line and a FREE or bonus line), combine them and add the quantities together.",
      "- name: the product's brand name, strength and form or pack size, as staff would say it, in Title Case. Example: \\"CSTN001A100: BAP0126 - CANESTEN 2% THRUSH CREAM\\" becomes \\"Canesten 2% Thrush Cream\\". Leave out supplier codes, lot or serial numbers and expiry text.",
      "- quantity: total units received, as an integer.",
      "- price: the consumer or retail selling price per unit INCLUDING VAT, if the invoice has such a column (e.g. 'Cons Inc VAT', 'Retail', 'RRP'). Never use the cost, unit price or net price. Use null if there is no selling price column.",
      "- expiry: the expiry date as YYYY-MM-DD. If only month and year are given, use the last day of that month. If combined lines have different dates, use the earliest. null if not shown.",
      "- match: if the product is clearly the same product, strength and pack size as one in the existing stock list below, give that id. Otherwise null. Do not match different strengths or pack sizes.",
      "- ingredients: for medicines, medical products and supplements, the active ingredient(s) with strengths, e.g. \\"Paracetamol 500mg, Caffeine 65mg\\", only if you are confident. Empty string for cosmetics, toiletries and anything you are unsure of.",
      "- supplier: the supplier or wholesaler company named on the invoice, or null.",
      "- skipped: how many product lines you could not read clearly. Skip unreadable lines rather than guessing.",
      "",
      "Existing stock list (id | name):",
      list,
      "",
      'Reply with only JSON in this shape: {"supplier": "AGS Limited", "items": [{"name": "Canesten 2% Thrush Cream", "quantity": 20, "price": 13.98, "expiry": "2029-08-31", "match": null}], "skipped": 0}',
    ].join("\\n");
  }

  $("#scanStop").addEventListener("click", () => { if (scanCtl) scanCtl.abort(); });
  $("#scanGo").addEventListener("click", async () => {
    if (!scanImgs.length) { scanNote("No photo was picked up. Tap Take photo or Choose from photos first. If nothing opens or no preview appears, this view can't pass photos to the page. Send the invoice photo to Claude in chat instead and it will add the items."); return; }
    if (!scanReady) { scanStatus("Checking\u2026"); await initScan(); scanStatus(""); }
    if (!scanReady) { scanNote(scanWhy || NO_SCAN); return; }
    scanNote("");
    scanCtl = new AbortController();
    scanBusy(true); $("#scanReview").innerHTML = "";
    try {
      const res = await sample.json(scanPrompt(), { images: scanImgs, signal: scanCtl.signal });
      scanBusy(false);
      const ids = new Set(state.items.map((i) => i.id));
      const rows = res && Array.isArray(res.items) ? res.items : [];
      scanSupplier = res && typeof res.supplier === "string" ? res.supplier.trim() : "";
      scanLines = rows.filter((r) => r && String(r.name || "").trim()).map((r) => ({
        include: true,
        name: String(r.name).trim().slice(0, 120),
        qty: Math.max(0, Math.round(Number(r.quantity) || 0)),
        price: price(r.price),
        expiry: /^\\d{4}-\\d{2}-\\d{2}$/.test(String(r.expiry || "")) ? String(r.expiry) : "",
        type: $("#scanType").value.trim(),
        ingredients: String(r.ingredients || "").trim(),
        match: r.match && ids.has(String(r.match)) ? String(r.match) : "",
      }));
      const skipped = Math.max(0, Math.round(Number(res && res.skipped) || 0));
      if (!scanLines.length) { scanStatus("No product lines found on that photo. Try a clearer photo of the item rows."); return; }
      if (!$("#scanSup").value.trim() && scanSupplier) {
        const known = suppliers().find((s) => s.toLowerCase().includes(scanSupplier.toLowerCase().split(/\\s+/)[0]) || scanSupplier.toLowerCase().includes(s.toLowerCase().split(/\\s+/)[0]));
        $("#scanSup").value = known || scanSupplier;
      }
      scanStatus(\`Found \${scanLines.length} product\${scanLines.length === 1 ? "" : "s"}\${skipped ? \`, \${skipped} line\${skipped === 1 ? "" : "s"} unreadable\` : ""}. Check them below.\`);
      renderScan();
    } catch (e) {
      scanBusy(false);
      const code = e && e.code;
      scanStatus(code === "cancelled" ? "Stopped." : "");
      if (code !== "cancelled") scanNote(SCAN_ERR[code] || "Something went wrong reading the invoice. Try again.");
      if (code === "not_granted" || code === "sampling_disabled" || code === "images_unavailable") { scanReady = false; scanWhy = SCAN_ERR[code]; }
    }
  });

  function priceChange(l) {
    const it = l.match && state.items.find((x) => x.id === l.match);
    if (!it) return null;
    const was = price(it.price), now = l.price;
    if (was == null || now == null || Math.abs(was - now) < 0.005) return { it, was, now, same: true };
    return { it, was, now, same: false };
  }
  function priceNoteHtml(l) {
    const c = priceChange(l);
    if (!c) return "";
    if (c.now == null && c.was != null) return \`<span class="pricenote">No selling price on the invoice. It stays at \${eur(c.was)}.</span>\`;
    if (c.same) return "";
    const pct = c.was > 0 ? Math.round(((c.now - c.was) / c.was) * 100) : null;
    const up = c.now > c.was;
    const shelf = onHand(c.it);
    return \`<span class="pricenote \${up ? "up" : "down"}"><b>Price \${up ? "increase" : "decrease"}:</b> \${eur(c.was)} \u2192 \${eur(c.now)}\${pct != null ? \` (\${up ? "+" : ""}\${pct}%)\` : ""}\${shelf > 0 ? \`. The \${shelf} already on the shelf will also show the new price.\` : ""}</span>\`;
  }
  function normName(s) { return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9%.]+/g, ""); }
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
    scanStatus(\`Loaded \${scanLines.length} product\${scanLines.length === 1 ? "" : "s"}\${m ? \`, \${m} matched to items you already stock\` : ""}. Check them below.\`);
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

  function renderScan() {
    const opts = state.items.slice().sort((a, b) => String(a.name).localeCompare(String(b.name)));
    const n = scanLines.filter((l) => l.include).length;
    const changed = scanLines.filter((l) => l.include && (() => { const c = priceChange(l); return c && !c.same; })()).length;
    $("#scanReview").innerHTML = \`<div class="review">
      <h3>Check before saving\${changed ? \` \xB7 <span class="pcount">\${changed} price change\${changed === 1 ? "" : "s"}</span>\` : ""}</h3>
      \${scanLines.map((l, i) => \`<div class="sline\${l.include ? "" : " off"}">
        <input type="checkbox" data-sf="include" data-i="\${i}" \${l.include ? "checked" : ""} aria-label="Include \${esc(l.name)}">
        <div class="sfields">
          <div class="field wide"><label for="sn-\${i}">Product</label><input id="sn-\${i}" data-sf="name" data-i="\${i}" value="\${esc(l.name)}"></div>
          <div class="field"><label for="sq-\${i}">Quantity</label><input id="sq-\${i}" data-sf="qty" data-i="\${i}" type="number" min="0" inputmode="numeric" value="\${l.qty}"></div>
          <div class="field"><label for="sp-\${i}">Selling price (\u20AC)</label><input id="sp-\${i}" data-sf="price" data-i="\${i}" type="number" min="0" step="0.01" inputmode="decimal" value="\${l.price != null ? l.price.toFixed(2) : ""}"></div>
          <div class="wide" id="pn-\${i}">\${priceNoteHtml(l)}</div>
          <div class="field"><label for="se-\${i}">Expiry</label><input id="se-\${i}" data-sf="expiry" data-i="\${i}" type="date" value="\${esc(l.expiry)}"></div>
          <div class="field"><label for="st-\${i}">Product type</label><input id="st-\${i}" data-sf="type" data-i="\${i}" list="typeList" autocomplete="off" value="\${esc(l.type)}"></div>
          <div class="field wide"><label for="si-\${i}">Active ingredient(s)</label><input id="si-\${i}" data-sf="ingredients" data-i="\${i}" autocomplete="off" placeholder="Leave blank for cosmetics and toiletries" value="\${esc(l.ingredients || "")}"></div>
          <div class="field wide"><label for="sm-\${i}">Save as</label>
            <select id="sm-\${i}" data-sf="match" data-i="\${i}">
              <option value="">New item</option>
              \${opts.map((it) => \`<option value="\${esc(it.id)}"\${it.id === l.match ? " selected" : ""}>Add to existing: \${esc(it.name)} (\${onHand(it)} on shelf)</option>\`).join("")}
            </select>
            \${l.match ? \`<span class="matchnote">Matches an item you already stock: quantity will be added to it.</span>\` : ""}
          </div>
        </div>
      </div>\`).join("")}
      <div class="actions">
        <button class="primary" type="button" id="scanSave" \${n ? "" : "disabled"}>Add \${n} item\${n === 1 ? "" : "s"} to stock</button>
        <button class="ghost" type="button" id="scanClear">Discard</button>
      </div>
    </div>\`;
  }

  $("#scanReview").addEventListener("input", (e) => {
    const t = e.target, i = Number(t.dataset.i), f = t.dataset.sf;
    if (!f || !scanLines[i]) return;
    const l = scanLines[i];
    if (f === "name" || f === "type" || f === "ingredients") l[f] = t.value;
    else if (f === "qty") l.qty = num(t.value, 0);
    else if (f === "price") { l.price = price(t.value); const pn = document.getElementById("pn-" + i); if (pn) pn.innerHTML = priceNoteHtml(l); }
    else if (f === "expiry") l.expiry = t.value;
  });
  $("#scanReview").addEventListener("change", (e) => {
    const t = e.target, i = Number(t.dataset.i), f = t.dataset.sf;
    if (!f || !scanLines[i]) return;
    if (f === "include") { scanLines[i].include = t.checked; renderScan(); }
    else if (f === "price") renderScan();
    else if (f === "match") { scanLines[i].match = t.value; renderScan(); }
  });
  $("#scanReview").addEventListener("click", async (e) => {
    if (e.target.id === "scanClear") { scanLines = []; $("#scanReview").innerHTML = ""; scanStatus(""); return; }
    if (e.target.id !== "scanSave") return;
    if (!db) { toast("Can't reach the Stock Room computer, so this wasn't saved."); return; }
    const btn = e.target; btn.disabled = true;
    const sup = $("#scanSup").value.trim() || scanSupplier;
    let added = 0, updated = 0, repriced = 0;
    for (const l of scanLines) {
      if (!l.include || !l.name.trim()) continue;
      const it = l.match && state.items.find((x) => x.id === l.match);
      try {
        if (it) {
          const patch = l.qty > 0 ? batchPatch(getBatches(it).concat([{ exp: l.expiry, qty: l.qty }]), it) : {};
          if (l.price != null) { const c = priceChange(l); if (c && !c.same) repriced++; patch.price = l.price; }
          if (l.type.trim() && !it.type) patch.type = l.type.trim();
          if (l.ingredients && l.ingredients.trim()) patch.ingredients = l.ingredients.trim();
          if (sup && !it.supplier) patch.supplier = sup;
          if (Object.keys(patch).length) await update(it.id, patch);
          updated++;
        } else {
          await db.collection("items").add(itemFrom({ name: l.name, supplier: sup, type: l.type, onHand: l.qty, min: 2, price: l.price, expiry: l.expiry, ingredients: l.ingredients || "" }));
          added++;
        }
      } catch (err) { writeErr(err); break; }
      btn.textContent = \`Saving\u2026 \${added + updated}\`;
    }
    scanLines = []; $("#scanReview").innerHTML = ""; scanFile.value = ""; setScanImages([]);
    const parts = [added ? \`\${added} new item\${added === 1 ? "" : "s"} added\` : "", updated ? \`\${updated} item\${updated === 1 ? "" : "s"} topped up\` : "", repriced ? \`\${repriced} price\${repriced === 1 ? "" : "s"} updated\` : ""].filter(Boolean);
    scanStatus(parts.length ? parts.join(", ") + "." : "");
    if (parts.length) toast(parts.join(", "));
  });

  // ---------- backup / restore ----------
  let dls = null, bkPending = null;
  const bkBox = $("#bkBox");
  function bkMsg(html) { bkBox.innerHTML = html; }
  async function initBackup() {
    if (window.STOCKROOM_LOCAL) { $("#bkCard").hidden = true; return; }
    try { dls = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (e) { dls = null; }
  }
  const strip = (snap) => { const d = Object.assign({}, snap.data()); return d; };
  $("#bkDl").addEventListener("click", async () => {
    if (!db) { bkMsg(\`<p class="notice">Stock isn't loaded on this page, so there's nothing to back up yet.</p>\`); return; }
    if (!dls) { bkMsg(\`<p class="notice">Downloads aren't available in this view. Open Stock Room in a computer browser, or ask Claude in chat to send you a backup file.</p>\`); return; }
    const btn = $("#bkDl"); btn.disabled = true; bkMsg(\`<p class="hint">Preparing backup\u2026</p>\`);
    try {
      const out = { version: 1, items: {}, sales: {}, meta: {} };
      state.items.forEach((it) => { const d = Object.assign({}, it); delete d.id; out.items[it.id] = d; });
      const sales = await db.collection("sales").get();
      sales.docs.forEach((s) => { out.sales[s.id] = strip(s); });
      const set = await db.doc("meta/settings").get();
      if (set.exists) out.meta.settings = strip(set);
      await dls.save({ filename: \`stockroom-backup-\${todayKey()}.json\`, data: JSON.stringify(out, null, 1) });
      bkMsg(\`<p class="hint">Backup saved: \${state.items.length} items, \${sales.size} sales.</p>\`);
    } catch (e) {
      bkMsg(e && e.code === "declined" ? "" : \`<p class="notice">The backup couldn't be saved here. Try a computer browser, or ask Claude in chat to send you a backup file.</p>\`);
    }
    btn.disabled = false;
  });
  $("#bkFile").addEventListener("change", async (e) => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    let data = null; try { data = JSON.parse(await f.text()); } catch (er) {}
    if (!data || typeof data.items !== "object") { bkPending = null; bkMsg(\`<p class="notice">That file isn't a Stock Room backup.</p>\`); return; }
    bkPending = data;
    const ni = Object.keys(data.items || {}).length, ns = Object.keys(data.sales || {}).length;
    bkMsg(\`<div class="notice">Replace everything here with this backup (\${ni} items, \${ns} sales)? Stock, sales, product types and suppliers on this page will be overwritten for everyone. Download a backup first if you want to keep the current data.</div>
      <div class="actions"><button class="danger" type="button" id="bkYes">Yes, replace</button><button class="ghost" type="button" id="bkNo">Cancel</button></div>\`);
  });
  bkBox.addEventListener("click", async (e) => {
    if (e.target.id === "bkNo") { bkPending = null; bkMsg(""); return; }
    if (e.target.id !== "bkYes" || !bkPending || !db) return;
    const data = bkPending; bkPending = null;
    const ok = (id) => /^[A-Za-z0-9_\\-.~:@+]{1,200}$/.test(id);
    try {
      const jobs = [];
      const keepItems = data.items || {}, keepSales = data.sales || {};
      state.items.forEach((it) => { if (!(it.id in keepItems)) jobs.push(() => db.collection("items").doc(it.id).delete()); });
      const curSales = await db.collection("sales").get();
      curSales.docs.forEach((s) => { if (!(s.id in keepSales)) jobs.push(() => db.collection("sales").doc(s.id).delete()); });
      Object.entries(keepItems).forEach(([id, d]) => { if (ok(id) && d && typeof d === "object") jobs.push(() => db.collection("items").doc(id).set(d)); });
      Object.entries(keepSales).forEach(([id, d]) => { if (ok(id) && d && typeof d === "object") jobs.push(() => db.collection("sales").doc(id).set(d)); });
      const st = data.meta && data.meta.settings;
      if (st && typeof st === "object") jobs.push(() => db.doc("meta/settings").set(st));
      let done = 0;
      for (const j of jobs) { await j(); done++; if (done % 5 === 0 || done === jobs.length) bkMsg(\`<p class="hint">Restoring\u2026 \${done} of \${jobs.length}</p>\`); }
      bkMsg(\`<p class="hint">Restored \${Object.keys(keepItems).length} items and \${Object.keys(keepSales).length} sales.</p>\`);
      toast("Backup restored");
    } catch (er) {
      writeErr(er);
      bkMsg(\`<p class="notice">The restore stopped part-way. Run it again with the same file to finish.</p>\`);
    }
  });

  // ---------- boot ----------
  async function resolveNames() {
    if (!user || !user.profiles) return;
    const ids = [...new Set(state.items.map((i) => i.updatedBy).concat(till.sales.map((x) => x.by), hist.sales.map((x) => x.by)).concat([me]).filter((x) => x && !(x in names)))];
    if (!ids.length) return;
    try {
      const ps = await user.profiles(ids);
      let changed = false;
      ids.forEach((id) => { const n = (ps && ps[id] && ps[id].name) || "a teammate"; if (names[id] !== n) { names[id] = n; changed = true; } });
      if (changed) { renderList(); renderSales(); renderHist(); }
    } catch (e) {}
  }

  render();
  (async () => {
    if (!window.claude || !window.claude.use) { state.failed = "nodb"; render(); return; }
    db = await window.claude.use("db");
    initScan();
    initBackup();
    if (!db) { state.failed = "nodb"; render(); return; }
    user = await window.claude.use("user");
    if (user) {
      try { me = await user.id(); } catch (e) {}
      try { const c = await user.can("data.write"); if (c === false) state.canWrite = false; } catch (e) {}
    }
    db.collection("items").onSnapshot((snap) => {
      state.items = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      state.ready = true;
      render();
      resolveNames();
    }, (err) => { state.failed = err && err.code || "unavailable"; render(); });
    const since = new Date(); since.setDate(since.getDate() - 1);
    db.collection("sales").where("at", ">=", since.toISOString()).onSnapshot((snap) => {
      till.sales = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      renderSales();
    }, () => {});
    if (state.tab === "hist") openHist();
    db.doc("meta/settings").onSnapshot((snap) => {
      const d = snap.exists ? snap.data() : null;
      state.savedTypes = d && Array.isArray(d.types) ? d.types.filter((x) => typeof x === "string" && x.trim()) : [];
      state.savedSuppliers = d && Array.isArray(d.suppliers) ? d.suppliers.filter((x) => typeof x === "string" && x.trim()) : [];
      state.quick = d && Array.isArray(d.quick) ? d.quick.filter((x) => typeof x === "string") : [];
      if (typeof renderQuick === "function" && !$("#qmenu").hidden) renderQuick();
      renderChips();
    }, () => {});
  })();
})();
</script>

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
  document.getElementById("updSave").addEventListener("click", async () => { us.textContent = "Saving\u2026"; await updCall({ action: "source", source: ui.value }); setTimeout(() => updCall(), 8000); });
  document.getElementById("updCheck").addEventListener("click", async (e) => { e.target.disabled = true; us.textContent = "Checking GitHub\u2026"; await updCall({ action: "check" }); e.target.disabled = false; });
  ub.addEventListener("click", async () => { ub.disabled = true; const j = await updCall({ action: "install" }); if (j) um.innerHTML = '<p class="hint">Installing. Stock Room will be back in a few seconds\u2026</p>'; ub.disabled = false; });
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
      box.innerHTML = r && r.ok ? '<p class="hint">Restored. Reloading\u2026</p>' : '<p class="notice">Restore failed. Check the Stock Room computer is on.</p>';
    }
  });
})();
</script>
</body>
</html>
`;var ICON_192="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";var ICON_512="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";var ICON_180="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";var ICON_ICO="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";var VERSION="1.7.0";var IS_COMPILED=!!process.execPath&&!/bun(\.exe)?$/i.test(path.basename(process.execPath));var BASE_DIR=process.env.STOCKROOM_DIR||(IS_COMPILED?path.dirname(process.execPath):process.cwd());var DATA_DIR=path.join(BASE_DIR,"data");var DATA_FILE=path.join(DATA_DIR,"stockroom-data.json");var BACKUP_DIR=path.join(DATA_DIR,"backups");var KEEP_BACKUPS=60;var START_PORT=Number(process.env.STOCKROOM_PORT)||8080;var COLLECTIONS=new Set(["items","sales","meta"]);var ID_RE=/^[A-Za-z0-9_\-.~:@+]{1,200}$/;var LOG_FILE=path.join(DATA_DIR,"stockroom.log");function logLine(text){try{fs.mkdirSync(DATA_DIR,{recursive:true});if(fs.existsSync(LOG_FILE)&&fs.statSync(LOG_FILE).size>1e6)fs.renameSync(LOG_FILE,LOG_FILE+".old");const t=new Date;const stamp=dayStamp(t)+" "+t.toTimeString().slice(0,8);fs.appendFileSync(LOG_FILE,stamp+"  "+String(text).trim()+`\r
`)}catch(e){}}if(!globalThis.__stockroomLogPatched){globalThis.__stockroomLogPatched=true;const _err=console.error.bind(console);console.error=(...a)=>{_err(...a);logLine(a.join(" "))}}function showError(text){console.error(text);if(process.platform!=="win32")return;try{const msg=String(text).replace(/'/g,"''");spawnSync("powershell.exe",["-NoProfile","-WindowStyle","Hidden","-Command",`Add-Type -AssemblyName PresentationFramework; [void][System.Windows.MessageBox]::Show('${msg}', 'Stock Room', 'OK', 'Warning')`],{stdio:"ignore",windowsHide:true})}catch(e){}}var UPDATE_DIR=path.join(BASE_DIR,"runtime","updates");function cmpVer(a,b){const pa=String(a).split(".").map(Number),pb=String(b).split(".").map(Number);for(let i=0;i<3;i++){const d=(pa[i]||0)-(pb[i]||0);if(d)return d>0?1:-1}return 0}if(process.argv.includes("--selftest")){console.log("stockroom-selftest-ok "+VERSION);process.exit(0)}async function runNewer(){if(process.env.STOCKROOM_NO_UPDATES)return false;let names=[];try{names=fs.readdirSync(UPDATE_DIR).filter((n)=>/^stockroom-\d+\.\d+\.\d+\.js$/.test(n))}catch(e){return false}const newer=names.map((n)=>({n,v:n.slice(10,-3)})).filter((f)=>cmpVer(f.v,VERSION)>0).sort((a,b)=>cmpVer(b.v,a.v));for(const f of newer){const file=path.join(UPDATE_DIR,f.n);try{await import(pathToFileURL(file).href);return true}catch(e){logLine("Update "+f.v+" failed to start ("+e.message+"). Using the previous version instead.");try{fs.renameSync(file,file+".failed")}catch(er){}}}return false}if(await runNewer())await new Promise(()=>{});var db={version:1,items:{},sales:{},meta:{}};var loaded=false;function load(){fs.mkdirSync(BACKUP_DIR,{recursive:true});if(!fs.existsSync(DATA_FILE)){saveNow();loaded=true;return}try{const raw=JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));for(const c of COLLECTIONS)db[c]=raw&&typeof raw[c]==="object"&&raw[c]?raw[c]:{};loaded=true}catch(e){const bad=DATA_FILE+".unreadable-"+Date.now();fs.copyFileSync(DATA_FILE,bad);showError(`Stock Room couldn't read its data file, so it didn't start.

A copy of the file was kept at:
`+bad+`

You can put back a copy from the data\\backups folder. Send Claude a photo of this message if you need help.`);process.exit(1)}}function saveNow(){const tmp=DATA_FILE+".tmp";fs.writeFileSync(tmp,JSON.stringify(db));fs.renameSync(tmp,DATA_FILE);dailyBackup()}var saveTimer=null;function saveSoon(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{saveNow()}catch(e){console.error("Save failed:",e.message)}},250)}function dayStamp(d=new Date){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}function dailyBackup(){const f=path.join(BACKUP_DIR,`stockroom-${dayStamp()}.json`);if(fs.existsSync(f))return;fs.copyFileSync(DATA_FILE,f);const all=fs.readdirSync(BACKUP_DIR).filter((n)=>/^stockroom-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();for(const old of all.slice(0,Math.max(0,all.length-KEEP_BACKUPS))){try{fs.unlinkSync(path.join(BACKUP_DIR,old))}catch(e){}}}var clients=new Set;function broadcast(changes){const msg=`event: change
data: ${JSON.stringify(changes)}

`;for(const res of clients){try{res.write(msg)}catch(e){}}}setInterval(()=>{for(const res of clients){try{res.write(`: ping

`)}catch(e){}}},25000);function applyOps(ops){const changes=[];for(const o of ops){if(!o||!COLLECTIONS.has(o.coll)||!ID_RE.test(String(o.id||"")))throw new Error("bad path");const coll=db[o.coll],id=String(o.id);if(o.op==="delete"){delete coll[id];changes.push({coll:o.coll,id,data:null});continue}if(!o.data||typeof o.data!=="object"||Array.isArray(o.data))throw new Error("bad body");if(o.op==="set")coll[id]=o.data;else if(o.op==="update"){if(!coll[id])throw new Error("missing");coll[id]=Object.assign({},coll[id],o.data)}else throw new Error("bad op");changes.push({coll:o.coll,id,data:coll[id]})}return changes}function lanAddresses(port){const out=[];for(const[name,list]of Object.entries(os.networkInterfaces())){for(const a of list||[]){if(a.family==="IPv4"&&!a.internal&&!/^169\.254\./.test(a.address)&&!/vEthernet|VirtualBox|VMware|WSL|Hyper-V/i.test(name))out.push(`http://${a.address}:${port}`)}}return out}function send(res,code,body,type="application/json; charset=utf-8",extra={}){res.writeHead(code,Object.assign({"Content-Type":type,"Cache-Control":"no-store"},extra));res.end(typeof body==="string"||Buffer.isBuffer(body)?body:JSON.stringify(body))}function readBody(req,limit=5242880){return new Promise((resolve,reject)=>{let size=0;const chunks=[];req.on("data",(c)=>{size+=c.length;if(size>limit){reject(new Error("too large"));req.destroy()}else chunks.push(c)});req.on("end",()=>resolve(Buffer.concat(chunks).toString("utf8")));req.on("error",reject)})}var MANIFEST=JSON.stringify({name:"Herba Pharmacy Stock Room",short_name:"Stock Room",start_url:"/",scope:"/",display:"standalone",background_color:"#f5f6ef",theme_color:"#2a6334",icons:[{src:"/icon-192.png",sizes:"192x192",type:"image/png"},{src:"/icon-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"}]});var PORT=START_PORT;var server=http.createServer(async(req,res)=>{const url=new URL(req.url,"http://x");try{if(req.method==="GET"&&(url.pathname==="/"||url.pathname==="/index.html"))return send(res,200,src_default,"text/html; charset=utf-8");if(url.pathname==="/manifest.webmanifest")return send(res,200,MANIFEST,"application/manifest+json");if(url.pathname==="/favicon.ico")return send(res,200,Buffer.from(ICON_ICO,"base64"),"image/x-icon",{"Cache-Control":"max-age=86400"});if(url.pathname==="/icon-192.png")return send(res,200,Buffer.from(ICON_192,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/icon-512.png")return send(res,200,Buffer.from(ICON_512,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/apple-touch-icon.png")return send(res,200,Buffer.from(ICON_180,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/api/state"&&req.method==="GET")return send(res,200,{items:db.items,sales:db.sales,meta:db.meta});if(url.pathname==="/api/info")return send(res,200,{version:VERSION,port:PORT,addresses:lanAddresses(PORT),dataFile:DATA_FILE});if(url.pathname==="/api/events"){res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-store",Connection:"keep-alive","X-Accel-Buffering":"no"});res.write(`retry: 3000

`);clients.add(res);req.on("close",()=>clients.delete(res));return}if(url.pathname==="/api/write"&&req.method==="POST"){const body=JSON.parse(await readBody(req));const ops=Array.isArray(body.ops)?body.ops:[];const snapshot=JSON.stringify(db);let changes;try{changes=applyOps(ops)}catch(e){db=JSON.parse(snapshot);return send(res,400,{error:e.message})}saveSoon();broadcast(changes);lastWrite=Date.now();return send(res,200,{ok:true})}if(url.pathname==="/api/quit"&&req.method==="POST"){if(!isLocal(req)||req.headers["x-stockroom"]!=="quit")return send(res,403,{error:"Stock Room can only be stopped from the Stock Room computer."});send(res,200,{ok:true});logLine("Stopped from the Stock Room window.");for(const r of clients){try{r.end()}catch(e){}}setTimeout(()=>process.exit(0),300);return}if(url.pathname==="/api/update"&&req.method==="GET")return send(res,200,updateStatus());if(url.pathname==="/api/update"&&req.method==="POST"){if(!isLocal(req)||req.headers["x-stockroom"]!=="update")return send(res,403,{error:"Updates can only be managed on the Stock Room computer."});const body=JSON.parse(await readBody(req)||"{}");if(body.action==="source"){const src=normSource(body.source);if(src===null)return send(res,400,{error:"That doesn't look like a GitHub username."});upd.source=src;upd.ready=null;upd.lastResult="";saveUpdateSettings();if(src)checkUpdate().catch(()=>{})}else if(body.action==="check"){await checkUpdate().catch(()=>{})}else if(body.action==="install"){if(!upd.ready)return send(res,400,{error:"No update is ready."});send(res,200,updateStatus());setTimeout(()=>restartForUpdate("Installed from the Stock Room window."),300);return}return send(res,200,updateStatus())}if(url.pathname==="/api/backup"){return send(res,200,JSON.stringify(db,null,1),"application/json",{"Content-Disposition":`attachment; filename="stockroom-backup-${dayStamp()}.json"`})}if(url.pathname==="/api/restore"&&req.method==="POST"){const raw=JSON.parse(await readBody(req,52428800));if(!raw||typeof raw.items!=="object")return send(res,400,{error:"Not a Stock Room backup file"});const pre=path.join(BACKUP_DIR,`before-restore-${Date.now()}.json`);fs.writeFileSync(pre,JSON.stringify(db));for(const c of COLLECTIONS)db[c]=raw[c]&&typeof raw[c]==="object"?raw[c]:{};saveNow();const msg=`event: reload
data: {}

`;for(const r of clients){try{r.write(msg)}catch(e){}}return send(res,200,{ok:true})}send(res,404,{error:"not found"})}catch(e){send(res,500,{error:"server error"})}});function isLocal(req){return/^(127\.|::1$|::ffff:127\.)/.test(String(req.socket.remoteAddress||""))}var UPDATE_SETTINGS=path.join(DATA_DIR,"update-settings.json");var QUIET_MS=600000;var lastWrite=0;var upd={source:"",lastCheck:0,lastResult:"",ready:null,checking:false};try{const u=JSON.parse(fs.readFileSync(UPDATE_SETTINGS,"utf8"));if(typeof u.source==="string")upd.source=u.source}catch(e){}function saveUpdateSettings(){try{fs.mkdirSync(DATA_DIR,{recursive:true});fs.writeFileSync(UPDATE_SETTINGS,JSON.stringify({source:upd.source}))}catch(e){}}function normSource(v){const s=String(v||"").trim().replace(/^https?:\/\/github\.com\//i,"").replace(/\/+$/,"").replace(/^@/,"");if(!s)return"";const m=s.match(/^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))(?:\/([A-Za-z0-9._-]{1,100}))?$/);return m?m[1]+"/"+(m[2]||"stockroom-updates"):null}function updateStatus(){return{version:VERSION,source:upd.source,lastCheck:upd.lastCheck,lastResult:upd.lastResult,ready:upd.ready,checking:upd.checking}}async function checkUpdate(){if(!upd.source||upd.checking)return;upd.checking=true;try{const base=(process.env.STOCKROOM_UPDATE_BASE||"https://raw.githubusercontent.com/")+upd.source+"/main/";const r=await fetch(base+"latest.json?t="+Date.now(),{signal:AbortSignal.timeout(20000)});if(r.status===404)throw new Error("Couldn't find Stock Room updates at github.com/"+upd.source+". Check the username.");if(!r.ok)throw new Error("GitHub answered "+r.status+".");const info=await r.json();if(!info||!/^\d+\.\d+\.\d+$/.test(String(info.version))||!/^[a-f0-9]{64}$/.test(String(info.sha256)))throw new Error("The update information on GitHub isn't valid.");upd.lastCheck=Date.now();if(cmpVer(info.version,VERSION)<=0){upd.ready=null;upd.lastResult="Up to date.";return}if(upd.ready&&upd.ready.version===info.version)return;const fr=await fetch(base+"stockroom-server.js?t="+Date.now(),{signal:AbortSignal.timeout(120000)});if(!fr.ok)throw new Error("Couldn't download version "+info.version+".");const buf=Buffer.from(await fr.arrayBuffer());const sum=crypto.createHash("sha256").update(buf).digest("hex");if(sum!==info.sha256)throw new Error("The download for version "+info.version+" was incomplete. It will try again later.");fs.mkdirSync(UPDATE_DIR,{recursive:true});const test=path.join(UPDATE_DIR,`check-${info.version}.js`);fs.writeFileSync(test,buf);const t=spawnSync(process.execPath,[test,"--selftest"],{timeout:30000,windowsHide:true,encoding:"utf8",env:Object.assign({},process.env,{STOCKROOM_NO_BROWSER:"1",STOCKROOM_NO_UPDATES:"1"})});if(!String(t.stdout||"").includes("stockroom-selftest-ok "+info.version)){try{fs.unlinkSync(test)}catch(e){}throw new Error("Version "+info.version+" didn't pass its start-up check, so it wasn't installed.")}fs.renameSync(test,path.join(UPDATE_DIR,`stockroom-${info.version}.js`));const all=fs.readdirSync(UPDATE_DIR).filter((n)=>/^stockroom-\d+\.\d+\.\d+\.js$/.test(n)).sort((a,b)=>cmpVer(b.slice(10,-3),a.slice(10,-3)));for(const old of all.slice(2)){try{fs.unlinkSync(path.join(UPDATE_DIR,old))}catch(e){}}upd.ready={version:info.version,notes:String(info.notes||"").slice(0,500)};upd.lastResult="Version "+info.version+" downloaded.";logLine("Downloaded update "+info.version+".")}catch(e){upd.lastResult=e.name==="TimeoutError"||/fetch|network|ENOTFOUND|ECONN/i.test(e.message)?"Couldn't reach GitHub. Is this computer online?":e.message;upd.lastCheck=Date.now()}finally{upd.checking=false}}var restarting=false;function restartForUpdate(why){if(restarting)return;restarting=true;logLine("Restarting to install version "+(upd.ready?upd.ready.version:"?")+". "+why);try{clearTimeout(saveTimer);saveNow()}catch(e){}for(const r of clients){try{r.end()}catch(e){}}server.close(()=>{try{const child=spawn(process.execPath,process.argv.slice(1),{cwd:process.cwd(),detached:true,stdio:"ignore",windowsHide:true,env:Object.assign({},process.env,{STOCKROOM_NO_BROWSER:"1"})});child.unref()}catch(e){logLine("Restart failed: "+e.message)}setTimeout(()=>process.exit(0),100)});try{server.closeAllConnections&&server.closeAllConnections()}catch(e){}}function startUpdater(){setTimeout(()=>checkUpdate().catch(()=>{}),30000);setInterval(()=>checkUpdate().catch(()=>{}),10800000);setInterval(()=>{if(upd.ready&&Date.now()-lastWrite>QUIET_MS)restartForUpdate("Stock Room was quiet.")},60000)}function refreshIconFile(){try{const f=path.join(BASE_DIR,"stockroom.ico"),want=Buffer.from(ICON_ICO,"base64");if(fs.existsSync(f)&&fs.readFileSync(f).equals(want))return;fs.writeFileSync(f,want);if(process.platform==="win32")exec("ie4uinit.exe -show",{windowsHide:true},()=>{})}catch(e){}}function start(port,triesLeft){server.once("error",(e)=>{if(e.code==="EADDRINUSE"&&triesLeft>0)return start(port+1,triesLeft-1);showError("Stock Room couldn't start: "+e.message);process.exit(1)});server.listen(port,"0.0.0.0",()=>{PORT=port;const lan=lanAddresses(port);console.log(`
  =============================================`);console.log("   HERBA PHARMACY  -  STOCK ROOM  v"+VERSION);console.log(`  =============================================
`);console.log("   On this computer:   http://localhost:"+port);if(lan.length){console.log("   On phones (Wi-Fi):  "+lan.join(`
                       `))}else console.log("   Not connected to a network: phones can't reach it yet.");console.log(`
   Data file:  `+DATA_FILE);console.log("   Backups:    "+BACKUP_DIR+"  (one per day)");console.log(`
   Stock Room is running. Closing the Stock Room window doesn't stop it,`);console.log(`   so phones keep working. To stop it: Settings > Phones and backups > Stop.
`);logLine("Started v"+VERSION+" on port "+port+(lan.length?" (phones: "+lan.join(", ")+")":" (no network)"));openWindow(port);startUpdater();refreshIconFile()})}function openWindow(port){if(process.platform!=="win32"||process.env.STOCKROOM_NO_BROWSER)return;const url=`http://localhost:${port}`;const pf=[process.env["ProgramFiles(x86)"],process.env.ProgramFiles,process.env.LOCALAPPDATA].filter(Boolean);const candidates=[];for(const base of pf){candidates.push(path.join(base,"Microsoft","Edge","Application","msedge.exe"));candidates.push(path.join(base,"Google","Chrome","Application","chrome.exe"))}const browser=candidates.find((c)=>{try{return fs.existsSync(c)}catch(e){return false}});if(browser){const profile=path.join(BASE_DIR,"runtime","window");try{const child=spawn(browser,[`--app=${url}`,`--user-data-dir=${profile}`,"--window-size=1280,880","--no-first-run","--no-default-browser-check"],{detached:true,stdio:"ignore"});child.unref();return}catch(e){}}exec(`start "" "${url}"`)}async function alreadyRunning(port){try{const r=await fetch(`http://127.0.0.1:${port}/api/info`,{signal:AbortSignal.timeout(1200)});if(!r.ok)return false;const i=await r.json();return i&&i.version?true:false}catch(e){return false}}if(await alreadyRunning(START_PORT)){console.log(`
  Stock Room is already running. Opening its window...
`);openWindow(START_PORT);setTimeout(()=>process.exit(3),1500)}else{load();start(START_PORT,10)}for(const sig of["SIGINT","SIGTERM","SIGHUP"])process.on(sig,()=>{if(loaded){try{saveNow()}catch(e){}}process.exit(0)});process.on("exit",()=>{if(!loaded)return;try{clearTimeout(saveTimer);fs.writeFileSync(DATA_FILE+".tmp",JSON.stringify(db));fs.renameSync(DATA_FILE+".tmp",DATA_FILE)}catch(e){}});
