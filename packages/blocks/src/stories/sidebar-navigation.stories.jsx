/* biome-ignore lint/correctness/noUnusedImports: Storybook build requires React in scope for this story module. */
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
          { id: "projects-active", label: "Active" },
          { id: "projects-archived", label: "Archived" },
          { id: "projects-favorites", label: "Favorites", badge: "3" },
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

export default {
  title: "Blocks/Sidebar Navigation",
  component: SidebarNavPanel,
  tags: ["autodocs"],
};

export const Default = {
  render: () => {
    return (
      <SidebarNavProvider defaultOpen={true} defaultCollapsed={false}>
        <div className="flex min-h-[620px] overflow-hidden rounded-2xl border bg-background">
          <SidebarNavPanel
            groups={groups}
            defaultActiveItemId="projects-active"
            title="Acme Console"
            subtitle="Main Navigation"
          />

          <main className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
              <SidebarNavVisibilityTrigger />
              <SidebarNavCollapseTrigger />
            </div>
            <div className="space-y-3 p-6">
              <h2 className="text-2xl font-semibold tracking-tight">Composable Sidebar Block</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                This block supports grouped navigation, nested submenus, icon-only collapse mode,
                offcanvas visibility, and motion layout highlight transitions.
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
