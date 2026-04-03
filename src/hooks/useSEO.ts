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

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

function setJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

function injectGA(gaId: string) {
  if (!gaId || document.getElementById('ga-script')) return;
  const s1 = document.createElement('script');
  s1.id = 'ga-script';
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s1);
  const s2 = document.createElement('script');
  s2.id = 'ga-config';
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`;
  document.head.appendChild(s2);
}

export interface CustomSEO {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function useSEO(pageKey: SeoPageKey | 'custom', custom?: CustomSEO) {
  const c = useContent();

  useEffect(() => {
    const siteName   = c['site_name']   || 'Rohit Health Care';
    const siteDomain = (c['site_domain'] || 'https://rohithealthcare.com').replace(/\/$/, '');
    const title       = custom?.title       || (pageKey !== 'custom' ? c[`seo_${pageKey}_title`]       : '') || siteName;
    const description = custom?.description || (pageKey !== 'custom' ? c[`seo_${pageKey}_description`] : '') || '';
    const keywords    = custom?.keywords    || (pageKey !== 'custom' ? c[`seo_${pageKey}_keywords`]    : '') || '';
    const image       = custom?.image       || c['seo_og_image'] || '';
    const robots      = c['seo_robots']     || 'index, follow';
    const gaId        = c['google_analytics_id'] || '';
    const path        = (pageKey === 'home' || pageKey === 'custom') ? '' : `/${pageKey}`;
    const pageUrl     = custom?.url || `${siteDomain}${path}`;

    // ── Document title ──────────────────────────────────────
    document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;

    // ── Core meta ───────────────────────────────────────────
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    setMeta('robots', robots);

    // ── Canonical ───────────────────────────────────────────
    setCanonical(pageUrl);

    // ── Geo meta (local SEO) ────────────────────────────────
    const geoRegion = c['seo_geo_region'] || 'IN-WB';
    const geoLat    = c['seo_geo_lat']    || '';
    const geoLng    = c['seo_geo_lng']    || '';
    if (geoRegion) setMeta('geo.region', geoRegion);
    if (c['contact_address']) setMeta('geo.placename', c['contact_address']);
    if (geoLat && geoLng) {
      setMeta('geo.position', `${geoLat};${geoLng}`);
      setMeta('ICBM', `${geoLat}, ${geoLng}`);
    }

    // ── Open Graph ──────────────────────────────────────────
    setMeta('og:title',       title,      'property');
    setMeta('og:description', description,'property');
    setMeta('og:type',        'website',  'property');
    setMeta('og:site_name',   siteName,   'property');
    setMeta('og:url',         pageUrl,    'property');
    if (image) {
      setMeta('og:image',        image,  'property');
      setMeta('og:image:width',  '1200', 'property');
      setMeta('og:image:height', '630',  'property');
    }

    // ── Twitter Card ─────────────────────────────────────────
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:title',       title);
    setMeta('twitter:description', description);
    if (c['seo_twitter_handle']) setMeta('twitter:site', c['seo_twitter_handle']);
    if (image) setMeta('twitter:image', image);

    // ── JSON-LD: WebSite ─────────────────────────────────────
    setJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      'name':     siteName,
      'url':      siteDomain,
      'potentialAction': {
        '@type':       'SearchAction',
        'target':      `${siteDomain}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });

    // ── JSON-LD: MedicalBusiness + LocalBusiness ─────────────
    const phone   = c['contact_phone']    || '';
    const email   = c['contact_email']    || '';
    const street  = c['seo_local_street'] || 'Masjid Road';
    const city    = c['seo_local_city']   || 'Balarampur';
    const state   = c['seo_local_state']  || 'West Bengal';
    const postal  = c['seo_local_postal'] || '';
    const country = c['seo_local_country']|| 'IN';
    const logoUrl = c['site_logo']        || '';

    const biz: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type':    ['MedicalBusiness', 'LocalBusiness'],
      '@id':      siteDomain,
      'name':     siteName,
      'url':      siteDomain,
      'address': {
        '@type':           'PostalAddress',
        'streetAddress':   street,
        'addressLocality': city,
        'addressRegion':   state,
        'postalCode':      postal,
        'addressCountry':  country,
      },
      'openingHoursSpecification': [
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], 'opens': '07:00', 'closes': '21:00' },
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Sunday'], 'opens': '07:00', 'closes': '14:00' },
      ],
      'priceRange':         '\u20b9\u20b9',
      'currenciesAccepted': 'INR',
      'paymentAccepted':    'Cash, UPI',
      'areaServed':         `${city}, ${state}, India`,
    };
    if (phone)  biz['telephone'] = `+${phone}`;
    if (email)  biz['email']     = email;
    if (logoUrl) { biz['logo'] = logoUrl; biz['image'] = logoUrl; }
    if (geoLat && geoLng) biz['geo'] = { '@type': 'GeoCoordinates', 'latitude': parseFloat(geoLat), 'longitude': parseFloat(geoLng) };
    const sameAs = [c['facebook_url'], c['youtube_url']].filter(Boolean);
    if (sameAs.length) biz['sameAs'] = sameAs;
    if (c['google_maps_url']) biz['hasMap'] = c['google_maps_url'];
    setJsonLd('ld-localbusiness', biz);

    // ── JSON-LD: Breadcrumb (non-home pages) ─────────────────
    if (pageKey !== 'home' && pageKey !== 'custom') {
      setJsonLd('ld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type':    'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteDomain },
          { '@type': 'ListItem', 'position': 2, 'name': title,  'item': pageUrl },
        ],
      });
    } else {
      removeJsonLd('ld-breadcrumb');
    }

    // ── Google Analytics ─────────────────────────────────────
    if (gaId) injectGA(gaId);

  }, [c, pageKey, custom?.title, custom?.description, custom?.keywords, custom?.image, custom?.url]);
}
