# Registration + Data Table Interface Design

Issue: #39

## Scope
- New registration block (`auth-sign-up`)
- New API-driven data table block (`data-table`)

## 1. Registration Contract (`AuthSignUp`)

### Frontend payload (from component)

```ts
export type AuthSignUpPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};
```

### Frontend validation hooks

```ts
export type AuthSignUpErrors = Partial<Record<keyof AuthSignUpPayload, string>> & {
  form?: string;
};

validate?: (payload: AuthSignUpPayload) => AuthSignUpErrors;
onSubmitRegistration?: (payload: AuthSignUpPayload) => void | Promise<void>;
```

### Recommended backend endpoint

- `POST /api/register`

Request:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@company.com",
  "password": "StrongPassword123!",
  "confirmPassword": "StrongPassword123!",
  "acceptTerms": true
}
```

Success response (`201 Created`):

```json
{
  "userId": "usr_123",
  "email": "ada@company.com",
  "status": "pending_verification"
}
```

Validation response (`422 Unprocessable Entity`):

```json
{
  "code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fieldErrors": {
    "email": "Email already exists",
    "password": "Password does not meet policy"
  }
}
```

### Error-handling guidance

- `400`: malformed payload
- `409`: email conflict
- `422`: semantic validation errors (recommended for field-level messages)
- `429`: throttling
- `500`: internal errors

Mapping guidance:
- `fieldErrors.<field>` -> inline field message
- `message` -> form-level fallback (`errors.form`)

## 2. Data Table Contract (`DataTable`)

### Core frontend interfaces

```ts
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
```

### Query semantics

- Search is debounced on client (`searchDebounceMs`), executed server-side.
- Sort is server-side (`sort.field`, `sort.direction`).
- Pagination is server-side (`page`, `pageSize`, `total`).
- `filters` is reserved for advanced filtering and should be forwarded transparently.

### Recommended list endpoint

- `GET /api/users`

Query params:
- `q=<search>`
- `page=<number>`
- `pageSize=<number>`
- `sortField=<column>`
- `sortDirection=asc|desc`

Success response (`200 OK`):

```json
{
  "rows": [
    {
      "id": 1,
      "name": "User 1",
      "email": "user1@example.com",
      "status": "active"
    }
  ],
  "total": 321,
  "page": 1,
  "pageSize": 20
}
```

### Row action contract

```ts
export type DataTableRowAction<Row> = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: Row) => void | Promise<void>;
  tone?: "default" | "danger";
  isVisible?: (row: Row) => boolean;
  isDisabled?: (row: Row) => boolean;
  confirm?: string | ((row: Row) => string);
  refreshAfterSuccess?: boolean;
};
```

Built-in shortcuts:
- `onEditRow`: adds icon edit action
- `onDeleteRow`: adds icon delete action + confirm message

### Recommended mutation endpoints

- `PATCH /api/users/:id` (edit)
- `DELETE /api/users/:id` (delete)

Suggested responses:
- `200/204` on success
- `404` if row not found
- `409` for state conflict
- `422` for business validation

## 3. Concurrency and UX Behavior

- The table fetcher receives `AbortSignal` and must pass it to `fetch` to cancel stale requests.
- Multiple quick query updates (search/sort/pagination) should allow latest-only rendering.
- After row mutation success, refresh list by default (`refreshAfterSuccess` default true).
- Action errors are displayed inline per row to keep error context close to the action source.

## 4. Security and backend guardrails

- Enforce server-side whitelist for `sortField`.
- Sanitize/escape `search` input for SQL/ORM query building.
- Validate `page/pageSize` bounds and cap max page size.
- Require authn/authz for list and mutation endpoints.

## 5. Implemented Files

- `packages/blocks/src/auth-sign-up.tsx`
- `packages/blocks/src/data-table.tsx`
- `packages/blocks/src/stories/auth-sign-up.stories.jsx`
- `packages/blocks/src/stories/data-table.stories.jsx`
- `packages/blocks/registry/auth-sign-up.json`
- `packages/blocks/registry/data-table.json`
