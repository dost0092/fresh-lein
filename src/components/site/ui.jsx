import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Container({ className, children, size = 'default' }) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'default' && 'max-w-7xl',
        size === 'narrow' && 'max-w-4xl',
        size === 'wide' && 'max-w-[90rem]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({ className, children, id, tone = 'white' }) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 sm:py-24 lg:py-32',
        tone === 'paper' && 'bg-paper',
        tone === 'ink' && 'bg-ink text-white',
        className
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className, onDark }) {
  return (
    <p className={cn('site-eyebrow', onDark && 'text-white/60', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full bg-leaf-500', onDark && 'bg-white/50')} />
      {children}
    </p>
  );
}

/** `title` may include an `accent` phrase rendered in serif italic. */
export function SectionHeading({ eyebrow, title, accent, after, description, align = 'left', onDark, className, children }) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2 className={cn('site-h2 mt-4', onDark && '!text-white')}>
        {title}
        {accent && (
          <>
            {' '}
            <span className={cn('site-accent', onDark ? 'text-white/55' : 'text-ink-mute')}>{accent}</span>
          </>
        )}
        {after && <> {after}</>}
      </h2>
      {description && (
        <p className={cn('site-lead mt-5', onDark && '!text-white/65', align === 'center' && 'mx-auto max-w-2xl')}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

const BTN_VARIANTS = {
  primary: 'site-btn-primary',
  secondary: 'site-btn-secondary',
  zest: 'site-btn-zest',
  ghostDark: 'site-btn-ghost-dark',
};

export function ButtonLink({ to, href, variant = 'primary', arrow, className, children, ...rest }) {
  const cls = cn(BTN_VARIANTS[variant], 'group', className);
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {content}
    </Link>
  );
}

export function TextLink({ to, children, className, onDark }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-1.5 text-[15px] font-semibold',
        onDark ? 'text-white hover:text-white/70' : 'text-ink underline decoration-line underline-offset-4 hover:decoration-ink',
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export function IconTile({ icon: Icon, className, onDark, size = 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl',
        size === 'md' && 'h-12 w-12',
        size === 'sm' && 'h-10 w-10 rounded-xl',
        onDark ? 'bg-white/10 text-white ring-1 ring-white/10' : 'bg-paper text-ink-soft ring-1 ring-line',
        className
      )}
    >
      <Icon className={size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5'} strokeWidth={1.75} />
    </span>
  );
}

export function CheckList({ items, className, onDark, cols = 1 }) {
  return (
    <ul className={cn('grid gap-3', cols === 2 && 'sm:grid-cols-2', className)}>
      {items.map((item) => (
        <li key={item} className={cn('flex items-start gap-3 text-[15px] leading-relaxed', onDark ? 'text-white/75' : 'text-ink-soft')}>
          <span
            className={cn(
              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              onDark ? 'bg-white/15 text-white' : 'bg-leaf-100 text-leaf'
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Accordion({ items, className }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        return (
          <div key={q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-tight text-lg font-semibold tracking-[-0.01em] text-ink">{q}</span>
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                  isOpen ? 'border-ink bg-ink text-white' : 'border-line text-ink'
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <p className="overflow-hidden pr-14 text-[15px] leading-relaxed text-ink-soft">{a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PageHero({ eyebrow, title, accent, after, description, children, className }) {
  return (
    <section className={cn('relative overflow-hidden border-b border-line bg-paper', className)}>
      <div className="site-grid-bg site-fade-mask pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44">
        <Reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="site-display mt-5 max-w-4xl !text-[2.4rem] sm:!text-[3.4rem] lg:!text-[4rem]">
            {title}
            {accent && (
              <>
                {' '}
                <span className="site-accent text-ink-mute">{accent}</span>
              </>
            )}
            {after && <> {after}</>}
          </h1>
          {description && <p className="site-lead mt-6 max-w-2xl">{description}</p>}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
