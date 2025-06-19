#!/bin/bash

# Silklux Website Setup Script
echo "✨ Setting up Silklux Website..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your settings."
else
    echo "✅ .env file already exists."
fi

# Build and start Docker containers
echo "🐳 Building and starting Docker containers..."
docker-compose down 2>/dev/null
docker-compose build
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
until docker-compose exec postgres pg_isready -U postgres -d silklux_db; do
    echo "⏳ Waiting for database..."
    sleep 2
done

echo "✅ Database is ready!"

# Install dependencies (if running locally)
if command -v pnpm &> /dev/null; then
    echo "📦 Installing dependencies with pnpm..."
    pnpm install
elif command -v npm &> /dev/null; then
    echo "📦 Installing dependencies with npm..."
    npm install
else
    echo "⚠️  No package manager found. Please install pnpm or npm."
fi

# Generate and run migrations
echo "🗄️  Setting up database schema..."
if command -v pnpm &> /dev/null; then
    pnpm run db:generate
    pnpm run db:migrate
elif command -v npm &> /dev/null; then
    npm run db:generate
    npm run db:migrate
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🌐 Your application is running at:"
echo "   Website: http://localhost:3002"
echo "   Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   npm run docker:logs  - View container logs"
echo "   npm run db:studio    - Open database studio"
echo "   npm run docker:down  - Stop containers"
echo ""
echo "📖 Check README.md for more information."
