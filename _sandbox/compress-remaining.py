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
    try {
        let img = sharp(fp, { failOn: 'none' });
        let buf;
        if (ext === '.png') {
            buf = await img.png({ quality: 75, compressionLevel: 9, palette: true }).toBuffer();
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
        } else {
            console.log(JSON.stringify({file: fp, skip: true, message: 'not smaller', oldSize}));
        }
    } catch (e) {
        console.log(JSON.stringify({file: fp, skip: true, error: e.message}));
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
    result = subprocess.run(['node', '-e', script], capture_output=True, text=True)
    for line in result.stdout.strip().split('\n'):
        if not line:
            continue
        try:
            data = json.loads(line)
            rel = os.path.relpath(data['file'], ROOT)
            if data.get('skip'):
                print(f"  SKIP ({data.get('error', data.get('message', '?'))})  {rel}")
            else:
                print(f"  {data['oldSize']//1024}K -> {data['newSize']//1024}K  ({data['saved']//1024}K saved)  {rel}")
        except:
            pass
    if result.stderr:
        print(f"  STDERR: {result.stderr.strip()[:300]}")

def main():
    files = find_large_images()
    print(f"Remaining {len(files)} images > 500KB")
    if not files:
        print("None.")
        return
    compress_with_sharp(files)

if __name__ == '__main__':
    main()