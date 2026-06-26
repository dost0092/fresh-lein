# FreshLien — Complete Marketing & Investor Brief

**Purpose:** Use this document as the single source of truth when creating marketing content, investor outreach, or a 30-day social media plan. All numbers and claims below reflect what FreshLien publishes today. Do not inflate coverage or invent features not listed here.

---

## 1. One-Line Pitch

**FreshLien is same-day distressed property intelligence for real estate investors and B2B teams — county and court records in one searchable platform, before the crowd.**

---

## 2. Elevator Pitch (30 seconds)

Every year, hundreds of thousands of foreclosure filings hit public record across the U.S. Investors, wholesalers, and lenders need that data the day it lands — not weeks later from stale list brokers.

FreshLien pulls county clerk, recorder, and court records into one product: map search, filters, alerts, CSV export, and a REST API. Today we index **100K+ foreclosure filings** across **250+ counties** in **40+ states**, with **same-day refresh** on priority markets. Probate, pre-foreclosure, and tax delinquency data are rolling out county by county with clear live / coming-soon labels.

We are building the intelligence layer for distressed real estate — the way Shovels built it for building permits.

---

## 3. The Problem

### For investors and acquisition teams
- **Stale data:** Most list providers repackage old filings. By the time a lead list arrives, the best deals are already under contract or sold at auction.
- **Fragmented sources:** Due diligence means jumping between 50+ county clerk websites, sheriff sale calendars, and court portals — hours per week, per market.
- **No single view:** Address, case number, auction date, plaintiff, equity, and lien context live in different systems.
- **Missed windows:** Foreclosure auctions have short timelines. A filing that hits public record on Monday should be actionable on Monday — not in three weeks.

### For B2B / enterprise
- Mortgage servicers, hard money lenders, and PE funds need **API-grade, normalized distress signals** tied to parcels — not PDFs and manual research.
- Proptech and CRM vendors want a reliable data feed but cannot scrape 3,000+ counties themselves.

### Market size context (U.S. estimates, public market data)
| Signal | Estimated annual volume |
|--------|-------------------------|
| Foreclosure filings | 367K+ / year |
| Peak-month foreclosure filings | 40K+ / month |
| Probate cases | 2.6M+ / year |
| State court filings (distress signals) | 70M+ / year |

FreshLien does **not** claim to index all of this today. These figures show the **total addressable universe** as counties come online.

---

## 4. The Solution — FreshLien Platform

FreshLien is a B2B SaaS platform that:

1. **Ingests** public records from county clerks, recorders, sheriff sale calendars, and court portals
2. **Normalizes** addresses, case numbers, sale dates, parties, and property links into one dataset
3. **Delivers** that data through a web app, REST API, CSV export, and (roadmap) warehouse feeds

### Product surfaces (how customers access data)

| Surface | Status | Description |
|---------|--------|-------------|
| **Web app** | Live | Search on a map, filter by county, open full property detail |
| **REST API** | Live | Pull normalized filing data into CRMs, scripts, internal tools |
| **Bulk export** | Partial | Download filtered CSV batches |
| **Enterprise warehouse feeds** | Roadmap | Snowflake, BigQuery, S3-compatible delivery |

### Core workflows

| Feature | Status | What it does |
|---------|--------|--------------|
| **Search & filters** | Live | State, county, ZIP, filing type, auction date, equity, lien flags |
| **Map view** | Live | Pins color-coded by urgency; soonest auctions first |
| **List view** | Live | Scannable rows; click to open full record |
| **Property detail** | Live | Timeline, owner/defendant, plaintiff, case #, auction date, bid, equity, flood zone |
| **County alerts** | Live | Notify when new filings match your counties or filters |
| **Saved properties** | Live | Bookmark records you care about |
| **CSV export** | Partial | Download filtered results for outreach or underwriting |
| **Analytics** | Live | Filing trends and market pulse |
| **Portfolio watch** | Soon | Track distress across a property list via API |
| **AI assistant** | Live | In-app guide that answers FreshLien product questions |

---

## 5. Data Coverage (Current + Roadmap)

### Live today
- **100K+** foreclosure filings indexed and searchable
- **120K+** properties linked to parcels
- **250+** priority counties
- **40+** states with live data
- **Same-day** or next-business-day refresh on priority counties

### Data sources
- County recorder and clerk-of-court portals
- Sheriff sale and auction calendars
- County assessor and tax records
- Probate filings (select counties)

### Data categories

| Category | Filing type | Stage | Investor value | Status |
|----------|-------------|-------|----------------|--------|
| Active foreclosure | NTS / Sheriff sale | Scheduled sale | Time-sensitive deals | **Live** |
| Pre-foreclosure | NOD / Lis pendens | Before auction | Highest lead time | Coming soon |
| REO | Post-auction deed | Lender-owned | Negotiable inventory | Coming soon |
| Probate | Probate court filing | Estate selling | Motivated seller | Coming soon |
| Tax delinquency | County tax records | Pre-lien | Early distress signal | Coming soon |
| Mortgage default | Missed payment / HELOC | Early warning | Lead time advantage | Coming soon |
| Enrichment | Flood zone, zoning, AVM | Risk context | Underwriting support | Partial |

### Coverage roadmap (honest labeling)
Every category is labeled **live**, **partial**, or **coming soon** in the product. No vague "nationwide" claims.

| Category | FreshLien today | U.S. universe (est.) | Status |
|----------|-----------------|----------------------|--------|
| Foreclosure filings | 100K+ indexed | 367K+ / year | Live |
| Probate cases | Building county coverage | 2.6M+ / year | Soon |
| State court filings | Select counties live | 70M+ / year | Partial |
| Pre-foreclosure & tax | Rolling out by county | Varies by recorder | Soon |

---

## 6. Who It's For (Target Customers)

| Segment | Pain | FreshLien value |
|---------|------|-----------------|
| **Fix-and-flip investors** | Old lists = missed deals before auction | Same-day filings, equity filters, map search |
| **Wholesalers** | Courthouse research takes hours/week | Filters, bulk export, territory maps in one tool |
| **Real estate attorneys** | Case research across county sites | One timeline with case numbers and lien holders |
| **Mortgage servicers** | Hard to monitor collateral at scale | API alerts when distress hits a tracked property |
| **Hard money lenders** | Collateral problems show up too late | Filing alerts + risk context on each parcel |
| **Hedge funds / PE** | Need custom data pipelines | API, bulk feeds, dedicated enterprise support |
| **Probate professionals** | Estate deals hide in court records | Probate alerts linked to property (rolling out) |
| **Proptech / CRM vendors** | Need normalized distress API | Developer & Scale API tiers |

---

## 7. Why FreshLien Wins (Differentiators)

1. **County-direct sources** — Data from clerk, recorder, and court portals. Not recycled list broker feeds.
2. **Same-day updates** — Filings appear the day they hit public record. Many competitors lag weeks.
3. **Honest coverage labels** — Every category shows live / partial / coming soon. No inflated claims.
4. **Built for investors** — Map search, exports, and alerts match how acquisition teams actually work.
5. **API + UI parity** — Same normalized data in the web app and through the REST API.
6. **Full distress roadmap** — Foreclosure live today; probate, pre-foreclosure, and tax rolling out county by county.
7. **AI product guide** — In-app assistant helps users understand the platform (like Shovels' "Patty").

---

## 8. Business Model & Pricing

### Platform plans (web app)

| Plan | Price | Highlights |
|------|-------|------------|
| **Free** | $0/mo | 1 county, 50 record views/mo, map & list search, basic filters, save 5 properties |
| **Starter** | $15/mo | 1 state, 500 views/mo, CSV export (200 rows), 1 watch-area alert |
| **Professional** | $25/mo | 5 states, 5,000 views/mo, unlimited CSV, 10 alerts, analytics, 1,000 API calls/mo |
| **Enterprise** | Custom | All 50 states, unlimited records, portfolio monitoring, warehouse feeds, Slack support |

### API plans (developers & B2B)

| Plan | Price | Highlights |
|------|-------|------------|
| **Developer** | $49/mo | 10,000 API calls/mo, search & record endpoints, JSON |
| **Scale** | $149/mo | 100,000 calls/mo, bulk county queries, webhooks, priority support |
| **Enterprise API** | Custom | Unlimited (fair use), custom county packs, SLA, onboarding |

### Revenue streams
1. **SaaS subscriptions** (Free → Starter → Pro → Enterprise)
2. **API subscriptions** (Developer → Scale → Enterprise)
3. **Enterprise contracts** (warehouse feeds, custom county packs, portfolio monitoring)
4. **Usage add-ons** (skip trace at $0.25/record Pro, $0.20 Enterprise)

---

## 9. Traction & Product Status

### What's built and live
- Marketing site (landing, pricing, about, FAQ, API docs, security, contact)
- Foreclosure search: map view + list view + full property detail pages
- Filters: state, county, status, date range, text search
- CSV export
- User auth (register, login, guest preview)
- Stripe billing integration
- REST API with documented endpoints
- County alerts, saved properties, analytics pages
- AI in-app assistant (FreshLien Assistant)
- Mobile-responsive dashboard

### Key metrics to cite (marketing-safe)
- 100K+ foreclosure filings indexed
- 250+ counties covered
- 40+ states with live data
- 120K+ properties linked to parcels
- Same-day refresh on priority counties

---

## 10. Competitive Landscape

| Competitor type | Weakness | FreshLien angle |
|-----------------|----------|-----------------|
| **List brokers / lead gen** | Stale data, recycled lists, no API | Same-day county-direct, normalized API |
| **PropStream / ATTOM-style** | Broad but not distress-focused, expensive | Purpose-built for distressed deals, lower entry price |
| **Foreclosure.com / RealtyTrac legacy** | Dated UX, unclear freshness | Modern SaaS UX, honest coverage labels |
| **Manual courthouse research** | Slow, doesn't scale | One platform, map + alerts + export |
| **Shovels.ai (permits)** | Different vertical (construction) | Same playbook: county data → normalized intelligence → API + UI |

**Positioning analogy for investors:**  
*"Shovels is the intelligence layer for construction permits. FreshLien is the intelligence layer for distressed real estate."*

---

## 11. Go-To-Market Strategy

### Phase 1 — Now (product-led growth)
- Free tier + guest preview on landing page map
- SEO: "foreclosure data [state/county]", "distressed property search"
- Content: weekly foreclosure pulse, top distressed ZIPs, auction trends
- LinkedIn + Facebook for investor audience
- Real estate investor communities (BiggerPockets, local REIA groups)

### Phase 2 — Expansion
- County-by-county rollout marketing ("Now live: [County], [State]")
- API developer docs + integrations (CRM, proptech)
- Partnerships with hard money lenders and wholesaling coaches
- Webinars: "How to find deals before auction with same-day data"

### Phase 3 — Enterprise
- Outbound to mortgage servicers, PE real estate desks, proptech
- Warehouse feed pilots (Snowflake / BigQuery)
- Custom county packs and SLA contracts

---

## 12. Product Roadmap (Investor-Relevant)

| Quarter focus | Deliverable |
|---------------|-------------|
| **Now** | Foreclosure live, 250+ counties, map + list + detail + export + API |
| **Next** | Probate filings county-by-county |
| **Next** | Pre-foreclosure (NOD / lis pendens) |
| **Next** | Tax delinquency signals |
| **Future** | Portfolio monitoring, warehouse feeds, webhooks, REO inventory |
| **Future** | Enrichment expansion (AVM, flood, zoning) |

---

## 13. Company & Brand

| Field | Value |
|-------|-------|
| **Company name** | FreshLien |
| **Tagline** | Same-day distressed property data |
| **Website** | https://freshlien.com |
| **Contact** | waqasdostdost0092@gmail.com |
| **LinkedIn** | https://www.linkedin.com/company/freshlien |
| **Facebook** | https://www.facebook.com/people/FreshLien/61590612976427/ |
| **GitHub** | https://github.com/dost0092/fresh-lein |

### Mission
FreshLien pulls county and court records into one searchable product so investors and B2B teams find distressed deals before the crowd.

### Origin story
We started FreshLien because investors waste time jumping between county websites and stale lists. We publish what is live today, label what is still rolling out, and update priority counties same-day when the source allows it.

### Core values
1. **Speed matters** — Foreclosure windows are short. Same-day refresh on priority counties.
2. **Honest numbers** — Show what's indexed now. No inflated "nationwide" claims.
3. **Works in the field** — Map search, county filters, CSV export, API for teams that move fast.
4. **Full picture over time** — Foreclosure live today; probate, pre-foreclosure, tax rolling out county by county.

---

## 14. Trust, Compliance & Security

- **Public records only**, used lawfully
- No resale of raw county data without license
- Security practices aligned with SOC 2 expectations
- GDPR-ready handling for EU users
- Filing date and recording date preserved on every record
- Coverage table updated as new counties go live

---

## 15. Enterprise Features (Upsell / Investor Story)

- Dedicated API keys with usage dashboards and custom rate limits
- Warehouse feeds to Snowflake, BigQuery, or S3-compatible storage
- Bulk delivery: scheduled county/state files in CSV, JSON, or Parquet
- Custom alerts: polygon watch areas, portfolio triggers, webhooks
- Portfolio monitoring across large property lists
- Dedicated Slack channel, SLA, and onboarding

---

## 16. Key Messaging & Voice Guidelines

### Do say
- "Same-day distressed property data"
- "County and court records in one place"
- "Before the crowd"
- "100K+ filings · 250+ counties · 40+ states"
- "Built for investors who move first"
- "Honest coverage labels — live, partial, or coming soon"
- "The intelligence layer for distressed real estate"

### Don't say
- "Nationwide coverage" (unless referring to Enterprise roadmap)
- Invented county counts beyond 250+
- Guaranteed ROI or legal advice
- Em dashes or AI-sounding marketing fluff
- Compare directly by name to competitors in a negative way (focus on FreshLien strengths)

### Tone
- Professional, direct, human
- Data-backed but not jargon-heavy
- Confident but honest about what's live vs coming soon
- White-first UI, green accents — premium B2B SaaS feel (like Shovels.ai)

---

## 17. Investor Angles (Why Back FreshLien)

### 1. Large, fragmented market
Distressed real estate data is a multi-billion-dollar market stuck on stale lists and manual research. 367K+ foreclosure filings/year is just the start — probate (2.6M+/year) and court filings (70M+/year) expand TAM dramatically.

### 2. Proven playbook
Shovels.ai proved that county-level public records → normalized SaaS + API is a fundable, scalable model. FreshLien applies the same playbook to distressed property — a larger, more urgent buyer persona (investors with money on the line).

### 3. Data moat compounds
Every new county integration adds permanent searchable inventory. Coverage grows weekly. Early counties = early user lock-in via alerts and saved searches.

### 4. Multiple revenue layers
Free → $15 → $25 → Enterprise SaaS, plus API tiers ($49–$149+), plus enterprise warehouse contracts. Land-and-expand from individual investors to B2B teams.

### 5. API-native from day one
Not a spreadsheet wrapper. Normalized JSON, documented endpoints, webhooks — ready for proptech, CRM, and fintech integrations.

### 6. AI-ready
In-app assistant live. Future: natural language search across filings, automated deal scoring, portfolio risk alerts.

### 7. Capital-efficient growth
County integrations are repeatable. Product-led free tier drives organic adoption. Content + SEO compounds.

---

## 18. Sample Content Themes (for 30-day plan)

Use these as rotating pillars for LinkedIn, Twitter/X, Facebook, and investor outreach:

| Day type | Theme | Example hook |
|----------|-------|--------------|
| Problem | Stale data pain | "Your foreclosure list is 3 weeks old. The auction was yesterday." |
| Product | Map demo | "See every upcoming auction in your county — color-coded by urgency." |
| Data | Coverage stat | "100K+ filings indexed. 250+ counties. Same-day refresh." |
| Education | Foreclosure 101 | "NTS vs NOD: why lead time matters for investors." |
| Use case | Wholesaler story | "Stop driving to the courthouse. Search from your desk." |
| Comparison | FreshLien vs lists | "County-direct data vs recycled list brokers." |
| Roadmap | What's next | "Probate filings rolling out county by county." |
| Social proof | Product screenshot | "This is what same-day distressed data looks like." |
| Investor | Market size | "367K foreclosures/year. 2.6M probate cases. One platform." |
| CTA | Free tier | "Start free. No credit card. Search live county filings today." |
| API | Developer angle | "Pull normalized foreclosure data into your CRM via REST API." |
| Enterprise | B2B angle | "Portfolio monitoring + warehouse feeds for servicers and PE." |
| Founder | Origin story | "We built FreshLien because county websites are broken for investors." |
| Trend | Market pulse | "Foreclosure filings up 12% in [region] this quarter." |
| Vision | Big picture | "The intelligence layer for distressed real estate." |

---

## 19. Links & CTAs

| Page | URL |
|------|-----|
| Homepage | https://freshlien.com |
| App (search & map) | https://freshlien.com/dashboard/foreclosures |
| Pricing | https://freshlien.com/pricing |
| About | https://freshlien.com/about |
| FAQ | https://freshlien.com/faq |
| API docs | https://freshlien.com/api |
| Contact / sales | https://freshlien.com/contact |
| Register (free) | https://freshlien.com/register |
| LinkedIn | https://www.linkedin.com/company/freshlien |

**Primary CTA:** "Get started free" / "Search live county filings"  
**Secondary CTA:** "Contact sales" (Enterprise) / "Get API key" (developers)

---

## 20. FAQ (Quick Reference)

**What is FreshLien?**  
Distressed property intelligence platform. County and court records in one searchable product with map, alerts, export, and API.

**Where does data come from?**  
County clerks, recorders, sheriff sale calendars, and court portals. Public records only.

**How fresh is it?**  
Same-day or next business day on priority counties.

**Is there a free plan?**  
Yes. 1 county, 50 record views/month, map & list search. No credit card.

**Do you have an API?**  
Yes. REST API with search and record endpoints. Developer plan from $49/mo.

**What about probate?**  
Rolling out county by county. Labeled coming soon until live in each market.

**How do I contact the team?**  
Email waqasdostdost0092@gmail.com or use the Contact page.

---

## 21. Ready-Made ChatGPT Prompt (Copy Everything Below)

```
You are a senior B2B SaaS marketing strategist and investor-relations copywriter.

Using ONLY the facts in the FreshLien Marketing Brief above, create a 30-day social media content calendar designed to attract angel investors, seed VCs, and strategic partners in proptech / real estate data.

Requirements:
- Platforms: LinkedIn (primary), Twitter/X, Facebook
- Mix: 40% investor/market angle, 30% product demo/education, 20% founder story/vision, 10% direct CTA
- Each day include: platform, post type (text/image/carousel/video idea), full post copy (ready to publish), 3-5 hashtags, best posting time suggestion
- Tone: professional, direct, human — no em dashes, no AI fluff, no inflated claims
- Always use honest coverage numbers (100K+ filings, 250+ counties, 40+ states, same-day refresh)
- Never claim "nationwide" unless referring to Enterprise roadmap
- Include 5 "investor hook" posts that reference market size (367K foreclosures/yr, 2.6M probate/yr)
- Include 3 posts comparing FreshLien to the Shovels.ai playbook (permits → distressed property)
- Include 2 posts with a "Ask me about FreshLien" engagement prompt
- End with a 1-page investor email template and a 60-second pitch script

Format as a table: Day | Platform | Type | Post Copy | Hashtags | Notes
```

---

*Document version: June 2026. Update coverage numbers in src/data/marketingStats.js as counties go live.*
