// ESM markdown-it plugin to render ```markmap fenced blocks
// It converts them into <svg> placeholders to be hydrated by markmap on client.
export default function markdownItMarkmap(md) {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const [lang, ...params] = info.split(/\s+/);

    if (lang === 'markmap') {
      const content = token.content || '';
      const encoded = encodeURIComponent(content);
      let height = 560; // default minimum/fallback height
      const paramStr = params.join(' ');
      const mh = paramStr.match(/height=(\d+)/);
      if (mh) height = Number(mh[1]);
      // Support full-width flags: `full`, `width=full`, `width-full`, `width_full`
      const isFull = /(?:^|\s)(?:full|width(?:=|-|_)full)(?:\s|$)/.test(paramStr);
      const id = 'mm-' + Math.random().toString(36).slice(2, 9);
      const cls = `markmap-container${isFull ? ' markmap-full-bleed' : ''}`;
      const fixedAttr = mh ? ' data-fixed-height' : '';
      const style = mh ? `height:${height}px` : `min-height:${height}px`;
      return `<div class="${cls}"${fixedAttr} style="${style}"><svg id="${id}" class="markmap-svg" data-code="${encoded}"></svg></div>`;
    }

    return defaultFence
      ? defaultFence(tokens, idx, options, env, slf)
      : slf.renderToken(tokens, idx, options);
  };
}
