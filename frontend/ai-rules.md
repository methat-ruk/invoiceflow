@AGENTS.md

## 1. General Principles

- **No 'any'**: Never use the `any` type. Define proper interfaces or types.
- **Functional Components**: Use arrow functions for all components.
- **Client vs Server**: Default to Server Components. Use `'use client'` only for interactivity (useState, useEffect) or browser APIs.
- **Clean Code**: Follow DRY and SOLID principles.

---

## 2. Naming Conventions

- **Folders/Files in App Router:** kebab-case (e.g., `user-profile/page.tsx`). Used for route segments and URL mapping.
- **Components (Files & Folders):** PascalCase (e.g., `UserProfile.tsx`, `DashboardLayout.tsx`). Used for React components and UI structure.
- **Services:** camelCase (e.g., `authService.ts`, `userService.ts`). Used for API calls and business logic communication layer.
- **Constants:** camelCase files (e.g., `userRoles.ts`, `routes.ts`). Used for application-wide constant values.
- **Config:** camelCase (e.g., `api.ts`, `env.ts`, `appConfig.ts`). Used for environment setup and system configuration.
- **Store:** camelCase (e.g., `authStore.ts`, `appStore.ts`). Used for global state management (e.g., Zustand, Redux).
- **Shared UI Components:** PascalCase (e.g., `Button.tsx`, `Card.tsx`, `Modal.tsx`). Used for reusable low-level UI components.
- **Hooks:** camelCase + prefix use (e.g., `useAuth.ts`, `usePagination.ts`). Used for reusable React stateful logic.
- **Utils:** camelCase (e.g., `formatDate.ts`, `validateEmail.ts`). Used for pure helper functions.
- **Types / Interfaces:** PascalCase (e.g., `User.ts`, `ApiResponse.ts`). Used for shared TypeScript types and interfaces

**File Responsibility Rule**

Each file should have one main responsibility to keep the codebase modular, maintainable, and easier to scale.

**Example structure**

components/ 
└── DataTable/ 
    ├── DataTable.tsx 
    ├── DataTable.types.ts 
    ├── DataTable.utils.ts 
    └── index.ts

**File Responsibilities**

- DataTable.tsx → main UI component
- DataTable.types.ts → TypeScript types/interfaces
- DataTable.utils.ts → helper functions related to the component
- index.ts → Optional barrel file used for cleaner imports

---

## 3. Folder Structure Standards

This project uses Next.js App Router and follows a standard folder structure
All application source code must be located inside the src directory

Folders that exist in the current implementation:

- `/app`: All routes and layouts (App Router)
- `/components/ui`: Atomic components (Shadcn)
- `/components/shared`: Reusable business components (e.g., ConfirmDialog)
- `/components/layout`: Sidebar, Topbar, ThemeToggle
- `/components/providers`: Context providers (e.g., ThemeProvider)
- `/lib`: HTTP client and utilities (e.g., `api.ts` — axios instance)
- `/types`: Shared TypeScript definitions (`index.ts`)
- `/services`: API call layer (e.g., `clientService.ts`, `projectService.ts`, `invoiceService.ts`)
- `/store`: Global state management via Zustand (e.g., `authStore.ts`)

---

## 4. Agent-Specific Instructions (MANDATORY)

- **Plan First (MANDATORY):**  
  AI MUST summarize the implementation plan and get explicit user confirmation before writing any code

- **Check Environment (REQUIRED):**  
  AI MUST verify that all required environment variables exist in `.env.example` before implementation

- **Verify Build (REQUIRED):**  
  AI MUST ensure both frontend and backend compile and run without errors

  - **Frontend:** `npm run build` or `next lint`
  - **Backend:** `npm run build` (NestJS) and ensure no runtime errors

- **Error Handling (REQUIRED):**  
  AI MUST wrap async operations (API routes, Server Actions) in try-catch and validate inputs using Zod

## 4.1 Mandatory Planning Workflow (CRITICAL)

Before writing any code, the AI MUST follow this workflow:

### Step 1: Understand the Task
- Analyze the user's request
- Identify scope, affected modules, and requirements

### Step 2: Create a Plan
- Break down the implementation into clear steps
- Specify:
  - Files to create or update
  - Components / services involved
  - Data flow and logic

### Step 3: Present the Plan
- Show the plan to the user clearly
- DO NOT start coding yet

### Step 4: Get Confirmation
- Wait for explicit user approval or feedback

### Step 5: Execute
- Only after confirmation, proceed with implementation

---

### Strict Rules

- No plan → No code
- No confirmation → Do not proceed
- If the task is unclear → ask questions BEFORE planning
- If the task changes → re-plan and confirm again
- If AI starts coding without a plan → STOP and restart with planning

---

## 5. CSS & UI & Responsive Design Rules

- Use Tailwind CSS for all styling
- Use `clsx` for conditional className handling
- Avoid inline styles
- The UI MUST follow mobile-first design
- Build layouts starting from mobile → tablet → desktop
- Use Tailwind responsive breakpoints (sm, md, lg, xl)

**Key Principle**
Design must adapt for usability, not just shrink the layout

---

## 6. Blocked Files (Blacklist)

AI MUST NOT read, scan, summarize, or include the following:

Dependencies

/node_modules/

Build outputs

/.next/
/dist/
/build/

Logs & temp

**/*.log
/logs/
/tmp/
/.cache/

Environment & secrets (CRITICAL)

.env*
.env.*
!.env.example

Lock files

**/package-lock.json

## 7. API Rules (MANDATORY)
- All API endpoints MUST start with /api
- Use RESTful conventions only
- Use kebab-case and plural nouns
- **Example:** `GET /api/...`, `POST /api/...`, `GET /api/.../:id`


## 8. Git Rules
- AI MUST NOT execute any git commands (`commit`, `push`, `pull`, `branch`)


## 9. Backend uses ES Module (ESM).

Rules:
- Use import/export only
- Do NOT use require, module.exports, or exports
- Always include file extensions in imports (e.g., './file.js')
- Assume "type": "module" in package.json

Strictly no CommonJS allowed

## 10. Theme Direction

The system supports both **Light** and **Dark** mode via a toggle in the Topbar, with localStorage persistence and system preference fallback.

**Shared rules:**
- Use `dark:` Tailwind prefix for all dark mode classes — toggled via `.dark` class on `<html>`
- Avoid pure white (#fff) or pure black (#000) — use slate scale for visual comfort
- Maintain consistent contrast across both themes for readability on data-heavy content

## 11. Form Validation & User Feedback Rules

The system MUST provide clear feedback to users when input errors or system actions occur. Two types of feedback must be used.

### Inline Validation (Form Errors)

Used for **form input validation errors**.

Rules:

* Display validation errors **directly on the input field**
* Highlight the input with a **red border**
* Show a **clear error message below the input**
* Validation must trigger on:

  * form submit
  * input blur
  * invalid user input

Examples:

* Required fields not filled
* Invalid email format
* Password too short
* Invalid numeric values

### Toast Notifications (Global Feedback)

Used for **system actions and API results**.

Rules:

* Display notifications at the **top-right corner**
* Notifications must **auto-dismiss after ~3 seconds**
* Must support the following types:

  * success
  * error
  * warning
  * info

Examples:

* Invoice created successfully
* Failed to update client
* Network error occurred

### Key Principle

* Use **Inline Validation** for user input errors
* Use **Toast Notifications** for system feedback

Never rely only on toast notifications for form validation.

---

## 12. API Error Handling Standards

All API interactions MUST implement consistent error handling.

Rules:

* All async operations MUST use **try-catch**
* All API responses must return **structured JSON responses**
* Error messages must be **user-friendly**
* Internal errors must NOT expose sensitive system details

Recommended API response format:

```json
{
  "success": false,
  "message": "Failed to create invoice",
  "error": "VALIDATION_ERROR"
}
```

Frontend must handle:

* network errors
* validation errors
* server errors (5xx)
* unauthorized access (401)

---

## 13. Loading State Rules

The UI MUST always indicate when data is loading.

Rules:

* Use **loading indicators** for async operations
* Prevent duplicate actions while loading
* Disable submit buttons during API calls
* Show skeleton loaders for data-heavy components

Examples:

* Table loading → show skeleton rows
* Form submission → disable submit button + loading spinner
* Page navigation → show loading indicator

Never leave users wondering if an action is processing.

---

## 14. Empty State Rules

The UI MUST clearly indicate when no data exists.

Rules:

* Display a **friendly empty state message**
* Provide guidance on what the user can do next
* Optionally include a **call-to-action button**

Examples:

Clients page with no data:

```
No clients yet
Create your first client to start managing invoices.
[ Create Client ]
```

Invoices page:

```
No invoices found
Invoices will appear here once created.
```

Key Principle:

Empty states must **guide the user toward the next action**, not just display "No data".

## 15. Security Guidelines

Security must be considered in both frontend and backend implementations. The system MUST follow secure development practices to prevent common vulnerabilities.

### Input Validation

All external input MUST be validated.

Rules:

* Validate all request data using **Zod schemas**
* Never trust user input
* Reject invalid or malformed requests
* Sanitize inputs when necessary

Examples:

* Form input validation
* API request body validation
* Query parameter validation

---

### Authentication & Authorization

Sensitive routes MUST require proper authentication and authorization.

Rules:

* Protect all private API endpoints
* Verify authentication before accessing protected resources
* Restrict access based on user roles or permissions where applicable
* Never expose protected data without authorization checks

Examples:

* `/api/invoices`
* `/api/clients`
* `/api/dashboard`

---

### Sensitive Data Protection

Sensitive information MUST never be exposed.

Rules:

* Never return secrets in API responses
* Never log sensitive information
* Avoid exposing internal error details to users

Sensitive data examples:

* passwords
* tokens
* API keys
* database credentials

---

### Environment Variables

All secrets MUST be stored in environment variables.

Rules:

* Never hardcode secrets in the codebase
* Store sensitive configuration in `.env`
* Commit only `.env.example` to the repository
* `.env` files must be included in `.gitignore`

Examples:

```
DATABASE_URL=
JWT_SECRET=
API_KEY=
```

---

### Rate Limiting & Abuse Protection

Public endpoints should implement protections against abuse.

Rules:

* Apply rate limiting where appropriate
* Prevent brute force attacks on authentication endpoints
* Limit repeated requests to sensitive routes

Examples:

* login endpoint
* password reset endpoint
* public API routes

---

### Dependencies & Updates

Dependencies must be maintained securely.

Rules:

* Regularly update packages
* Monitor for known vulnerabilities
* Avoid unnecessary dependencies

Recommended practice:

Run security audits periodically.

```
npm audit
```

---

### Key Principle

Security must be considered **by default**, not as an afterthought.

Every feature must assume:

* inputs may be malicious
* APIs may be abused
* sensitive data must be protected

## 16. SaaS UI Theme & Design Rules

The UI must follow a **modern Vibrant SaaS dashboard design style** optimized for productivity and readability.

The design must support **both Light Mode and Dark Mode**.

### Design Philosophy

The interface must follow these principles:

* Clean and minimal with vibrant primary accent
* Data-first design
* Color used for meaning and brand identity
* High readability for financial data

---

### Color System

This project uses the **Vibrant SaaS Theme** with violet as primary and sky as accent.

All colors are defined as CSS custom properties in `globals.css` using oklch color space.

Primary color

```
violet  (violet-600 light / violet-500 dark)
```

Accent color

```
sky  (sky-500 light / sky-400 dark)
```

Neutral base

```
gray
```

Status colors

```
success → green
warning → orange
error   → red
info    → sky
```

---

### Light Mode

Backgrounds

```
Page background  → gray-50
Card background  → white
Sidebar          → violet-50
Border           → gray-200
```

Text

```
Heading → gray-900
Muted   → gray-500
```

Primary buttons

```
bg-violet-600
hover:bg-violet-700
text-white
```

---

### Dark Mode

Backgrounds

```
Page background → gray-950
Card background → gray-900
Sidebar         → gray-900
Border          → gray-800
```

Text

```
Heading → gray-100
Muted   → gray-500
```

Primary buttons

```
bg-violet-500
hover:bg-violet-600
text-white
```

---

### Status Colors (Business Meaning)

Invoice status mapping

```
Draft   → gray
Sent    → sky
Paid    → green
Overdue → red
```

Status colors must be consistent across the entire system.

---

## 17. Dashboard UX Rules

Dashboards must prioritize **clarity and speed of information scanning**.

### Layout Structure

Standard SaaS dashboard layout:

```
Sidebar (navigation)
Topbar (actions / profile / theme toggle)
Main content area
```

Rules

* Navigation must be visible and consistent
* Important actions should be easily accessible
* Avoid deep navigation hierarchies

---

### Information Hierarchy

Important data must be visually prioritized.

Example dashboard layout

```
KPI cards
Charts
Tables
Recent activity
```

Rules

* Show key metrics at the top
* Display summaries before detailed data
* Avoid cluttering the dashboard with too many widgets

---

### Card Design

Cards should group related information.

Rules

* Use consistent padding
* Use subtle borders
* Maintain consistent spacing

Example spacing

```
gap-4
gap-6
gap-8
```

---

## 18. Data Visualization Rules

Charts and graphs must be designed for **clarity and business insights**.

### Chart Usage

Use charts only when they improve understanding.

Recommended charts

```
Bar chart     → comparisons
Line chart    → trends over time
Pie / donut   → proportions
```

Avoid unnecessary or complex charts.

---

### Chart Design Rules

* Use consistent color mapping
* Use limited colors
* Highlight important data points
* Ensure charts remain readable in dark mode

Example mapping

```
Revenue → blue
Expenses → red
Profit → green
```

---

### Labels & Tooltips

Rules

* All charts must have labels
* Provide tooltips for detailed values
* Numbers must use clear formatting

Example

```
$1,250.00
```

---

## 19. Financial UI Rules

Financial applications must prioritize **accuracy, clarity, and trust**.

### Number Formatting

All financial values must follow consistent formatting.

Rules

* Use currency symbols
* Include thousand separators
* Show decimal places when necessary

Example

```
$1,250.00
$12,450.50
```

---

### Financial Data Presentation

Rules

* Align numbers to the **right in tables**
* Use **monospace fonts for financial values**
* Highlight totals and important values

Example

```
font-mono
text-right
font-semibold (for totals)
```

---

### Status Indicators

Financial status must be visually clear.

Examples

```
Paid → green badge
Overdue → red badge
Pending → amber badge
```

Do not rely only on color. Always include text labels.

---

### Financial Safety

Rules

* Confirm destructive actions (delete invoice, cancel payment)
* Display confirmation dialogs before critical actions
* Prevent accidental financial operations
