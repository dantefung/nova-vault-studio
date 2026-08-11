import os
import subprocess
import json

ROOT = '/opt/workspace/nova-vault-studio/docs/md'
MIN_SIZE = 500 * 1024
EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp')

def find_large_images():
    results = []
    for dirpath, _, filenames in os.walk(ROOT):
        for f in filenames:
            ext = os.path.splitext(f)[1].lower()
            if ext not in EXTENSIONS:
                continue
            fp = os.path.join(dirpath, f)
            size = os.path.getsize(fp)
            if size > MIN_SIZE:
                results.append((fp, size, ext))
    return results

def compress_with_sharp(files):
    script = '''
const sharp = require('sharp');
const fs = require('fs');

async function compress(fp, ext) {
    let img = sharp(fp);
    let buf;
    if (ext === '.png') {
        buf = await img.png({ quality: 80, compressionLevel: 9, palette: true }).toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
        buf = await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    } else if (ext === '.webp') {
        buf = await img.webp({ quality: 80 }).toBuffer();
    }
    const oldSize = fs.statSync(fp).size;
    if (buf.length < oldSize) {
        fs.writeFileSync(fp, buf);
        const newSize = fs.statSync(fp).size;
        console.log(JSON.stringify({file: fp, oldSize, newSize, saved: oldSize - newSize}));
    }
}

async function main() {
    const files = ''' + json.dumps(files) + ''';
    for (const [fp, size, ext] of files) {
        await compress(fp, ext);
    }
}
main().catch(e => console.error(JSON.stringify({error: e.message})));
'''
    result = subprocess.run(
        ['node', '-e', script],
        capture_output=True, text=True,
        cwd=os.path.dirname(ROOT)
    )
    saved_total = 0
    count = 0
    for line in result.stdout.strip().split('\n'):
        if not line:
            continue
        try:
            data = json.loads(line)
            rel = os.path.relpath(data['file'], ROOT)
            kb_saved = data['saved'] // 1024
            saved_total += kb_saved
            count += 1
            print(f"  {data['oldSize']//1024}K -> {data['newSize']//1024}K  ({kb_saved}K saved)  {rel}")
        except:
            pass
    if result.stderr:
        print(f"  ERR: {result.stderr.strip()[:200]}")
    return count, saved_total

def main():
    files = find_large_images()
    print(f"Found {len(files)} images > 500KB")
    if not files:
        print("Nothing to compress.")
        return
    count, saved = compress_with_sharp(files)
    print(f"\nCompressed {count} files, saved ~{saved}KB total")

if __name__ == '__main__':
    main()