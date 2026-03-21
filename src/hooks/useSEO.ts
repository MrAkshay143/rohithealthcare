import { useEffect } from 'react';
import { useContent } from './useContent';
import type { SeoPageKey } from '@/services/content';

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Updates document title and meta tags from per-page SEO settings.
 * @param pageKey - The SEO page key (e.g. 'home', 'about').
 *                  Reads seo_{key}_title, seo_{key}_description, seo_{key}_keywords from settings.
 */
export function useSEO(pageKey: SeoPageKey) {
  const c = useContent();

  useEffect(() => {
    const siteName = c.site_name || '';
    const title = c[`seo_${pageKey}_title`] || '';
    const description = c[`seo_${pageKey}_description`] || '';
    const keywords = c[`seo_${pageKey}_keywords`] || '';

    // Document title
    document.title = title || siteName;

    // Basic meta
    setMeta('description', description);
    setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', title || siteName, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', siteName, 'property');
    if (c.seo_og_image) setMeta('og:image', c.seo_og_image, 'property');
    if (c.site_domain) setMeta('og:url', c.site_domain, 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title || siteName);
    setMeta('twitter:description', description);
    if (c.seo_og_image) setMeta('twitter:image', c.seo_og_image);
  }, [c, pageKey]);
}
