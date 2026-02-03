# Linktree-Pro-bio-Profile-app

A Linktree clone with pro subscription features built with Next.js 16.1.4, React 19.2.3, and Tailwind CSS

## Features

- **User Authentication**: Secure login and registration with Better Auth
- **Profile Customization**: Customizable profile pages with username slugs
- **Link Management**: Add, edit, and organize links with drag-and-drop
- **Theme Customization**: Predefined themes and custom theme builder with light/dark mode
- **Public Profiles**: SEO-optimized public profile pages with fast loading
- **Analytics**: Profile views and link click tracking
- **Mobile Responsive**: Fully responsive design for all devices

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Update the .env.local file with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   # or for initial setup
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for Better Auth (change in production)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: For GitHub OAuth

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Push schema changes to database
- `npm run db:migrate`: Run migrations
- `npm run db:studio`: Open Prisma Studio

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── @/[username]/    # Public profile page
│   └── api/             # API routes
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── profile/         # Profile management components
│   └── public-profile/  # Public profile components
├── lib/                 # Utility functions and database client
├── types/               # TypeScript type definitions
├── prisma/              # Prisma schema and migrations
└── public/              # Static assets
```

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in
- `GET /api/profile` - Get user profile
- `PUT /API/profile` - Update user profile
- `POST /api/profile/username-available` - Check username availability
- `GET /api/links` - Get user links
- `POST /api/links` - Create a new link
- `PUT /api/links/[id]` - Update a link
- `DELETE /api/links/[id]` - Delete a link
- `PUT /api/links/reorder` - Reorder links
- `PUT /api/links/[id]/visibility` - Toggle link visibility
- `GET/POST/PUT /api/themes` - Theme management
- `GET /api/analytics` - Analytics data
- `POST /api/analytics` - Track events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT
