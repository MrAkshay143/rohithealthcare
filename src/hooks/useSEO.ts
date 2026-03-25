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

export interface CustomSEO {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * Updates document title and meta tags from per-page SEO settings or custom override.
 * @param pageKey - The SEO page key (e.g. 'home', 'about').
 * @param custom  - Optional custom metadata to override settings (ideal for blog posts).
 */
export function useSEO(pageKey: SeoPageKey | 'custom', custom?: CustomSEO) {
  const c = useContent();

  useEffect(() => {
    const siteName = c.site_name || 'Rohit Health Care';
    const title = custom?.title || (pageKey !== 'custom' ? c[`seo_${pageKey}_title`] : '') || siteName;
    const description = custom?.description || (pageKey !== 'custom' ? c[`seo_${pageKey}_description`] : '') || '';
    const keywords = custom?.keywords || (pageKey !== 'custom' ? c[`seo_${pageKey}_keywords`] : '') || '';
    const image = custom?.image || c.seo_og_image || '';
    const url = custom?.url || c.site_domain || '';

    // Document title
    document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;

    // Basic meta
    setMeta('description', description);
    setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', siteName, 'property');
    if (image) setMeta('og:image', image, 'property');
    if (url) setMeta('og:url', url, 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (image) setMeta('twitter:image', image);
  }, [c, pageKey, custom?.title, custom?.description, custom?.keywords, custom?.image, custom?.url]);
}
