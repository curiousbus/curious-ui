import {
  AuthSignUpCard,
  AuthSignUpContent,
  AuthSignUpFooter,
  AuthSignUpForm,
  AuthSignUpHeader,
  CtaBanner,
  DataTable,
  HeroSplit,
  SidebarNavCollapseTrigger,
  SidebarNavPanel,
  SidebarNavProvider,
  SidebarNavVisibilityTrigger,
} from "@curious-ui/blocks";
import * as React from "react";

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

function createTableRows(count = 96) {
  const regions = ["APAC", "EMEA", "NA", "LATAM"];
  const statuses = ["active", "paused", "invited"];

  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      region: regions[index % regions.length],
      status: statuses[index % statuses.length],
      seats: 1 + (index % 8),
    };
  });
}

function getStatusClass(status) {
  if (status === "active") {
    return "bg-emerald-500/10 text-emerald-700";
  }
  if (status === "paused") {
    return "bg-amber-500/10 text-amber-700";
  }
  return "bg-slate-500/10 text-slate-700";
}

export function App() {
  const [registrationMessage, setRegistrationMessage] = React.useState("");
  const [tableRows, setTableRows] = React.useState(() => createTableRows());

  const tableColumns = React.useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        sortable: true,
      },
      {
        id: "region",
        header: "Region",
        accessorKey: "region",
        sortable: true,
        align: "center",
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        sortable: true,
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(row.status)}`}
          >
            {row.status}
          </span>
        ),
      },
      {
        id: "seats",
        header: "Seats",
        accessorKey: "seats",
        sortable: true,
        align: "right",
      },
    ],
    [],
  );

  const fetchRows = React.useCallback(
    async (query, { signal }) => {
      await new Promise((resolve, reject) => {
        const timeoutId = window.setTimeout(resolve, 180);
        signal.addEventListener(
          "abort",
          () => {
            window.clearTimeout(timeoutId);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        );
      });

      const normalizedSearch = query.search.trim().toLowerCase();
      let filteredRows = tableRows;

      if (normalizedSearch) {
        filteredRows = tableRows.filter((row) => {
          return (
            row.name.toLowerCase().includes(normalizedSearch) ||
            row.email.toLowerCase().includes(normalizedSearch) ||
            row.region.toLowerCase().includes(normalizedSearch) ||
            row.status.toLowerCase().includes(normalizedSearch)
          );
        });
      }

      if (query.sort?.field) {
        filteredRows = [...filteredRows].sort((left, right) => {
          const leftValue = String(left[query.sort.field] ?? "");
          const rightValue = String(right[query.sort.field] ?? "");
          const compared = leftValue.localeCompare(rightValue, undefined, {
            numeric: true,
            sensitivity: "base",
          });
          return query.sort.direction === "asc" ? compared : -compared;
        });
      }

      const start = (query.page - 1) * query.pageSize;
      const end = start + query.pageSize;

      return {
        rows: filteredRows.slice(start, end),
        total: filteredRows.length,
        page: query.page,
        pageSize: query.pageSize,
      };
    },
    [tableRows],
  );

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

      <section className="grid gap-6 xl:grid-cols-[380px,1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              Registration Block
            </h2>
            <p className="text-sm text-muted-foreground text-pretty">
              API-agnostic sign-up form with field-level validation and async submit support.
            </p>
          </div>

          <AuthSignUpCard>
            <AuthSignUpHeader
              title="Create account"
              description="Register with your work email to create a new workspace."
              align="left"
            />
            <AuthSignUpContent className="grid gap-5">
              <AuthSignUpForm
                submitLabel="Create workspace"
                validate={(payload) => {
                  if (!payload.email.endsWith("@example.com")) {
                    return { email: "Use @example.com for this preview." };
                  }

                  if (payload.password.length < 8) {
                    return { password: "Use at least 8 characters." };
                  }

                  return {};
                }}
                onSubmitRegistration={async (payload) => {
                  await new Promise((resolve) => {
                    window.setTimeout(resolve, 260);
                  });
                  setRegistrationMessage(`Registered ${payload.email}`);
                }}
              />
              <AuthSignUpFooter>
                Already registered?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </a>
              </AuthSignUpFooter>
            </AuthSignUpContent>
          </AuthSignUpCard>

          {registrationMessage ? (
            <p className="text-sm text-muted-foreground">{registrationMessage}</p>
          ) : null}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-balance">Data Table Block</h2>
          <DataTable
            title="Organization Users"
            description="Server-driven query contract: search + sort + pagination + icon actions + edit/delete."
            columns={tableColumns}
            fetchPage={fetchRows}
            searchPlaceholder="Search by name, email, region, status"
            initialQuery={{
              pageSize: 8,
              sort: { field: "name", direction: "asc" },
            }}
            rowActions={[
              {
                id: "mark-invited",
                label: "Mark invited",
                onClick: async (row) => {
                  await new Promise((resolve) => {
                    window.setTimeout(resolve, 100);
                  });
                  setTableRows((currentRows) =>
                    currentRows.map((currentRow) => {
                      if (currentRow.id !== row.id) {
                        return currentRow;
                      }
                      return {
                        ...currentRow,
                        status: "invited",
                      };
                    }),
                  );
                },
                isVisible: (row) => row.status !== "invited",
              },
            ]}
            onEditRow={async (row) => {
              await new Promise((resolve) => {
                window.setTimeout(resolve, 100);
              });
              setTableRows((currentRows) =>
                currentRows.map((currentRow) => {
                  if (currentRow.id !== row.id) {
                    return currentRow;
                  }
                  return {
                    ...currentRow,
                    status: currentRow.status === "paused" ? "active" : "paused",
                  };
                }),
              );
            }}
            onDeleteRow={async (row) => {
              await new Promise((resolve) => {
                window.setTimeout(resolve, 100);
              });
              setTableRows((currentRows) =>
                currentRows.filter((currentRow) => currentRow.id !== row.id),
              );
            }}
            deleteConfirmMessage={(row) => `Delete ${row.name}? This cannot be undone.`}
          />
        </div>
      </section>
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
