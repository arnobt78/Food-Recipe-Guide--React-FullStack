# Vercel Setup Guide

## Quick Setup (Automated)

1. **Login to Vercel** (if not already):
   ```bash
   vercel login
   ```

2. **Run the setup script**:
   ```bash
   npm run setup:vercel
   ```

3. **Start development**:
   ```bash
   npm run dev:vercel
   ```

## Manual Setup

If the automated script doesn't work, follow these steps:

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Link to existing project**:
   ```bash
   vercel link --project recipe
   ```
   
   (Replace `recipe` with your actual project name if different)

3. **Start development**:
   ```bash
   npm run dev:vercel
   ```

## What This Does

- ✅ Links your local code to your existing Vercel project
- ✅ Syncs environment variables from production
- ✅ Uses the same project settings for local and production
- ✅ **No duplicate project created** - uses existing one

## Troubleshooting

### "Could not retrieve Project Settings"
```bash
rm -rf .vercel
npm run setup:vercel
```

### "The specified token is not valid"
```bash
vercel login
```

### Project name not found
Check your Vercel dashboard for the exact project name, then:
```bash
vercel link --project YOUR_PROJECT_NAME
```

## Available Commands

- `npm run dev` - Frontend only (Vite)
- `npm run dev:vercel` - Full stack (Vercel with API functions)
- `npm run setup:vercel` - Link to existing Vercel project

