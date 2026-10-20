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
    <p className={cn('site-eyebrow', onDark && 'text-white/55', className)}>
      <span
        className={cn('h-[5px] w-[5px] rotate-45 rounded-[1px] bg-leaf-500', onDark && 'bg-leaf-300')}
        aria-hidden
      />
      {children}
    </p>
  );
}

/** Two-sentence headlines read best with the second sentence on its own line. */
const endsSentence = (t) => typeof t === 'string' && /[.!?]$/.test(t.trim());

/** `title` may include an `accent` phrase rendered in a quieter tone. */
export function SectionHeading({ eyebrow, title, accent, after, description, align = 'left', onDark, className, children }) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2 className={cn('site-h2 mt-5', onDark && '!text-white')}>
        {title}
        {accent && (
          <>
            {' '}
            <span className={cn('site-accent', onDark ? '!text-white/45' : '', endsSentence(title) && 'sm:block')}>{accent}</span>
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
        onDark ? 'text-white hover:text-white/70' : 'text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:decoration-ink',
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Soft fade-up on first view. Kept short and subtle so fast scrolling never
 * lands on a half-empty section.
 */
export function Reveal({ children, className, delay = 0, y = 12, as = 'div' }) {
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
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.45, delay: Math.min(delay, 0.2), ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/**
 * Icon in a crisp, slightly raised tile. Pairs with the custom glyph set in
 * `Glyphs.jsx`. `interactive` flips the tile to night green with a mint
 * accent when a parent `.group` is hovered; `active` holds that state.
 */
export function IconTile({ icon: Icon, className, onDark, size = 'md', interactive, active }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center transition-[background-color,box-shadow,color] duration-300 ease-out-expo',
        size === 'lg' && 'h-14 w-14 rounded-[16px]',
        size === 'md' && 'h-12 w-12 rounded-[14px]',
        size === 'sm' && 'h-10 w-10 rounded-xl',
        onDark || active
          ? 'bg-night text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(6,18,13,1),0_6px_14px_-6px_rgba(6,18,13,0.6)] [--glyph-accent:#6CD6A3]'
          : 'bg-white text-ink shadow-[inset_0_-1px_0_rgba(10,13,12,0.06),0_0_0_1px_rgba(10,13,12,0.09),0_1px_2px_rgba(10,13,12,0.06)]',
        interactive &&
          !active &&
          'group-hover:bg-night group-hover:text-white group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(6,18,13,1),0_6px_14px_-6px_rgba(6,18,13,0.6)] group-hover:[--glyph-accent:#6CD6A3]',
        onDark && '!bg-white/[0.06] !shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]',
        className
      )}
    >
      <Icon
        className={size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'}
        strokeWidth={1.5}
      />
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
              'mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full',
              onDark ? 'bg-white/10 text-leaf-300 ring-1 ring-inset ring-white/10' : 'bg-leaf-50 text-leaf-500 ring-1 ring-inset ring-leaf-100'
            )}
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3.25} />
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
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-tight text-[17px] font-semibold tracking-[-0.015em] text-ink transition-colors group-hover:text-ink-soft sm:text-lg">
                {q}
              </span>
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                  isOpen ? 'rotate-180 border-ink bg-ink text-white' : 'border-line-strong text-ink-mute group-hover:border-ink/30 group-hover:text-ink'
                )}
              >
                {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
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
      <div className="site-grid-bg site-fade-b pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        aria-hidden
      />
      <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44">
        <Reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="site-display mt-6 max-w-4xl !text-[2.4rem] sm:!text-[3.25rem] lg:!text-[3.75rem]">
            {title}
            {accent && (
              <>
                {' '}
                <span className={cn('site-accent', endsSentence(title) && 'sm:block')}>{accent}</span>
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
