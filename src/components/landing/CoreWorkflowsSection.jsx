import { Search, Map, FileText, Bell, Download, Briefcase } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { CORE_WORKFLOWS } from '@/data/marketingContent';

const ICONS = [Search, Map, FileText, Bell, Download, Briefcase];

export default function CoreWorkflowsSection() {
  return (
    <section id="workflows" className="border-y border-border bg-[#FAFAFA] py-14 lg:py-20">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Workflows"
          title="From search to close"
          titleHighlight="in one platform"
          description="Search, filter, inspect a property, set alerts, export, or plug in the API."
        />

        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_WORKFLOWS.map(({ title, description, status }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="flex h-full flex-col rounded-lg border border-border/80 bg-white p-6 shadow-card"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="icon-surface h-10 w-10 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <StatusBadge status={status} />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
