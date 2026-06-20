import { Link } from 'react-router-dom';
import { Key, Database, FileDown, Bell, Briefcase, Headphones } from 'lucide-react';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import { CONTACT_MAILTO_SUBJECT } from '@/data/company';
import { ENTERPRISE_FEATURES } from '@/data/marketingContent';

const ICONS = [Key, Database, FileDown, Bell, Briefcase, Headphones];

export default function EnterpriseFeaturesSection() {
  return (
    <section id="enterprise" className="bg-white py-11 lg:py-14">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Enterprise"
          title="Scale distressed intelligence"
          titleHighlight="across your organization"
          description="API keys, warehouse feeds, portfolio monitoring, and dedicated support for data teams and servicers."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTERPRISE_FEATURES.map(({ title, description }, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-white p-5 transition-colors hover:border-primary/20"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <a href={CONTACT_MAILTO_SUBJECT('FreshLien Enterprise inquiry')}>Contact sales</a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/api">View API docs</Link>
          </Button>
        </div>
      </LandingContainer>
    </section>
  );
}
