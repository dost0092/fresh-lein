import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('h-8 w-8', className)} aria-hidden>
      <defs>
        <linearGradient id="fl-mark-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E9E66" />
          <stop offset="1" stopColor="#1F8A55" />
        </linearGradient>
        <linearGradient id="fl-mark-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F8A55" />
          <stop offset="1" stopColor="#176240" />
        </linearGradient>
      </defs>
      <path d="M6 14C6 7.4 11.4 2 18 2h18c0 6.6-5.4 12-12 12H6Z" fill="url(#fl-mark-a)" />
      <path d="M6 26c0-5.5 4.5-10 10-10h14c0 5.5-4.5 10-10 10H6Z" fill="url(#fl-mark-b)" />
      <path d="M6 14h6v18c0 3.3-2.7 6-6 6V14Z" fill="#135133" />
      <g fill="#1F8A55">
        <rect x="16" y="29" width="3.2" height="3.2" rx="0.6" />
        <rect x="20.2" y="29" width="3.2" height="3.2" rx="0.6" />
        <rect x="16" y="33.2" width="3.2" height="3.2" rx="0.6" />
        <rect x="20.2" y="33.2" width="3.2" height="3.2" rx="0.6" />
      </g>
    </svg>
  );
}

export default function SiteLogo({ onDark, className, to = '/' }) {
  const location = useLocation();
  return (
    <Link
      to={to}
      aria-label="FreshLien home"
      onClick={(e) => {
        if (location.pathname === to) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className={cn('inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90', className)}
    >
      <LogoMark />
      <span className={cn('font-tight text-[1.3rem] font-bold tracking-[-0.035em]', onDark ? 'text-white' : 'text-ink')}>
        Fresh<span className={onDark ? 'text-leaf-300' : 'text-leaf-500'}>Lien</span>
      </span>
    </Link>
  );
}
