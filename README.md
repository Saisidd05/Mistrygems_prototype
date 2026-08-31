<div align="center">
  <img src="./assets/logo.png" alt="Mistry Gems Logo" width="120" />

  <h1>💎 Mistry Gems</h1>
  <p><strong>A futuristic workflow platform for modern manufacturing teams.</strong></p>
  <p>Mistry Gems brings jobs, customers, inventory, quotations, invoices, tasks, and team operations into one polished workspace.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" alt="Build Status" />
    <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>

  <p>
    <a href="https://www.mistrygems.in">🚀 Live Demo</a> •
    <a href="#-quick-start">📖 Documentation</a> •
    <a href="https://github.com/Saisidd05/Mistrygems_prototype">💻 GitHub</a>
  </p>
</div>

---

## ✨ PROJECT OVERVIEW

**Mistry Gems** is designed for MSME (Micro, Small & Medium Enterprises) manufacturing and job-work workflows. With a responsive, Liquid Glass design system, it delivers a fast, seamless, and visually stunning everyday operations hub. Track jobs, manage customers, handle inventory, and oversee billing—all from a single, beautifully crafted workspace.

---

## 🎯 PROBLEM

Manufacturing and job-work teams often struggle with disjointed operations:
- 📉 **Scattered Data:** Information is spread across spreadsheets, notebooks, and isolated software.
- ⏳ **Inefficient Tracking:** No real-time visibility into job progress, inventory, or billing.
- 🧩 **Fragmented Workflows:** Switching contexts between CRM, project management, and invoicing tools kills productivity.
- 🎨 **Poor UX:** Existing manufacturing ERPs are often clunky, outdated, and hard to adopt.

---

## 💡 OUR SOLUTION

Mistry Gems solves this by providing a **Unified Operations Hub**:
- Brings jobs, customers, inventory, and billing into **one cohesive platform**.
- Features a **Kanban-style workflow** for intuitive task management.
- Protects routes and customizes the navigation tailored to the signed-in user's role.
- Envelopes everything in a **Liquid Glass** aesthetic (Deep Twilight, teal-blue, and frosted-cyan) for an ultra-modern, engaging experience.

---

## 🌟 KEY FEATURES

| Feature | Description | Benefit |
| :---: | :--- | :--- |
| 📊 **Unified Hub** | Centralized dashboard for operational metrics, revenue, and workflow visibility. | Complete control and real-time oversight. |
| 📋 **Jobs & Tasks** | Kanban boards for job tracking, assignments, priorities, and progress. | Streamlines daily operational execution. |
| 👥 **CRM & Team** | Customer relationship records, team details, and role-aware access. | Enhances collaboration and data security. |
| 💸 **Billing Flow** | Commercial workflows moving seamlessly from quotation to final invoice. | Accelerates the sales-to-cash cycle. |
| 📦 **Inventory** | Live material and stock visibility for workshop operations. | Prevents shortages and overstocking. |
| 🔔 **Alerts & Reports**| At-a-glance reports and real-time operational notifications. | Ensures timely decisions and proactive management. |

---

## 🧠 HOW IT WORKS

```mermaid
graph LR
    A[User] -->|Interacts| B(React/Vite Frontend)
    B -->|State Management| C{Context & Hooks}
    B -->|API Calls| D[Vercel Serverless Functions]
    D -->|JWT Authentication| E(Google OAuth / Auth)
    D -->|CRUD Operations| F[(MongoDB)]
    F -.->|Data| D
    D -.->|JSON| B
    C -.->|Updates UI| A
```

---

## 🏗️ SYSTEM ARCHITECTURE

```mermaid
flowchart TD
    subgraph Frontend [Client Browser]
        React[React 18 SPA]
        Tailwind[Tailwind CSS + Liquid Glass]
        UI[Radix UI + Framer Motion]
        React --> Tailwind
        React --> UI
    end

    subgraph Backend [Vercel Cloud]
        API[Serverless API Functions]
        Auth[JWT & Google OAuth]
    end

    subgraph Database [Database]
        Mongo[(MongoDB)]
    end

    Frontend <-->|REST APIs| API
    Frontend <-->|Token| Auth
    API <-->|Mongoose/Driver| Mongo
```

---

## 🛠️ TECH STACK

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Centralized CSS Tokens |
| **UI/UX** | Framer Motion, Radix UI primitives, dnd-kit, Lucide React, Recharts |
| **Backend** | Vercel Serverless Functions (`api/`) |
| **Database** | MongoDB |
| **Authentication** | JWT, Google OAuth |
| **Deployment** | Vercel |

---

## 📸 VISUAL SHOWCASE

<details>
<summary><b>Click to expand screenshots</b></summary>

### Dashboard
![Dashboard Placeholder](./assets/dashboard.png)

### Kanban Workflow
![Workflow Placeholder](./assets/workflow.png)

### Invoicing
![Invoicing Placeholder](./assets/invoicing.png)

</details>

---

## 🚀 QUICK START

### Prerequisites
- **Node.js**: v18 or newer
- **npm**: v9 or newer
- **MongoDB**: Atlas or local instance

### 1. Clone the repository
```bash
git clone https://github.com/Saisidd05/Mistrygems_prototype.git
cd Mistrygems_prototype
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 ENVIRONMENT VARIABLES

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGODB_DB` | (Optional) Database name | `mistry_gems` |
| `JWT_SECRET` | Secret key for signing sessions | `your_super_secret_string` |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth Client ID | `client-id.apps.googleusercontent.com` |

---

## 📂 PROJECT STRUCTURE

```text
├── api/            # Vercel serverless backend functions (auth, data, chat)
├── db/             # MongoDB connection setup and query documentation
├── src/
│   ├── components/ # Shared UI, layout, forms, modals, and feedback
│   ├── context/    # Authentication, application data, theme, and sidebar
│   ├── lib/        # Data, utilities, and centralized design tokens
│   ├── pages/      # Feature pages and route-level screens
│   ├── App.tsx     # Route and provider composition
│   └── index.css   # Global theme, glass system, motion, and responsive styles
├── .env.example    # Environment template
└── vercel.json     # Deployment configuration and route rewrites
```

---

## 🧪 TESTING & LINTING

Ensure code quality before committing:
```bash
# Run ESLint across TypeScript files
npm run lint

# Build for production
npm run build
```

---

## 🆚 WHAT MAKES IT DIFFERENT

| Feature | Generic ERPs | Mistry Gems |
| :--- | :--- | :--- |
| **Interface** | Clunky, outdated | **Modern "Liquid Glass" UI** |
| **Performance** | Slow page loads | **Lightning fast (Vite + React SPA)** |
| **Workflow** | Rigid, form-based | **Visual Kanban boards (dnd-kit)** |
| **Focus** | One-size-fits-all | **Tailored for Job-work & MSME manufacturing** |

---

## 🔮 ROADMAP

- [x] Initial UI/UX Design System
- [x] Core Authentication & Role Management
- [x] Job & Kanban Task Tracking
- [x] Invoicing & Quotations Module
- [ ] AI-assisted Data Entry
- [ ] Advanced Reporting & Analytics Export
- [ ] Mobile App Port (React Native)

---

## 📜 LICENSE

This project is proprietary and closed-source. All rights reserved.

---

## 👥 TEAM

| Name | Role | GitHub | LinkedIn |
| :--- | :--- | :--- | :--- |
| **[TEAM MEMBER 1]** | Lead Developer | [@Saisidd05](https://github.com/Saisidd05) | [PLACEHOLDER] |
| **[TEAM MEMBER 2]** | UI/UX Designer | [PLACEHOLDER] | [PLACEHOLDER] |

---

## ⭐ SUPPORT

If you found this project helpful, please give it a **star** ⭐️ on GitHub! It helps us grow and continue improving the platform.

---

## 📬 CONTACT

- **GitHub Issues:** [Open an Issue](https://github.com/Saisidd05/Mistrygems_prototype/issues)
- **Project Link:** [https://github.com/Saisidd05/Mistrygems_prototype](https://github.com/Saisidd05/Mistrygems_prototype)
