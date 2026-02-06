import { toValue, watchEffect } from 'vue';
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE_PATH, DEFAULT_TITLE, SITE_NAME, buildAbsoluteUrl } from '@/constants/seo';

type SeoMetaInput = {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'FAQPage';
  locale?: string;
};

export function useSeoMeta(input: SeoMetaInput | (() => SeoMetaInput)) {
  if (typeof document === 'undefined') {
    return;
  }

  watchEffect(() => {
    const meta = toValue(input) ?? {};
    const title = meta.title ?? DEFAULT_TITLE;
    const description = meta.description ?? DEFAULT_DESCRIPTION;
    const canonical = meta.canonical ? buildAbsoluteUrl(meta.canonical) : buildAbsoluteUrl('/');
    const image = meta.image ? buildAbsoluteUrl(meta.image) : buildAbsoluteUrl(DEFAULT_IMAGE_PATH);
    const ogType = meta.type ?? 'website';
    const locale = meta.locale ?? 'ru_RU';

    document.title = title;
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', 'index, follow');

    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:site_name', SITE_NAME);
    updateMeta('property', 'og:url', canonical);
    updateMeta('property', 'og:image', image);
    updateMeta('property', 'og:locale', locale);
  });
}

function updateMeta(selectorAttr: 'name' | 'property', selectorValue: string, content: string) {
  const selector = `meta[${selectorAttr}="${selectorValue}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.setAttribute('content', content);
    return;
  }

  const element = document.createElement('meta');
  element.setAttribute(selectorAttr, selectorValue);
  element.setAttribute('content', content);
  document.head.appendChild(element);
}

