import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import {
  LandingContainer,
  LandingEyebrow,
  LandingSectionHeader,
  highlightMarkStyle,
} from '@/components/landing/LandingLayout';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { POSITIONING } from '@/data/sitePositioning';
import { SERVICE_PACKAGES } from '@/data/servicePackages';
import {
  SOLUTIONS,
  PAIN_POINTS,
  CORE_WORKFLOW,
  COMPARISON,
  BEFORE_AFTER,
  METRIC_CATEGORIES,
  USE_CASES,
  PROCESS_PHASES,
  TRUST_FEATURES,
  INTEGRATIONS,
  SITE_FAQS,
} from '@/data/solutionsContent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function AnnouncementBar() {
  const { announcement } = POSITIONING;
  return (
    <div className="border-b border-border/70 bg-fl-subtle">
      <LandingContainer className="py-2.5">
        <p className="text-center text-sm text-muted-foreground">
          {announcement.text}{' '}
          <Link to={announcement.href} className="font-semibold text-primary hover:underline">
            {announcement.linkLabel}
          </Link>
        </p>
      </LandingContainer>
    </div>
  );
}

function HeroFlowVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.10)]">
      <div className="flex items-center gap-2 border-b border-border/60 bg-fl-subtle px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>
        <p className="mx-auto text-[11px] text-muted-foreground">FreshLien operating flow</p>
      </div>
      <div className="space-y-2 p-4 sm:p-5">
        {POSITIONING.heroFlow.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <div className="flex-1 rounded-lg border border-border/70 bg-fl-subtle px-3 py-2.5 text-sm font-medium text-foreground">
              {label}
            </div>
            {i < POSITIONING.heroFlow.length - 1 && (
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary/40 sm:block" aria-hidden />
            )}
          </div>
        ))}
        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          {POSITIONING.flow.join(' → ')}
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_15%,rgba(19,81,51,0.07),transparent)]" />
      <LandingContainer className="relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <LandingEyebrow>Real estate data and workflow automation</LandingEyebrow>
            <h1 className="font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.6rem] lg:text-[3rem]">
              Turn fragmented property data into{' '}
              <span
                className="inline box-decoration-clone rounded-md px-1.5 py-0.5 text-primary"
                style={highlightMarkStyle}
              >
                qualified seller opportunities
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              FreshLien collects, cleans, enriches, and connects public records, property data, CRM
              workflows, follow-up, and offers—so your team spends more time speaking with sellers and
              less time managing spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={POSITIONING.primaryCta.href} className="fl-btn-primary h-11 px-6 text-[15px]">
                {POSITIONING.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={POSITIONING.secondaryCta.href}
                className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
              >
                {POSITIONING.secondaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Built for real estate investors, wholesalers, acquisition teams, and property operators.
            </p>
          </div>
          <HeroFlowVisual />
        </div>
      </LandingContainer>
    </section>
  );
}

function PainSection() {
  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          title="Your team should not spend its week"
          titleHighlight="fixing property data"
          description="Real estate teams lose hours downloading county files, cleaning spreadsheets, removing duplicates, researching properties, updating CRMs, chasing documents, and repeating the same follow-up tasks. FreshLien turns those manual steps into dependable workflows."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map((p) => (
            <div key={p.title} className="fl-card p-5">
              <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          title="From raw record to"
          titleHighlight="working opportunity"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_WORKFLOW.map((s) => (
            <div key={s.step} className="fl-card p-5">
              <p className="text-2xl font-bold text-primary/25">{s.step}</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/platform" className="fl-btn-primary px-5">
            Explore the Platform <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </LandingContainer>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section id="solutions" className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Solutions"
          title="One operational system across the"
          titleHighlight="real estate deal lifecycle"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <div key={s.id} className="fl-card fl-card-hover flex h-full flex-col p-6">
              <h3 className="text-lg font-semibold text-foreground">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-4 flex-1 space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={s.href} className="fl-link mt-5 inline-flex items-center gap-1">
                {s.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function WhySection() {
  const cols = [COMPARISON.vendor, COMPARISON.agency, COMPARISON.freshlien];
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          title="Not another generic CRM."
          titleHighlight="Not another raw data list."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {cols.map((col) => {
            const isFresh = col.title === 'FreshLien';
            return (
              <div
                key={col.title}
                className={
                  isFresh
                    ? 'rounded-xl border-2 border-primary/30 bg-white p-6 shadow-sm'
                    : 'fl-card p-6'
                }
              >
                <h3 className={`text-sm font-semibold ${isFresh ? 'text-primary' : 'text-foreground'}`}>
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      {isFresh ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader
          eyebrow="Services"
          title="Start with one bottleneck. Expand into a"
          titleHighlight="complete operating system"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {SERVICE_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="fl-card flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">{pkg.name}</h3>
                <p className="shrink-0 text-sm font-bold text-primary">{pkg.priceLabel}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{pkg.priceNote}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
              <ul className="mt-4 flex-1 space-y-1.5">
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <Link to={pkg.href} className="fl-btn-primary mt-5 w-full sm:w-auto">
                {pkg.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link to="/services" className="fl-link inline-flex items-center gap-1">
            See all services <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </LandingContainer>
    </section>
  );
}

function IntegrationsSection() {
  const groups = [
    { title: 'CRM', items: INTEGRATIONS.crm },
    { title: 'Communication', items: INTEGRATIONS.communication },
    { title: 'Data', items: INTEGRATIONS.data },
    { title: 'Documents', items: INTEGRATIONS.documents },
  ];
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          title="Works with the systems"
          titleHighlight="your team already uses"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {g.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border/80 bg-white px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Do not see your system? FreshLien can review API, file, email, and database integration options.
        </p>
      </LandingContainer>
    </section>
  );
}

function BeforeAfterSection() {
  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader title="What changes after" titleHighlight="FreshLien?" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="fl-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Before</h3>
            <ul className="mt-4 space-y-2.5">
              {BEFORE_AFTER.before.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-primary/25 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">After</h3>
            <ul className="mt-4 space-y-2.5">
              {BEFORE_AFTER.after.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          title="Measure the work your"
          titleHighlight="automation removes"
          description="Every implementation should have a baseline, a target, and ongoing operational reporting. FreshLien focuses on measurable improvements—not vague automation claims."
        />
        <div className="flex flex-wrap gap-2">
          {METRIC_CATEGORIES.map((m) => (
            <span
              key={m}
              className="rounded-full border border-border/80 bg-white px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {m}
            </span>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader title="Built around real" titleHighlight="operational problems" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="fl-card p-5">
              <h3 className="text-sm font-semibold text-foreground">{u.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/70">Problem: </span>
                {u.problem}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/70">Workflow: </span>
                {u.workflow}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-primary">Result: </span>
                {u.result}
              </p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader
          title="A controlled path from manual work to"
          titleHighlight="reliable automation"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_PHASES.map((p, i) => (
            <div key={p.title} className="fl-card p-5">
              <p className="text-xs font-bold text-primary/40">0{i + 1}</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/book-audit" className="fl-btn-primary px-5">
            Book Your Workflow Audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </LandingContainer>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="fl-marketing-section">
      <LandingContainer>
        <LandingSectionHeader title="Built for" titleHighlight="operational reliability" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_FEATURES.map((t) => (
            <div key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl rounded-lg border border-border/70 bg-fl-subtle p-4 text-xs leading-relaxed text-muted-foreground">
          {POSITIONING.disclaimer}
        </p>
      </LandingContainer>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="fl-marketing-section-muted">
      <LandingContainer>
        <LandingSectionHeader title="Common questions" />
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {SITE_FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </LandingContainer>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-b-0 bg-fl-subtle py-16 lg:py-20">
      <LandingContainer innerClassName="text-center">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Find the repetitive work hiding inside your real estate operation
        </h2>
        <p className="mx-auto mt-3 mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
          FreshLien will map your workflow, identify the highest-value automation opportunity, and
          show you what should be automated first.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-audit" className="fl-btn-primary px-6 py-2.5">
            Book a Workflow Audit <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="fl-btn-ghost px-6 py-2.5">
            Tell Us About Your Workflow
          </Link>
        </div>
      </LandingContainer>
    </section>
  );
}

export default function HomePageContent({ topSlot = null }) {
  return (
    <div className="fl-app">
      {topSlot}
      <AnnouncementBar />
      <HeroSection />
      <PainSection />
      <WorkflowSection />
      <SolutionsSection />
      <WhySection />
      <ServicesSection />
      <IntegrationsSection />
      <BeforeAfterSection />
      <MetricsSection />
      <UseCasesSection />
      <ProcessSection />
      <TrustSection />
      <FaqSection />
      <FinalCta />
      <MarketingFooter />
    </div>
  );
}
