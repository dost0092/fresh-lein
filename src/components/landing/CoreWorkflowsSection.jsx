import { Search, Map, FileText, Bell, Download, Briefcase } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { CORE_WORKFLOWS } from '@/data/marketingContent';

const ICONS = [Search, Map, FileText, Bell, Download, Briefcase];

export default function CoreWorkflowsSection() {
  return (
    <section id="workflows" className="border-y border-border bg-slate-50/60 py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Workflows"
          title="From search to close"
          titleHighlight="in one platform"
          description="The investor journey: search → filter → inspect → alert → export → integrate."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_WORKFLOWS.map(({ title, description, status }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="rounded-xl border border-border/70 bg-white p-5 shadow-sm transition-colors hover:border-primary/20"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <StatusBadge status={status} />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
