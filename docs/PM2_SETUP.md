# PM2 Setup Guide for Silklux Website

This guide explains how to use PM2 for production deployment of the Silklux website.

## What is PM2?

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, reload them without downtime, and facilitate common system admin tasks.

## Features

- **Zero-downtime reloads**: Update your app without stopping it
- **Load balancing**: Automatically distribute load across multiple instances
- **Process monitoring**: Real-time monitoring and automatic restarts
- **Log management**: Centralized log management
- **Cluster mode**: Utilize all CPU cores
- **Memory monitoring**: Automatic restart on memory threshold

## Quick Start

### 1. Install PM2 globally (for development)
```bash
npm install -g pm2
```

### 2. Start the application
```bash
# Using npm scripts
npm run pm2:start

# Or directly with PM2
pm2 start ecosystem.config.js --env production
```

### 3. Monitor the application
```bash
# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Open monitoring dashboard
npm run pm2:monit
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run pm2:start` | Start the app | Starts the application in cluster mode |
| `npm run pm2:stop` | Stop the app | Stops the application |
| `npm run pm2:restart` | Restart the app | Restarts the application |
| `npm run pm2:reload` | Zero-downtime reload | Reloads without downtime |
| `npm run pm2:delete` | Delete from PM2 | Removes app from PM2 |
| `npm run pm2:logs` | View logs | Shows application logs |
| `npm run pm2:status` | Check status | Shows PM2 status |
| `npm run pm2:monit` | Monitor | Opens monitoring dashboard |
| `npm run pm2:flush` | Clear logs | Clears all logs |
| `npm run pm2:save` | Save config | Saves current PM2 config |
| `npm run pm2:startup` | Setup startup | Sets up PM2 to start on boot |

## Docker Deployment

The Dockerfile has been configured to use PM2 in production:

### Build and run with Docker
```bash
# Build the image
docker build -t silklux-website .

# Run the container
docker run -p 3000:3000 silklux-website
```

### Docker Compose
```bash
# Start with docker-compose
npm run docker:up

# View logs
npm run docker:logs
```

## Configuration

The PM2 configuration is defined in `ecosystem.config.js`:

- **Cluster mode**: Uses all available CPU cores
- **Auto-restart**: Automatically restarts on crashes
- **Memory limit**: Restarts if memory usage exceeds 1GB
- **Log management**: Centralized logging with timestamps
- **Health checks**: Built-in health monitoring

## Production Deployment

### 1. Setup PM2 startup script (run once)
```bash
pm2 startup
# Follow the instructions to run the generated command
pm2 save
```

### 2. Deploy your application
```bash
# Build the application
npm run build

# Start with PM2
npm run pm2:start

# Save the configuration
npm run pm2:save
```

### 3. Zero-downtime updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Reload without downtime
npm run pm2:reload
```

## Monitoring and Logs

### View real-time logs
```bash
npm run pm2:logs
```

### Monitor performance
```bash
npm run pm2:monit
```

### Check application status
```bash
npm run pm2:status
```

## Troubleshooting

### Application won't start
1. Check logs: `npm run pm2:logs`
2. Verify environment variables
3. Check port availability
4. Ensure database connection

### High memory usage
1. Monitor with: `npm run pm2:monit`
2. Check for memory leaks
3. Adjust memory limit in `ecosystem.config.js`

### Application crashes
1. Check error logs: `pm2 logs silklux-website --err`
2. Review crash reports: `pm2 info silklux-website`
3. Check system resources

## Environment Variables

Create a `.env.production` file for production environment variables:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com
```

## Best Practices

1. **Always use ecosystem.config.js** for consistent configuration
2. **Monitor memory usage** and set appropriate limits
3. **Use zero-downtime reloads** for updates
4. **Set up log rotation** to prevent disk space issues
5. **Monitor application health** regularly
6. **Use startup scripts** for automatic recovery after server restarts

## Support

For PM2-specific issues, refer to the [PM2 Documentation](https://pm2.keymetrics.io/docs/).
