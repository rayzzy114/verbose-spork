export const DISPLAY_FONT_FAMILY = 'Trajan Pro';

const FONT_ASSETS: Record<string, string> = import.meta.glob('/src/assets/**/*.{otf,ttf,woff2}', { eager: true, query: '?url', import: 'default' });

const FONT_SOURCES = [
  FONT_ASSETS['/src/assets/trajan-pro.otf'],
  FONT_ASSETS['/src/assets/trajan-pro.ttf'],
].filter(Boolean);

if (FONT_SOURCES.length === 0) {
  // If glob fails, try direct paths that Vite can static-analyze for inlining
  FONT_SOURCES.push(new URL('./assets/trajan-pro.otf', import.meta.url).href);
}

export async function loadDisplayFont(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document) || typeof FontFace === 'undefined') {
    return;
  }

  const fontLoads = FONT_SOURCES.map(async (source) => {
    try {
      const face = new FontFace(DISPLAY_FONT_FAMILY, `url(${source})`);
      const loaded = await face.load();
      document.fonts.add(loaded);
    } catch (e) {
      console.warn(`Failed to load font from ${source}:`, e);
    }
  });

  await Promise.all(fontLoads);
  await document.fonts.load(`16px "${DISPLAY_FONT_FAMILY}"`);
}
