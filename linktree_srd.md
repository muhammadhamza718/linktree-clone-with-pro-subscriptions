# Linktree Clone Pro - System Requirements Document (SRD)

**Version:** 1.1  
**Date:** February 11, 2026  
**Target Audience:** Development Team & Claude Code Implementation  
**Document Type:** Technical Specification (Hybrid-Control Architecture)

---

## 1. Milestone 1: Project Overview & Goals

### 1.1 Executive Summary

A production-grade bio link platform that replicates all Linktree Pro features, offered for free through architectural efficiency. The platform enables creators and developers to showcase their digital presence through a customizable landing page with advanced link features, rich media embeds, and deep GitHub integrations.

### 1.2 The "Hybrid-Control" Philosophy

As defined in the project [README.md](file:///f:/Courses/Hamza/Linktree-Pro-bio-Profile-app/linktree-clone-with-pro-subscriptions/README.md), this project follows a specific architectural philosophy:

- **Managed Infrastructure:** We use Supabase (Postgres/Storage) and Vercel for scalability.
- **Full Ownership:** We use Better-auth and Prisma to maintain 100% control over the user data and schema.
- **Zero Cost:** Strategically leveraging free tiers to provide a "Pro" experience at $0 maintenance.

### 1.3 Success Criteria

- **User Experience:** Setup to publication in under 3 minutes.
- **Performance:** Public profiles load in <1.5s (LCP).
- **Control:** Zero vendor lock-in for authentication and database logic.
- **Customization:** Deep theme editing and custom CSS support for developers.

---

## 2. Milestone 2: User Personas & Actors

### 2.1 Developer / Tech Creator

- **Alex:** Focuses on GitHub repo integration (stars/forks/languages).
- **Needs:** Live project demos, tech stack badges, and automated repo metadata syncing.

### 2.2 Small Business / Influencer

- **Sarah:** Focuses on visual branding and conversion.
- **Needs:** Custom icons, theme presets, booking links, and contact form submissions.

### 2.3 Actor Roles

- **Visitor:** Views profiles, clicks links, completes age gates or password forms.
- **Authenticated User:** Manages profile, links, themes, and views analytics.
- **Pro Subscriber:** Access to advanced features like custom domains, webhooks, and A/B testing.

---

## 3. Milestone 3: Functional Requirements

### 3.1 Authentication & Security (Powered by Better-auth)

- **Zero SaaS Dependency:** Authentication is handled by a library running in our API, not an external service (like Clerk).
- **Methods:** OAuth (Google, GitHub), Email/Password.
- **Ownership:** All user records sit in our Supabase PostgreSQL database.
- **Security:** Session-based (secure httpOnly cookies), 2FA support, and full session management.

### 3.2 Link Management (Next.js & Prisma)

- **CRUD Operations:** Real-time link editing with drag-and-drop reordering.
- **Link Types:** Social, Web, GitHub Repo (with metadata), Project, and Embed (YouTube/Spotify).
- **Pro Features:**
  - **Scheduling:** Start and end dates for links.
  - **Protection:** Password-protected links and age-gating.
  - **Priority:** Pinning important links to the top.

### 3.3 Theme & Design (Tailwind CSS 4)

- **Presets:** 10+ curated modern themes.
- **Theme Builder:** Control colors, gradients, button styles (rounded/square/pill), and fonts (Google Fonts).
- **Expert Mode:** Custom CSS injection for pixel-perfect control.
- **Assets:** User avatars and icons hosted on **Supabase Storage** (5GB free).

### 3.4 Pro Subscription Features (Phase 2 Focus)

- **Analytics Dashboard:** Deep insights into demographics (country, city), devices, and referrers.
- **Custom Domains:** Connecting personal domains (e.g., links.mybrand.com) with SSL.
- **Webhooks:** Triggering external workflows on link clicks or profile views.
- **A/B Testing:** SPLIT testing link titles and icons to optimize CTR.
- **Billing:** Managed via **Stripe** (Customer Portal for management).

---

## 4. Milestone 4: Architecture & Tech Stack

### 4.1 The Stack Decision Matrix

| Layer         | Choice                  | Rationale                                                   |
| :------------ | :---------------------- | :---------------------------------------------------------- |
| **Framework** | **Next.js 15**          | App Router for SSR profiles, Route Handlers for the API.    |
| **Database**  | **Supabase (Postgres)** | Expert Choice: 500MB DB + 5GB free storage for user assets. |
| **ORM**       | **Prisma**              | Full schema control and type-safe DB access.                |
| **Auth**      | **Better-auth**         | No monthly SaaS fees, 100% data ownership.                  |
| **Hosting**   | **Vercel**              | Industry-standard speed and $0 Hobby plan.                  |
| **Billing**   | **Stripe**              | Simple integration for professional subscription handling.  |

### 4.2 Data Flow Architecture

1. **Public View:** Next.js Server Components fetch profile data from Supabase via Prisma.
2. **Auth Flow:** Better-auth communicates with the Prisma database to manage sessions.
3. **Analytics:** Every click triggers a Next.js Server Action/API route that logs to PostgreSQL.
4. **Assets:** Avatars are uploaded to Supabase Storage; URLs are stored in the `Profile` model.

### 4.3 Database Models (Conceptual)

Detailed models are maintained in `schema.prisma`:

- `User` & `Account`: Core identities.
- `Profile` & `Link`: The "Bio-Link" core.
- `AnalyticsEvent`: High-volume click and view tracking.
- `Subscription`: Stripe integration records.
- `ABTest` & `WebhookEndpoint`: Advanced Pro features.

---

## 5. Milestone 5: Non-Functional Requirements

### 5.1 Performance Limits

- **LCP (Largest Contentful Paint):** < 1.2s for public profiles.
- **Interaction to Next Paint (INP):** < 100ms for dashboard controls.
- **Database Latency:** < 50ms for primary key lookups.

### 5.2 Scalability

- **Free Tier Cap:** 50,000 monthly active users (Supabase limit).
- **Concurrency:** Handling 1,000 requests per second via Vercel Edge functions.

### 5.3 Reliability

- **Data Safety:** Daily automated backups via Supabase.
- **Failover:** Prisma connection pooling via Supabase connection pooler.

---

## 6. Milestone 6: Implementation Roadmap

### Phase 1: Core Foundation (In Progress)

- [x] Initial Next.js & Prisma Setup.
- [x] Basic Analytics Components refactoring.
- [x] Better-auth integration preparation.
- [x] Prisma Client Synchronizing (v6.19.2).

### Phase 2: Pro Subscription Core (Next)

- [ ] Database Schema updates for Plans and Billing.
- [ ] Stripe Webhook integration.
- [ ] Feature-gating logic (Free vs Pro).
- [ ] Supabase Storage setup for user assets.

### Phase 3: Advanced Optimization

- [ ] Custom CSS injection engine.
- [ ] A/B Testing split logic.
- [ ] Webhook trigger system.
- [ ] SEO & Open Graph meta-tag control.

---

## 7. Milestone 7: Compliance & Legal

- **GDPR:** Users own their data; Better-auth allows for easy data export/deletion.
- **DMCA:** Mechanism for reporting and disabling infringing links.
- **Policy:** Terms of Service and Privacy Policy must reflect the $0/month model.

---

**Document Status:** Version 1.1 - Tech Stack Synchronized with README.md.  
**Author:** Antigravity AI Engineering Assistant.
