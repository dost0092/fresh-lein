import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonLink, CheckList, IconTile, Reveal } from '@/components/site/ui';
import {
  ENGAGEMENTS,
  PROCESS,
  SOLUTIONS,
  STACK,
  TRUSTED_BY,
  getService,
} from '@/data/siteContent';

export function ServiceCard({ service, index = 0, className }) {
  return (
    <Reveal delay={(index % 4) * 0.06} className={cn('h-full', className)}>
      <Link
        to={`/services/${service.slug}`}
        className="site-card site-card-hover group flex h-full flex-col p-7"
      >
        <div className="flex items-start justify-between">
          <IconTile icon={service.icon} />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute">{service.category}</span>
        </div>
        <h3 className="site-h3 mt-8">{service.name}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{service.short}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf transition-colors group-hover:text-ink">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Reveal>
  );
}

export function StackMarquee({ label = 'We build on and integrate with the tools you already use' }) {
  const hasClients = TRUSTED_BY.length > 0;
  const items = hasClients ? TRUSTED_BY : STACK;
  const row = [...items, ...items];
  return (
    <div className="border-y border-line bg-white py-10">
      <p className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
        {hasClients ? 'Trusted by real estate teams at' : label}
      </p>
      <div className="site-marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-tight text-xl font-semibold tracking-[-0.02em] text-ink/35 transition-colors hover:text-ink"
              aria-hidden={i >= items.length}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AudienceExplorer() {
  const [active, setActive] = useState(0);
  const sol = SOLUTIONS[active];

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0" role="tablist">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            return (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all lg:w-full',
                  isActive ? 'bg-white text-ink shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-leaf' : 'text-white/40')} strokeWidth={1.75} />
                <span className="whitespace-nowrap text-[15px] font-semibold">{s.name}</span>
                <ArrowRight className={cn('ml-auto hidden h-4 w-4 lg:block', isActive ? 'opacity-100' : 'opacity-0')} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={sol.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 p-7 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-leaf-500/30 blur-3xl" aria-hidden />
            <p className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-zest">For {sol.name}</p>
            <h3 className="relative mt-4 font-tight text-2xl font-semibold leading-tight tracking-[-0.02em] !text-white sm:text-[2rem]">
              {sol.headline}
            </h3>

            <div className="relative mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-white/50">What gets in the way</p>
                <ul className="mt-4 space-y-3">
                  {sol.pains.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-white/60">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50">What we build</p>
                <CheckList items={sol.builds} onDark className="mt-4" />
              </div>
            </div>

            <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div className="flex flex-wrap gap-2">
                {sol.services.slice(0, 3).map((slug) => (
                  <Link
                    key={slug}
                    to={`/services/${slug}`}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-zest hover:text-zest"
                  >
                    {getService(slug)?.name}
                  </Link>
                ))}
              </div>
              <Link
                to={`/solutions/${sol.slug}`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-zest hover:text-white"
              >
                See the full solution
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ProcessSteps({ compact = false }) {
  return (
    <ol className={cn('grid gap-4', compact ? 'md:grid-cols-5' : 'md:grid-cols-2 lg:grid-cols-5')}>
      {PROCESS.map((p, i) => (
        <Reveal key={p.step} delay={i * 0.07} as="li" className="relative">
          <div className="site-card h-full p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium text-leaf">{p.step}</span>
              <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                {p.duration}
              </span>
            </div>
            <h3 className="site-h3 mt-8 !text-lg">{p.title}</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{p.body}</p>
          </div>
          {i < PROCESS.length - 1 && (
            <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-mute lg:inline-flex">
              <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

export function EngagementCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {ENGAGEMENTS.map((e, i) => (
        <Reveal key={e.name} delay={i * 0.08} className="h-full">
          <div
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8',
              e.featured ? 'bg-ink text-white' : 'border border-line bg-white'
            )}
          >
            {e.featured && (
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-leaf-500/40 blur-3xl" aria-hidden />
            )}
            <div className="relative flex items-center justify-between">
              <span
                className={cn(
                  'rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em]',
                  e.featured ? 'bg-zest text-ink' : 'bg-paper text-ink-mute'
                )}
              >
                {e.tagline}
              </span>
              <span className={cn('text-sm', e.featured ? 'text-white/60' : 'text-ink-mute')}>{e.duration}</span>
            </div>
            <h3 className={cn('relative mt-8 font-tight text-3xl font-semibold tracking-[-0.025em]', e.featured && '!text-white')}>
              {e.name}
            </h3>
            <p className={cn('relative mt-4 text-[15px] leading-relaxed', e.featured ? 'text-white/70' : 'text-ink-soft')}>
              {e.body}
            </p>
            <div className={cn('relative my-8 h-px', e.featured ? 'bg-white/10' : 'bg-line')} />
            <CheckList items={e.includes} onDark={e.featured} className="relative flex-1 content-start" />
            <ButtonLink
              to={`/book-audit?engagement=${encodeURIComponent(e.name)}`}
              variant={e.featured ? 'zest' : 'secondary'}
              arrow
              className="relative mt-10 w-full"
            >
              {e.cta}
            </ButtonLink>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ExampleCard({ example, index = 0, expanded = false }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <article className="site-card flex h-full flex-col overflow-hidden">
        <div className="relative h-40 overflow-hidden border-b border-line bg-paper">
          <div className="site-grid-bg absolute inset-0 opacity-80" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            {example.services.map((slug, i) => {
              const s = getService(slug);
              if (!s) return null;
              const Icon = s.icon;
              return (
                <span
                  key={slug}
                  className={cn(
                    'inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ring-1',
                    i === 0 ? 'bg-ink text-zest ring-ink' : 'bg-white text-leaf ring-line'
                  )}
                  title={s.name}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
              );
            })}
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute shadow-sm">
            {example.audience}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="site-h3">{example.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{example.problem}</p>
          {expanded && (
            <>
              <p className="mt-6 text-sm font-semibold text-ink">What we build</p>
              <CheckList items={example.built} className="mt-3" />
            </>
          )}
          <div className="mt-auto pt-6">
            <p className="rounded-2xl bg-leaf-50 p-4 text-[14.5px] font-medium leading-relaxed text-leaf">{example.outcome}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
