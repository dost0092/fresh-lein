import { useEffect } from 'react';
import { COMPANY } from '@/data/company';

const SITE_NAME = COMPANY.name;
const BASE_URL = (COMPANY.website || 'https://freshlien.com').replace(/\/$/, '');
const DEFAULT_IMAGE = `${BASE_URL}/hero-foreclosure.png`;
const SEO_ATTR = 'data-seo-managed';

function upsertMeta({ name, property, content }) {
  if (!content) return;
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (name) el.setAttribute('name', name);
    if (property) el.setAttribute('property', property);
    el.setAttribute(SEO_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(SEO_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Dependency-free SEO/AEO head manager.
 * Sets title, description, canonical, Open Graph, Twitter, and JSON-LD.
 * `jsonLd` may be a single object or an array of schema.org objects.
 */
export default function Seo({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noIndex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${COMPANY.tagline}`;
    const canonical = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/$/, '') || BASE_URL;

    document.title = fullTitle;

    upsertMeta({ name: 'description', content: description });
    upsertMeta({ name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' });
    upsertLink('canonical', canonical);

    upsertMeta({ property: 'og:site_name', content: SITE_NAME });
    upsertMeta({ property: 'og:title', content: fullTitle });
    upsertMeta({ property: 'og:description', content: description });
    upsertMeta({ property: 'og:type', content: type });
    upsertMeta({ property: 'og:url', content: canonical });
    upsertMeta({ property: 'og:image', content: image });

    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta({ name: 'twitter:title', content: fullTitle });
    upsertMeta({ name: 'twitter:description', content: description });
    upsertMeta({ name: 'twitter:image', content: image });

    const scriptId = 'seo-jsonld';
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      script.setAttribute(SEO_ATTR, 'true');
      script.text = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, path, image, type, jsonLd, noIndex]);

  return null;
}

export { BASE_URL, SITE_NAME, DEFAULT_IMAGE };
