import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

export type SaasMemberStatus = "active" | "invited" | "suspended";

export type SaasTeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: SaasMemberStatus;
  avatarFallback?: string;
  lastSeen?: string;
  mfaEnabled?: boolean;
};

type SaasTeamRosterProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  members: SaasTeamMember[];
  maxVisible?: number;
  onInviteClick?: () => void;
  onMemberClick?: (member: SaasTeamMember) => void;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function statusBadgeClass(status: SaasMemberStatus) {
  if (status === "active") {
    return "bg-emerald-500/10 text-emerald-700";
  }
  if (status === "invited") {
    return "bg-amber-500/10 text-amber-700";
  }
  return "bg-destructive/10 text-destructive";
}

function initials(name: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  const chunks = name
    .split(" ")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 2);

  return chunks.map((chunk) => chunk[0]?.toUpperCase() ?? "").join("") || "U";
}

export function SaasTeamRoster({
  title = "Team Access",
  description = "Monitor team seats, security status, and member lifecycle in one panel.",
  members,
  maxVisible = 6,
  onInviteClick,
  onMemberClick,
  className,
  ...props
}: SaasTeamRosterProps) {
  const shouldReduceMotion = useReducedMotion();

  const visibleMembers = React.useMemo(
    () => members.slice(0, Math.max(1, maxVisible)),
    [maxVisible, members],
  );

  const summary = React.useMemo(() => {
    const active = members.filter((member) => member.status === "active").length;
    const invited = members.filter((member) => member.status === "invited").length;
    const suspended = members.filter((member) => member.status === "suspended").length;
    const mfa = members.filter((member) => member.mfaEnabled).length;

    return { active, invited, suspended, mfa };
  }, [members]);

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-balance">{title}</h2>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
          onClick={onInviteClick}
        >
          Invite teammate
        </button>
      </header>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Active" value={summary.active} />
        <SummaryCard label="Invited" value={summary.invited} />
        <SummaryCard label="Suspended" value={summary.suspended} />
        <SummaryCard label="MFA Enabled" value={summary.mfa} />
      </div>

      <div className="mt-4 space-y-2">
        {visibleMembers.map((member, index) => (
          <motion.button
            key={member.id}
            type="button"
            onClick={() => {
              onMemberClick?.(member);
            }}
            className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:bg-accent/60"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
            }
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials(member.name, member.avatarFallback)}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{member.name}</span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px]",
                    statusBadgeClass(member.status),
                  )}
                >
                  {member.status}
                </span>
              </span>
              <span className="block truncate text-xs text-muted-foreground">{member.email}</span>
            </span>

            <span className="text-right">
              <span className="block text-xs text-foreground">{member.role}</span>
              {member.lastSeen ? (
                <span className="block text-[11px] text-muted-foreground">
                  Seen {member.lastSeen}
                </span>
              ) : null}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border bg-background px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold tabular-nums">{value}</p>
    </article>
  );
}
