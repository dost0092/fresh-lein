import { LandingContainer, highlightMarkStyle } from '@/components/landing/LandingLayout';

export default function MarketingPageHero({ eyebrow, title, titleHighlight, description, children }) {
  return (
    <section className="border-b border-border bg-white">
      <LandingContainer className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          )}
          <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span
                  className="inline box-decoration-clone rounded-sm px-1.5 py-0.5 text-primary"
                  style={highlightMarkStyle}
                >
                  {titleHighlight}
                </span>
              </>
            )}
          </h1>
          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {children}
        </div>
      </LandingContainer>
    </section>
  );
}
