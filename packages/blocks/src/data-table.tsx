import * as React from "react";

type AsyncResult = void | Promise<void>;

export type DataTableSortDirection = "asc" | "desc";

export type DataTableSort = {
  field: string;
  direction: DataTableSortDirection;
};

export type DataTableQuery = {
  search: string;
  page: number;
  pageSize: number;
  sort?: DataTableSort;
  filters?: Record<string, unknown>;
};

export type DataTablePageResult<Row> = {
  rows: Row[];
  total: number;
  page: number;
  pageSize: number;
};

export type DataTableFetcher<Row> = (
  query: DataTableQuery,
  context: { signal: AbortSignal },
) => Promise<DataTablePageResult<Row>>;

export type DataTableColumn<Row> = {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof Row & string;
  cell?: (row: Row) => React.ReactNode;
  sortable?: boolean;
  sortField?: string;
  align?: "left" | "center" | "right";
  width?: string;
};

export type DataTableRowAction<Row> = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: Row) => AsyncResult;
  tone?: "default" | "danger";
  isVisible?: (row: Row) => boolean;
  isDisabled?: (row: Row) => boolean;
  confirm?: string | ((row: Row) => string);
  refreshAfterSuccess?: boolean;
};

type DataTableProps<Row> = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  title?: string;
  description?: string;
  columns: DataTableColumn<Row>[];
  fetchPage: DataTableFetcher<Row>;
  rowActions?: DataTableRowAction<Row>[];
  onEditRow?: (row: Row) => AsyncResult;
  onDeleteRow?: (row: Row) => AsyncResult;
  deleteConfirmMessage?: string | ((row: Row) => string);
  editActionLabel?: string;
  deleteActionLabel?: string;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
  pageSizeOptions?: number[];
  initialQuery?: Partial<DataTableQuery>;
  reloadToken?: string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowId?: (row: Row, index: number) => string;
  onQueryChange?: (query: DataTableQuery) => void;
};

const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
const BUTTON_CLASS =
  "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ACTION_BUTTON_CLASS =
  "inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return Boolean(value) && typeof (value as Promise<unknown>).then === "function";
}

function toErrorMessage(value: unknown, fallback: string) {
  if (value instanceof Error && value.message.trim().length > 0) {
    return value.message;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return fallback;
}

function normalizeInitialQuery(initialQuery?: Partial<DataTableQuery>): DataTableQuery {
  const pageSize = initialQuery?.pageSize ?? 10;
  const page = initialQuery?.page ?? 1;

  return {
    search: initialQuery?.search ?? "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
    sort: initialQuery?.sort,
    filters: initialQuery?.filters,
  };
}

function normalizePageResult<Row>(result: DataTablePageResult<Row>, fallback: DataTableQuery) {
  const normalizedPageSize =
    Number.isFinite(result.pageSize) && result.pageSize > 0 ? result.pageSize : fallback.pageSize;
  const normalizedPage =
    Number.isFinite(result.page) && result.page > 0 ? result.page : fallback.page;
  const normalizedTotal = Number.isFinite(result.total) && result.total >= 0 ? result.total : 0;

  return {
    rows: Array.isArray(result.rows) ? result.rows : [],
    page: normalizedPage,
    pageSize: normalizedPageSize,
    total: normalizedTotal,
  };
}

function defaultGetRowId<Row>(row: Row, index: number) {
  const maybeRecord = row as Record<string, unknown>;
  const fallback = maybeRecord.id;
  if (typeof fallback === "string" || typeof fallback === "number") {
    return String(fallback);
  }
  return String(index);
}

function getCellAlignClass(align: DataTableColumn<unknown>["align"]) {
  if (align === "center") {
    return "text-center";
  }
  if (align === "right") {
    return "text-right";
  }
  return "text-left";
}

function getSortIcon(activeSort: DataTableSort | undefined, field: string) {
  if (activeSort?.field !== field) {
    return <SortIcon />;
  }

  if (activeSort.direction === "asc") {
    return <SortAscIcon />;
  }

  return <SortDescIcon />;
}

export function DataTable<Row>({
  title = "Records",
  description = "Search, sort, paginate, and run row actions with a single API contract.",
  columns,
  fetchPage,
  rowActions,
  onEditRow,
  onDeleteRow,
  deleteConfirmMessage = "Delete this row? This action cannot be undone.",
  editActionLabel = "Edit row",
  deleteActionLabel = "Delete row",
  searchPlaceholder = "Search",
  searchDebounceMs = 350,
  pageSizeOptions = [10, 20, 50],
  initialQuery,
  reloadToken,
  emptyTitle = "No data found",
  emptyDescription = "Adjust the search query or create a new record.",
  getRowId = defaultGetRowId,
  onQueryChange,
  className,
  ...props
}: DataTableProps<Row>) {
  const normalizedInitialQuery = React.useMemo(
    () => normalizeInitialQuery(initialQuery),
    [initialQuery],
  );
  const [query, setQuery] = React.useState<DataTableQuery>(normalizedInitialQuery);
  const [searchInput, setSearchInput] = React.useState(normalizedInitialQuery.search);
  const [result, setResult] = React.useState<DataTablePageResult<Row>>({
    rows: [],
    page: normalizedInitialQuery.page,
    pageSize: normalizedInitialQuery.pageSize,
    total: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = React.useState(0);
  const [pendingAction, setPendingAction] = React.useState<{
    rowId: string;
    actionId: string;
  } | null>(null);
  const [actionError, setActionError] = React.useState<{ rowId: string; message: string } | null>(
    null,
  );
  const requestVersionRef = React.useRef(0);
  const reloadMarker = React.useMemo(
    () => `${String(reloadToken ?? "")}:${reloadVersion}`,
    [reloadToken, reloadVersion],
  );
  const normalizedPageSizeOptions = React.useMemo(() => {
    const unique = new Set(
      pageSizeOptions
        .filter((option) => Number.isFinite(option) && option > 0)
        .map((option) => Number(option)),
    );
    unique.add(query.pageSize);
    return Array.from(unique).sort((left, right) => left - right);
  }, [pageSizeOptions, query.pageSize]);

  React.useEffect(() => {
    setQuery(normalizedInitialQuery);
    setSearchInput(normalizedInitialQuery.search);
  }, [normalizedInitialQuery]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQuery((currentQuery) => {
        if (currentQuery.search === searchInput) {
          return currentQuery;
        }

        return {
          ...currentQuery,
          search: searchInput,
          page: 1,
        };
      });
    }, searchDebounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchDebounceMs, searchInput]);

  React.useEffect(() => {
    onQueryChange?.(query);
  }, [onQueryChange, query]);

  React.useEffect(() => {
    // Keeps external/manual reloads in the effect dependency model.
    void reloadMarker;

    const controller = new AbortController();
    const requestVersion = ++requestVersionRef.current;

    setIsLoading(true);
    setErrorMessage(null);

    Promise.resolve()
      .then(() => fetchPage(query, { signal: controller.signal }))
      .then((nextResult) => {
        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        setResult(normalizePageResult(nextResult, query));
      })
      .catch((requestError) => {
        if (controller.signal.aborted || requestVersion !== requestVersionRef.current) {
          return;
        }

        setErrorMessage(toErrorMessage(requestError, "Failed to load table data."));
      })
      .finally(() => {
        if (controller.signal.aborted || requestVersion !== requestVersionRef.current) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [fetchPage, query, reloadMarker]);

  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const canGoPrevious = query.page > 1;
  const canGoNext = query.page < totalPages;

  React.useEffect(() => {
    if (query.page > totalPages) {
      setQuery((currentQuery) => ({
        ...currentQuery,
        page: totalPages,
      }));
    }
  }, [query.page, totalPages]);

  const visibleActions = React.useMemo(() => {
    const nextActions: DataTableRowAction<Row>[] = [...(rowActions ?? [])];

    if (onEditRow) {
      nextActions.unshift({
        id: "edit",
        label: editActionLabel,
        icon: <EditIcon />,
        onClick: onEditRow,
        refreshAfterSuccess: true,
      });
    }

    if (onDeleteRow) {
      nextActions.push({
        id: "delete",
        label: deleteActionLabel,
        icon: <TrashIcon />,
        tone: "danger",
        confirm: deleteConfirmMessage,
        onClick: onDeleteRow,
        refreshAfterSuccess: true,
      });
    }

    return nextActions;
  }, [
    deleteActionLabel,
    deleteConfirmMessage,
    editActionLabel,
    onDeleteRow,
    onEditRow,
    rowActions,
  ]);

  const hasActionColumn = visibleActions.length > 0;

  const refreshData = React.useCallback(() => {
    setReloadVersion((currentVersion) => currentVersion + 1);
  }, []);

  const handleSort = React.useCallback((column: DataTableColumn<Row>) => {
    if (!column.sortable) {
      return;
    }

    const field = column.sortField ?? column.accessorKey ?? column.id;
    setQuery((currentQuery) => {
      const isSameField = currentQuery.sort?.field === field;
      const nextDirection: DataTableSortDirection =
        isSameField && currentQuery.sort?.direction === "asc" ? "desc" : "asc";

      return {
        ...currentQuery,
        page: 1,
        sort: {
          field,
          direction: nextDirection,
        },
      };
    });
  }, []);

  const handlePageSizeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const nextPageSize = Number(event.target.value);
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: 1,
      pageSize:
        Number.isFinite(nextPageSize) && nextPageSize > 0 ? nextPageSize : currentQuery.pageSize,
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: Math.max(1, Math.min(page, totalPages)),
    }));
  };

  const handleRowAction = async (row: Row, rowIndex: number, action: DataTableRowAction<Row>) => {
    const rowId = getRowId(row, rowIndex);

    if (action.isDisabled?.(row)) {
      return;
    }

    if (action.confirm) {
      const confirmationText =
        typeof action.confirm === "function" ? action.confirm(row) : action.confirm;
      if (typeof window !== "undefined" && !window.confirm(confirmationText)) {
        return;
      }
    }

    setActionError(null);

    let actionResult: AsyncResult;
    try {
      actionResult = action.onClick(row);
    } catch (mutationError) {
      setActionError({
        rowId,
        message: toErrorMessage(mutationError, "Action failed."),
      });
      return;
    }

    if (!isPromiseLike(actionResult)) {
      if (action.refreshAfterSuccess ?? true) {
        refreshData();
      }
      return;
    }

    setPendingAction({ rowId, actionId: action.id });
    try {
      await actionResult;
      if (action.refreshAfterSuccess ?? true) {
        refreshData();
      }
    } catch (mutationError) {
      setActionError({
        rowId,
        message: toErrorMessage(mutationError, "Action failed."),
      });
    } finally {
      setPendingAction(null);
    }
  };

  const renderBody = () => {
    if (isLoading && result.rows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length + (hasActionColumn ? 1 : 0)} className="px-4 py-8">
            <div className="grid gap-3" aria-live="polite" aria-busy="true">
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          </td>
        </tr>
      );
    }

    if (errorMessage) {
      return (
        <tr>
          <td
            colSpan={columns.length + (hasActionColumn ? 1 : 0)}
            className="px-4 py-8 text-center"
          >
            <div className="mx-auto grid max-w-lg gap-3">
              <p className="text-sm text-destructive">{errorMessage}</p>
              <div>
                <button type="button" className={BUTTON_CLASS} onClick={refreshData}>
                  <RefreshIcon />
                  Retry
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    if (result.rows.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length + (hasActionColumn ? 1 : 0)}
            className="px-4 py-10 text-center"
          >
            <div className="mx-auto grid max-w-lg gap-2">
              <p className="text-sm font-medium">{emptyTitle}</p>
              <p className="text-sm text-muted-foreground text-pretty">{emptyDescription}</p>
              {query.search ? (
                <div>
                  <button
                    type="button"
                    className={BUTTON_CLASS}
                    onClick={() => {
                      setSearchInput("");
                    }}
                  >
                    Clear search
                  </button>
                </div>
              ) : null}
            </div>
          </td>
        </tr>
      );
    }

    return result.rows.map((row, rowIndex) => {
      const rowId = getRowId(row, rowIndex);

      return (
        <tr key={rowId} className="border-b last:border-0">
          {columns.map((column) => {
            const rawValue = column.accessorKey
              ? (row as Record<string, unknown>)[column.accessorKey]
              : undefined;
            const cellContent = column.cell ? column.cell(row) : (rawValue as React.ReactNode);

            return (
              <td
                key={column.id}
                className={cn("px-4 py-3 text-sm text-foreground", getCellAlignClass(column.align))}
                style={column.width ? { width: column.width } : undefined}
              >
                {cellContent}
              </td>
            );
          })}

          {hasActionColumn ? (
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                {visibleActions.map((action) => {
                  if (action.isVisible && !action.isVisible(row)) {
                    return null;
                  }

                  const isPending =
                    pendingAction?.rowId === rowId && pendingAction.actionId === action.id;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      className={cn(
                        ACTION_BUTTON_CLASS,
                        action.tone === "danger" && "text-destructive hover:text-destructive",
                      )}
                      aria-label={action.label}
                      title={action.label}
                      disabled={isPending || Boolean(action.isDisabled?.(row))}
                      onClick={() => {
                        void handleRowAction(row, rowIndex, action);
                      }}
                    >
                      {action.icon ?? <ActionIcon />}
                    </button>
                  );
                })}
              </div>
              {actionError?.rowId === rowId ? (
                <p className="mt-2 text-right text-xs text-destructive">{actionError.message}</p>
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    });
  };

  const rangeStart = result.total === 0 ? 0 : (query.page - 1) * query.pageSize + 1;
  const rangeEnd = result.total === 0 ? 0 : Math.min(query.page * query.pageSize, result.total);

  return (
    <section className={cn("rounded-xl border bg-card text-card-foreground", className)} {...props}>
      <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-balance">{title}</h2>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <label className="relative block min-w-64" htmlFor="data-table-search">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="data-table-search"
              className={cn(INPUT_CLASS, "pl-9")}
              type="search"
              value={searchInput}
              placeholder={searchPlaceholder}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
            />
          </label>

          <button type="button" className={BUTTON_CLASS} onClick={refreshData} disabled={isLoading}>
            <RefreshIcon />
            Reload
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full tabular-nums">
          <thead>
            <tr className="border-b bg-muted/30">
              {columns.map((column) => {
                const sortField = column.sortField ?? column.accessorKey ?? column.id;

                return (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-xs font-semibold uppercase text-muted-foreground",
                      getCellAlignClass(column.align),
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => {
                          handleSort(column);
                        }}
                      >
                        <span>{column.header}</span>
                        {getSortIcon(query.sort, sortField)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}

              {hasActionColumn ? (
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground"
                >
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="tabular-nums">
          Showing {rangeStart}-{rangeEnd} of {result.total}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2">
            <span>Rows</span>
            <select
              className={cn(INPUT_CLASS, "h-8 w-auto py-0")}
              value={query.pageSize}
              onChange={handlePageSizeChange}
            >
              {normalizedPageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={BUTTON_CLASS}
            disabled={!canGoPrevious}
            onClick={() => {
              handlePageChange(query.page - 1);
            }}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>

          <span className="min-w-16 text-center tabular-nums">
            {query.page} / {totalPages}
          </span>

          <button
            type="button"
            className={BUTTON_CLASS}
            disabled={!canGoNext}
            onClick={() => {
              handlePageChange(query.page + 1);
            }}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

type IconProps = React.ComponentPropsWithoutRef<"svg">;

function iconClassName(className?: string) {
  return cn("size-4", className);
}

export function ActionIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M3 16h4v4" />
      <path d="M21 8h-4V4" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L7 21H3v-4z" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6v14h12V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function SortIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="m8 9 4-4 4 4" />
      <path d="m16 15-4 4-4-4" />
    </svg>
  );
}

export function SortAscIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="m8 14 4-4 4 4" />
    </svg>
  );
}

export function SortDescIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="m16 10-4 4-4-4" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={iconClassName(props.className)}
      aria-hidden="true"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
