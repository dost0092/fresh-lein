import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import MarketingPageShell from '@/components/landing/MarketingPageShell';
import MarketingPageHero from '@/components/landing/MarketingPageHero';
import { LandingContainer } from '@/components/landing/LandingLayout';
import Seo, { BASE_URL } from '@/components/seo/Seo';
import { getAllPosts, BLOG_CATEGORIES } from '@/data/blogPosts';
import { COMPANY } from '@/data/company';

function formatDate(d) {
  try {
    return format(new Date(d), 'MMM d, yyyy');
  } catch {
    return d;
  }
}

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${COMPANY.name} Blog`,
    description:
      'Guides and education on foreclosure, pre-foreclosure, and distressed property investing, plus FreshLien product news.',
    url: `${BASE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: COMPANY.name,
      url: BASE_URL,
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.metaDescription,
      datePublished: p.datePublished,
      dateModified: p.dateModified,
      url: `${BASE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <MarketingPageShell>
      <Seo
        title="Blog: Foreclosure & Distressed Property Investing Guides"
        description="Guides on foreclosure, pre-foreclosure, and distressed property investing, plus FreshLien product news. Learn how to find distressed real estate deals before the crowd."
        path="/blog"
        jsonLd={jsonLd}
      />

      <MarketingPageHero
        eyebrow="FreshLien Blog"
        title="Foreclosure and distressed property"
        titleHighlight="investing guides"
        description="Clear, practical guides on foreclosure, pre-foreclosure, and distressed real estate, plus the latest FreshLien product news."
      />

      <section className="py-14 lg:py-20">
        <LandingContainer>
          {featured && (
            <Link
              to={`/blog/${featured.slug}`}
              className="group mb-10 block overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-shadow hover:shadow-card-hover lg:mb-14"
            >
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="flex items-center justify-center bg-primary/5 p-8 lg:p-12">
                  <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {BLOG_CATEGORIES[featured.category]}
                    </span>
                    <p className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                      {featured.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(featured.datePublished)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {featured.readingTime}
                    </span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {BLOG_CATEGORIES[post.category]}
                </span>
                <h2 className="font-display mt-4 text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(post.datePublished)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {post.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </LandingContainer>
      </section>
    </MarketingPageShell>
  );
}
