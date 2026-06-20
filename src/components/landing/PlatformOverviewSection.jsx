import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Code2, Database } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { PLATFORM_SURFACES } from '@/data/marketingContent';

const ICONS = { web: Globe, api: Code2, export: Database };

export default function PlatformOverviewSection() {
  return (
    <section id="platform" className="bg-white py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Platform"
          title="Three ways to access"
          titleHighlight="distressed property data"
          description="One normalized dataset in the web app, through the API, or as bulk exports for your team."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {PLATFORM_SURFACES.map(({ id, title, description, href, status }) => {
            const Icon = ICONS[id];
            return (
              <Link
                key={id}
                to={href}
                className="group flex flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="icon-surface h-10 w-10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <StatusBadge status={status} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
