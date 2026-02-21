import {
  Controls,
  Description,
  Markdown,
  Primary,
  Source,
  Stories as StoriesBlock,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import * as React from "react";
import {
  SidebarNavCollapseTrigger,
  SidebarNavPanel,
  SidebarNavProvider,
  SidebarNavVisibilityTrigger,
} from "../sidebar-navigation";

const groups = [
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

const sidebarOverviewDocs = [
  "## Overview",
  "",
  "This block is intentionally router-agnostic. You control navigation by wiring:",
  "",
  "1. `activeItemId` from current route",
  "2. `onActiveItemChange` to router navigate",
  "",
  "The recommended pattern is to keep a single `id <-> path` mapping table.",
].join("\n");

const reactRouterCode = [
  'import { useMemo } from "react";',
  'import { useLocation, useNavigate } from "react-router-dom";',
  'import { SidebarNavPanel, SidebarNavProvider } from "@curious-ui/blocks";',
  "",
  "const ROUTE_TO_ID: Record<string, string> = {",
  '  "/": "overview",',
  '  "/projects/active": "projects-active",',
  '  "/projects/archived": "projects-archived",',
  '  "/projects/favorites": "projects-favorites",',
  '  "/reports": "reports",',
  '  "/members": "members",',
  '  "/settings": "settings",',
  "};",
  "",
  "const ID_TO_ROUTE = Object.fromEntries(",
  "  Object.entries(ROUTE_TO_ID).map(([path, id]) => [id, path]),",
  ") as Record<string, string>;",
  "",
  "export function AppSidebar() {",
  "  const location = useLocation();",
  "  const navigate = useNavigate();",
  "",
  "  const activeItemId = useMemo(() => {",
  '    return ROUTE_TO_ID[location.pathname] ?? "overview";',
  "  }, [location.pathname]);",
  "",
  "  return (",
  "    <SidebarNavProvider defaultOpen defaultCollapsed={false}>",
  "      <SidebarNavPanel",
  "        groups={groups}",
  "        activeItemId={activeItemId}",
  "        onActiveItemChange={(id) => {",
  "          const to = ID_TO_ROUTE[id];",
  "          if (to && to !== location.pathname) {",
  "            navigate(to);",
  "          }",
  "        }}",
  '        title="Acme Console"',
  '        subtitle="Main Navigation"',
  "      />",
  "    </SidebarNavProvider>",
  "  );",
  "}",
].join("\n");

const tanstackStartCode = [
  'import { useMemo } from "react";',
  'import { useLocation, useNavigate } from "@tanstack/react-router";',
  'import { SidebarNavPanel, SidebarNavProvider } from "@curious-ui/blocks";',
  "",
  "const ROUTE_TO_ID: Record<string, string> = {",
  '  "/": "overview",',
  '  "/projects/active": "projects-active",',
  '  "/projects/archived": "projects-archived",',
  '  "/projects/favorites": "projects-favorites",',
  '  "/reports": "reports",',
  '  "/members": "members",',
  '  "/settings": "settings",',
  "};",
  "",
  "const ID_TO_ROUTE = Object.fromEntries(",
  "  Object.entries(ROUTE_TO_ID).map(([path, id]) => [id, path]),",
  ") as Record<string, string>;",
  "",
  "export function AppSidebar() {",
  "  const location = useLocation();",
  "  const navigate = useNavigate();",
  "",
  "  const activeItemId = useMemo(() => {",
  '    return ROUTE_TO_ID[location.pathname] ?? "overview";',
  "  }, [location.pathname]);",
  "",
  "  return (",
  "    <SidebarNavProvider defaultOpen defaultCollapsed={false}>",
  "      <SidebarNavPanel",
  "        groups={groups}",
  "        activeItemId={activeItemId}",
  "        onActiveItemChange={(id) => {",
  "          const to = ID_TO_ROUTE[id];",
  "          if (to && to !== location.pathname) {",
  "            navigate({ to });",
  "          }",
  "        }}",
  "      />",
  "    </SidebarNavProvider>",
  "  );",
  "}",
].join("\n");

const sidebarNotesDocs = [
  "## Notes",
  "",
  "- Use `activeItemId` (controlled mode) in real apps so route and sidebar stay in sync.",
  "- Keep `defaultActiveItemId` only for static demos or local prototypes.",
  "- For nested routes, map both parent and child paths to explicit item IDs.",
].join("\n");

export default {
  title: "Blocks/Sidebar Navigation",
  component: SidebarNavPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <React.Fragment>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Markdown>{sidebarOverviewDocs}</Markdown>
          <Markdown>{"## React Router Integration"}</Markdown>
          <Source code={reactRouterCode} language="tsx" />
          <Markdown>{"## TanStack Start Integration"}</Markdown>
          <Source code={tanstackStartCode} language="tsx" />
          <Markdown>{sidebarNotesDocs}</Markdown>
          <StoriesBlock />
        </React.Fragment>
      ),
    },
  },
};

export const Default = {
  render: () => {
    return (
      <SidebarNavProvider defaultOpen={true} defaultCollapsed={false}>
        <div className="flex min-h-[620px] overflow-hidden rounded-xl border border-sidebar-border bg-sidebar">
          <SidebarNavPanel
            groups={groups}
            defaultActiveItemId="projects-active"
            title="Acme Console"
            subtitle="Main Navigation"
          />

          <main className="flex flex-1 flex-col bg-background">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-4 py-3">
              <SidebarNavVisibilityTrigger />
              <SidebarNavCollapseTrigger />
            </div>
            <div className="space-y-3 p-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Shadcn-Like Sidebar Composition
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Uses shadcn-style sizing and spacing with grouped menus, submenu icons,
                icon-collapse mode, and animated active highlight movement.
              </p>
            </div>
          </main>
        </div>
      </SidebarNavProvider>
    );
  },
};

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
