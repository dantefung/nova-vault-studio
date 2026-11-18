#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""删除文章结尾的引流/广告段（AGENTS.md「归档去广告要求」）。

保守策略：
- 只扫描文件最后 40 行（CTA 几乎都在结尾；全文扫描会误伤正文里的
  "点赞/关注/公众号" 描述、署名、来源、去广告记录等，故不采用）
- 只删「句子主体就是 CTA」的高置信度整行：三连、点赞收藏、扫码关注、
  加群、公众号引流、求星标、下篇见等
- 作者署名/领域/账号保留（用于溯源），用 EXCLUDE 排除正文说明与方法论句
- 排除误报：方法论句（"别一加微信就群发链接"）、功能说明（"二维码会过期"）、
  正文结语（"请务必亲手跑一遍"）等

用法：
    python3 scripts/strip-ad-tails.py            # 预览
    python3 scripts/strip-ad-tails.py --apply    # 写回
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'docs/md'
APPLY = '--apply' in sys.argv

AD = re.compile(
    r'^\s*[👇\-\—\*>「」\s]*'
    r'(?:'
    r'(?:既然|都)看到这里了.*[。！]?'
    r'|(?:如果|假如)(?:这篇|这篇文章|觉得).{0,24}?(?:点赞|三连|转发|在看|收获|分享|星标)[^。]{0,40}[。！]?'
    r'|如果有(?:所)?收获.{0,30}[。！]?'
    r'|觉得有(?:所)?收获.{0,30}[。！]?'
    r'|如有收获.{0,30}[。！]?'
    r'|.*(?:随手|顺手)点(?:个)?赞[^。]{0,30}[。！]?'
    r'|.*(?:点个赞|点赞.{0,3}在看|在看.{0,3}转发|转发.{0,2}三连|点赞.{0,2}三连|点赞\+转发)[^。]{0,30}[。！]?'
    r'|.*给(?:我|个)?星标[^。]{0,20}[。！]?'
    r'|.*(?:扫码|长按)[^。]{0,10}(?:关注|进群|加我|领取|二维码)[^。]{0,30}[。！]?'
    r'|.*(?:关注公众号|公众号「[^」]+」|加(?:我|个)?微信|微信搜索框|发送.{0,4}交流群|后台回复)[^。]{0,30}[。！]?'
    r'|.*(?:第一时间收到推送|我们下篇见|青山不改|下次见)[^。]{0,20}[。！]?'
    r'|一起[“"]?点赞[”"]?三连[^。]{0,20}[。！]?'
    r'|文末点赞[^。]{0,20}[。！]?'
    r'|(?:点赞|转发|推荐|在看|分享|收藏)[+、,，][^。]{0,30}[。！]?'
    r'|请长按二维码[^。]{0,20}[。！]?'
    r'|关注公众号：?[^。]{0,30}[。！]?'
    r')\s*$'
)

CHEAP = ('点赞', '收藏', '转发', '三连', '在看', '星标', '扫码',
         '加我', '加微信', '公众号', '交流群', '推送', '下篇见', '下次见',
         '分享', '青山不改', '顺手', '随手', '长按二维码')

EXCLUDE = ('别一加微信', '二维码会过期', '过期刷新', '请务必', '留在下一篇',
           '逐一介绍', '埋点', '我是熠辉，感谢阅读', '往期精华文章导读',
           '生成可分享回顾页面', '打包成一个 Bot', '与 JK 哥交流',
           '验证二维码', '当场扫码验证')


def process(p):
    raw = p.read_text(encoding='utf-8')
    lines = raw.split('\n')
    n = len(lines)
    tail_start = max(0, n - 40)
    out, removed = [], []
    for i, line in enumerate(lines):
        if i < tail_start:
            out.append(line)
            continue
        s = line.strip()
        if s.startswith('```') or s.startswith('~~~') or len(s) > 130:
            out.append(line)
            continue
        if not any(k in s for k in CHEAP):
            out.append(line)
            continue
        if any(k in s for k in EXCLUDE):
            out.append(line)
            continue
        if s and AD.match(line):
            removed.append((i + 1, s[:85]))
            continue
        out.append(line)
    new_text = '\n'.join(out)
    if APPLY and new_text != raw:
        p.write_text(new_text, encoding='utf-8')
    return removed


def main():
    total = files = 0
    for p in sorted(ROOT.rglob('*.md')):
        rm = process(p)
        if rm:
            files += 1
            total += len(rm)
            print(f'\n{p.relative_to(ROOT)}:')
            for ln, txt in rm:
                print(f'  L{ln}: {txt}')
    print(f'\n合计: {files} 篇, {total} 处引流删除' + (' (已写入)' if APPLY else ' (DRY-RUN)'))


if __name__ == '__main__':
    main()
