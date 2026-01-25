# Quickstart Guide: Pro Features Implementation

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database server
- Git version control
- Redis server (for analytics queue processing)

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
   - REDIS_URL: Connection string for Redis (for analytics queue)
   - IP_GEOLOCATION_API_KEY: API key for IP geolocation service
   - CUSTOM_DOMAIN_CERT_PROVIDER: Certificate provider configuration

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

7. **Start the analytics queue processor (separate terminal)**
   ```bash
   npm run queue:analytics
   ```

## Pro Feature Configuration

### Analytics Dashboard
- Access at `/dashboard/analytics`
- View geographic, device, and referral data
- Export CSV reports with date filtering

### Link Scheduling
- Edit links and set activation/deactivation times
- Timezone-aware scheduling
- Automatic link visibility management

### Password Protection
- Enable password protection on individual links
- Secure hash storage
- Session-based access control

### Custom Domains
- Navigate to `/dashboard/branding/domains`
- Add your custom domain
- Follow DNS verification instructions
- SSL auto-provisioning via Let's Encrypt

### Rich Content Blocks
- Add embedded content (YouTube, Spotify) to profiles
- Create contact forms for visitor interaction
- Insert formatted text blocks

## Key Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run queue:analytics`: Start analytics processing queue
- `npx prisma studio`: Open database GUI
- `npx prisma migrate dev`: Create and apply migration

## Configuration Notes
- Analytics data is processed asynchronously via Redis queue
- Custom domain SSL certificates provisioned automatically
- Password-protected links use secure session management
- Embedded content is sandboxed for security
- Link scheduling uses database-level timestamp validation