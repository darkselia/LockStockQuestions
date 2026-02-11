function resolveSiteOrigin() {
  const envOrigin = (import.meta.env?.VITE_SITE_URL ?? '').trim();
  const runtimeOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  const fallbackOrigin = 'https://darkselia.github.io/LockStockQuestions';
  const rawOrigin = envOrigin || runtimeOrigin || fallbackOrigin;
  return rawOrigin.replace(/\/$/, '');
}

export const SITE_ORIGIN = resolveSiteOrigin();
export const SITE_NAME = 'Лок Сток Вопросы';
export const DEFAULT_TITLE = 'Каталог вопросов из шоу «Лок Сток. Ставка на знания»';
export const DEFAULT_DESCRIPTION = 'Неофициальный каталог вопросов и ответов из шоу «Лок Сток. Ставка на знания».' +
  ' Вопросы собраны по выпускам для удобного поиска.';
export const DEFAULT_IMAGE_PATH = '/cards.webp';

export function buildAbsoluteUrl(path = '/') {
  if (!path) {
    return SITE_ORIGIN;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}
