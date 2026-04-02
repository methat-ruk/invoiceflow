@AGENTS.md

## 1. General Principles

- **No 'any'**: Never use the `any` type. Define proper interfaces or types.
- **Functional Components**: Use arrow functions for all components.
- **Client vs Server**: Default to Server Components. Use `'use client'` only for interactivity (useState, useEffect) or browser APIs.
- **Clean Code**: Follow DRY and SOLID principles.

---

## 2. Naming Conventions

- **Folders/Files in App Router:** kebab-case (e.g., `customer-profile/page.tsx`). Used for route segments and URL mapping.
- **Components (Files & Folders):** PascalCase (e.g., `CustomerProfile.tsx`, `AIAssistantPanel.tsx`). Used for React components and UI structure.
- **Services:** camelCase (e.g., `customerService.ts`, `aiService.ts`). Used for API calls and business logic communication layer.
- **Constants:** camelCase files (e.g., `userRoles.ts`, `routes.ts`). Used for application-wide constant values.
- **Config:** camelCase (e.g., `api.ts`, `env.ts`). Used for environment setup and system configuration.
- **Store:** camelCase (e.g., `authStore.ts`, `customerStore.ts`). Used for global state management (e.g., Zustand, Redux).
- **Shared UI Components:** PascalCase (e.g., `Button.tsx`, `Card.tsx`, `Modal.tsx`). Used for reusable low-level UI components.
- **Hooks:** camelCase + prefix use (e.g., `useCustomerAnalytics.ts`). Used for reusable React stateful logic.
- **Utils:** camelCase (e.g., `formatDate.ts`). Used for pure helper functions.

---

## 3. Folder Structure Standards

Folders that exist in the current implementation:

- `/app`: All routes and layouts (App Router)
- `/components/ui`: Atomic components (Shadcn)
- `/components/shared`: Reusable business components (e.g., ConfirmDialog)
- `/components/layout`: Sidebar, Topbar, ThemeToggle
- `/components/providers`: Context providers (e.g., ThemeProvider)
- `/lib`: HTTP client and utilities (e.g., `api.ts` — axios instance)
- `/types`: Shared TypeScript definitions (`index.ts`)
- `/services`: API call layer (e.g., `customerService.ts`, `aiService.ts`)
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

