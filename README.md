# Elite Management Tracking System

A modern tracking system built with Hono.js and TypeScript, designed to run on Vercel.

## Features

- User tracking with unique track IDs
- Admin dashboard for managing users
- Real-time progress updates
- Secure authentication with JWT
- Responsive design with Tailwind CSS

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your JWT_SECRET
```

3. Initialize the database and create admin user:
```bash
npm run db:init
```

4. Start development server:
```bash
npm run dev
```

## Deployment to Vercel

This project is configured to deploy automatically to Vercel.

### Environment Variables

Make sure to set the following environment variables in your Vercel dashboard:

- `JWT_SECRET`: A secure random string for JWT token signing
- `NODE_ENV`: Set to `production`

### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npx vercel --prod
```

## API Endpoints

### Public Endpoints
- `GET /api/users/track/:trackId` - Get user by track ID
- `POST /api/auth/login` - Admin login

### Protected Endpoints (require JWT token)
- `PUT /api/auth/change-password` - Change admin password
- `GET /api/users/all` - Get all users
- `POST /api/users/new` - Create new user
- `PUT /api/users/update` - Update user
- `PUT /api/users/progress` - Update user progress
- `DELETE /api/users/delete` - Delete user

## Project Structure

```
├── api/                    # Vercel API routes
├── public/                 # Static HTML files
├── src/
│   ├── controller/         # Request handlers
│   ├── db/                 # Database client
│   ├── middleware/         # Auth middleware
│   ├── routes/             # Route definitions
│   └── types/              # TypeScript types
├── scripts/                # Database initialization scripts
└── vercel.json            # Vercel configuration
```

## Technologies

- **Runtime**: Node.js (Vercel)
- **Framework**: Hono.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
