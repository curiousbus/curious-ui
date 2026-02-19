import * as React from "react";

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

type TestimonialWallProps = {
  title: string;
  items: Testimonial[];
};

export function TestimonialWall({ title, items }: TestimonialWallProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <figure key={`${item.author}-${item.quote.slice(0, 12)}`} className="rounded-xl border p-5">
            <blockquote className="text-sm leading-6">“{item.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              {item.author}
              {item.role ? `, ${item.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
