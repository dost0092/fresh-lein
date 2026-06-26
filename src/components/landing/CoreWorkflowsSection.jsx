import { Search, Map, FileText, Bell, Download, Briefcase, Send } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import StatusBadge from '@/components/landing/StatusBadge';
import { CORE_WORKFLOWS } from '@/data/marketingContent';

const ICONS = [Send, Search, Map, FileText, Bell, Download, Briefcase];

export default function CoreWorkflowsSection() {
  return (
    <section id="workflows" className="fl-marketing-section-muted border-y">
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
              <div key={title} className="fl-card flex h-full flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <StatusBadge status={status} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
