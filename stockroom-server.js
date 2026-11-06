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
<link rel="icon" href="/icon-192.png">
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
.logo { width: 54px; height: 54px; flex: none; }
.logo .c { fill: var(--leaf); } .logo .l { fill: var(--accent); } .logo .v { stroke: var(--surface); }
.word { display: grid; line-height: 1; }
h1 { font-family: var(--font-display); font-weight: 800; font-size: 2.1rem; margin: 0; letter-spacing: 0.02em; text-transform: uppercase; color: var(--fg); }
.word .ph { font-family: var(--font-display); font-weight: 700; font-size: 0.78rem; letter-spacing: 0.42em; color: var(--accent); margin-top: 4px; text-transform: uppercase; }
.sub { display: inline-block; margin: 10px 0 0; background: var(--accent); color: var(--accent-ink); font-family: var(--font-display); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px; border-radius: 99px; }
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
      <svg class="logo" viewBox="0 0 60 60" aria-hidden="true">
        <path class="c" d="M22 4h16a3 3 0 0 1 3 3v12h12a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H41v12a3 3 0 0 1-3 3H22a3 3 0 0 1-3-3V41H7a3 3 0 0 1-3-3V22a3 3 0 0 1 3-3h12V7a3 3 0 0 1 3-3z"/>
        <path class="l" d="M30 48C18 44 17 30 30 16c13 14 12 28 0 32z"/>
        <path class="v" d="M30 46V24" fill="none" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <div>
        <div class="word"><h1>Herba</h1><span class="ph">Pharmacy</span></div>
        <span class="sub">Stock Room</span>
      </div>
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
      <div class="card" id="bkCard">
        <h2>Backups and moving data</h2>
        <p>Download a backup to keep a copy, or to move your stock into the Windows app (Add items \u203A Phones and backups \u203A Restore). To bring data the other way, download a backup in the Windows app and restore it here.</p>
        <div class="actions">
          <button class="primary" type="button" id="bkDl">Download backup</button>
          <span class="filebtn overlay">Restore from backup<input id="bkFile" type="file" accept=".json,application/json" aria-label="Choose a backup file to restore"></span>
        </div>
        <div id="bkBox"></div>
      </div>
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
      <datalist id="supplierList"></datalist>
      <datalist id="typeList"></datalist>
    </section>
  </main>
  <footer class="foot">
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18C3 15 3 7 10 2c7 5 7 13 0 16z"/></svg>
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
  window.STOCKROOM_VERSION = "1.6.0";
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
    ["stock", "cash", "hist", "order", "exp", "add"].forEach((t) => { $("#tab-" + t).hidden = t !== state.tab; });
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
`;var ICON_192="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";var ICON_512="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";var ICON_180="iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAYM0lEQVR4nO2dW4wc13mgv/9UVffcqeGdEi8STZO6xRItWl7It3gDG4gV5wYlcF78ssnLAkn2IZsAAQIkyCbAJgGCDfYl6zzlYdebCJvEirKJHcSSIimwI9mRdXVCURySFocXcci5d1ed8+fhVPX0jEhxeqYv1d3ng2ZI1rSmT9f5+u+/Tp3zH7n/P51SOokAt3oGaXqIAwyoKkYMqp1tVmB7iAhOHSICDsQ0dfMH9XeHuzXu6G/f2PhCYBG8r4qJDBhBnKIKooq6IHPZUVWMMSCCRDT60FnnjwlrQanoTs2/pHPt6ojQjTdis8D5z6JKBOpfuFpwqUNFEW0K14G+QJ2Cqve06EMBifCBSgRbt/4YueDNn8odaFN7hc7ffUVDxQiKYpIIdYpLLVkt9T/LX7x/sRJE7lcagq71oWZKZrPGcZNEiBFsmiEI6nR9etLGvm+v0E0RGQGTRF7i1RQR/wAhROKBpwhSOS7NUPVRu3ACXR+x24XZ9m/Y8LkhkWAqPiJnqynq1AseDB5ixKedTU6YSoREG5xoQw6yfaF9coQYiKox6iBbzdMKCRIH1lM44cX2zogB2hStty805DmS8SKrBpEDt0X8MIhPR41PRdpBy0I3VM2T+aga4zKHS20QOdAyIoJLLS5zRNV43fDHVmxqWWg/fKxI7N9VRXpBkDmwVZrSEJNESGwaw4Gt0nrKoQqxQQRsLQtROdA2RCR3CsilbpXWhC5kRrBZSDEC7UckdwvZktS3FXotZ16T2RVPGAh0gHWONUm9GeM+UGghv2WtQNQkc4jMgQ4j0iR15Gc++XGID3bv1kIraDGbJBKMEZwNMge6h4h3zhiByA9/aGH2Lbi10E3emthg05BmBLqPINjUYmLTfPCWfGDKoapE1SSMZgR6SjH6EVWT286Tf5/QzTdOoiQKMgdKQUPqJPrAGy/vE1o3PDqsHAmUhYaLhZs3SabXCS1N36Nq7PPmEJ0DJUHE59NRtZj1/P6ruobQgtBYNGIEVw8yB8qHSO6m8W7qhrnXTRFaG2N9JolwznW5qYHA5nDO+VVQQNM3oCH02po/YyRcCAZKTXGBaIoo7Y8CDaG18d0kUbgQDJQeVV2L0v4I0JxyqCJCmNcc6AuKedSSr5gqME2PIKrEvq5CINAHOOuIKvG6ufiNVd9KXmdhCIPzoHwgDV2mKDRKIhRdmAutiDE+hA+R0YXI1oJ12revXBWMgSgqKhb1ukXdQcjTDiPgHCCF0EKUL6calvxZBOp1xRiYnIyYGDdehH57+erryq2uOm7ccNTrSqUyPGKrKnESY2v+xTYitDJc6UaaKkcOJxz7UJWdOyMqFel43bWOkLc5y5T5ecfZmTqn365jLUTREEgtTdOcfYTOx/IyNzTpRpYpHzs1yonjVZzz/07T/u55EZiejtizZ5RDBxOee36ZNHVEkQy01IKgmU83QPBLAQyoHeBX3YS1yqMfG+XeE1VqtTWRRfr7C/wbc2VF2bcv5oc/PUaSGIbhhq9azcfr1P8hprm472Ai4tOMDx+rcu+JEVZWdJ0Mg4CIvzhcXVX27o059dERrNWBeo03RXOHAaPiJyOpDLbRqlCpCMc/XKFedwPdyYXUhw4l7NoZk2WD9cbdiIrmDoPBAa6pPvMAIvlF0549MVNTEdYOdgcXxLFw110xdsDTSVEBp+DAMOCRucA52DkdYdpSza8/GLrXLHkOPSx3CIchKm9kKF5zfscQwBhjwp4mgb5Hnd/zxQSZA4OCOm1PfehAoCwEoQMDRRA6MFAEoQMDRRA6MFAEoQMDRRA6MFAEoQMDRRA6MFC0d6/vAOBXURTbQW+skCn5RnyqetPqmYHtEYRuIyIGAVJbJ3U1nLNEJm4sPFZVrMswJiIxVZKo4lfD6RAsK+kSQeg24COyoZYtYzVjz/ghDk0/wN7JIxzYcYyRZBKA1XSBizdOc3lhhvNzr3Nl6TyRxFTjMVRdiNhtIAi9TYxEpLZG3a5y6I57+eSxL/Hggc9Qjcdu+vj7938KgFq2zGsXn+X501/l/PW3qEQjJFEVp7abzR84gtDbwEjEUv0Gu8bv4vP3/jwPH/w8kfGndC3ibpyQrAhCNR7jkUM/ysN3fY5/ufB1vv7Wn/De0g8Yr+wIUm+DIPQWKMo9LNbnOHX4cX7swV9isroTAKcWI6aRT98axakjMjGPHP4Cx/f9B/76tT/ipXNPM57syB8RUpBWCUK3iOQjF3W7yk8/9Gt84ugTQCFyhJFo07+peKxTy2R1Jz/3yG9yePpBvvbqH1KJRhrPFdg8YRy6BQrBatkyP3Py1/nE0SdwalG0BZHfj5EIRXFq+cTRJ/iZk79OLVtG8/QksHlChG4FgTRb5Wc/+hucOvwFrGZE0p5T6EdKIqxmnDr8OCA8+d3foRKPDnzNlHZSGqE7uZhTBMw2i8pEEjNfu8oXH/xlL7PLGheA7SSSGOsyTh3+AgurV3nqtf/BVHU3VrMt/85uFNQpS7mxngtdVMmsp0qn7i+IwGpNybKtnXUjEYv1OR498kU+e/zLPjJ3QOaCyMRYzfjs8S9zaeEML537G8Yrd2xp9MM5qNUU5zonnYgv5VuG4pA9F7peV6oV4a4DCTt3Rh2JJL7QDOzfF7dcZMaIoW5XODD1IX7iI7/i9/bYRr68+ef1e938xEd+hR9c/z5Xly5QiUZwm3zXS14yeXLScPLh0Y7JJgI35h1XrmQsLjqSRDCmd2L3VGhrlRMnqhw/VmFqqrMFUQTILC1XEdJ83sVPPfSrjCYTOHWYFq6l/c4IXkIRYbP1twXB4RhNJviph36V//XCL7Y84uGcMjFhOPnwSEv/X6uowvKyY+Zcymuvr5Jl2rOqpz0TOsuURz82xonjFdK08+Vsi1scrUXniKX6dT5xzxMc3X2yMTTXCsJaIcFWMWJwajm6+yQfP/LjvPDOky2nHkXK0WkqFeGB+6vs3h3x7HNLpGlv6lN3XeiiCujHHhnlxPFK16qAtvrrBSFzdaZH9/O5+34BVUVk82I6VYwIb577Pr/zv38fVcfDH/oI//Vn/0v+uzYZqcWgqnzuvl/gjdnnWU7niSRuKVp3o3qSKqysKHt2x3zm0+M88+xST2oIdnUcutgG4vChCidOVFld9VtClLFclYhhNV3isaNPMFGdRmmtIHyx1+Pc4nX+/jvf5Bsvf5PvnH7F/6wVGREUx0R1mseOPsFqutTSG6ubGOM/DfbtTXjwgRHStPulfLt+ZoyBYx9KSl2Iu4jOO8fv5ON3/2TL0bmZ2MTsGJ9ix/gU49WbT1i6bXvyKP3xu3+SneN3krl6aW+4GAP1uuPI4YSJie4XXO+q0Nb6DXp27YrJsvIW4i6mgj52zxOMVaZajs7NKIp1Fuvspkco3teePEqPVaZ47J4nqGXLpY3S4PP2sTHDnj3d7+eunRU/jOSvupOkvPt+CILVlMmRXTx65IvA1qNzW9slBlAePfJFJkd2YTUtbZQG3987pkzX+7nrPVVWkQuK3Pn+fZ9kvHqHTzdKII4gqCrj1Tu4f98nS51LF/Sir8t9RnqAosSmwqkjj+f/Lg9FW04deZzYVMJMvJsQhG7CIKR2lQM7jnFk5w+BKqZEUdCIvwV3ZOcPcWDHMVK7yu1mXQ8b5emtMiCGerbKvfsew0iEo3xDMQ6HkYh79z1GPVv128gGGoSz0YTiqMQj3H/gU/mRMkY/36b7D3yKSjyClvBN10uC0DlGhNTW2D95lDunPgyUK90oMPlox51TH2b/5FFSW8OUdfyzB5Svx3qGIbV1Dk8/QGTiLY8Zd4NiLeLh6QdIbZ3QjWuEM7EO5e7dD/W6EZvGtzWMdDQThM5xahlNJjk0/YA/UMJ0o0HetkPTDzCaTIayB02UuNe6hxFDamvsnjjE9Oh+/Cbo5c1LTV4fb3p0P7snDuV5dOhKCEI3sC5j/+RRIhM3ZsqVGVUlMjH7J49i3dbXGw4aQWgABKeWvZN3A/1R4KVo497Ju/OUo7yfKN0kCI2XIzIRe6fuyY/0gxy+jXun7iEyUV+8CbtBEDrHmJiJvJxXPzFR3Ynp4Ar0fmPohRYE61ImKtPsGT/oj/XBjYqijXvGDzJRmca6ck8n7RZDL7RHiUzS0VobnSIyMZFJCOPRnqEXWkRIbZ29E0eo5IXH+yHS+fnRjko8xt6JI6S23hefLJ1m6IUuMGL6QuSNCBLGoJsIZyKnG9WQOkU/t73dBKERrMs4OH0f0B9j0AVFWw9O35ffXOm/T5h2E4TOaVdZ3F7Qz21vN0HonH6KzBvp57a3myB0YKAIQgcGiiB0YKAIQuf04xh0QT+3vd0EoXO2s4dJr+nntrebIDR+ovyFuTeB/op2RVsvzL2Zz0MJox1B6Jx+XpfXz21vN0HoHNfYm7u/0HyL5YBn6IVWVZKowuXFGep53eV+EFvzMr/1bJnLizMkUaUv1kJ2mqEX2uMn+ffjYlPrMqxLCfM4PEMvtOaT+xfrc1xZuuCP9UGkK9p4ZekCi/U5IpP0xSdLpxl6oQucy1isXet1M1pmsXYN14efLJ0iCE2xrtByef6d/Eg/RDrfxsvz72Cd7avhxk4ShAZ8pdGIywtngf4Yiy7aeHnhbD7Bvx/ehJ0nCJ0TmZjZhTNYl/XF2jwRvzBhduFMXy7u7RRBaPwYdBJVubp4nrmVWUBwJY54Lt/oeW5llquL50miahiLzglC5xiJWEkXOD/3uj9QZkHytp2fe52VdCGsKWwiCL0O4ezVV3rdiE3j21r+9KibBKEbOJKowrm517EuK3VpACMG6zLOzb1OElUg7LPSoLy91mWcKklUZXbhDO/O/xu+Imn5RPFtEt6d/zdmF87k+XN58/1uE4RuQvDbur1x8R/zI2UUxbfpjYv/SD1bRUIXriOcjWbUb+v21qUXcWoxJTw9BoNTy1uXXqQSj5T74rUHlK/HeohDSaIRLt44zcy1V0HKlXY4dSDCzLVXuXjjNEk0UurhxV4QhN6AIGSuzkszT+f/Lg9FW16aeZrM1fvijma36brQZb8Jp+oYScZ549LzLNWuIyKlmMXm5z8LS7XrvHHpeUaScbREnx43oxd93VWhRYTVVcVaLa3YihJJwsLqe3x75inIy9b2Gs1HN7498xQLq+8RSfmniy6vdL+fuya0KkQR3LhhuXHDYkqc7Kg6qvEYL77zJMv1eYTermJRFMGwXJ/nxXeepJrXsS4rIlCrKVeuZERRd43ucoSGNFXOzqQkieBK2ieKEpsK15be5Vtn/9KnHT0USNUhInzr7F9ybeldYlMpbXR2DioVYXY25fp1SxT5YNYtuiq0qn+xp9+uMzubMVItsdR5Lv3imSdZrM31LEoX0XmxNseLZ54sde6sCnEsrKwor7xaI4qkqzJDj0Y5nIPnnl/mytWM0VH/orvx1QpFlJ5bmeUbb36lZ1G6iM7fePMrzK3Mbik6d+v8VipClinPPLfE/LyPzt2mJxNpowjS1PHMc8uc+ugIhw4lxHFno7UIWKstPYdTy1hlim/NfI2HDn6Oo7tP4tR1bZ6Hf66IM1e/y7dmvsZYZarlGhwikCSdjZTG+CB15UrGP7+8wrVrlkql+9EZeiS0v0D07+YX/mmZXd+PueuumJ3Tkd+Xvd0nQvwJn5gwTE6YlqQWBBHhL175Pf7zp7/CSDyepwGdvdgpnmMlXeQvXvk9RMRvFNTCyRGBel25dCnrzHnFj1zNL1jefTdj9lLaiNS9ml7Ss6UOqmvR49pcxpWrWcdGPoqr7pMPj3Ly4RFqtc0PJzl1VKJRLs6/zV997w/40iO/idWs41XznVoiifmr7/0BF+ffZrxyR0vRuchn5+Yy/v4fFjsXpQWc9VE6jgWR7l4EbqTna3eKEx93sCWSR+itvmGcWiYq03x75in2TR7ls8e/jHVZx5Y+Fb/7m//6p3x75immqru3XJCxCBodTTvy07CVa5UONaW3dOMkbPc5rGZMVKf5uzf/mMmR3Zw6/IWORGqrXuaXzv0Nf/fmHzNRnd52ddGtXhj3I6UQum9QSKIR/uw7vw0opw4/jlOLtGGPQ0VRdUQS89K5p/mz7/w3qvFYOWewlpgS368rH8WFWjUe48+/+7u8cOZJjEQIsq0KoE5tvoFmxAtnnuTPv/u7VOOxli8CAyFCt0xD6miU//fKf+fc3Gv82IO/xGR1J+Dl3NywnjaG5YxELNSu8dev/REvnXua8WRH47kCrRGE3gKFaBOVaV4+9/85+973+Py9P8/DBz/fuFB0ahHVdTdjfOlbi1PFSIyRCOsy/uXC1/n6W3/Ce0s/YKIyHeo9b4Mg9DZwahmv7GBh9T3+z8u/xfNv/18+eexLPHjgMz7/BarxOD4R9rP4fESGWrbMaxef5fnTX+X89beoRCOMV3YEmbdJEHqbOLXEJiGJqlycf5uvvvxb7Bk/xME77uOu6WNcvFwnMgkijveWL/DM6T/l3bm3OX/9Da4unSeSmPHKDlRdkLkNBKHbgB+hsFTiUQS4vnKZywvn+d7s33J5VrBZhKrh0o0L/O2b/5MsNVTiKmPJJErYUqKdBKHbiKpf4RebhLhSJY6FybGUOw8sowq7dsWMJeNkooAr1XrFQSEI3QH8RaMlzWDHHcKP/McJf1yVNAu1nDtJELrDqPpFDQVlXXo2KAShu0CQuHuEO4WBgSIIHRgogtCBgSIIHRgogtCBgSIIHRgogtCBgcKICYOkgcFAjGCccwSpA/2OGME551MOMTIUa9eG8Y7dULxkpRGUDToULxkRuDHvhmLlc4ExML/gSls/sO2o5NuIGEFlcHu6qP1x5UrG8rIrdSnfduIcvDvbuQI+ZUFFwQgYMKKgTpEBj9TGwOKiY+ZcSqXSWjmwfkPVF5e5ejVjdjYjjntXmqsbiErucD5sp84NfLJVdPJrr69y6XJKtcSlfLeDc75uYL2u/PPLK6iWd7eEtiG5w4DxxclAulxpvRcYA1kGzz631CjlW9RiG4QvgJERIU0d33x2iWvX7MBHZ8jddQBCXKxIljjC2Wygd1byVU/9hPtnnl3iwQdGOHI4YWzM9H8UU6jVlZmZlFdeXWV+vnclbbuJopg4Qq1fCZRP8PelWlGGIvWIIsFaeOnlFd76fo09e2J2TJm+7XwRWF52XLlq820gOlycsUwoeRD24hZ1I7GpRfo+TG2OopRvtep35Tp7tt7/nS8QGaFS8X3Y969nk4gINrUU0bgRodUpURJh08FOO5pR9Xl1t3dq6iTDIjL4dCNKYh+M10doH7AbdwwHp383xTBJMFDkdwibdV0bclfF1jNMNOCj8IGBwUQGW8/WRaQ1e8VfRJgkQkPICpQcVc1dZd0knVxoaXx3Q3RxGOhfRMS7unYEaAitjR84p0TVOETpQGlR9Y465x3Nx3WAdStWpPgPl1rMoM9oCfQtxpi16Lz2zf+s+IviJ3eAn6xkKiGXDpQP1dzNIjrr+p0O1oVhbfpuaxlRuEAMlAjV/F5JrSh4+f5NO96XVzRG9fJHhgvEQFlouFi4eZMbJu8TumG8gE1tuEAMlILiQtCmlg0xdx0feOUnIthaGqQO9JSGzLX0thnDrYVu8tdlzufTw7CSNlAq/HyNCJe55oO35NZCS9O0PKs4p5goXCQGuoeqd845BesnGUkxtnwLPjDl0OKGiwDWrU2mDlIHOoxq7hoK1jXukdwuS7jt3ZO1i0SBrEnqkH4EOsQ6xzLXmKuxGeNaux3YJHUUInWgA6jmbm2QebO0fn+7kFoJox+BtlKMZqiyJZlhC0L7nFrQzOFSSzySFK1p+ckDAaDhTjyS4FKL5jJv5ZZey7tgNd94Qf0tchP798UwrUsMtIfidjawdkv7A26c3I62TKlzqUWd89FaJKQhgdui+UrleCRBnf+0bwfbFzpfMaDOv8PE0EhDgtiBjWhTeiHGO6MOny+3QZftC70hw1CruLpFjOSNLiJ2kHt4UV+SrMkJV7eo3eBEG7LV9u4km68YV1XQPBVB848VbfwbfIG9YVtdPjQojWq2gmCSGDGCTbM8PdV1j22nB+0VWtb+UGg03NWt11iEuBKDKs46/w7NX3yj+mmQvL8oFoUUfSggsRBFEYhg6xaXOd+tTZPxC0fa3d8d2etbm/8iTbm0gK1nSL7CHMGPkBgBp/6Y6vp3cKC0iBE/vCY0+tBZhzpw6tb6XW/iRIfa1NnN64uSY0Xri9fXJLizDrH4CwOT38MXEy4oS46I39NE8gEBMc3S6s1vS3Th0/ffAbPpeqamxmjxAAAAAElFTkSuQmCC";var VERSION="1.6.0";var IS_COMPILED=!!process.execPath&&!/bun(\.exe)?$/i.test(path.basename(process.execPath));var BASE_DIR=process.env.STOCKROOM_DIR||(IS_COMPILED?path.dirname(process.execPath):process.cwd());var DATA_DIR=path.join(BASE_DIR,"data");var DATA_FILE=path.join(DATA_DIR,"stockroom-data.json");var BACKUP_DIR=path.join(DATA_DIR,"backups");var KEEP_BACKUPS=60;var START_PORT=Number(process.env.STOCKROOM_PORT)||8080;var COLLECTIONS=new Set(["items","sales","meta"]);var ID_RE=/^[A-Za-z0-9_\-.~:@+]{1,200}$/;var LOG_FILE=path.join(DATA_DIR,"stockroom.log");function logLine(text){try{fs.mkdirSync(DATA_DIR,{recursive:true});if(fs.existsSync(LOG_FILE)&&fs.statSync(LOG_FILE).size>1e6)fs.renameSync(LOG_FILE,LOG_FILE+".old");const t=new Date;const stamp=dayStamp(t)+" "+t.toTimeString().slice(0,8);fs.appendFileSync(LOG_FILE,stamp+"  "+String(text).trim()+`\r
`)}catch(e){}}if(!globalThis.__stockroomLogPatched){globalThis.__stockroomLogPatched=true;const _err=console.error.bind(console);console.error=(...a)=>{_err(...a);logLine(a.join(" "))}}function showError(text){console.error(text);if(process.platform!=="win32")return;try{const msg=String(text).replace(/'/g,"''");spawnSync("powershell.exe",["-NoProfile","-WindowStyle","Hidden","-Command",`Add-Type -AssemblyName PresentationFramework; [void][System.Windows.MessageBox]::Show('${msg}', 'Stock Room', 'OK', 'Warning')`],{stdio:"ignore",windowsHide:true})}catch(e){}}var UPDATE_DIR=path.join(BASE_DIR,"runtime","updates");function cmpVer(a,b){const pa=String(a).split(".").map(Number),pb=String(b).split(".").map(Number);for(let i=0;i<3;i++){const d=(pa[i]||0)-(pb[i]||0);if(d)return d>0?1:-1}return 0}if(process.argv.includes("--selftest")){console.log("stockroom-selftest-ok "+VERSION);process.exit(0)}async function runNewer(){if(process.env.STOCKROOM_NO_UPDATES)return false;let names=[];try{names=fs.readdirSync(UPDATE_DIR).filter((n)=>/^stockroom-\d+\.\d+\.\d+\.js$/.test(n))}catch(e){return false}const newer=names.map((n)=>({n,v:n.slice(10,-3)})).filter((f)=>cmpVer(f.v,VERSION)>0).sort((a,b)=>cmpVer(b.v,a.v));for(const f of newer){const file=path.join(UPDATE_DIR,f.n);try{await import(pathToFileURL(file).href);return true}catch(e){logLine("Update "+f.v+" failed to start ("+e.message+"). Using the previous version instead.");try{fs.renameSync(file,file+".failed")}catch(er){}}}return false}if(await runNewer())await new Promise(()=>{});var db={version:1,items:{},sales:{},meta:{}};var loaded=false;function load(){fs.mkdirSync(BACKUP_DIR,{recursive:true});if(!fs.existsSync(DATA_FILE)){saveNow();loaded=true;return}try{const raw=JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));for(const c of COLLECTIONS)db[c]=raw&&typeof raw[c]==="object"&&raw[c]?raw[c]:{};loaded=true}catch(e){const bad=DATA_FILE+".unreadable-"+Date.now();fs.copyFileSync(DATA_FILE,bad);showError(`Stock Room couldn't read its data file, so it didn't start.

A copy of the file was kept at:
`+bad+`

You can put back a copy from the data\\backups folder. Send Claude a photo of this message if you need help.`);process.exit(1)}}function saveNow(){const tmp=DATA_FILE+".tmp";fs.writeFileSync(tmp,JSON.stringify(db));fs.renameSync(tmp,DATA_FILE);dailyBackup()}var saveTimer=null;function saveSoon(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{saveNow()}catch(e){console.error("Save failed:",e.message)}},250)}function dayStamp(d=new Date){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}function dailyBackup(){const f=path.join(BACKUP_DIR,`stockroom-${dayStamp()}.json`);if(fs.existsSync(f))return;fs.copyFileSync(DATA_FILE,f);const all=fs.readdirSync(BACKUP_DIR).filter((n)=>/^stockroom-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();for(const old of all.slice(0,Math.max(0,all.length-KEEP_BACKUPS))){try{fs.unlinkSync(path.join(BACKUP_DIR,old))}catch(e){}}}var clients=new Set;function broadcast(changes){const msg=`event: change
data: ${JSON.stringify(changes)}

`;for(const res of clients){try{res.write(msg)}catch(e){}}}setInterval(()=>{for(const res of clients){try{res.write(`: ping

`)}catch(e){}}},25000);function applyOps(ops){const changes=[];for(const o of ops){if(!o||!COLLECTIONS.has(o.coll)||!ID_RE.test(String(o.id||"")))throw new Error("bad path");const coll=db[o.coll],id=String(o.id);if(o.op==="delete"){delete coll[id];changes.push({coll:o.coll,id,data:null});continue}if(!o.data||typeof o.data!=="object"||Array.isArray(o.data))throw new Error("bad body");if(o.op==="set")coll[id]=o.data;else if(o.op==="update"){if(!coll[id])throw new Error("missing");coll[id]=Object.assign({},coll[id],o.data)}else throw new Error("bad op");changes.push({coll:o.coll,id,data:coll[id]})}return changes}function lanAddresses(port){const out=[];for(const[name,list]of Object.entries(os.networkInterfaces())){for(const a of list||[]){if(a.family==="IPv4"&&!a.internal&&!/^169\.254\./.test(a.address)&&!/vEthernet|VirtualBox|VMware|WSL|Hyper-V/i.test(name))out.push(`http://${a.address}:${port}`)}}return out}function send(res,code,body,type="application/json; charset=utf-8",extra={}){res.writeHead(code,Object.assign({"Content-Type":type,"Cache-Control":"no-store"},extra));res.end(typeof body==="string"||Buffer.isBuffer(body)?body:JSON.stringify(body))}function readBody(req,limit=5242880){return new Promise((resolve,reject)=>{let size=0;const chunks=[];req.on("data",(c)=>{size+=c.length;if(size>limit){reject(new Error("too large"));req.destroy()}else chunks.push(c)});req.on("end",()=>resolve(Buffer.concat(chunks).toString("utf8")));req.on("error",reject)})}var MANIFEST=JSON.stringify({name:"Herba Pharmacy Stock Room",short_name:"Stock Room",start_url:"/",scope:"/",display:"standalone",background_color:"#f5f6ef",theme_color:"#2a6334",icons:[{src:"/icon-192.png",sizes:"192x192",type:"image/png"},{src:"/icon-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"}]});var PORT=START_PORT;var server=http.createServer(async(req,res)=>{const url=new URL(req.url,"http://x");try{if(req.method==="GET"&&(url.pathname==="/"||url.pathname==="/index.html"))return send(res,200,src_default,"text/html; charset=utf-8");if(url.pathname==="/manifest.webmanifest")return send(res,200,MANIFEST,"application/manifest+json");if(url.pathname==="/icon-192.png")return send(res,200,Buffer.from(ICON_192,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/icon-512.png")return send(res,200,Buffer.from(ICON_512,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/apple-touch-icon.png")return send(res,200,Buffer.from(ICON_180,"base64"),"image/png",{"Cache-Control":"max-age=86400"});if(url.pathname==="/api/state"&&req.method==="GET")return send(res,200,{items:db.items,sales:db.sales,meta:db.meta});if(url.pathname==="/api/info")return send(res,200,{version:VERSION,port:PORT,addresses:lanAddresses(PORT),dataFile:DATA_FILE});if(url.pathname==="/api/events"){res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-store",Connection:"keep-alive","X-Accel-Buffering":"no"});res.write(`retry: 3000

`);clients.add(res);req.on("close",()=>clients.delete(res));return}if(url.pathname==="/api/write"&&req.method==="POST"){const body=JSON.parse(await readBody(req));const ops=Array.isArray(body.ops)?body.ops:[];const snapshot=JSON.stringify(db);let changes;try{changes=applyOps(ops)}catch(e){db=JSON.parse(snapshot);return send(res,400,{error:e.message})}saveSoon();broadcast(changes);lastWrite=Date.now();return send(res,200,{ok:true})}if(url.pathname==="/api/quit"&&req.method==="POST"){if(!isLocal(req)||req.headers["x-stockroom"]!=="quit")return send(res,403,{error:"Stock Room can only be stopped from the Stock Room computer."});send(res,200,{ok:true});logLine("Stopped from the Stock Room window.");for(const r of clients){try{r.end()}catch(e){}}setTimeout(()=>process.exit(0),300);return}if(url.pathname==="/api/update"&&req.method==="GET")return send(res,200,updateStatus());if(url.pathname==="/api/update"&&req.method==="POST"){if(!isLocal(req)||req.headers["x-stockroom"]!=="update")return send(res,403,{error:"Updates can only be managed on the Stock Room computer."});const body=JSON.parse(await readBody(req)||"{}");if(body.action==="source"){const src=normSource(body.source);if(src===null)return send(res,400,{error:"That doesn't look like a GitHub username."});upd.source=src;upd.ready=null;upd.lastResult="";saveUpdateSettings();if(src)checkUpdate().catch(()=>{})}else if(body.action==="check"){await checkUpdate().catch(()=>{})}else if(body.action==="install"){if(!upd.ready)return send(res,400,{error:"No update is ready."});send(res,200,updateStatus());setTimeout(()=>restartForUpdate("Installed from the Stock Room window."),300);return}return send(res,200,updateStatus())}if(url.pathname==="/api/backup"){return send(res,200,JSON.stringify(db,null,1),"application/json",{"Content-Disposition":`attachment; filename="stockroom-backup-${dayStamp()}.json"`})}if(url.pathname==="/api/restore"&&req.method==="POST"){const raw=JSON.parse(await readBody(req,52428800));if(!raw||typeof raw.items!=="object")return send(res,400,{error:"Not a Stock Room backup file"});const pre=path.join(BACKUP_DIR,`before-restore-${Date.now()}.json`);fs.writeFileSync(pre,JSON.stringify(db));for(const c of COLLECTIONS)db[c]=raw[c]&&typeof raw[c]==="object"?raw[c]:{};saveNow();const msg=`event: reload
data: {}

`;for(const r of clients){try{r.write(msg)}catch(e){}}return send(res,200,{ok:true})}send(res,404,{error:"not found"})}catch(e){send(res,500,{error:"server error"})}});function isLocal(req){return/^(127\.|::1$|::ffff:127\.)/.test(String(req.socket.remoteAddress||""))}var UPDATE_SETTINGS=path.join(DATA_DIR,"update-settings.json");var QUIET_MS=600000;var lastWrite=0;var upd={source:"",lastCheck:0,lastResult:"",ready:null,checking:false};try{const u=JSON.parse(fs.readFileSync(UPDATE_SETTINGS,"utf8"));if(typeof u.source==="string")upd.source=u.source}catch(e){}function saveUpdateSettings(){try{fs.mkdirSync(DATA_DIR,{recursive:true});fs.writeFileSync(UPDATE_SETTINGS,JSON.stringify({source:upd.source}))}catch(e){}}function normSource(v){const s=String(v||"").trim().replace(/^https?:\/\/github\.com\//i,"").replace(/\/+$/,"").replace(/^@/,"");if(!s)return"";const m=s.match(/^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))(?:\/([A-Za-z0-9._-]{1,100}))?$/);return m?m[1]+"/"+(m[2]||"stockroom-updates"):null}function updateStatus(){return{version:VERSION,source:upd.source,lastCheck:upd.lastCheck,lastResult:upd.lastResult,ready:upd.ready,checking:upd.checking}}async function checkUpdate(){if(!upd.source||upd.checking)return;upd.checking=true;try{const base=(process.env.STOCKROOM_UPDATE_BASE||"https://raw.githubusercontent.com/")+upd.source+"/main/";const r=await fetch(base+"latest.json?t="+Date.now(),{signal:AbortSignal.timeout(20000)});if(r.status===404)throw new Error("Couldn't find Stock Room updates at github.com/"+upd.source+". Check the username.");if(!r.ok)throw new Error("GitHub answered "+r.status+".");const info=await r.json();if(!info||!/^\d+\.\d+\.\d+$/.test(String(info.version))||!/^[a-f0-9]{64}$/.test(String(info.sha256)))throw new Error("The update information on GitHub isn't valid.");upd.lastCheck=Date.now();if(cmpVer(info.version,VERSION)<=0){upd.ready=null;upd.lastResult="Up to date.";return}if(upd.ready&&upd.ready.version===info.version)return;const fr=await fetch(base+"stockroom-server.js?t="+Date.now(),{signal:AbortSignal.timeout(120000)});if(!fr.ok)throw new Error("Couldn't download version "+info.version+".");const buf=Buffer.from(await fr.arrayBuffer());const sum=crypto.createHash("sha256").update(buf).digest("hex");if(sum!==info.sha256)throw new Error("The download for version "+info.version+" was incomplete. It will try again later.");fs.mkdirSync(UPDATE_DIR,{recursive:true});const test=path.join(UPDATE_DIR,`check-${info.version}.js`);fs.writeFileSync(test,buf);const t=spawnSync(process.execPath,[test,"--selftest"],{timeout:30000,windowsHide:true,encoding:"utf8",env:Object.assign({},process.env,{STOCKROOM_NO_BROWSER:"1",STOCKROOM_NO_UPDATES:"1"})});if(!String(t.stdout||"").includes("stockroom-selftest-ok "+info.version)){try{fs.unlinkSync(test)}catch(e){}throw new Error("Version "+info.version+" didn't pass its start-up check, so it wasn't installed.")}fs.renameSync(test,path.join(UPDATE_DIR,`stockroom-${info.version}.js`));const all=fs.readdirSync(UPDATE_DIR).filter((n)=>/^stockroom-\d+\.\d+\.\d+\.js$/.test(n)).sort((a,b)=>cmpVer(b.slice(10,-3),a.slice(10,-3)));for(const old of all.slice(2)){try{fs.unlinkSync(path.join(UPDATE_DIR,old))}catch(e){}}upd.ready={version:info.version,notes:String(info.notes||"").slice(0,500)};upd.lastResult="Version "+info.version+" downloaded.";logLine("Downloaded update "+info.version+".")}catch(e){upd.lastResult=e.name==="TimeoutError"||/fetch|network|ENOTFOUND|ECONN/i.test(e.message)?"Couldn't reach GitHub. Is this computer online?":e.message;upd.lastCheck=Date.now()}finally{upd.checking=false}}var restarting=false;function restartForUpdate(why){if(restarting)return;restarting=true;logLine("Restarting to install version "+(upd.ready?upd.ready.version:"?")+". "+why);try{clearTimeout(saveTimer);saveNow()}catch(e){}for(const r of clients){try{r.end()}catch(e){}}server.close(()=>{try{const child=spawn(process.execPath,process.argv.slice(1),{cwd:process.cwd(),detached:true,stdio:"ignore",windowsHide:true,env:Object.assign({},process.env,{STOCKROOM_NO_BROWSER:"1"})});child.unref()}catch(e){logLine("Restart failed: "+e.message)}setTimeout(()=>process.exit(0),100)});try{server.closeAllConnections&&server.closeAllConnections()}catch(e){}}function startUpdater(){setTimeout(()=>checkUpdate().catch(()=>{}),30000);setInterval(()=>checkUpdate().catch(()=>{}),10800000);setInterval(()=>{if(upd.ready&&Date.now()-lastWrite>QUIET_MS)restartForUpdate("Stock Room was quiet.")},60000)}function start(port,triesLeft){server.once("error",(e)=>{if(e.code==="EADDRINUSE"&&triesLeft>0)return start(port+1,triesLeft-1);showError("Stock Room couldn't start: "+e.message);process.exit(1)});server.listen(port,"0.0.0.0",()=>{PORT=port;const lan=lanAddresses(port);console.log(`
  =============================================`);console.log("   HERBA PHARMACY  -  STOCK ROOM  v"+VERSION);console.log(`  =============================================
`);console.log("   On this computer:   http://localhost:"+port);if(lan.length){console.log("   On phones (Wi-Fi):  "+lan.join(`
                       `))}else console.log("   Not connected to a network: phones can't reach it yet.");console.log(`
   Data file:  `+DATA_FILE);console.log("   Backups:    "+BACKUP_DIR+"  (one per day)");console.log(`
   Stock Room is running. Closing the Stock Room window doesn't stop it,`);console.log(`   so phones keep working. To stop it: Add items > Phones and backups > Stop.
`);logLine("Started v"+VERSION+" on port "+port+(lan.length?" (phones: "+lan.join(", ")+")":" (no network)"));openWindow(port);startUpdater()})}function openWindow(port){if(process.platform!=="win32"||process.env.STOCKROOM_NO_BROWSER)return;const url=`http://localhost:${port}`;const pf=[process.env["ProgramFiles(x86)"],process.env.ProgramFiles,process.env.LOCALAPPDATA].filter(Boolean);const candidates=[];for(const base of pf){candidates.push(path.join(base,"Microsoft","Edge","Application","msedge.exe"));candidates.push(path.join(base,"Google","Chrome","Application","chrome.exe"))}const browser=candidates.find((c)=>{try{return fs.existsSync(c)}catch(e){return false}});if(browser){const profile=path.join(BASE_DIR,"runtime","window");try{const child=spawn(browser,[`--app=${url}`,`--user-data-dir=${profile}`,"--window-size=1280,880","--no-first-run","--no-default-browser-check"],{detached:true,stdio:"ignore"});child.unref();return}catch(e){}}exec(`start "" "${url}"`)}async function alreadyRunning(port){try{const r=await fetch(`http://127.0.0.1:${port}/api/info`,{signal:AbortSignal.timeout(1200)});if(!r.ok)return false;const i=await r.json();return i&&i.version?true:false}catch(e){return false}}if(await alreadyRunning(START_PORT)){console.log(`
  Stock Room is already running. Opening its window...
`);openWindow(START_PORT);setTimeout(()=>process.exit(3),1500)}else{load();start(START_PORT,10)}for(const sig of["SIGINT","SIGTERM","SIGHUP"])process.on(sig,()=>{if(loaded){try{saveNow()}catch(e){}}process.exit(0)});process.on("exit",()=>{if(!loaded)return;try{clearTimeout(saveTimer);fs.writeFileSync(DATA_FILE+".tmp",JSON.stringify(db));fs.renameSync(DATA_FILE+".tmp",DATA_FILE)}catch(e){}});
