import {
  CtaBanner,
  HeroSplit,
  SidebarNavCollapseTrigger,
  SidebarNavPanel,
  SidebarNavProvider,
  SidebarNavVisibilityTrigger,
} from "@ftb/blocks";

const sidebarGroups = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: <CompassIcon />,
      },
      {
        id: "projects",
        label: "Projects",
        icon: <FolderIcon />,
        badge: "12",
        children: [
          { id: "projects-active", label: "Active", icon: <PulseIcon /> },
          { id: "projects-archived", label: "Archived", icon: <ArchiveIcon /> },
          { id: "projects-favorites", label: "Favorites", badge: "3", icon: <MiniStarIcon /> },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: <ChartIcon />,
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    items: [
      {
        id: "members",
        label: "Members",
        icon: <UsersIcon />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <CogIcon />,
      },
    ],
  },
];

export function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-8 p-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Component Preview</h1>
        <p className="text-muted-foreground">
          Production blocks currently available in this registry.
        </p>
      </div>

      <SidebarNavProvider defaultOpen={true} defaultCollapsed={false}>
        <div className="flex min-h-[620px] overflow-hidden rounded-xl border border-sidebar-border bg-sidebar">
          <SidebarNavPanel
            groups={sidebarGroups}
            defaultActiveItemId="projects-active"
            title="Acme Console"
            subtitle="Main Navigation"
          />

          <section className="flex flex-1 flex-col bg-background">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-4 py-3">
              <SidebarNavVisibilityTrigger />
              <SidebarNavCollapseTrigger />
            </div>
            <div className="space-y-3 p-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Shadcn-Like Sidebar Navigation
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Uses shadcn-style sizing and spacing with grouped menus, submenu icons,
                icon-collapse mode, and animated active highlight movement.
              </p>
            </div>
          </section>
        </div>
      </SidebarNavProvider>

      <HeroSplit
        title="Build composable pages faster with real production blocks"
        description="Start from high-quality defaults, then adapt content, styling, and behavior directly in your product codebase."
        primaryActionLabel="Install Hero Split"
        secondaryActionLabel="Read Usage"
      />

      <div className="max-w-4xl">
        <CtaBanner
          title="Build the real component library"
          description="Use this CTA block as a conversion section under your hero or feature content."
          actionLabel="Start Building"
        />
      </div>
    </main>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.8 9.2L13.2 13.2L9.2 14.8L10.8 10.8L14.8 9.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M3 7.5C3 6.67 3.67 6 4.5 6H9L11 8H19.5C20.33 8 21 8.67 21 9.5V16.5C21 17.33 20.33 18 19.5 18H4.5C3.67 18 3 17.33 3 16.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M6 16V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 16V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 12H8L10.2 8L13.8 16L16 12H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="4" y="6" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 10V18H18V10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 13H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MiniStarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M12 5.5L13.9 9.4L18.2 10L15.1 13L15.8 17.3L12 15.3L8.2 17.3L8.9 13L5.8 10L10.1 9.4L12 5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 18C4.9 15.9 6.6 14.5 9 14.5C11.4 14.5 13.1 15.9 13.5 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16.8" cy="9.4" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14.8 17.8C15.1 16.5 16.1 15.5 17.6 15.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 4.5V6.2M12 17.8V19.5M6.7 6.7L7.9 7.9M16.1 16.1L17.3 17.3M4.5 12H6.2M17.8 12H19.5M6.7 17.3L7.9 16.1M16.1 7.9L17.3 6.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
