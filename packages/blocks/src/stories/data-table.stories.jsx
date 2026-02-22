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
import { DataTable } from "../data-table";

function buildSeedRows(count = 128) {
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
      lastSeen: `2026-02-${String((index % 20) + 1).padStart(2, "0")}`,
    };
  });
}

const interfaceCode = [
  "import type {",
  "  DataTableColumn,",
  "  DataTableFetcher,",
  "  DataTablePageResult,",
  "  DataTableQuery,",
  "  DataTableRowAction,",
  '} from "@curious-ui/blocks";',
  "",
  "type UserRow = {",
  "  id: number;",
  "  name: string;",
  "  email: string;",
  "  region: string;",
  "  status: string;",
  "};",
  "",
  "const fetchUsers: DataTableFetcher<UserRow> = async (query, { signal }) => {",
  "  const params = new URLSearchParams({",
  "    q: query.search,",
  "    page: String(query.page),",
  "    pageSize: String(query.pageSize),",
  "    sortField: query.sort?.field ?? '',",
  "    sortDirection: query.sort?.direction ?? '',",
  "  });",
  "",
  "  const response = await fetch('/api/users?' + params.toString(), { signal });",
  "  if (!response.ok) throw new Error('Failed to fetch users');",
  "",
  "  const payload = (await response.json()) as DataTablePageResult<UserRow>;",
  "  return payload;",
  "};",
  "",
  "const columns: DataTableColumn<UserRow>[] = [",
  "  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },",
  "  { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },",
  "  { id: 'status', header: 'Status', accessorKey: 'status', sortable: true },",
  "];",
  "",
  "const rowActions: DataTableRowAction<UserRow>[] = [",
  "  {",
  "    id: 'impersonate',",
  "    label: 'Impersonate',",
  "    onClick: async (row) => {",
  "      await fetch('/api/admin/impersonate/' + row.id, { method: 'POST' });",
  "    },",
  "  },",
  "];",
].join("\n");

const docsOverview = [
  "## API Contract Design",
  "",
  "The table is fully server-driven through one typed fetch contract:",
  "",
  "- `DataTableQuery`: search + page/pageSize + sort + optional filters",
  "- `DataTableFetcher<T>`: query -> paged result (supports `AbortSignal`)",
  "- `DataTableColumn<T>`: sortable columns + custom cell renderers",
  "- `DataTableRowAction<T>`: iconized row actions with optional confirm and refresh behavior",
  "",
  "Built-in interaction coverage:",
  "",
  "- Search input with debounce",
  "- Server-side sort field/direction",
  "- Server-side pagination and result count",
  "- Edit/Delete shortcuts (`onEditRow`, `onDeleteRow`) with icon actions",
  "- Inline action error display and reload",
].join("\n");

function getStatusClass(status) {
  if (status === "active") {
    return "bg-emerald-500/10 text-emerald-700";
  }

  if (status === "paused") {
    return "bg-amber-500/10 text-amber-700";
  }

  return "bg-slate-500/10 text-slate-700";
}

export default {
  title: "Blocks/Data Table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Markdown>{docsOverview}</Markdown>
          <Markdown>{"## Interface + Backend Integration Example"}</Markdown>
          <Source code={interfaceCode} language="tsx" />
          <StoriesBlock />
        </>
      ),
    },
  },
};

export const ApiDriven = {
  render: () => {
    const [rows, setRows] = React.useState(() => buildSeedRows());

    const columns = React.useMemo(
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
          sortable: true,
          accessorKey: "status",
          cell: (row) => (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(row.status)}`}
            >
              {row.status}
            </span>
          ),
        },
        {
          id: "lastSeen",
          header: "Last Seen",
          accessorKey: "lastSeen",
          sortable: true,
          align: "right",
        },
      ],
      [],
    );

    const fetchPage = React.useCallback(
      async (query, { signal }) => {
        await new Promise((resolve, reject) => {
          const timeoutId = window.setTimeout(resolve, 220);
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
        let filteredRows = rows;

        if (normalizedSearch) {
          filteredRows = rows.filter((row) => {
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
      [rows],
    );

    return (
      <DataTable
        title="User Directory"
        description="Server-driven table contract with debounced search, sorting, pagination, and row actions."
        columns={columns}
        fetchPage={fetchPage}
        searchPlaceholder="Search user, email, region, status"
        onEditRow={async (row) => {
          await new Promise((resolve) => {
            window.setTimeout(resolve, 120);
          });

          setRows((currentRows) =>
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
            window.setTimeout(resolve, 120);
          });

          setRows((currentRows) => currentRows.filter((currentRow) => currentRow.id !== row.id));
        }}
        deleteConfirmMessage={(row) => `Delete ${row.name}? This cannot be undone.`}
        rowActions={[
          {
            id: "view",
            label: "View detail",
            onClick: (row) => {
              window.alert(`Open detail for #${row.id}`);
            },
            refreshAfterSuccess: false,
          },
        ]}
        initialQuery={{
          pageSize: 12,
          sort: { field: "name", direction: "asc" },
        }}
      />
    );
  },
};
