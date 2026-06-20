import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const LOGO_SRC = '/freshlien-logo.png';
export const HOME_PATH = '/';

const SIZES = {
  nav: 'h-11 w-auto sm:h-12 md:h-14 lg:h-[3.25rem]',
  footer: 'h-9 w-auto sm:h-10',
  auth: 'h-10 w-auto sm:h-11',
  sidebar: 'h-9 w-auto max-w-[172px]',
  mobile: 'h-10 w-auto max-w-[180px] sm:h-11',
};

function LogoMark({ className, imgClassName }) {
  return (
    <span className={cn('inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-md sm:h-11 sm:w-11', className)}>
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden
        className={cn('block h-10 w-[10rem] max-w-none object-cover object-left sm:h-11', imgClassName)}
        draggable={false}
      />
    </span>
  );
}

export default function FreshLienLogo({
  to = HOME_PATH,
  variant = 'nav',
  className,
  imgClassName,
  onClick,
  onDark = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMark = variant === 'mark' || variant === 'icon';
  const isNav = variant === 'nav';

  const img = isMark ? (
    <LogoMark className={className} imgClassName={imgClassName} />
  ) : (
    <img
      src={LOGO_SRC}
      alt="FreshLien"
      width={isNav ? 220 : 170}
      height={isNav ? 52 : 42}
      className={cn('block max-w-none object-contain object-left', SIZES[variant] ?? SIZES.nav, className, imgClassName)}
      draggable={false}
    />
  );

  const wrapped = onDark ? (
    <span className="inline-flex rounded-lg bg-white/95 px-3 py-2 shadow-sm ring-1 ring-white/10">
      {img}
    </span>
  ) : (
    img
  );

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (location.pathname === to && !location.hash) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname === to && location.hash) {
      event.preventDefault();
      navigate(to, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={cn(
        'relative z-10 inline-flex shrink-0 items-center py-1 transition-opacity hover:opacity-90',
        isNav && '-ml-0.5 sm:-ml-1'
      )}
      aria-label="FreshLien home"
    >
      {wrapped}
    </Link>
  );
}
