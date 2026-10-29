#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""X 长文归档流水线：抓取 → 配图本地化 → 构建 sources → 排版规范化 → 校验。

用法：
    python3 scripts/x-pipeline.py fetch <url> [<url> ...]
    python3 scripts/x-pipeline.py images   <manifest.json>
    python3 scripts/x-pipeline.py build    <manifest.json>
    python3 scripts/x-pipeline.py normalize <manifest.json>
    python3 scripts/x-pipeline.py check    <manifest.json>
    python3 scripts/x-pipeline.py all      <manifest.json>   # images+build+normalize+check

manifest.json 结构（数组，每项一篇）：
[
  {
    "slug": "author-topic-slug",              // 图片目录名 docs/md/wiki/images/<slug>
    "src": "x-to-markdown/User/123/0.md",      // 抓取产物的相对路径
    "out": "docs/md/wiki/sources/<slug>.md",   // 归档输出路径
    "title": "作者：标题",
    "author": "作者 (@user)",
    "url": "https://x.com/user/status/123",
    "desc": "一句话摘要（渲染成标题下方的引用块）",
    "related": ["sources/xxx", "patterns/yyy"], // 结尾「相关页面」的 wikilink
    "links":   {"https://t.co/x": "https://real.url"},   // 短链还原
    "sections": ["一、第一节", "二、第二节"],            // 多段 Thread 的自定义小标题
    "insert_before": [["锚点文本", "插入的小标题"]],      // 在指定位置前插小标题
    "note":     "::: info 说明\\n正文\\n:::",             // frontmatter 后的提示块
    "remove_lines":  ["正则"],                  // 整行删除（去导流话术）
    "replace_lines": [["正则", "替换文本"]]       // 行内替换
  }
]

可选字段：date（默认 2026-10-29）、source（默认 X/Twitter）。

处理约定（与 AGENTS.md「归档去广告要求」一致）：
- Thread 外壳剥离：'## N' 分段、推文 URL 行、'> Author:' / '> URL:' 引述头
- 标题层级：原 H1 丢弃（由 frontmatter 生成），正文其余标题整体下沉一级
- 列表：'N、' / 'N．' / '1⃣' → 有序列表，'▸' / '* ' → 无序列表
- 推文行间补段（表格行不打断），'\\\\X\\\\' → '**X**'
- 配图按出现顺序编号本地化，单图 > 450KB 自动用 sharp 压缩
- 末尾关注 / 点赞 / 转发 / 私信 / 社群导流话术自动剔除
"""
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = 'docs/md/wiki/images'
SIZE_LIMIT = 450 * 1024

# 抓取脚本位置（多个候选，任一存在即可）
FETCH_CANDIDATES = [
    Path.home() / '.agents/skills/baoyu-danger-x-to-markdown/scripts/main.ts',
    Path.home() / '.claude/skills/baoyu-danger-x-to-markdown/scripts/main.ts',
    ROOT / '.claude/skills/baoyu-danger-x-to-markdown/scripts/main.ts',
]


def find_fetch_script():
    for p in FETCH_CANDIDATES:
        if p.exists():
            return p
    return None


def normalize_script():
    """排版规范化脚本：优先同目录，其次 _sandbox。"""
    for p in (Path(__file__).with_name('normalize-typo.py'),
              ROOT / '_sandbox/normalize-typo.py'):
        if p.exists():
            return p
    return None


# ---------------------------------------------------------------- 公共工具


def read_manifest(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def collect_urls(text):
    """按出现顺序收集配图 URL：coverImage 优先，其次正文 media 图。"""
    urls = []
    m = re.search(r'coverImage:\s*"([^"]+)"', text)
    if m and 'twimg.com' in m.group(1):
        urls.append(m.group(1))
    for m in re.finditer(r'!\[[^\]]*\]\((https://pbs\.twimg\.com/media/[^)]+)\)', text):
        if m.group(1) not in urls:
            urls.append(m.group(1))
    return urls


def strip_frontmatter(lines):
    if not lines or lines[0].strip() != '---':
        return lines
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            return lines[i + 1:]
    return lines


def split_blocks(body):
    """按 '## N' 推文分隔符把正文切成多个推文块。"""
    blocks, cur = [], []
    for l in body:
        if re.fullmatch(r'##\s+\d+', l.strip()):
            blocks.append(cur)
            cur = []
            continue
        cur.append(l)
    blocks.append(cur)
    return blocks


def clean_block(lines):
    """清理单个推文块：去 URL 行、去引述壳、还原加粗、转义引号。"""
    out = []
    in_quote = False
    for l in lines:
        s = l.strip()
        if s.startswith('> Author:') or s.startswith('> URL:'):
            continue
        if re.fullmatch(r'https://x\.com/\w+/status/\d+', s):
            continue
        if re.search(r'!\[[^\]]*\]\(https://pbs\.twimg\.com/amplify_video_thumb/[^)]+\)', l):
            continue
        if s.startswith('>'):
            inner = s[1:]
            if inner.startswith(' '):
                inner = inner[1:]
            out.append(inner)
            in_quote = True
            continue
        if in_quote and s == '':
            out.append('')
            continue
        in_quote = False
        out.append(l)
    return [re.sub(r'\\\\(.+?)\\\\', r'**\1**', l) for l in out]


def fix_headings(lines, shift):
    """标题整体下沉一级（shift=True），并统一小节编号的句点。"""
    out = []
    in_code = False
    for l in lines:
        s = l.strip()
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            out.append(l)
            continue
        if in_code:
            out.append(l)
            continue
        m = re.match(r'^(#{1,5})\s+(.*)$', l)
        if not m:
            out.append(l)
            continue
        level = len(m.group(1))
        title = m.group(2)
        if shift:
            level = min(level + 1, 6)
        title = re.sub(r'^(\d+)\s*[、．]\s*', r'\1. ', title)
        out.append('#' * level + ' ' + title)
    return out


def normalize_lists(lines):
    """'N、' / 'N．' / '1⃣' → Markdown 有序列表；'▸' / '* ' → 无序列表。"""
    out = []
    in_item = False
    in_code = False
    for l in lines:
        s = l.strip()
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            out.append(l)
            continue
        if in_code:
            out.append(l)
            continue
        if not s:
            in_item = False
            out.append(l)
            continue
        m = re.match(r'^(\d+)\ufe0f?\u20e3\s*(.+)$', s)
        if m:
            out.append(f'{m.group(1)}. {m.group(2)}')
            in_item = True
            continue
        m = re.match(r'^(\d+)\s*[、．.]\s*(.+)$', s)
        if m:
            out.append(f'{m.group(1)}. {m.group(2)}')
            in_item = True
            continue
        if re.match(r'^▸\s*', s):
            out.append('- ' + re.sub(r'^▸\s*', '', s))
            in_item = True
            continue
        if re.match(r'^\*\s+', s):
            out.append('- ' + re.sub(r'^\*\s+', '', s))
            in_item = True
            continue
        if re.match(r'^/[a-z]+\s', s):
            out.append('- ' + s)
            in_item = True
            continue
        if in_item:
            out.append('   ' + s)
            continue
        out.append(l)
    return out


def split_paragraphs(lines):
    """推文里连续的非空行原本是独立段落，补空行；列表项与表格行保持不变。"""
    out = []
    in_code = False
    prev_kind = None
    for l in lines:
        s = l.strip()
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            out.append(l)
            prev_kind = 'code'
            continue
        if in_code:
            out.append(l)
            continue
        if not s:
            out.append(l)
            prev_kind = 'blank'
            continue
        if s.startswith('|'):
            kind = 'table'
        elif re.match(r'^(?:\d+\.|-\s)', s):
            kind = 'item'
        elif l.startswith('   '):
            kind = 'cont'
        else:
            kind = 'para'
        if prev_kind == 'para' and kind != 'cont':
            out.append('')
        out.append(l)
        prev_kind = kind
    return out


# ---------------------------------------------------------------- 子命令


def cmd_fetch(urls):
    script = find_fetch_script()
    if not script:
        print('✗ 找不到 baoyu-danger-x-to-markdown 抓取脚本')
        print('  候选路径：' + '\n           '.join(str(p) for p in FETCH_CANDIDATES))
        return 1
    for u in urls:
        print(f'--- Fetching: {u}')
        subprocess.run(['bun', str(script), u], cwd=ROOT, check=False)
    return 0


def cmd_images(manifest):
    hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'}
    for t in manifest:
        slug = t['slug']
        src = ROOT / t['src']
        if not src.exists():
            print(f'SKIP {slug}: 找不到 {t["src"]}')
            continue
        urls = collect_urls(src.read_text(encoding='utf-8'))
        out = ROOT / IMG_DIR / slug
        out.mkdir(parents=True, exist_ok=True)
        print(f'=== {slug}: {len(urls)} 张 ===')
        for i, u in enumerate(urls, 1):
            ext = '.png' if u.endswith('.png') else '.jpg'
            fn = f'{i:03d}{ext}'
            p = out / fn
            try:
                req = urllib.request.Request(u, headers=hdr)
                with urllib.request.urlopen(req, timeout=30) as r:
                    p.write_bytes(r.read())
            except Exception as e:
                print(f'  ERR {fn}: {e}')
                continue
            size = p.stat().st_size
            if size > SIZE_LIMIT:
                size = compress_image(p)
            print(f'  {fn}: {size // 1024} KB')
    return 0


def compress_image(path):
    """用 sharp 把超过 450KB 的图压到限制内（优先 PNG palette，不行转 JPEG）。"""
    script = (
        "const sharp=require('sharp'),fs=require('fs');"
        f"const p={str(path)!r};const L={SIZE_LIMIT};"
        "sharp(p).rotate().resize({width:1200,withoutEnlargement:true})"
        ".png({compressionLevel:9,palette:true,quality:85,effort:10}).toFile(p+'.tmp')"
        ".then(()=>{const s=fs.statSync(p+'.tmp').size;"
        "if(s<=L){fs.unlinkSync(p);fs.renameSync(p+'.tmp',p);return s;}"
        "fs.unlinkSync(p+'.tmp');return sharp(p).rotate().resize({width:1200,withoutEnlargement:true})"
        ".jpeg({quality:80,mozjpeg:true}).toFile(p+'.jpg.tmp').then(()=>{fs.unlinkSync(p);"
        "fs.renameSync(p+'.jpg.tmp',p);return fs.statSync(p).size;});});"
    )
    try:
        subprocess.run(['node', '-e', script], cwd=ROOT, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f'  WARN 压缩失败: {e.stderr.decode()[:200]}')
    return path.stat().st_size


def cmd_build(manifest):
    for t in manifest:
        slug = t['slug']
        src = ROOT / t['src']
        raw = src.read_text(encoding='utf-8')
        urls = collect_urls(raw)
        links = t.get('links', {})

        def local(u, _urls=urls, _slug=slug):
            if u not in _urls:
                return None
            i = _urls.index(u) + 1
            ext = '.png' if u.endswith('.png') else '.jpg'
            p = ROOT / IMG_DIR / _slug / f'{i:03d}{ext}'
            return f'../images/{_slug}/{i:03d}{ext}' if p.exists() else None

        lines = strip_frontmatter(raw.split('\n'))
        for i, l in enumerate(lines):
            if l.strip() == '## Thread':
                lines = lines[:i]
                break

        blocks = split_blocks(lines)
        blocks = [b for b in blocks if any(x.strip() for x in b)]

        # 丢弃原标题 H1，判断其余标题是否需要整体下沉
        first_h1_done = False
        for b in blocks:
            for i, l in enumerate(b):
                if l.strip().startswith('# '):
                    if not first_h1_done:
                        b[i] = ''
                        first_h1_done = True
                    break
                if l.strip():
                    break
        extra_h1 = sum(1 for b in blocks for l in b if re.match(r'^#\s+', l.strip()))
        blocks = [fix_headings(b, extra_h1 > 0) for b in blocks]

        body = []
        for bi, b in enumerate(blocks):
            cleaned = clean_block(b)
            if bi < len(t.get('sections', [])):
                body += ['', f'## {t["sections"][bi]}', '']
            body.extend(cleaned)

        text = '\n'.join(body)
        for short, real in links.items():
            text = text.replace(short, real)

        # 图片本地化
        def repl(m):
            alt, u = m.group(1), m.group(2)
            p = local(u)
            return f'![{alt}]({p})' if p else m.group(0)

        text = re.sub(r'!\[([^\]]*)\]\((https://pbs\.twimg\.com/media/[^)]+)\)', repl, text)

        text = '\n'.join(normalize_lists(text.split('\n')))
        text = '\n'.join(split_paragraphs(text.split('\n')))
        text = text.replace('\ufffc', '')

        for marker, heading in t.get('insert_before', []):
            nl = text.split('\n')
            for i, l in enumerate(nl):
                if marker in l:
                    nl.insert(i, f'## {heading}')
                    nl.insert(i + 1, '')
                    break
            text = '\n'.join(nl)

        # 折叠空行
        out = []
        for l in text.split('\n'):
            if l.strip() == '' and out and out[-1].strip() == '':
                continue
            out.append(l.rstrip())
        text = '\n'.join(out).strip()

        # 去广告 / 导流话术
        ad = [
            r'.*欢迎点个赞或者关注.*',
            r'.*也欢迎关注我。后续我会继续在这里.*',
            r'.*关注我一定是不会吃亏的.*',
            r'.*有什么问题一定要主动私信我.*',
            r'.*能解决不能解决我都会回复.*',
            r'.*只要不是让我帮你远程.*',
            r'.*都是free的.*',
            r'.*这里借着自己的流量说一下.*',
            r'.*我宣布：.*',
            r'.*Bot时代正式到来！.*',
            r'.*谢谢大家，欢迎随时讨论.*',
        ]
        keep = []
        for l in text.split('\n'):
            if any(re.match(p, l.strip()) for p in ad):
                continue
            keep.append(l)

        # 逐篇定制：remove_lines 整行删除，replace_lines 正则替换
        for pat in t.get('remove_lines', []):
            keep = [l for l in keep if not re.search(pat, l)]
        for pat, rep in t.get('replace_lines', []):
            keep = [re.sub(pat, rep, l) for l in keep]

        out = []
        for l in keep:
            if l.strip() == '' and out and out[-1].strip() == '':
                continue
            out.append(l)
        text = '\n'.join(out).strip()

        cov = ''
        for ext in ('jpg', 'png'):
            if (ROOT / IMG_DIR / slug / f'001.{ext}').exists():
                cov = f'coverImage: "../images/{slug}/001.{ext}"\n'
                break

        front = (
            f'---\ntitle: "{t["title"]}"\ndate: "{t.get("date", "2026-10-29")}"\n'
            f'source: "{t.get("source", "X/Twitter")}"\nauthor: "{t["author"]}"\n'
            f'url: "{t["url"]}"\n{cov}---\n\n'
            f'# {t["title"]}\n\n> {t["desc"]}\n\n<!-- more -->\n\n'
        )
        if t.get('note'):
            front += t['note'] + '\n\n'
        related = '\n\n## 相关页面\n\n' + '\n'.join(f'- [[{r}]]' for r in t.get('related', [])) + '\n'

        outp = ROOT / t['out']
        outp.parent.mkdir(parents=True, exist_ok=True)
        outp.write_text(front + text + related, encoding='utf-8')
        rem = len(re.findall(r'pbs\.twimg\.com/media/', front + text))
        print(f'{outp.name}: {len((front + text + related).splitlines())} 行, 远程图残留 {rem}')
    return 0


def cmd_normalize(manifest):
    script = normalize_script()
    if not script:
        print('✗ 找不到 scripts/normalize-typo.py')
        return 1
    for t in manifest:
        f = ROOT / t['out']
        if f.exists():
            subprocess.run([sys.executable, str(script), str(f), '--apply'], cwd=ROOT, check=True)
    return 0


def cmd_check(manifest):
    ok = True
    for t in manifest:
        p = ROOT / t['out']
        if not p.exists():
            print(f'✗ {t["out"]} 不存在')
            ok = False
            continue
        body = p.read_text(encoding='utf-8')
        for link in sorted(set(re.findall(r'\[\[([^\]]+)\]\]', body))):
            if not (ROOT / 'docs/md/wiki' / f'{link}.md').exists():
                print(f'✗ 悬空 wikilink: {t["slug"]} -> {link}')
                ok = False
        rem = len(re.findall(r'pbs\.twimg\.com/media/', body))
        if rem:
            print(f'✗ 远程图残留 {rem}: {t["slug"]}')
            ok = False
        for m in re.finditer(r'!\[[^\]]*\]\((\.\./images/[^)]+)\)', body):
            target = (p.parent / m.group(1)).resolve()
            if not target.exists():
                print(f'✗ 图片缺失: {t["slug"]} -> {m.group(1)}')
                ok = False
    print('✓ 校验通过' if ok else '✗ 校验失败')
    return 0 if ok else 1


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == 'fetch':
        sys.exit(cmd_fetch(sys.argv[2:]))
    manifest = read_manifest(sys.argv[2])
    handlers = {
        'images': cmd_images,
        'build': cmd_build,
        'normalize': cmd_normalize,
        'check': cmd_check,
    }
    if cmd == 'all':
        rc = 0
        for fn in (cmd_images, cmd_build, cmd_normalize, cmd_check):
            rc = fn(manifest) or rc
        sys.exit(rc)
    sys.exit(handlers[cmd](manifest))


if __name__ == '__main__':
    main()
