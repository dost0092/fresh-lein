import { LandingContainer } from '@/components/landing/LandingLayout';

export default function MarketingPageHero({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-primary/[0.05] via-white to-white">
      <LandingContainer className="py-10 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          )}
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {children}
        </div>
      </LandingContainer>
    </section>
  );
}
