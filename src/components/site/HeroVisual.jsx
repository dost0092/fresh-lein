import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BrainCircuit, Check, FileText, HardHat, LandPlot, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Deterministic pseudo-random so the map renders identically every load. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useParcels() {
  return useMemo(() => {
    const rand = rng(42);
    const lots = [];
    const W = 640;
    const H = 420;
    const blockW = 120;
    const blockH = 92;
    const road = 14;
    for (let by = 0; by * (blockH + road) < H; by += 1) {
      for (let bx = 0; bx * (blockW + road) < W; bx += 1) {
        const x0 = bx * (blockW + road) + (by % 2 ? -30 : 0);
        const y0 = by * (blockH + road);
        const cols = 3 + Math.floor(rand() * 3);
        const lotW = blockW / cols;
        for (let r = 0; r < 2; r += 1) {
          for (let c = 0; c < cols; c += 1) {
            const roll = rand();
            lots.push({
              x: x0 + c * lotW + 1,
              y: y0 + r * (blockH / 2) + 1,
              w: lotW - 2,
              h: blockH / 2 - 2,
              kind: roll > 0.94 ? 'hot' : roll > 0.86 ? 'match' : roll > 0.8 ? 'permit' : 'base',
            });
          }
        }
      }
    }
    return lots;
  }, []);
}

function Float({ children, className, delay = 0, drift = 6 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn('absolute', className)}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
      animate={reduce ? undefined : { opacity: 1, y: [0, -drift, 0], scale: 1 }}
      transition={
        reduce
          ? undefined
          : {
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.5, delay },
              y: { duration: 6, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
            }
      }
    >
      {children}
    </motion.div>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-white/95 p-3.5 shadow-[0_20px_40px_-20px_rgba(11,26,19,0.35)] backdrop-blur',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardLabel({ icon: Icon, children, tone = 'leaf' }) {
  return (
    <p className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-mute">
      <span
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-md',
          tone === 'leaf' && 'bg-leaf-50 text-leaf',
          tone === 'zest' && 'bg-zest-soft text-ink',
          tone === 'ink' && 'bg-ink text-zest'
        )}
      >
        <Icon className="h-3 w-3" />
      </span>
      {children}
    </p>
  );
}

const LOT_FILL = {
  base: '#EEF2EC',
  match: '#B9E2C8',
  permit: '#EEFBC4',
  hot: '#1F8A55',
};

export default function HeroVisual() {
  const lots = useParcels();

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Main console */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_40px_80px_-40px_rgba(11,26,19,0.45)]">
        <div className="flex items-center justify-between border-b border-line bg-paper/80 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
          </div>
          <p className="font-mono text-[10.5px] text-ink-mute">your-workspace / acquisitions / map</p>
          <span className="rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-wider text-leaf">
            Live
          </span>
        </div>

        <div className="relative aspect-[640/420] bg-[#F6F8F3]">
          <svg viewBox="0 0 640 420" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect width="640" height="420" fill="#DDE4DA" />
            {lots.map((l, i) => (
              <rect
                key={i}
                x={l.x}
                y={l.y}
                width={Math.max(l.w, 0)}
                height={l.h}
                rx="2"
                fill={LOT_FILL[l.kind]}
                stroke={l.kind === 'hot' ? '#135133' : '#FFFFFF'}
                strokeWidth={l.kind === 'hot' ? 1.5 : 1}
              />
            ))}
            <path d="M0 300 C 160 260, 300 340, 640 250" stroke="#C9D7E8" strokeWidth="16" fill="none" opacity="0.9" />
          </svg>

          {/* Pin */}
          <div className="absolute left-[46%] top-[38%]">
            <span className="absolute -left-3 -top-3 h-6 w-6 animate-pulse-ring rounded-full bg-leaf-500/50" />
            <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-ink shadow" />
          </div>

          <span className="absolute bottom-3 right-3 hidden rounded-full bg-white/80 px-2 py-1 font-mono text-[9px] sm:block uppercase tracking-[0.14em] text-ink-mute">
            Illustrative · sample data
          </span>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 hidden flex-wrap gap-1.5 sm:flex">
            {[
              ['#1F8A55', 'High score'],
              ['#B9E2C8', 'Buy box match'],
              ['#EEFBC4', 'Recent permit'],
            ].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-ink-soft shadow-sm">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: c }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <Float className="-left-3 top-16 w-[220px] sm:-left-10 lg:-left-6 xl:-left-12" delay={0.2}>
        <Card>
          <CardLabel icon={FileText}>New filing · 2m ago</CardLabel>
          <p className="mt-2 text-[13px] font-semibold text-ink">Lis pendens recorded</p>
          <p className="text-[11.5px] text-ink-mute">1418 Alder St · Owner: estate</p>
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-leaf-50 px-2 py-1.5 text-[11px] font-medium text-leaf">
            <Check className="h-3 w-3" strokeWidth={3} /> Enriched &amp; pushed to CRM
          </div>
        </Card>
      </Float>

      <Float className="-right-3 top-6 hidden w-[200px] sm:block sm:-right-10 lg:-right-16" delay={0.45} drift={8}>
        <Card>
          <CardLabel icon={LandPlot} tone="zest">Zoning</CardLabel>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px]">
            <span className="text-ink-mute">District</span>
            <span className="text-right font-semibold text-ink">R-2</span>
            <span className="text-ink-mute">Max FAR</span>
            <span className="text-right font-semibold text-ink">0.60</span>
            <span className="text-ink-mute">ADU</span>
            <span className="text-right font-semibold text-leaf">Allowed</span>
            <span className="text-ink-mute">Est. units</span>
            <span className="text-right font-semibold text-ink">4</span>
          </div>
        </Card>
      </Float>

      <Float className="-bottom-10 -left-2 w-[210px] sm:-left-10 lg:-left-6 xl:-left-12" delay={0.7} drift={5}>
        <Card>
          <CardLabel icon={BrainCircuit} tone="ink">Seller score</CardLabel>
          <div className="mt-2 flex items-end justify-between">
            <p className="font-tight text-3xl font-bold tracking-tight text-ink">87</p>
            <p className="pb-1 text-[11px] text-ink-mute">top 3% in ZIP</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
            <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-leaf-300 to-leaf" />
          </div>
        </Card>
      </Float>

      <Float className="-bottom-14 right-2 hidden w-[230px] sm:block sm:-right-8 lg:-right-12" delay={0.95} drift={7}>
        <Card>
          <CardLabel icon={Megaphone}>Buyer campaign</CardLabel>
          <div className="mt-2 flex items-end gap-1">
            {[18, 26, 22, 34, 30, 44, 40, 52, 48, 60].map((h, i) => (
              <span key={i} className="w-full rounded-sm bg-leaf/80" style={{ height: `${h * 0.6}px` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px]">
            <span className="text-ink-mute">Replies this week</span>
            <span className="font-semibold text-ink">+38</span>
          </div>
        </Card>
      </Float>

      <Float className="right-[18%] top-[46%] hidden md:block" delay={1.2} drift={4}>
        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-medium text-ink shadow-lg">
          <HardHat className="h-3.5 w-3.5 text-leaf" />
          Roof permit filed · 3 days ago
        </div>
      </Float>

      <div className="h-14 sm:h-16" aria-hidden />
    </div>
  );
}
