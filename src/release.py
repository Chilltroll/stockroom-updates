#!/usr/bin/env python3
"""Build Stock Room and publish it as the latest update.

Run from the repository root:  python3 src/release.py "What changed"
Needs bun. It builds src/index.html from src/index.src.html, bundles the server into
stockroom-server.js at the repository root and writes latest.json, which every
pharmacy computer checks every 3 hours. Then commit and push.
Remember to raise VERSION in src/server.js first."""
import hashlib, json, pathlib, re, shutil, subprocess, sys
root = pathlib.Path(__file__).resolve().parent.parent
src = root / "src"
version = re.search(r'const VERSION = "([0-9]+\.[0-9]+\.[0-9]+)"', (src / "server.js").read_text()).group(1)
old = json.loads((root / "latest.json").read_text())["version"] if (root / "latest.json").exists() else "0.0.0"
if tuple(map(int, version.split("."))) <= tuple(map(int, old.split("."))):
    sys.exit(f"Raise VERSION in src/server.js above {old} first (it is {version}).")
subprocess.run([sys.executable, str(src / "build.py")], check=True)
bun = shutil.which("bun") or str(pathlib.Path.home() / ".bun/bin/bun")
subprocess.run([bun, "build", str(src / "server.js"), "--target=bun", "--minify-whitespace", "--outfile", str(root / "stockroom-server.js")], check=True)
data = (root / "stockroom-server.js").read_bytes()
notes = " ".join(sys.argv[1:]).strip()
(root / "latest.json").write_text(json.dumps({"version": version, "sha256": hashlib.sha256(data).hexdigest(), "notes": notes}, indent=1) + "\n")
print(f"Ready to push version {version} ({len(data)} bytes).")
