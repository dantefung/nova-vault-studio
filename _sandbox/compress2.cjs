const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const all = walk('docs/md');
const big = all.filter(p => fs.statSync(p).size > 400 * 1024 && fs.statSync(p).size < 5 * 1024 * 1024);

let saved = 0;
(async () => {
  for (const f of big) {
    const before = fs.statSync(f).size;
    const tmp = f + '.tmp';
    try {
      await sharp(f).rotate().resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(tmp);
      const after = fs.statSync(tmp).size;
      if (after < before) {
        fs.renameSync(tmp, f);
        saved += (before - after);
        console.log(`OK ${(before/1024).toFixed(0)}KB->${(after/1024).toFixed(0)}KB ${f}`);
      } else {
        fs.unlinkSync(tmp);
        console.log(`SKIP (larger) ${f}`);
      }
    } catch(e) {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      console.log(`ERR ${f} ${e.message}`);
    }
  }
  console.log(`\nTotal saved: ${(saved/1024/1024).toFixed(1)}MB over ${big.length} files`);
})();