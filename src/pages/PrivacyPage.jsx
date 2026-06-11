import { Link } from 'react-router-dom';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import LegalDocument from '@/components/landing/LegalDocument';
import { COMPANY, CONTACT_MAILTO } from '@/data/company';

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <LegalDocument title="Privacy Policy" updated="June 2, 2026">
        <p>
          {COMPANY.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy
          explains what information we collect, how we use it, and your choices when you use our website and
          platform at freshlien.com.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account information:</strong> name, email address, and password when you register.
          </li>
          <li>
            <strong>Billing information:</strong> payment details processed by Stripe. We do not store full card
            numbers on our servers.
          </li>
          <li>
            <strong>Usage data:</strong> pages visited, searches, exports, and feature usage to improve the product.
          </li>
          <li>
            <strong>Device &amp; log data:</strong> IP address, browser type, and timestamps for security and analytics.
          </li>
          <li>
            <strong>Communications:</strong> messages you send via contact forms, feedback, or email.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>Provide and maintain the FreshLien platform</li>
          <li>Process subscriptions and send billing-related notices</li>
          <li>Send product updates, alerts, and support responses</li>
          <li>Improve features, fix bugs, and analyze usage trends</li>
          <li>Protect against fraud, abuse, and security incidents</li>
        </ul>

        <h2>Third-party services</h2>
        <p>We use trusted providers to operate our service, including:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication and database hosting
          </li>
          <li>
            <strong>Stripe</strong> — payment processing
          </li>
          <li>
            <strong>Vercel</strong> — website hosting and analytics
          </li>
        </ul>
        <p>
          These providers process data according to their own privacy policies. We only share what is necessary
          to deliver the service.
        </p>

        <h2>Public foreclosure data</h2>
        <p>
          Foreclosure records displayed in FreshLien are derived from public court filings. This information is
          already publicly available; we organize and present it for research purposes.
        </p>

        <h2>Data retention</h2>
        <p>
          We retain account data while your account is active and for a reasonable period afterward for legal,
          billing, and security purposes. You may request deletion by contacting us.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export your personal
          data. Contact us at{' '}
          <a href={CONTACT_MAILTO}>{COMPANY.contactEmail}</a> to make a request.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. Analytics cookies help us understand
          how visitors use the site. You can control cookies through your browser settings.
        </p>

        <h2>Children</h2>
        <p>
          FreshLien is not intended for users under 18. We do not knowingly collect data from children.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be posted on this page with an
          updated date.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Email{' '}
          <a href={CONTACT_MAILTO}>{COMPANY.contactEmail}</a> or visit our{' '}
          <Link to="/contact">Contact page</Link>.
        </p>
      </LegalDocument>
    </MarketingPageShell>
  );
}
