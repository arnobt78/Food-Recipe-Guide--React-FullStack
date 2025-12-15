#!/bin/bash

# Unified Development Server Script
# Runs both frontend (Vite) and backend (Vercel dev) together
# 
# Frontend: http://localhost:3000 (Vite)
# Backend API: http://localhost:3001/api (Vercel dev, proxied through Vite)
#
# SIMPLE FIX: Temporarily change project name in project.json to avoid Vercel CLI bug
# The bug: Vercel extracts "recipe" from project name "recipe-app" and appends it to path

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_JSON="$SCRIPT_DIR/.vercel/project.json"
BACKUP_JSON="$SCRIPT_DIR/.vercel/project.json.backup"

echo "🚀 Starting unified development server..."
echo "📁 Project directory: $SCRIPT_DIR"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001/api"
echo ""

# Function to restore original project.json and cleanup on exit
cleanup() {
    if [ -f "$BACKUP_JSON" ]; then
        mv "$BACKUP_JSON" "$PROJECT_JSON" 2>/dev/null
        echo ""
        echo "✅ Restored original project configuration"
    fi
    # Kill background processes
    pkill -P $$ 2>/dev/null
}
trap cleanup EXIT INT TERM

# Check if project.json exists, if not, try to link project
if [ ! -f "$PROJECT_JSON" ]; then
    echo "⚠️  .vercel/project.json not found. Linking project..."
    echo "   This will prompt you to select your Vercel project."
    vercel link --yes 2>&1 | head -10
    echo ""
fi

# No need to change project name - it's already changed to "food-app" in project.json
# The project name "food-app" doesn't contain "recipe", so Vercel won't append "/recipe" to path

# Start Vercel dev server in background (port 3001)
echo "🔌 Starting Vercel dev server (backend API) on port 3001..."
cd "$SCRIPT_DIR" || exit 1
vercel dev --listen 3001 --yes > /tmp/vercel-dev.log 2>&1 &
VERCEL_PID=$!

# Wait for Vercel dev to be ready (check port and log)
echo "⏳ Waiting for backend API to be ready..."
VERCEL_READY=false
for i in {1..30}; do
    # Check if port 3001 is listening (most reliable check)
    if lsof -ti:3001 >/dev/null 2>&1; then
        echo "✅ Backend API ready! (port 3001 is listening)"
        VERCEL_READY=true
        break
    fi
    # Also check log for ready messages
    if grep -qE "(Ready|listening|Local:)" /tmp/vercel-dev.log 2>/dev/null; then
        echo "✅ Backend API ready!"
        VERCEL_READY=true
        break
    fi
    # Check for errors in log
    if grep -qiE "(Error|Failed|Cannot)" /tmp/vercel-dev.log 2>/dev/null; then
        echo "⚠️  Vercel dev encountered an error. Checking log..."
        tail -5 /tmp/vercel-dev.log
        echo ""
        echo "💡 If you see 'Could not retrieve Project Settings', try:"
        echo "   1. Remove .vercel directory: rm -rf .vercel"
        echo "   2. Run: vercel link"
        echo "   3. Then run: npm run dev"
        break
    fi
    sleep 1
done

if [ "$VERCEL_READY" = false ]; then
    echo "⚠️  Backend API may not be ready yet, but continuing..."
    echo "   Check /tmp/vercel-dev.log if API calls fail"
fi

# Start Vite dev server (port 3000, proxies /api to 3001)
echo "🎨 Starting Vite dev server (frontend) on port 3000..."
echo ""
# Use vite directly to avoid script loop (npm run dev would call this script again)
npx vite

