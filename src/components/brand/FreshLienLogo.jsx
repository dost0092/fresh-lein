import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const LOGO_SRC = '/freshlien-logo.png';

const VARIANTS = {
  nav: 'h-8 w-auto sm:h-9',
  footer: 'h-7 w-auto',
  auth: 'h-10 w-auto',
  sidebar: 'h-8 w-auto max-w-[148px]',
  mobile: 'h-7 w-auto max-w-[120px]',
  icon: 'h-9 w-9 object-cover object-left',
};

export default function FreshLienLogo({
  to,
  variant = 'nav',
  className,
  imgClassName,
  onClick,
}) {
  const img = (
    <span
      className={cn(
        'inline-flex shrink-0 items-center overflow-hidden rounded-md bg-[#0a0f0d]',
        className
      )}
    >
      <img
        src={LOGO_SRC}
        alt="FreshLien"
        width={160}
        height={40}
        className={cn('block', VARIANTS[variant] ?? VARIANTS.nav, imgClassName)}
        draggable={false}
      />
    </span>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="shrink-0 transition-opacity hover:opacity-90">
        {img}
      </Link>
    );
  }

  return img;
}
