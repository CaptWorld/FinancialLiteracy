import { useEffect, useState } from 'preact/hooks';

export const parseHash = () => (location.hash.replace(/^#\/?/, '') || 'today').split('/').map(decodeURIComponent);

export function useRoute(): string[] {
  const [r, setR] = useState(parseHash());
  useEffect(() => {
    const f = () => { setR(parseHash()); window.scrollTo(0, 0); };
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return r;
}

export const go = (path: string) => { location.hash = '#/' + path; };
export const href = (path: string) => '#/' + path;
