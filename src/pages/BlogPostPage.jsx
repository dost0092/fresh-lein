import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import { LandingContainer } from '@/components/landing/LandingLayout';
import { Button } from '@/components/ui/button';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import BlogContent from '@/components/blog/BlogContent';
import { getPostBySlug, getRelatedPosts, BLOG_CATEGORIES } from '@/data/blogPosts';
import { COMPANY } from '@/data/company';

function formatDate(d) {
  try {
    return format(new Date(d), 'MMMM d, yyyy');
  } catch {
    return d;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(slug);
  const url = `${BASE_URL}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: post.author || COMPANY.name },
    publisher: {
      '@type': 'Organization',
      name: COMPANY.name,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/freshlien-logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    keywords: (post.keywords || []).join(', '),
  };

  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <MarketingPageShell>
      <Seo
        title={post.metaTitle || post.title}
        description={post.metaDescription}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <article className="py-12 lg:py-16">
        <LandingContainer innerClassName="max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {BLOG_CATEGORIES[post.category]}
            </span>
            <h1 className="font-display mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span>{formatDate(post.datePublished)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {post.readingTime}
              </span>
            </div>
          </div>

          {post.tldr?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-[#FAFAFA] p-6">
              <p className="text-sm font-semibold text-foreground">Key takeaways</p>
              <ul className="mt-3 space-y-2">
                {post.tldr.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] leading-[1.6] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <BlogContent blocks={post.body} />
          </div>

          {post.faqs?.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Frequently asked questions
              </h2>
              <div className="mt-5 divide-y divide-border rounded-xl border border-border">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="p-5">
                    <p className="text-[15px] font-semibold text-foreground">{faq.q}</p>
                    <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-primary/5 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Find distressed deals before the crowd
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Search live county foreclosure filings on a map, set alerts, and export lists. Start free, no credit card required.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link to="/register">
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/foreclosures">Preview live data</Link>
              </Button>
            </div>
          </div>
        </LandingContainer>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-[#FAFAFA] py-14">
          <LandingContainer>
            <h2 className="font-display text-lg font-semibold text-foreground">Keep reading</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {BLOG_CATEGORIES[r.category]}
                  </span>
                  <h3 className="font-display mt-4 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                    {r.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {r.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </LandingContainer>
        </section>
      )}
    </MarketingPageShell>
  );
}
