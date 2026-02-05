// Client-only renderer for markmap placeholders created by the markdown-it plugin.
// Safe for SSR because imports happen dynamically inside the function.
let scheduled = false;

async function renderMarkmapsNow() {
  const nodes = Array.from(document.querySelectorAll('svg.markmap-svg'));
  if (!nodes.length) return;

  const [{ Transformer }, { Markmap }] = await Promise.all([
    import('markmap-lib'),
    import('markmap-view')
  ]);

  const transformer = new Transformer();

  nodes.forEach((el) => {
    if (el.__markmap_inited__) return;
    const code = el.getAttribute('data-code') || '';
    const markdown = decodeURIComponent(code);
    const { root } = transformer.transform(markdown);
    Markmap.create(el, undefined, root);
    el.__markmap_inited__ = true;
  });
}

export function scheduleRender() {
  if (typeof window === 'undefined') return;
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(async () => {
    try { await renderMarkmapsNow(); } finally { scheduled = false; }
  });
}

export function initMarkmap() {
  if (typeof window === 'undefined') return;
  // Initial render
  scheduleRender();
  // Re-render on DOM updates inside main doc container
  const root = document.querySelector('#app') || document.body;
  const mo = new MutationObserver(() => scheduleRender());
  mo.observe(root, { childList: true, subtree: true });
}
