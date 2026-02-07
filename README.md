# Recipe Guide | Recipe Discovery & Management Platform - Next.js, PostgreSQL, Redis, Spoonacular API, Contentful CMS FullStack Project

A modern full-stack recipe app to search, save, and manage recipes—with favourites, collections, meal planning, AI-powered analysis, and more. Built for learning and production use.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Spoonacular API](https://img.shields.io/badge/Spoonacular-API-22C55E)](https://spoonacular.com/food-api)

- **Live-Demo:** [https://recipe-smart.vercel.app/](https://recipe-smart.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [Project Walkthrough](#project-walkthrough)
- [API Endpoints](#api-endpoints)
- [Components & Reusability](#components--reusability)
- [Routes](#routes)
- [Database Schema](#database-schema)
- [Keywords](#keywords)
- [Conclusion](#conclusion)

---

## Overview

**Recipe Guide** is a modern full-stack recipe discovery and management platform built with Next.js 15, React 18, TypeScript, and PostgreSQL. It integrates the **Spoonacular API** for recipe data and provides features like recipe search, favourites, collections, meal planning, shopping lists, AI-powered recipe analysis, blog (Contentful CMS), and business insights.

The app follows a **server/client component separation** architecture, uses **NextAuth v5** for authentication (Google OAuth + email/password), and is deployment-ready for **Vercel** with optional **Redis** (Upstash) caching and **Sentry** error tracking.

---

## Features

| Feature               | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| **Recipe Search**     | Advanced search with filters (cuisine, diet, type, ingredients)            |
| **Recipe Details**    | Full recipe info, nutrition, taste data, instructions, wine pairing        |
| **Favourites**        | Save and manage favourite recipes (auth required)                          |
| **Collections**       | Create custom recipe collections with custom ordering                      |
| **Meal Planning**     | Weekly meal planner with breakfast, lunch, dinner, snack slots             |
| **Shopping List**     | Auto-generated shopping lists from recipes                                 |
| **AI Features**       | Recipe analysis, recommendations, modifications, weather-based suggestions |
| **Blog**              | Contentful CMS–powered blog posts                                          |
| **Business Insights** | Platform statistics, AI predictions, trends                                |
| **API Status**        | Real-time API endpoint health monitoring                                   |
| **API Docs**          | Endpoint documentation grouped by category                                 |

---

## Technology Stack

| Layer            | Technology                                               |
| ---------------- | -------------------------------------------------------- |
| **Framework**    | Next.js 15 (App Router)                                  |
| **UI**           | React 18, Tailwind CSS, ShadCN UI (Radix), Framer Motion |
| **Language**     | TypeScript 5.7                                           |
| **Database**     | PostgreSQL (NeonDB), Prisma ORM                          |
| **Auth**         | NextAuth v5 (JWT, Google OAuth, Credentials)             |
| **Caching**      | Upstash Redis (optional)                                 |
| **Recipe Data**  | Spoonacular API                                          |
| **CMS**          | Contentful                                               |
| **Image Upload** | Cloudinary                                               |
| **Monitoring**   | Sentry, PostHog                                          |
| **Hosting**      | Vercel                                                   |

---

## Project Structure

```bash
recipe-spoonacular/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── [...path]/        # Unified API handler (recipes, collections, etc.)
│   │   ├── auth/             # NextAuth, login, signup
│   │   ├── jobs/              # Scheduled jobs (QStash)
│   │   └── test/              # Test endpoints (Redis)
│   ├── api-docs/              # API documentation page
│   ├── api-status/            # API status monitoring page
│   ├── blog/                  # Blog (list + [slug])
│   ├── business-insights/     # Platform analytics
│   ├── recipe/[id]/           # Recipe detail page
│   ├── layout.tsx             # Root layout + metadata
│   └── page.tsx               # Home page
├── src/
│   ├── components/           # React components
│   │   ├── analysis/          # AI recipe analysis
│   │   ├── auth/              # Login, Register dialogs
│   │   ├── blog/              # Blog card, list, detail
│   │   ├── collections/       # Collection manager, cards
│   │   ├── common/            # ErrorBoundary, EmptyState, etc.
│   │   ├── filters/           # Advanced filters, presets
│   │   ├── hero/              # Hero search section
│   │   ├── insights/          # Business insights dashboard
│   │   ├── layout/            # Navbar, Footer, TabNavigation
│   │   ├── meal-planning/     # Meal planner
│   │   ├── pages/             # Page-level client components
│   │   ├── recipes/           # RecipeCard, RecipeDetailCard, etc.
│   │   ├── search/            # SearchInput, metadata
│   │   ├── shopping/          # Shopping list generator
│   │   ├── skeletons/         # Loading skeletons
│   │   ├── status/            # API status dashboard
│   │   ├── ui/                # ShadCN UI primitives
│   │   ├── videos/            # Recipe video player
│   │   └── weather/           # Weather-based suggestions
│   ├── config/               # Upload presets, config
│   ├── context/              # AuthContext, RecipeContext
│   ├── hooks/                # useRecipes, useCollections, etc.
│   ├── lib/                  # posthog, utils
│   ├── utils/                # Helpers, mock data, generators
│   └── types.ts              # Shared TypeScript types
├── lib/                      # Server-side utilities
│   ├── api-key-tracker.ts    # Spoonacular API key rotation
│   ├── api-utils-nextjs.ts   # CORS, auth helpers
│   ├── prisma.ts             # Prisma client
│   ├── recipe-api.ts         # Spoonacular API calls
│   ├── redis-cache.ts        # Redis caching
│   └── redis.ts              # Upstash Redis client
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
├── auth.ts                   # NextAuth configuration
└── instrumentation.ts       # Sentry instrumentation
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **PostgreSQL** (e.g. [NeonDB](https://neon.tech/))
- **Spoonacular API key** (free tier: [spoonacular.com/food-api](https://spoonacular.com/food-api))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/arnobt78/recipe-spoonacular.git
cd recipe-spoonacular

# Install dependencies
npm install

# Copy environment file and fill in values
cp .env.example .env.local

# Generate Prisma client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root. Use `.env.example` as a template.

### Required (Minimum to Run)

```env
# Spoonacular API (required for recipe data)
API_KEY=your_spoonacular_api_key_here
# Optional: additional keys for rotation (API_KEY_2, API_KEY_3, etc.)

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Authentication (NextAuth)

```env
# NextAuth v5
AUTH_SECRET=your-secret-here          # Generate: openssl rand -base64 32
AUTH_URL=http://localhost:3000       # Production: https://your-domain.com

# Google OAuth (optional)
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
# Or: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### Optional Services

```env
# Redis (Upstash) - for caching
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=your-token

# Contentful CMS - for blog
CMS_SPACE_ID=your-space-id
CMS_DELIVERY_TOKEN=your-delivery-token
CMS_ENVIRONMENT=master

# Cloudinary - for image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI / LLM (OpenRouter, Gemini, etc.)
OPENROUTER_API_KEY=your-key
GOOGLE_GEMINI_API_KEY=your-key
GROQ_LLAMA_API_KEY=your-key
HUGGING_FACE_INFERENCE_API_KEY=your-key

# Weather (OpenWeather) - for weather-based suggestions
OPENWEATHER_API_KEY=your-key

# Email (Resend or Brevo) - for recipe sharing
RESEND_TOKEN=your-token
BREVO_API_KEY=your-key
EMAIL_SENDER_ADDRESS=noreply@yourdomain.com

# Sentry - error tracking
SENTRY_DSN=your-sentry-dsn

# PostHog - analytics
NEXT_PUBLIC_POSTHOG_KEY=your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App URL (for metadata, links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### How to Obtain Environment Variables

| Variable                      | How to Get                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| `API_KEY`                     | [Spoonacular](https://spoonacular.com/food-api) → Sign up, copy API key                       |
| `DATABASE_URL`                | [NeonDB](https://neon.tech/) → Create project, copy connection string                         |
| `AUTH_SECRET`                 | Run `openssl rand -base64 32`                                                                 |
| `GOOGLE_ID` / `GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) → Credentials → OAuth 2.0 Client ID |
| `UPSTASH_REDIS_*`             | [Upstash](https://upstash.com/) → Create Redis database                                       |
| `CMS_*`                       | [Contentful](https://www.contentful.com/) → Space Settings → API keys                         |
| `CLOUDINARY_*`                | [Cloudinary](https://cloudinary.com/) → Dashboard                                             |
| `SENTRY_DSN`                  | [Sentry](https://sentry.io/) → Create project, copy DSN                                       |

---

## How to Run

| Command                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `npm run dev`             | Start dev server (Turbo) at `http://localhost:3000` |
| `npm run dev:webpack`     | Start dev server (Webpack)                          |
| `npm run build`           | Production build                                    |
| `npm run start`           | Start production server                             |
| `npm run lint`            | Run ESLint                                          |
| `npm run prisma:generate` | Generate Prisma client                              |
| `npm run prisma:push`     | Push schema to database                             |
| `npm run prisma:studio`   | Open Prisma Studio                                  |

---

## Project Walkthrough

### 1. Home Page (`/`)

- Hero search with a search bar and advanced filters.
- Tabs: **Home**, **Favourites**, **Collections**, **Meal Plan**, **Shopping List**.
- Search results from Spoonacular API with dietary badges, scores, and images.

### 2. Recipe Detail (`/recipe/[id]`)

- Full recipe info: instructions, ingredients, nutrition, taste, wine pairing.
- Tabs: **Details**, **Summary**, **Info**, **Nutrition**, **Taste**.
- Actions: Add to favourites, collections, meal plan, shopping list.
- User notes, images, videos (when logged in).

### 3. Blog (`/blog`)

- List of blog posts from Contentful CMS.
- Individual post at `/blog/[slug]`.

### 4. Business Insights (`/business-insights`)

- User stats, recipe activity, AI predictions, trends.
- Popular recipes, top contributors, recent activity.

### 5. API Status (`/api-status`)

- Real-time status of main API endpoints.
- Auto-refresh every 10 seconds.

### 6. API Docs (`/api-docs`)

- Endpoint reference grouped by category.
- Method badges, paths, and params.

---

## API Endpoints

The app uses a unified API handler at `/api/[...path]`, which routes to different logic by path.

### Recipes

| Method | Path                            | Description                                |
| ------ | ------------------------------- | ------------------------------------------ |
| GET    | `/api/recipes/search`           | Search recipes (searchTerm, page, filters) |
| GET    | `/api/recipes/autocomplete`     | Autocomplete suggestions                   |
| GET    | `/api/recipes/[id]/information` | Full recipe details                        |
| GET    | `/api/recipes/[id]/summary`     | Recipe summary                             |
| GET    | `/api/recipes/[id]/similar`     | Similar recipes                            |
| GET    | `/api/recipes/favourite`        | User favourites (auth)                     |
| POST   | `/api/recipes/favourite`        | Add favourite (auth)                       |
| DELETE | `/api/recipes/favourite`        | Remove favourite (auth)                    |

### Food & Wine

| Method | Path                     | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/food/wine/dishes`  | Dishes for a wine       |
| GET    | `/api/food/wine/pairing` | Wine pairing for a food |

### Collections

| Method | Path                          | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/collections`            | List collections (auth)  |
| GET    | `/api/collections/[id]`       | Get collection (auth)    |
| GET    | `/api/collections/[id]/items` | Collection items (auth)  |
| POST   | `/api/collections`            | Create collection (auth) |
| POST   | `/api/collections/[id]/items` | Add item (auth)          |
| PUT    | `/api/collections/[id]`       | Update collection (auth) |
| DELETE | `/api/collections/[id]`       | Delete collection (auth) |
| DELETE | `/api/collections/[id]/items` | Remove item (auth)       |

### Meal Plan & Shopping

| Method | Path                 | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/meal-plan`     | Get meal plan (auth)      |
| POST   | `/api/meal-plan`     | Add to meal plan (auth)   |
| DELETE | `/api/meal-plan`     | Clear meal plan (auth)    |
| GET    | `/api/shopping-list` | Get shopping list (auth)  |
| POST   | `/api/shopping-list` | Create/update list (auth) |
| PUT    | `/api/shopping-list` | Update list (auth)        |
| DELETE | `/api/shopping-list` | Clear list (auth)         |

### Platform & CMS

| Method | Path                     | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/cms/blog`          | List blog posts     |
| GET    | `/api/cms/blog/[slug]`   | Single blog post    |
| GET    | `/api/business-insights` | Platform statistics |
| GET    | `/api/status`            | API health status   |

---

## Components & Reusability

### Using Components in Other Projects

Most components are self-contained and can be reused by copying the component and its dependencies.

**Example: Recipe card**

```tsx
// src/components/recipes/RecipeCard.tsx
import RecipeCard from "@/components/recipes/RecipeCard";

<RecipeCard recipe={recipe} onFavouriteToggle={() => {}} isFavourite={false} />;
```

**Example: Search input**

```tsx
import SearchInput from "@/components/search/SearchInput";

<SearchInput
  onSearch={(term) => console.log(term)}
  placeholder="Search recipes..."
/>;
```

### Component Architecture

- **Pages** (`src/components/pages/`) – full-page client components.
- **Features** (`src/components/recipes/`, `collections/`, etc.) – feature-specific components.
- **UI** (`src/components/ui/`) – ShadCN primitives (Button, Card, Dialog, etc.).
- **Skeletons** (`src/components/skeletons/`) – loading placeholders.

### Hooks Usage

```tsx
import { useRecipes } from "@/hooks/useRecipes";
import { useCollections } from "@/hooks/useCollections";
import { useIsFavourite } from "@/hooks/useIsFavourite";

const { data, isLoading, searchRecipes } = useRecipes();
const { collections, createCollection } = useCollections();
const { isFavourite, toggleFavourite } = useIsFavourite(recipeId);
```

---

## Routes

| Route                | Type    | Description         |
| -------------------- | ------- | ------------------- |
| `/`                  | Static  | Home (search, tabs) |
| `/recipe/[id]`       | Dynamic | Recipe detail       |
| `/blog`              | Static  | Blog list           |
| `/blog/[slug]`       | Dynamic | Blog post           |
| `/business-insights` | Static  | Analytics dashboard |
| `/api-status`        | Static  | API status page     |
| `/api-docs`          | Static  | API docs page       |
| `/test-sentry`       | Static  | Sentry test page    |

---

## Database Schema

Key models (Prisma):

- **User** – Auth, profile, relations
- **FavouriteRecipes** – User favourites
- **RecipeCollection** – Custom collections
- **CollectionItem** – Items in collections
- **RecipeNote** – User notes on recipes
- **MealPlan** / **MealPlanItem** – Meal planning
- **ShoppingList** – Shopping lists
- **RecipeImage** – User-uploaded images (Cloudinary)
- **FilterPreset** – Saved search filters
- **RecipeVideo** – User-added videos

---

## Keywords

`recipe app`, `Next.js`, `React`, `TypeScript`, `Spoonacular API`, `PostgreSQL`, `Prisma`, `NextAuth`, `full-stack`, `meal planning`, `shopping list`, `recipe collections`, `favourites`, `AI recipe`, `Contentful`, `Cloudinary`, `Tailwind CSS`, `ShadCN`, `Vercel`, `Redis`, `Sentry`

---

## Conclusion

Recipe Guide is a full-featured recipe platform built with modern web technologies. It demonstrates:

- Next.js 15 App Router with server and client components
- Prisma + PostgreSQL for data
- NextAuth for OAuth and credentials
- REST API design with a unified handler
- ShadCN UI and Tailwind for consistent design
- API key rotation, caching, and error monitoring

Use it as a reference for building similar apps or as a base to extend with new features.

---

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com/](https://www.arnobmahmud.com/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
