import { Fragment } from 'react';

/** Render **bold** spans inside a plain string. */
function renderInline(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BlogContent({ blocks }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                id={slugifyHeading(block.text)}
                className="font-display scroll-mt-28 pt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="font-display text-lg font-semibold text-foreground">
                {block.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="text-[15px] leading-[1.75] text-muted-foreground">
                {renderInline(block.text)}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-[15px] leading-[1.7] text-muted-foreground">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-[1.7] text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case 'callout':
            return (
              <div key={i} className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                {block.title && (
                  <p className="mb-1.5 text-sm font-semibold text-primary">{block.title}</p>
                )}
                <p className="text-[15px] leading-[1.7] text-foreground/80">{renderInline(block.text)}</p>
              </div>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-2 border-primary pl-4 text-[15px] italic leading-[1.7] text-foreground/75"
              >
                {renderInline(block.text)}
              </blockquote>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-neutral-50 text-left">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 1 ? 'bg-neutral-50/50' : undefined}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={
                              k === 0
                                ? 'px-4 py-3 align-top text-sm font-medium text-foreground'
                                : 'px-4 py-3 align-top text-sm text-muted-foreground'
                            }
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
