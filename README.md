# Herba Pharmacy · Stock Room updates

Stock Room is the pharmacy's stock and cashout app. It runs on the pharmacy computer and is shared with phones over the pharmacy Wi-Fi.

This repository is where Stock Room collects its updates. The pharmacy computer checks `latest.json` every 3 hours. When the version there is newer, it downloads `stockroom-server.js`, checks it, and installs it once nobody has used Stock Room for 10 minutes.

**No stock, sales or customer data is kept here.** That stays on the pharmacy computer, in `StockRoom\data`.

## Making a new version
1. Edit the files in `src/`. `index.src.html` is the app page and `server.js` is the program.
2. Raise `VERSION` in `src/server.js`.
3. Run `python3 src/release.py "Short note on what changed"`. This needs [bun](https://bun.sh).
4. Commit and push to `main`.
