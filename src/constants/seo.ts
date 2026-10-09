export const SITE_ORIGIN = ((import.meta.env.VITE_SITE_URL ?? '').trim() ||
  'https://lockstock-fanvault.darkselia.ru/').replace(/\/+$/, '');
export const SITE_NAME = 'Фанатское хранилище вопросов «Лок Сток»';
export const DEFAULT_TITLE = SITE_NAME;
export const DEFAULT_DESCRIPTION = 'Вопросы, подсказки и ответы для игры «Лок Сток»,' +
  ' собранные по выпускам для удобного поиска.';
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
