import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const LOGO_SRC = '/freshlien-logo.png';

const SIZES = {
  nav: 'h-9 w-auto sm:h-10',
  footer: 'h-8 w-auto sm:h-9',
  auth: 'h-10 w-auto sm:h-11',
  sidebar: 'h-8 w-auto max-w-[152px]',
  mobile: 'h-8 w-auto max-w-[136px]',
};

function LogoMark({ className, imgClassName }) {
  return (
    <span className={cn('inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-md', className)}>
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden
        className={cn('block h-9 w-[10rem] max-w-none object-cover object-left', imgClassName)}
        draggable={false}
      />
    </span>
  );
}

export default function FreshLienLogo({
  to,
  variant = 'nav',
  className,
  imgClassName,
  onClick,
  onDark = false,
}) {
  const isMark = variant === 'mark' || variant === 'icon';

  const img = isMark ? (
    <LogoMark className={className} imgClassName={imgClassName} />
  ) : (
    <img
      src={LOGO_SRC}
      alt="FreshLien"
      width={170}
      height={42}
      className={cn('block', SIZES[variant] ?? SIZES.nav, className, imgClassName)}
      draggable={false}
    />
  );

  const wrapped = onDark ? (
    <span className="inline-flex rounded-lg bg-white px-3 py-1.5 shadow-sm">{img}</span>
  ) : (
    img
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
        aria-label="FreshLien home"
      >
        {wrapped}
      </Link>
    );
  }

  return wrapped;
}
