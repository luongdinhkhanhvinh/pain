#!/bin/bash

# PM2 Management Script for Silklux Website
# Usage: ./scripts/pm2.sh [start|stop|restart|status|logs|monitor|delete]

APP_NAME="silklux-website"
ECOSYSTEM_FILE="ecosystem.config.js"

case "$1" in
  start)
    echo "🚀 Starting $APP_NAME with PM2..."
    pm2 start $ECOSYSTEM_FILE --env production
    pm2 save
    ;;
  
  stop)
    echo "⏹️  Stopping $APP_NAME..."
    pm2 stop $APP_NAME
    ;;
  
  restart)
    echo "🔄 Restarting $APP_NAME..."
    pm2 restart $APP_NAME
    ;;
  
  reload)
    echo "🔄 Reloading $APP_NAME (zero-downtime)..."
    pm2 reload $APP_NAME
    ;;
  
  status)
    echo "📊 PM2 Status:"
    pm2 status
    ;;
  
  logs)
    echo "📋 Showing logs for $APP_NAME..."
    pm2 logs $APP_NAME
    ;;
  
  monitor)
    echo "📈 Opening PM2 Monitor..."
    pm2 monit
    ;;
  
  delete)
    echo "🗑️  Deleting $APP_NAME from PM2..."
    pm2 delete $APP_NAME
    ;;
  
  flush)
    echo "🧹 Flushing PM2 logs..."
    pm2 flush
    ;;
  
  startup)
    echo "🔧 Setting up PM2 startup script..."
    pm2 startup
    echo "After running the generated command, run: pm2 save"
    ;;
  
  info)
    echo "ℹ️  Detailed info for $APP_NAME:"
    pm2 info $APP_NAME
    ;;
  
  *)
    echo "Usage: $0 {start|stop|restart|reload|status|logs|monitor|delete|flush|startup|info}"
    echo ""
    echo "Commands:"
    echo "  start    - Start the application"
    echo "  stop     - Stop the application"
    echo "  restart  - Restart the application"
    echo "  reload   - Zero-downtime reload"
    echo "  status   - Show PM2 status"
    echo "  logs     - Show application logs"
    echo "  monitor  - Open PM2 monitor"
    echo "  delete   - Remove app from PM2"
    echo "  flush    - Clear all logs"
    echo "  startup  - Setup PM2 startup script"
    echo "  info     - Show detailed app info"
    exit 1
    ;;
esac
