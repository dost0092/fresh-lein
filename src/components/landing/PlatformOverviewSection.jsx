import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Code2, Database, Send } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { PLATFORM_SURFACES } from '@/data/marketingContent';

const ICONS = { crm: Send, web: Globe, api: Code2, export: Database };

export default function PlatformOverviewSection() {
  return (
    <section id="platform" className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Platform"
          title="Data and outreach"
          titleHighlight="in one place"
          description="Search live filings, export lists, connect the API, and reach property owners from your own inbox."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_SURFACES.map(({ id, title, description, href, status }) => {
            const Icon = ICONS[id];
            return (
              <Link
                key={id}
                to={href}
                className="fl-card fl-card-hover group flex flex-col p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <StatusBadge status={status} />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
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
