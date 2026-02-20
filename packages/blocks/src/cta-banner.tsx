import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

type CtaBannerProps = {
  title: string;
  description?: string;
  actionLabel?: string;
};

export function CtaBanner({ title, description, actionLabel = "Start Now" }: CtaBannerProps) {
  const shouldReduceMotion = useReducedMotion();
  const headingId = React.useId();

  return (
    <motion.aside
      className="rounded-2xl bg-primary p-8 text-primary-foreground"
      aria-labelledby={headingId}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id={headingId} className="text-2xl font-semibold">
            {title}
          </h2>
          {description ? <p className="mt-2 text-primary-foreground/80">{description}</p> : null}
        </div>
        <motion.button
          type="button"
          className="rounded-lg bg-background px-4 py-2 text-foreground"
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          {actionLabel}
        </motion.button>
      </div>
    </motion.aside>
  );
}
