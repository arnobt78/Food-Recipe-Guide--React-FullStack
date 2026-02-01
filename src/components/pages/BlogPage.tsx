/**
 * Blog Page Client Component
 *
 * Features:
 * - Displays blog posts list from Contentful CMS
 * - Wraps with auth and recipe providers
 * - Client-side rendering for interactive features
 *
 * Following DEVELOPMENT_RULES.md: Server/Client component separation
 */

"use client";

import { motion } from "framer-motion";
import { AuthProvider } from "../../context/AuthContext";
import { RecipeProvider } from "../../context/RecipeContext";
import BlogPostList from "../blog/BlogPostList";
import Navbar from "../layout/Navbar";
import HeroHeader from "../layout/HeroHeader";
import { Badge } from "../ui/badge";
import { BookOpen, Sparkles } from "lucide-react";

/**
 * Blog Page Client Component
 * Contains all client-side logic and providers
 */
export default function BlogPageClient() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <div
          className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col"
          style={{
            backgroundImage: "url(/recipe-bg-4.avif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <Navbar />
          <HeroHeader subtitle="Recipe Blog & Articles">
            {/* Blog description and CMS badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                Discover cooking tips, recipe stories, and culinary insights from our kitchen to yours
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge className="bg-teal-500/20 backdrop-blur-sm text-teal-300 border-teal-500/30 px-4 py-2 text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Culinary Stories
                </Badge>
                <Badge className="bg-purple-500/20 backdrop-blur-sm text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by Contentful CMS
                </Badge>
              </div>
            </motion.div>
          </HeroHeader>
          <div className="w-full flex-1">
            <main className="max-w-9xl mx-auto px-2 sm:px-4 md:px-6 xl:px-8 py-8">
              <BlogPostList limit={12} />
            </main>
          </div>
        </div>
      </RecipeProvider>
    </AuthProvider>
  );
}
