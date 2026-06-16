import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { COMPANY } from '@/data/company';

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
              Contact <strong>{COMPANY.contactEmail}</strong> to get a key.
            </p>
            <CodeBlock>{`x-api-key: YOUR_API_KEY`}</CodeBlock>
          </Section>

          <Section title="Base URL">
            <p>
              Use your Vercel domain as the base URL. Example:
            </p>
            <CodeBlock>{`https://YOUR-APP.vercel.app/api`}</CodeBlock>
          </Section>

          <Section title="Health check">
            <CodeBlock>{`GET /api/health`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  https://YOUR-APP.vercel.app/api/health`}</CodeBlock>
          </Section>

          <Section title="Counties">
            <CodeBlock>{`GET /api/counties`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  https://YOUR-APP.vercel.app/api/counties`}</CodeBlock>
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
  "https://YOUR-APP.vercel.app/api/foreclosures?state=NJ&status=Scheduled&limit=50&offset=0"`}</CodeBlock>
          </Section>

          <Section title="Foreclosures (detail)">
            <CodeBlock>{`GET /api/foreclosures/:id`}</CodeBlock>
            <CodeBlock>{`curl -s \\
  -H "x-api-key: YOUR_API_KEY" \\
  https://YOUR-APP.vercel.app/api/foreclosures/RECORD_UUID`}</CodeBlock>
          </Section>

          <Section title="Performance notes">
            <ul className="list-disc space-y-1 pl-5">
              <li>Responses are kept lean (no heavy joins on list).</li>
              <li>Use <strong>limit + offset</strong> for pagination.</li>
              <li>Detail endpoint returns county + status history.</li>
            </ul>
          </Section>
        </div>
      </LandingContainer>
    </MarketingPageShell>
  );
}

