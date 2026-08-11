const sharp = require('sharp');

const files = [
  ['docs/md/wiki/images/skill-system-prompt-design/001.gif', 'done'],
  ['docs/md/columns/agentic-engineer/images/taobao-code-generation-workflow/agent-article-temp-img1.gif', 'pending'],
  ['docs/md/wiki/images/ai-coding-delivery-practice/001.gif', 'pending'],
  ['docs/md/columns/indie-hub/seo/ahrefs/images/ahrefs-web-analytics-2FXWHLR3.gif', 'pending'],
  ['docs/md/wiki/images/taste-skill-302ai-review/004.gif', 'pending'],
  ['docs/md/wiki/images/taste-skill-302ai-review/008.gif', 'pending'],
  ['docs/md/wiki/images/linux-kernel-context-switch/001.gif', 'pending'],
];

async function main() {
  for (const [f] of files) {
    const out = f.replace('.gif', '.png');
    try {
      await sharp(f, { animated: false })
        .png({ compressionLevel: 9, palette: true })
        .toFile(out);
      const { size: oldSize } = require('fs').statSync(f);
      const { size: newSize } = require('fs').statSync(out);
      console.log(`OK: ${f} (${(oldSize/1024/1024).toFixed(1)}MB → ${(newSize/1024).toFixed(0)}KB)`);
    } catch(e) {
      console.log(`ERR: ${f} → ${e.message}`);
    }
  }
}
main();