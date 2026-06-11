import { LandingContainer } from '@/components/landing/LandingLayout';

export default function LegalDocument({ title, updated, children }) {
  return (
    <section className="py-10 lg:py-14">
      <LandingContainer>
        <article className="mx-auto max-w-3xl">
          <header className="mb-8 border-b border-border pb-6">
            <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
            {updated && <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>}
          </header>
          <div className="prose-legal space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline">
            {children}
          </div>
        </article>
      </LandingContainer>
    </section>
  );
}
