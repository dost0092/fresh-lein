import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import SocialLinks from '@/components/brand/SocialLinks';
import { COMPANY, SOCIAL_LINKS } from '@/data/company';

function CodeBlock({ children }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
      <code>{children}</code>
    </pre>
  );
}

function Section({ title, children }) {
  return (
    <section className="py-10">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-4 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

export default function ApiDocsPage() {
  const { apiBaseUrl, contactEmail, website } = COMPANY;

  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow="API"
        title="FreshLien Data API"
        description="Fast foreclosure data for your applications, underwriting, and lead pipelines."
      />

      <LandingContainer>
        <div className="mx-auto max-w-3xl divide-y divide-border">
          <Section title="Authentication">
            <p>
              All endpoints require an API key via the <strong>x-api-key</strong> header.
              Contact <strong>{contactEmail}</strong> to get a key.
            </p>
            <CodeBlock>{`x-api-key: YOUR_API_KEY`}</CodeBlock>
          </Section>

          <Section title="Base URL">
            <p>
              All API requests use the FreshLien production base URL:
            </p>
            <CodeBlock>{apiBaseUrl}</CodeBlock>
            <p>
              Live documentation: <strong>{website}/api</strong>
            </p>
          </Section>

          <Section title="Health check">
            <CodeBlock>{`GET /api/health`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  ${apiBaseUrl}/health`}</CodeBlock>
          </Section>

          <Section title="Counties">
            <CodeBlock>{`GET /api/counties`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  ${apiBaseUrl}/counties`}</CodeBlock>
          </Section>

          <Section title="Foreclosures (list / search)">
            <CodeBlock>{`GET /api/foreclosures`}</CodeBlock>
            <p className="text-sm">
              Query parameters:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>q</strong>: search address/city/defendant/plaintiff/sheriff #/parcel</li>
              <li><strong>state</strong>: two-letter state (e.g. NJ)</li>
              <li><strong>status</strong>: exact status (e.g. Scheduled)</li>
              <li><strong>county_id</strong>: UUID from <code>/api/counties</code></li>
              <li><strong>date_from</strong>, <strong>date_to</strong>: YYYY-MM-DD sale_date range</li>
              <li><strong>limit</strong>: 1–500 (default 50)</li>
              <li><strong>offset</strong>: pagination offset (default 0)</li>
            </ul>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  "${apiBaseUrl}/foreclosures?state=NJ&status=Scheduled&limit=50&offset=0"`}</CodeBlock>
          </Section>

          <Section title="Foreclosures (detail)">
            <CodeBlock>{`GET /api/foreclosures/:id`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  ${apiBaseUrl}/foreclosures/RECORD_UUID`}</CodeBlock>
          </Section>

          <Section title="Performance notes">
            <ul className="list-disc space-y-1 pl-5">
              <li>Responses are kept lean (no heavy joins on list).</li>
              <li>Use <strong>limit + offset</strong> for pagination.</li>
              <li>Detail endpoint returns county + status history.</li>
            </ul>
          </Section>

          <Section title="Support">
            <p>
              Email <strong>{contactEmail}</strong> for API keys, integration help, or enterprise access.
            </p>
            <p>Follow FreshLien for product updates:</p>
            <ul className="list-disc space-y-1 pl-5">
              {SOCIAL_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <SocialLinks className="pt-1" />
          </Section>
        </div>
      </LandingContainer>
    </MarketingPageShell>
  );
}
