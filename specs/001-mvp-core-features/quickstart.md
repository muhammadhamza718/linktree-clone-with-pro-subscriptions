# Quickstart Guide: MVP Core Features

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database server
- Git version control

## Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in the required values:
   - DATABASE_URL: PostgreSQL connection string
   - NEXTAUTH_SECRET: Secret for authentication
   - GITHUB_ID and GITHUB_SECRET: For OAuth integration
   - GOOGLE_ID and GOOGLE_SECRET: For Google OAuth

4. **Set up the database**
   ```bash
   npx prisma db push
   # or for initial setup
   npx prisma migrate dev
   ```

5. **Seed initial data (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Dashboard: http://localhost:3000/dashboard
   - Public profile: http://localhost:3000/@username

## Key Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npx prisma studio`: Open database GUI
- `npx prisma migrate dev`: Create and apply migration

## First-Time User Flow
1. Visit the home page and click "Sign Up"
2. Register using email/password or OAuth
3. Complete profile setup with username, bio, and avatar
4. Add your first links using the dashboard
5. Customize your profile theme
6. Publish and share your public profile URL

## Configuration Notes
- Authentication is handled by Better Auth
- Database schema managed with Prisma
- Public profiles use server-side rendering for SEO
- Link ordering supports drag-and-drop functionality
- GitHub integration fetches repository metadata automatically