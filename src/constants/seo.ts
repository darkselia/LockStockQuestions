export const SITE_ORIGIN = ((import.meta.env.VITE_SITE_URL ?? '').trim() ||
  'https://lockstock-fanvault.darkselia.ru/').replace(/\/+$/, '');
export const SITE_NAME = 'Лок Сток Игра Вопросы';
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
