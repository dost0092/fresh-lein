import {
  siAirbyte,
  siAirtable,
  siAmazonwebservices,
  siApacheairflow,
  siApachekafka,
  siArcgis,
  siAsana,
  siBrevo,
  siCalendly,
  siClaude,
  siClickup,
  siCloudflare,
  siDatabricks,
  siDbt,
  siDocker,
  siDropbox,
  siElasticsearch,
  siFastapi,
  siGithub,
  siGmail,
  siGoogleads,
  siGoogleanalytics,
  siGooglebigquery,
  siGooglecloud,
  siGoogledrive,
  siGooglegemini,
  siGooglemaps,
  siGooglesheets,
  siHubspot,
  siHuggingface,
  siIntercom,
  siJupyter,
  siLangchain,
  siLeaflet,
  siLinkedin,
  siLooker,
  siMailchimp,
  siMake,
  siMapbox,
  siMeta,
  siMetabase,
  siMongodb,
  siMysql,
  siN8n,
  siNextdotjs,
  siNotion,
  siOpenai,
  siOpenstreetmap,
  siPandas,
  siPostgresql,
  siPython,
  siPytorch,
  siQgis,
  siQuickbooks,
  siReact,
  siRedis,
  siResend,
  siRetool,
  siSalesforce,
  siSendgrid,
  siSlack,
  siSnowflake,
  siStripe,
  siSupabase,
  siTableau,
  siTwilio,
  siTypeform,
  siVercel,
  siWebflow,
  siWhatsapp,
  siWordpress,
  siXero,
  siZapier,
  siZillow,
  siZoho,
} from 'simple-icons';
import { cn } from '@/lib/utils';
import { Container, Reveal, SectionHeading } from '@/components/site/ui';
import { TRUSTED_BY } from '@/data/siteContent';

/**
 * Tool registry. `icon` is a simple-icons entry; `mono` + `color` render a
 * letter badge for tools simple-icons does not ship.
 */
const TOOLS = {
  hubspot: { name: 'HubSpot', icon: siHubspot },
  salesforce: { name: 'Salesforce', icon: siSalesforce },
  fub: { name: 'Follow Up Boss', mono: 'FUB', color: '#1E66F5' },
  ghl: { name: 'GoHighLevel', mono: 'GHL', color: '#155EEF' },
  podio: { name: 'Podio', mono: 'P', color: '#3D9CD7' },
  zoho: { name: 'Zoho', icon: siZoho },
  intercom: { name: 'Intercom', icon: siIntercom },
  mailchimp: { name: 'Mailchimp', icon: siMailchimp },
  brevo: { name: 'Brevo', icon: siBrevo },
  sendgrid: { name: 'SendGrid', icon: siSendgrid },
  resend: { name: 'Resend', icon: siResend },
  twilio: { name: 'Twilio', icon: siTwilio },
  whatsapp: { name: 'WhatsApp', icon: siWhatsapp },
  gmail: { name: 'Gmail', icon: siGmail },
  calendly: { name: 'Calendly', icon: siCalendly },
  typeform: { name: 'Typeform', icon: siTypeform },
  zillow: { name: 'Zillow', icon: siZillow },
  googlemaps: { name: 'Google Maps', icon: siGooglemaps },
  mapbox: { name: 'Mapbox', icon: siMapbox },
  arcgis: { name: 'ArcGIS', icon: siArcgis },
  qgis: { name: 'QGIS', icon: siQgis },
  osm: { name: 'OpenStreetMap', icon: siOpenstreetmap },
  leaflet: { name: 'Leaflet', icon: siLeaflet },
  airtable: { name: 'Airtable', icon: siAirtable },
  notion: { name: 'Notion', icon: siNotion },
  slack: { name: 'Slack', icon: siSlack },
  clickup: { name: 'ClickUp', icon: siClickup },
  asana: { name: 'Asana', icon: siAsana },
  quickbooks: { name: 'QuickBooks', icon: siQuickbooks },
  xero: { name: 'Xero', icon: siXero },
  stripe: { name: 'Stripe', icon: siStripe },
  googleads: { name: 'Google Ads', icon: siGoogleads },
  meta: { name: 'Meta Ads', icon: siMeta },
  linkedin: { name: 'LinkedIn', icon: siLinkedin },
  ga: { name: 'Google Analytics', icon: siGoogleanalytics },
  webflow: { name: 'Webflow', icon: siWebflow },
  wordpress: { name: 'WordPress', icon: siWordpress },
  gdrive: { name: 'Google Drive', icon: siGoogledrive },
  dropbox: { name: 'Dropbox', icon: siDropbox },
  sheets: { name: 'Google Sheets', icon: siGooglesheets },
  snowflake: { name: 'Snowflake', icon: siSnowflake },
  bigquery: { name: 'BigQuery', icon: siGooglebigquery },
  databricks: { name: 'Databricks', icon: siDatabricks },
  postgres: { name: 'Postgres', icon: siPostgresql },
  mysql: { name: 'MySQL', icon: siMysql },
  mongodb: { name: 'MongoDB', icon: siMongodb },
  supabase: { name: 'Supabase', icon: siSupabase },
  redis: { name: 'Redis', icon: siRedis },
  elastic: { name: 'Elasticsearch', icon: siElasticsearch },
  dbt: { name: 'dbt', icon: siDbt },
  airflow: { name: 'Airflow', icon: siApacheairflow },
  kafka: { name: 'Kafka', icon: siApachekafka },
  airbyte: { name: 'Airbyte', icon: siAirbyte },
  python: { name: 'Python', icon: siPython },
  pandas: { name: 'pandas', icon: siPandas },
  jupyter: { name: 'Jupyter', icon: siJupyter },
  fastapi: { name: 'FastAPI', icon: siFastapi },
  claude: { name: 'Claude', icon: siClaude },
  openai: { name: 'OpenAI', icon: siOpenai },
  gemini: { name: 'Gemini', icon: siGooglegemini },
  huggingface: { name: 'Hugging Face', icon: siHuggingface },
  langchain: { name: 'LangChain', icon: siLangchain },
  pytorch: { name: 'PyTorch', icon: siPytorch },
  zapier: { name: 'Zapier', icon: siZapier },
  make: { name: 'Make', icon: siMake },
  n8n: { name: 'n8n', icon: siN8n },
  retool: { name: 'Retool', icon: siRetool },
  looker: { name: 'Looker Studio', icon: siLooker },
  tableau: { name: 'Tableau', icon: siTableau },
  metabase: { name: 'Metabase', icon: siMetabase },
  gcp: { name: 'Google Cloud', icon: siGooglecloud },
  aws: { name: 'AWS', icon: siAmazonwebservices },
  vercel: { name: 'Vercel', icon: siVercel },
  cloudflare: { name: 'Cloudflare', icon: siCloudflare },
  docker: { name: 'Docker', icon: siDocker },
  github: { name: 'GitHub', icon: siGithub },
  react: { name: 'React', icon: siReact },
  nextjs: { name: 'Next.js', icon: siNextdotjs },
};

const ROW_BUSINESS = [
  'hubspot', 'salesforce', 'fub', 'ghl', 'podio', 'zoho', 'mailchimp', 'brevo', 'sendgrid', 'twilio',
  'whatsapp', 'gmail', 'calendly', 'typeform', 'zillow', 'googlemaps', 'mapbox', 'arcgis', 'qgis', 'airtable',
  'notion', 'slack', 'clickup', 'quickbooks', 'xero', 'stripe', 'googleads', 'meta', 'linkedin', 'webflow',
];

const ROW_DATA = [
  'snowflake', 'bigquery', 'databricks', 'postgres', 'mysql', 'mongodb', 'supabase', 'redis', 'dbt', 'airflow',
  'kafka', 'airbyte', 'python', 'pandas', 'jupyter', 'claude', 'openai', 'gemini', 'huggingface', 'langchain',
  'pytorch', 'zapier', 'make', 'n8n', 'retool', 'looker', 'tableau', 'metabase', 'gcp', 'aws',
];

const GROUPS = [
  { title: 'CRM & sales', tools: ['hubspot', 'salesforce', 'fub', 'ghl', 'podio', 'zoho', 'intercom', 'calendly', 'typeform', 'airtable', 'notion', 'clickup'] },
  { title: 'Outreach & marketing', tools: ['mailchimp', 'brevo', 'sendgrid', 'resend', 'twilio', 'whatsapp', 'gmail', 'googleads', 'meta', 'linkedin', 'ga', 'webflow'] },
  { title: 'Data & warehouse', tools: ['snowflake', 'bigquery', 'databricks', 'postgres', 'mysql', 'mongodb', 'supabase', 'redis', 'elastic', 'dbt', 'airflow', 'airbyte'] },
  { title: 'AI & machine learning', tools: ['claude', 'openai', 'gemini', 'huggingface', 'langchain', 'pytorch', 'python', 'pandas', 'jupyter', 'fastapi'] },
  { title: 'Maps & property', tools: ['zillow', 'googlemaps', 'mapbox', 'arcgis', 'qgis', 'osm', 'leaflet'] },
  { title: 'Automation, reporting & cloud', tools: ['zapier', 'make', 'n8n', 'retool', 'looker', 'tableau', 'metabase', 'sheets', 'gcp', 'aws', 'vercel', 'cloudflare'] },
];

export const TOOL_COUNT = Object.keys(TOOLS).length;

/** Very light brand colors (e.g. yellow) are unreadable on white; draw those in ink instead. */
function readableHex(hex) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.72 ? '#151817' : `#${hex}`;
}

export function ToolLogo({ id, className }) {
  const t = TOOLS[id];
  const icon = t.icon;
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" className={cn('h-6 w-6 shrink-0', className)} fill={readableHex(icon.hex)} aria-hidden>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[8px] font-bold tracking-tight text-white',
        className
      )}
      style={{ backgroundColor: t.color }}
      aria-hidden
    >
      {t.mono}
    </span>
  );
}

function LogoChip({ id, hidden }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-white py-3 pl-3 pr-5 shadow-[0_1px_2px_rgba(20,24,22,0.04),0_8px_24px_-16px_rgba(20,24,22,0.18)] transition-colors hover:border-ink/20"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-paper ring-1 ring-line">
        <ToolLogo id={id} className="!h-5 !w-5" />
      </span>
      <span className="whitespace-nowrap text-[15px] font-medium text-ink">{TOOLS[id].name}</span>
    </li>
  );
}

function MarqueeRow({ ids, duration }) {
  return (
    <div className="site-marquee-mask group overflow-hidden py-1.5">
      <ul
        className="flex w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {ids.map((id) => (
          <LogoChip key={id} id={id} />
        ))}
        {ids.map((id) => (
          <LogoChip key={`${id}-dup`} id={id} hidden />
        ))}
      </ul>
    </div>
  );
}

/** Logo carousel under the hero: two rows scrolling right to left at different speeds. */
export function ToolStrip() {
  const hasClients = TRUSTED_BY.length > 0;
  return (
    <section className="border-y border-line bg-white py-14">
      <Container>
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            {hasClients ? 'Trusted by real estate teams' : `${TOOL_COUNT}+ integrations`}
          </span>
          <p className="mt-4 max-w-xl font-tight text-xl font-semibold tracking-[-0.015em] text-ink sm:text-2xl">
            {hasClients ? 'Teams that run on FreshLien' : 'Works with the tools your team already uses'}
          </p>
        </div>
      </Container>
      {hasClients ? (
        <Container>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_BY.map((n) => (
              <li key={n} className="font-tight text-lg font-semibold text-ink-soft">
                {n}
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <div className="mx-auto mt-9 max-w-[90rem] space-y-2">
          <MarqueeRow ids={ROW_BUSINESS} duration={90} />
          <MarqueeRow ids={ROW_DATA} duration={110} />
        </div>
      )}
    </section>
  );
}

/** Full integrations section, grouped by category. */
export function IntegrationsSection({ tone = 'white' }) {
  return (
    <section className={cn('py-20 sm:py-24 lg:py-28', tone === 'paper' ? 'bg-paper' : 'bg-white')}>
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Integrations"
                title="Works with the tools"
                accent="you already use."
                description="We plug into your CRM, data, AI, and marketing tools, so your team keeps working the way it does today. If a tool has no integration, we build one."
              />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="font-tight text-3xl font-semibold tracking-tight text-ink">{TOOL_COUNT}+</p>
                  <p className="mt-1 text-sm text-ink-mute">Tools we work with</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="font-tight text-3xl font-semibold tracking-tight text-ink">{GROUPS.length}</p>
                  <p className="mt-1 text-sm text-ink-mute">Categories covered</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-10 lg:col-span-8">
            {GROUPS.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.03}>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-ink">{g.title}</p>
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-xs text-ink-mute">{g.tools.length}</span>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {g.tools.map((id) => (
                    <li
                      key={id}
                      className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 pr-3 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_24px_-18px_rgba(20,24,22,0.35)]"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper ring-1 ring-line">
                        <ToolLogo id={id} className="!h-[18px] !w-[18px]" />
                      </span>
                      <span className="truncate text-[14px] font-medium text-ink">{TOOLS[id].name}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="text-xs text-ink-mute">
              Product names and logos are trademarks of their respective owners and are shown to indicate
              compatibility, not endorsement.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
