import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

type HeroSplitProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  highlights?: string[];
};

const DEFAULT_HIGHLIGHTS = ["No lock-in", "Accessible by default", "Install with shadcn add"];

export function HeroSplit({
  eyebrow = "Production Ready",
  title,
  description,
  primaryActionLabel = "Get Started",
  secondaryActionLabel = "View Docs",
  highlights = DEFAULT_HIGHLIGHTS,
}: HeroSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const headingId = React.useId();

  return (
    <motion.section
      className="overflow-hidden rounded-3xl border bg-background"
      aria-labelledby={headingId}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid gap-8 p-8 md:grid-cols-2 md:p-10">
        <motion.div
          className="space-y-5"
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -16 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={
            shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.1, ease: "easeOut" }
          }
        >
          <motion.p
            className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: 0.2 }}
          >
            {eyebrow}
          </motion.p>
          <h1
            id={headingId}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            {title}
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              {primaryActionLabel}
            </motion.button>
            <motion.button
              type="button"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium text-foreground"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              {secondaryActionLabel}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border bg-muted/30 p-6"
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: 16 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={
            shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.18, ease: "easeOut" }
          }
        >
          <p className="text-sm font-medium text-muted-foreground">Why teams use this block</p>
          <ul className="mt-4 space-y-3">
            {highlights.map((item) => (
              <motion.li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.3 }}
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-6 rounded-xl bg-background p-4 shadow-sm ring-1 ring-border/60"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: 0.28 }}
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Typical outcome</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              2x faster landing page assembly
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
