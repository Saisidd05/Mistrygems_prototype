# Mistry Gems

> A futuristic workflow platform for modern manufacturing teams.

![React](https://img.shields.io/badge/React-18-00B4D8?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-0077B6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-90E0EF?logo=vite&logoColor=03045E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-CAF0F8?logo=tailwindcss&logoColor=03045E)

Mistry Gems brings jobs, customers, inventory, quotations, invoices, tasks, and team operations into one polished workspace. It is designed for MSME manufacturing and job-work workflows, with a responsive blue-glass interface built for fast everyday use.

## Highlights

- **Unified operations hub** — track jobs, customers, employees, inventory, quotations, invoices, notifications, and reports.
- **Role-aware experience** — protected routes and navigation tailored to the signed-in user.
- **Workflow-first UI** — Kanban task management, status badges, data tables, modals, filters, and actionable dashboards.
- **Liquid Glass design system** — Deep Twilight, teal-blue, and frosted-cyan palette with glass surfaces, plasma background, and motion details.
- **Responsive by default** — works across desktop, tablet, and mobile layouts.
- **Frontend performance** — Vite-powered build, TypeScript safety, and reusable React components.

## Product Surface

| Area | What it supports |
| --- | --- |
| Dashboard | Live operational metrics, revenue, performance, and workflow visibility |
| Jobs & Tasks | Job tracking, assignments, priorities, progress, and Kanban workflows |
| Customers & Employees | Relationship records, team information, and operational context |
| Quotations & Invoices | Commercial workflow from estimate through billing |
| Inventory | Material and stock visibility for workshop operations |
| Reports & Notifications | At-a-glance reporting and timely operational alerts |
| Settings | Workspace preferences and user-facing configuration |

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tooling:** Vite
- **Styling:** Tailwind CSS + centralized CSS design tokens
- **Motion:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Interactions:** dnd-kit and Radix UI primitives

## Design System

The interface uses a centralized futuristic color system:

| Token | Value | Purpose |
| --- | --- | --- |
| Deep Twilight | `#03045E` | Application background |
| Bright Teal Blue | `#0077B6` | Primary actions and active states |
| Turquoise Surf | `#00B4D8` | Hover highlights and glow details |
| Frosted Blue | `#90E0EF` | Borders and secondary text |
| Light Cyan | `#CAF0F8` | Primary foreground text |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/Saisidd05/Mistrygems_prototype.git
cd Mistrygems_prototype
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### Production build

```bash
npm run build
```

### Quality checks

```bash
npm run lint
```

## Project Structure

```text
src/
├── components/     # Shared UI, layout, forms, modals, and feedback components
├── context/        # Authentication, application data, theme, and sidebar state
├── lib/            # Data, utilities, and centralized design tokens
├── pages/          # Feature pages and route-level screens
├── App.tsx         # Route and provider composition
└── index.css       # Global theme, glass system, motion, and responsive styles
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across TypeScript source files |

## Deploy on Vercel

This repository includes [vercel.json](./vercel.json), which rewrites client-side routes such as `/dashboard` to the app entry point.

1. Push the repository to GitHub.
2. In Vercel, select **Add New → Project** and import the repository.
3. Vercel automatically detects Vite. Keep the framework preset as **Vite** and deploy.

For a manual setup, use:

| Setting | Value |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node Version | `18` or newer |

## Contributing

1. Create a focused branch.
2. Keep feature behavior and route contracts intact.
3. Run `npm run build` before opening a pull request.
4. Reuse the design tokens and shared UI components for visual consistency.

---

Built for teams that want manufacturing operations to feel as fluid as their craft.
