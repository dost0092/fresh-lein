# FreshLien content review checklist

Items below need business or legal confirmation before treating website copy as final.

## Pricing

- [ ] Workflow Audit starting price (`From $750`)
- [ ] Lead Pipeline Sprint (`From $4,000` + optional monitoring from `$750/mo`)
- [ ] Acquisition Automation (`From $8,000`)
- [ ] Custom OS pricing language
- [ ] SaaS product plan prices on `/pricing` (existing Stripe plans)

Source file: `src/data/servicePackages.js`

## Claims and proof

- [ ] Customer logos (none published; keep empty until approved)
- [ ] Testimonials (none published)
- [ ] Named case-study results (current pages are illustrative only)
- [ ] Marketing coverage numbers in `src/data/marketingStats.js`
- [ ] Integration availability per CRM / dialer / vendor

## Legal / compliance

- [ ] Privacy and retention language for “Who owns our data?” FAQ
- [ ] Outreach / TCPA / CAN-SPAM language for SMS/email automation services
- [ ] Data-source licensing claims by jurisdiction
- [ ] Security claims (do not claim SOC 2 / ISO / HIPAA / PCI unless certified)
- [ ] Disclaimer on homepage/about (already present; confirm wording)

## Company details

- [ ] Contact email (`COMPANY.contactEmail`)
- [ ] Optional `FRESHLIEN_LEADS_EMAIL` for lead routing docs
- [ ] Company address (not shown yet)
- [ ] Support response times
- [ ] Founder / team biographies (placeholders only; none invented)

## Forms

- [ ] FormSubmit destination email
- [ ] Calendar booking link (placeholder not yet wired; add when ready)
- [ ] Marketing consent copy

## Analytics events (recommended)

Wire when analytics owner is ready:

- `homepage_primary_cta_click`
- `homepage_secondary_cta_click`
- `solution_page_view`
- `pricing_page_view`
- `audit_form_started`
- `audit_form_submitted`
- `contact_form_submitted`
- `calendar_opened`
- `resource_viewed`
- `login_clicked`
