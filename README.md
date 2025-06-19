# Silklux Website

A modern luxury e-commerce website built with Next.js, PostgreSQL, and Docker.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **UI**: Radix UI, Tailwind CSS
- **Authentication**: JWT with bcryptjs
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- pnpm (recommended package manager)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd silklux-website
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the application with Docker**
   ```bash
   # Build and start all services
   npm run docker:up
   
   # Or manually
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   ```

5. **Access the application**
   - Website: http://localhost:3002
   - Database: localhost:5432
   - Drizzle Studio: `npm run db:studio`

## Available Scripts

### Docker Commands
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start services in detached mode
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs

### Database Commands
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Local Development (without Docker)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up local PostgreSQL**
   - Install PostgreSQL locally
   - Create database: `wood_veneer_db`
   - Update `.env` with your local database URL

3. **Run migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/silklux_db
NEXT_PUBLIC_APP_URL=http://localhost:3002
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## Database Schema

The application uses Drizzle ORM for database management. Schema files are located in:
- `server/db/schema.ts` - Database schema definitions
- `drizzle/` - Generated migration files

## Docker Services

- **postgres**: PostgreSQL 15 database
- **app**: Next.js application

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Connect to database directly
docker-compose exec postgres psql -U postgres -d wood_veneer_db
```

### Application Issues
```bash
# View application logs
docker-compose logs app

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request
