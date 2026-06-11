import { Link } from 'react-router-dom';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import LegalDocument from '@/components/landing/LegalDocument';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <LegalDocument title="Terms of Service" updated="June 2, 2026">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of {COMPANY.name} and related services. By
          creating an account or using the platform, you agree to these Terms.
        </p>

        <h2>Service description</h2>
        <p>
          {COMPANY.name} provides foreclosure research tools including searchable court-sourced records, map
          view, alerts, exports, and optional API access. We may update features at any time.
        </p>

        <h2>Accounts</h2>
        <ul>
          <li>You must provide accurate registration information.</li>
          <li>You are responsible for safeguarding your login credentials.</li>
          <li>One person or organization may not share a single login across unrelated parties.</li>
          <li>We may suspend accounts that violate these Terms or abuse the platform.</li>
        </ul>

        <h2>Subscriptions &amp; billing</h2>
        <ul>
          <li>Paid plans renew automatically unless cancelled before the renewal date.</li>
          <li>Prices are listed on our <Link to="/pricing">Pricing page</Link> and may change with notice.</li>
          <li>Refunds are handled case-by-case unless required by applicable law.</li>
          <li>Free trials convert to paid plans only if you subscribe — we do not charge without consent.</li>
        </ul>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Scrape, bulk-download, or resell data outside your licensed plan or API agreement</li>
          <li>Reverse engineer, probe, or disrupt our systems</li>
          <li>Use the service for unlawful harassment, spam, or discrimination</li>
          <li>Misrepresent foreclosure data as legal, title, or investment advice</li>
        </ul>

        <h2>Data accuracy disclaimer</h2>
        <p>
          Foreclosure records come from public sources and may contain errors, delays, or omissions.{' '}
          {COMPANY.name} does not guarantee completeness or accuracy. Always verify sale dates, amounts, and
          property details with official county records and qualified professionals before making investment
          decisions.
        </p>

        <h2>Not legal or financial advice</h2>
        <p>
          {COMPANY.name} is a research tool only. Nothing on the platform constitutes legal, tax, title, or
          investment advice.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The FreshLien brand, software, and curated datasets are our property or licensed to us. Public
          record data remains in the public domain; our organization, features, and presentation are protected.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {COMPANY.name} is not liable for indirect, incidental, or
          consequential damages arising from use of the service, including lost profits from investment
          decisions based on platform data.
        </p>

        <h2>Termination</h2>
        <p>
          You may cancel anytime from account settings. We may terminate access for breach of these Terms.
          Sections that should survive termination (disclaimers, liability limits) will remain in effect.
        </p>

        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of the United States and the state in which {COMPANY.name} operates,
          without regard to conflict-of-law principles.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Email{' '}
          <a href={CONTACT_MAILTO}>{COMPANY.contactEmail}</a> or visit our{' '}
          <Link to="/contact">Contact page</Link>.
        </p>
      </LegalDocument>
    </MarketingPageShell>
  );
}
