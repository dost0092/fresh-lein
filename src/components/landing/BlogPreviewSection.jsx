import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { LandingContainer, LandingSectionHeader } from '@/components/landing/LandingLayout';
import { getAllPosts, BLOG_CATEGORIES } from '@/data/blogPosts';

function formatDate(d) {
  try {
    return format(new Date(d), 'MMM d, yyyy');
  } catch {
    return d;
  }
}

export default function BlogPreviewSection({ limit = 3 }) {
  const posts = getAllPosts().slice(0, limit);

  return (
    <section className="border-t border-border bg-[#FAFAFA] py-14 lg:py-20">
      <LandingContainer>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <LandingSectionHeader
            eyebrow="Resources"
            title="Guides on foreclosure"
            titleHighlight="and distressed property"
            description="Practical articles on foreclosure, pre-foreclosure, auctions, and finding deals from county records."
            className="mb-0"
          />
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
          >
            View all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {BLOG_CATEGORIES[post.category]}
              </span>
              <h3 className="font-display mt-4 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
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
  );
}
