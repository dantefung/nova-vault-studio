#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""normalize-typo.py 回归测试：确保排版变换不破坏代码/HTML/URL。

运行：python3 scripts/test-normalize-typo.py
"""
import importlib.util, tempfile, os
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('nt', HERE / 'normalize-typo.py')
nt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(nt)

CASES = [
    ('请求示例：`{"role": "user", "content": "hi"}`', '`{"role": "user", "content": "hi"}`', 'JSON 行内代码'),
    ('表格 <table tabindex="0"> 内容', '<table tabindex="0">', 'HTML 属性'),
    ('ENV 写 `ANTHROPIC_API_KEY="your_key"` 文件', '`ANTHROPIC_API_KEY="your_key"`', '环境变量代码'),
    ('访问 https://example.com/a?b="x" 看看', 'https://example.com/a?b="x"', 'URL 含引号'),
    ('<a href="https://x.com/a">链接</a> 层设计', '<a href="https://x.com/a">链接</a>', 'HTML 内嵌 URL（嵌套占位符）'),
    ('在LeanCloud上开发', '在 LeanCloud 上开发', '盘古之白'),
    ('中文语境中的应用, 测试; 结束!', '中文语境中的应用，测试；结束！', '全角标点'),
    ('他说"你好"然后走了', '他说“你好”然后走了', '配对引号'),
]

def main():
    with tempfile.NamedTemporaryFile('w', suffix='.md', delete=False, encoding='utf-8') as f:
        f.write('\n'.join(c[0] for c in CASES))
        p = f.name
    nt.process(Path(p), apply=True)
    out = Path(p).read_text(encoding='utf-8').split('\n')
    os.unlink(p)

    ok = 0
    for i, (src, must_keep, desc) in enumerate(CASES):
        passed = must_keep in out[i]
        ok += passed
        print(f'  {"PASS" if passed else "FAIL"}  {desc}')
        if not passed:
            print(f'        期望含: {must_keep}')
            print(f'        实际得: {out[i]}')
    print(f'\n{ok}/{len(CASES)} 通过')
    raise SystemExit(0 if ok == len(CASES) else 1)

if __name__ == '__main__':
    main()
