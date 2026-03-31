export const APP_SECTIONS = ['about', 'projects', 'study'] as const;
export type AppSection = (typeof APP_SECTIONS)[number];

function stripBasePath(pathname: string): string {
  const base = import.meta.env.BASE_URL;
  if (base === '/') return pathname;
  const root = base.replace(/\/$/, '');
  if (pathname === root) return '/';
  if (pathname.startsWith(`${root}/`)) {
    return pathname.slice(root.length) || '/';
  }
  return pathname;
}

/** 첫 경로 세그먼트 → 섹션. 없거나 알 수 없으면 null (404). */
export function sectionFromPathname(pathname: string): AppSection | null {
  const p = stripBasePath(pathname);
  const seg = p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)[0] ?? '';
  if (!seg) return 'about';
  if (seg === 'about') return 'about';
  if ((APP_SECTIONS as readonly string[]).includes(seg)) return seg as AppSection;
  return null;
}

export function pathnameForSection(section: AppSection): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  if (section === 'about') return base;
  return `${base}${section}`;
}

export function projectSlugFromPathname(pathname: string): string | null {
  const p = stripBasePath(pathname);
  const segments = p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments[0] !== 'projects') return null;
  const slug = segments[1];
  return slug ? decodeURIComponent(slug) : null;
}

export function pathnameForProjectSlug(slug: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}projects/${encodeURIComponent(slug)}`;
}
