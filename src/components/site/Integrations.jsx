import {
  siApacheairflow,
  siArcgis,
  siClaude,
  siDbt,
  siGooglebigquery,
  siGooglesheets,
  siHubspot,
  siLooker,
  siMake,
  siMapbox,
  siN8n,
  siOpenai,
  siPostgresql,
  siPython,
  siRetool,
  siSalesforce,
  siSlack,
  siSnowflake,
  siSupabase,
  siTwilio,
  siZapier,
} from 'simple-icons';
import { cn } from '@/lib/utils';
import { Container, Reveal, SectionHeading } from '@/components/site/ui';
import { TRUSTED_BY } from '@/data/siteContent';

/** `icon` is a simple-icons entry; `mono` is used for tools simple-icons does not ship. */
const TOOLS = {
  hubspot: { name: 'HubSpot', icon: siHubspot },
  salesforce: { name: 'Salesforce', icon: siSalesforce },
  fub: { name: 'Follow Up Boss', mono: 'FUB', color: '#1E66F5' },
  ghl: { name: 'GoHighLevel', mono: 'GHL', color: '#155EEF' },
  podio: { name: 'Podio', mono: 'P', color: '#3D9CD7' },
  snowflake: { name: 'Snowflake', icon: siSnowflake },
  bigquery: { name: 'BigQuery', icon: siGooglebigquery },
  postgres: { name: 'Postgres', icon: siPostgresql },
  supabase: { name: 'Supabase', icon: siSupabase },
  dbt: { name: 'dbt', icon: siDbt },
  airflow: { name: 'Airflow', icon: siApacheairflow },
  claude: { name: 'Claude', icon: siClaude },
  openai: { name: 'OpenAI', icon: siOpenai },
  python: { name: 'Python', icon: siPython },
  zapier: { name: 'Zapier', icon: siZapier },
  make: { name: 'Make', icon: siMake },
  n8n: { name: 'n8n', icon: siN8n },
  twilio: { name: 'Twilio', icon: siTwilio },
  slack: { name: 'Slack', icon: siSlack },
  mapbox: { name: 'Mapbox', icon: siMapbox },
  arcgis: { name: 'ArcGIS', icon: siArcgis },
  looker: { name: 'Looker Studio', icon: siLooker },
  sheets: { name: 'Google Sheets', icon: siGooglesheets },
  retool: { name: 'Retool', icon: siRetool },
};

const GROUPS = [
  { title: 'CRM', tools: ['hubspot', 'salesforce', 'fub', 'ghl', 'podio'] },
  { title: 'Data & warehouse', tools: ['snowflake', 'bigquery', 'postgres', 'supabase', 'dbt', 'airflow'] },
  { title: 'AI', tools: ['claude', 'openai', 'python'] },
  { title: 'Automation & outreach', tools: ['zapier', 'make', 'n8n', 'twilio', 'slack'] },
  { title: 'Maps & reporting', tools: ['mapbox', 'arcgis', 'looker', 'sheets', 'retool'] },
];

const STRIP = ['hubspot', 'salesforce', 'fub', 'snowflake', 'bigquery', 'postgres', 'claude', 'openai', 'zapier', 'mapbox'];

export function ToolLogo({ id, className }) {
  const t = TOOLS[id];
  if (t.icon) {
    return (
      <svg viewBox="0 0 24 24" className={cn('h-6 w-6', className)} fill={`#${t.icon.hex}`} aria-hidden>
        <path d={t.icon.path} />
      </svg>
    );
  }
  return (
    <span
      className={cn('inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[9px] font-bold tracking-tight text-white', className)}
      style={{ backgroundColor: t.color }}
      aria-hidden
    >
      {t.mono}
    </span>
  );
}

/** Compact, static row under the hero: logo + name, easy to scan. */
export function ToolStrip() {
  const hasClients = TRUSTED_BY.length > 0;
  return (
    <div className="border-y border-line bg-white py-10">
      <Container>
        <p className="text-center text-sm font-medium text-ink-mute">
          {hasClients ? 'Trusted by real estate teams at' : 'Works with the tools your team already uses'}
        </p>
        {hasClients ? (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_BY.map((n) => (
              <li key={n} className="font-tight text-lg font-semibold text-ink-soft">
                {n}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {STRIP.map((id) => (
              <li
                key={id}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-3 py-3 text-[14px] font-medium text-ink"
              >
                <ToolLogo id={id} className="!h-5 !w-5" />
                {TOOLS[id].name}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}

/** Full integrations section, grouped by category. */
export function IntegrationsSection({ tone = 'white' }) {
  return (
    <section className={cn('py-20 sm:py-24 lg:py-28', tone === 'paper' ? 'bg-paper' : 'bg-white')}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Integrations"
              title="Works with the tools"
              accent="you already use."
              description="We plug into your current CRM, data, and automation tools, so your team keeps working the way it does today. If something has no integration, we build one."
            />
          </div>
          <div className="space-y-8 lg:col-span-8">
            {GROUPS.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.04}>
                <p className="text-sm font-semibold text-ink">{g.title}</p>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {g.tools.map((id) => (
                    <li
                      key={id}
                      className="flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-3 py-4 text-center transition-colors hover:border-ink/20"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-paper">
                        <ToolLogo id={id} />
                      </span>
                      <span className="text-[13.5px] font-medium leading-tight text-ink">{TOOLS[id].name}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="text-xs text-ink-mute">
              Product names and logos belong to their owners and are shown to indicate compatibility, not endorsement.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
