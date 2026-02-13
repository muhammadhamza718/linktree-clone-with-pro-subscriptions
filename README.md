# Linktree Clone with Pro Subscriptions

A high-performance, developer-first Linktree clone built for maximum control, scalability, and $0 maintenance cost

## 🚀 The Chosen Tech Stack

This project uses a "Hybrid-Control" architecture. We utilize powerful managed services for infrastructure while maintaining 100% ownership of the logic and data.

| Layer              | Technology                  | Why?                                                                             |
| :----------------- | :-------------------------- | :------------------------------------------------------------------------------- |
| **Frontend**       | **Next.js 16 (App Router)** | Best-in-class performance, SEO, and React Server Components.                     |
| **Backend API**    | **Next.js Route Handlers**  | Single codebase, shared TypeScript types, and seamless Vercel deployment.        |
| **Database**       | **Supabase (PostgreSQL)**   | 500MB DB storage + 5GB free file storage (avatars/icons). High scalability.      |
| **ORM**            | **Prisma**                  | Type-safe database access and easy migrations.                                   |
| **Authentication** | **Better-auth**             | **Full Ownership.** A library, not a service. No vendor lock-in or monthly fees. |
| **Payments**       | **Stripe**                  | Industry standard for "Pro" subscriptions and recurring billing.                 |
| **Hosting**        | **Vercel**                  | Industry-leading performance for Next.js and $0 hobby tier.                      |

### 🛡️ Why This Stack is Fully Controlled

As an expert-level architecture, this setup ensures:

- ✅ **Database:** 100% control (Supabase is standard PostgreSQL).
- ✅ **Data:** 100% yours (export anytime via `pg_dump`, migrate anytime).
- ✅ **API Endpoints:** 100% yours (custom logic created in Next.js).
- ✅ **Auth Logic:** 100% yours (Better-auth is a self-hosted library you own).
- ✅ **Schema:** 100% yours (Prisma migrations you manage).

---

## 🚫 Rejected Stacks (Rethink Harder)

During the design phase, several popular alternatives were rejected based on the specific needs of a Pro Linktree clone.

### 1. Python (FastAPI / Django)

- **Status:** Rejected ❌
- **Reasoning:** Adding a Python backend would decouple the codebase, requiring management of two separate environments. For a CRUD-heavy application like Linktree, the overhead of managing CORS, shared types across languages, and separate deployments outweighs Python's ML/AI advantages. Next.js offers superior development speed and deployment simplicity for this use case.

### 2. Headless CMS (Sanity / Contentful)

- **Status:** Rejected ❌
- **Reasoning:** A Linktree clone is a **data-application**, not a content-site. Using a CMS for relational data (users -> links -> analytics) is inefficient and expensive at scale. Relational databases (PostgreSQL) are better suited for tracking click-through rates and managing complex user relationships.

### 3. Integrated Auth SaaS (Clerk / Auth0)

- **Status:** Rejected ❌
- **Reasoning:** While "plug-and-play," these services introduce high vendor lock-in and can become extremely expensive as the user base grows ($25-$300+/month). **Better-auth** was chosen because it provides the same features (OAuth, sessions, 2FA) while allowing the developer to own the user table and pay $0 in service fees.

### 4. Pure Database (Neon)

- **Status:** Rejected ❌
- **Reasoning:** While Neon is excellent, Supabase provides an equivalent PostgreSQL experience plus **5GB of free object storage**. Since a Linktree clone requires hosting user profile pictures and custom icons, the "bonus" features of Supabase provide more value for a $0 budget without sacrificing any database control.

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Supabase Account (for PostgreSQL & Storage)

### Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Configure `.env` with your Supabase DB URL
4. Run migrations: `npx prisma migrate dev`
5. Start dev server: `npm run dev`
