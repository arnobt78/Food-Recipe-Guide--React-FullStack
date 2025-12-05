#!/bin/bash

# Setup script to link local development to existing Vercel project
# This ensures local dev and production use the same project

echo "🔗 Setting up Vercel project link..."

# Check if user is logged in
if ! vercel whoami &>/dev/null; then
    echo "⚠️  Not logged in to Vercel. Please login first:"
    echo "   Run: vercel login"
    echo "   Then run this script again: npm run setup:vercel"
    exit 1
fi

# Remove any existing .vercel directory
echo "🧹 Cleaning up existing .vercel directory..."
rm -rf .vercel

# Link to existing project
echo "🔗 Linking to existing Vercel project..."
echo "   Project name: recipe"
echo "   (If your project has a different name, edit this script)"

# Use vercel link with project name
# This will prompt you to select the project if multiple matches
vercel link --project recipe --yes

echo ""
echo "✅ Setup complete!"
echo "📝 You can now run: npm run dev:vercel"
echo "   This will use your existing Vercel project for both local and production!"

