#!/bin/bash
set -e

echo "🚀 Deploying SM Trade International..."

cd /var/www/sm-trade-international

echo "📥 Fetching latest code..."
git fetch origin

echo "🔄 Resetting to latest main..."
git reset --hard origin/main

echo "🔨 Building frontend..."
npm run build

echo "♻️ Restarting backend..."
pm2 restart sm-trade-backend

echo "✅ Deploy complete!"
