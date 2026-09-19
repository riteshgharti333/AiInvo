# AiInvo

> **Production-grade full-stack billing platform for invoices, quotations, payments, analytics, AI-assisted invoice creation, and automated customer notifications.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma\&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest\&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 What is AiInvo?

A **self-hosted invoice and quotation management system** built for freelancers, agencies, and small teams. Combines invoice CRUD, quotation workflows, payment tracking, and revenue analytics with **automated PDF generation** and **multi-channel delivery** — all in a type-safe monorepo.

---

## 📑 PDF Generation

Invoices and quotations are dynamically generated as A4 PDFs using **PDFKit**.

Generated documents include:

* Business information
* Customer information
* Invoice/quotation metadata
* Status and dates
* Item tables
* Quantities
* Discounts
* Taxes
* Totals
* Payment balances

Generated PDFs are cached in memory for **30 minutes** to avoid unnecessary repeated rendering.

---

## 📊 Dashboard & Analytics

The dashboard provides financial and operational insights including:

* Total revenue
* Outstanding balances
* Overdue invoices
* Invoice volume
* Quotation volume
* Monthly revenue
* Payment methods
* Invoice status distribution
* Service demand
* Recent invoices

Charts and visualizations are implemented using **ApexCharts**, with animated dashboard components powered by **Framer Motion**.

---

## 🔐 Authentication & Security

AiInvo implements multiple layers of application security.

### Authentication

* JWT authentication
* Bcrypt password hashing
* HTTP-only cookie support
* Bearer-token fallback
* Session restoration
* Role-aware authentication state

### Authorization

Role-based authorization middleware supports:

* Admin
* User

### API Security

* Helmet security headers
* CORS configuration
* Rate limiting
* Request validation
* Centralized error handling
* Request IDs
* Structured logging
* Environment validation
* Standardized API responses

JWT configuration also requires a sufficiently strong secret.

---

## ✅ Type-Safe Validation

Frontend and backend share Zod schemas through the shared package.

Validation covers:

* Authentication
* Customers
* Services
* Invoices
* Quotations
* Payments
* Status transitions
* Numeric ranges
* Field length limits

This keeps request contracts consistent across the application.

---

## 🏗️ Architecture

AiInvo follows a modular, feature-based architecture.

```text
invoice-ready/
│
├── frontend/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── store/
│   ├── pages/
│   └── App.tsx
│
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── middleware/
│   │   └── modules/
│   │       ├── auth/
│   │       ├── customer/
│   │       ├── invoice/
│   │       ├── quotation/
│   │       ├── payment/
│   │       ├── dashboard/
│   │       ├── notification/
│   │       ├── email/
│   │       ├── pdf/
│   │       └── ai/
│   │
│   ├── prisma/
│   └── tests/
│
└── packages/
    └── shared/
        ├── schema.ts
        ├── types.ts
        └── index.ts
```

### Backend

The backend follows a layered structure:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories / Prisma
   ↓
PostgreSQL
```

Cross-cutting functionality is handled through reusable middleware and common utilities.

---

## 🗄️ Database

The application uses **PostgreSQL with Prisma ORM**.

The database contains **11 Prisma models** with:

* Relational associations
* Lifecycle enums
* Unique constraints
* Cascading relationships
* Restrictive relationships
* Query indexes

Indexes are used across important customer, invoice, quotation, payment, and notification access paths.

---

## ⚡ API

The backend exposes approximately **69 domain API routes** covering:

* Authentication
* Customers
* Services
* Categories
* Invoices
* Quotations
* Payments
* Dashboard analytics
* Notifications
* AI invoice workflows

The API also includes reusable cursor-based pagination with a maximum of **10 records per request**.

---

## 🖥️ Frontend

The frontend is built with:

* React 19
* Vite
* TanStack React Query
* Zustand
* ApexCharts
* Framer Motion
* cmdk

### React Query

Server state is managed through reusable hooks supporting:

* Lists
* Details
* Search
* Filtering
* Mutations
* Cache invalidation

### Authentication State

Zustand manages:

* Login
* Logout
* Session restoration
* Protected routes
* User roles

### Command Palette

A keyboard-accessible command palette provides navigation across application pages and actions.

```text
Ctrl + K
```

Features include:

* Keyboard navigation
* Route navigation
* Escape dismissal
* Animated transitions

---

## 📱 User Experience

The frontend includes reusable UI components for:

* Loading skeletons
* Toast notifications
* Status badges
* Forms
* Customer selectors
* Service selectors
* Animated transitions
* Responsive dashboards
* Data tables
* Search and filtering

A reusable table controller supports normal, search, and filter modes with cursor pagination and previous-page history.

---

## 🧪 Testing

The project contains a comprehensive **Vitest test suite with 298 currently enumerated test cases**.

Testing covers:

* Authentication
* CRUD workflows
* Schema validation
* Service errors
* Invoice lifecycle
* AI parsing
* AI intent classification
* Security
* SQL injection inputs
* XSS payloads
* Mass assignment
* Rate limiting
* Sensitive-data exposure
* Malformed authentication tokens

### Load Testing

The project also includes **k6 load-testing scenarios** covering:

* API requests with 10 virtual users
* Customer creation with 5 virtual users
* Customer-list workloads
* Login performance targets

> Load-test configurations represent test scenarios and targets; they should not be interpreted as measured production performance.

---

## 🔄 CI

GitHub Actions is configured to run checks including:

* ESLint
* TypeScript type checking
* Prisma client generation
* npm audit
* Vitest

CI workflows run on pushes and pull requests.

---

## 🛠️ Tech Stack

### Frontend

| Technology           | Purpose          |
| -------------------- | ---------------- |
| React 19             | UI               |
| TypeScript           | Type safety      |
| Vite                 | Frontend tooling |
| TanStack React Query | Server state     |
| Zustand              | Client state     |
| ApexCharts           | Analytics        |
| Framer Motion        | Animations       |
| cmdk                 | Command palette  |

### Backend

| Technology         | Purpose                |
| ------------------ | ---------------------- |
| Node.js            | Runtime                |
| Express 5          | REST API               |
| TypeScript         | Type safety            |
| Prisma 6           | ORM                    |
| PostgreSQL 16      | Database               |
| Zod                | Validation             |
| JWT                | Authentication         |
| Bcrypt             | Password hashing       |
| PDFKit             | PDF generation         |
| Nodemailer         | Email delivery         |
| Groq               | AI invoice assistant   |
| WhatsApp Graph API | WhatsApp notifications |

### Testing & DevOps

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| Vitest         | Unit & integration testing |
| k6             | Load testing               |
| GitHub Actions | CI                         |
| npm            | Package management         |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/invoice-ready.git

cd invoice-ready
```

---

### 2. Install dependencies

```bash
npm install
```

If the frontend and backend are managed separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### 3. Configure environment variables

Create the required environment files for the backend and frontend.

Example backend configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/invoice_ready"

JWT_SECRET="your-secure-jwt-secret"

PORT=5000

GROQ_API_KEY="your-groq-api-key"

SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"

WHATSAPP_ACCESS_TOKEN="your-whatsapp-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
```

> Never commit real credentials or secrets to the repository.

---

### 4. Setup Prisma

```bash
cd backend

npx prisma generate

npx prisma migrate dev
```

---

### 5. Start the backend

```bash
npm run dev
```

---

### 6. Start the frontend

```bash
cd frontend

npm run dev
```

The Vite development server will provide the local frontend URL.

---

## 📌 Project Highlights

* **11** Prisma/PostgreSQL models
* **~69** domain API routes
* **298** currently enumerated Vitest cases
* **30-minute** PDF cache
* **10-record** pagination limit
* **2,000-character** AI input limit
* AI request timeout and retry protection
* Automated email and WhatsApp notifications
* Role-based JWT authentication
* Shared frontend/backend Zod validation
* PostgreSQL indexes for important access paths
* k6 load-testing scenarios
* GitHub Actions CI

---

## 🔮 Future Improvements

Potential future enhancements include:

* Multi-tenant organizations
* Recurring invoices
* Online payment gateway integration
* Expense management
* Advanced financial reports
* Custom invoice templates
* Cloud object storage for generated documents
* Background job queues
* Webhook-based payment synchronization
* Mobile application
* Advanced notification preferences

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Built with **TypeScript, React, Express, PostgreSQL, Prisma, and AI**.

If you find the project useful, consider giving it a ⭐ on GitHub.
