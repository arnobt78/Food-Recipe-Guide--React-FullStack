/**
 * Blog Post Detail Component
 *
 * Features:
 * - Display full blog post content
 * - Rich text rendering
 * - Featured image
 * - Author information
 * - Category and tags
 * - ShadCN UI components
 * - React Query integration
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBlogPost } from "../../hooks/useBlogPosts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import EmptyState from "../common/EmptyState";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BlogPostDetailProps {
  slug: string;
  className?: string;
}

/**
 * Blog Post Detail Component (Memoized for performance)
 */
const BlogPostDetail = memo(({ slug, className = "" }: BlogPostDetailProps) => {
  const router = useRouter();
  const { data: post, isLoading, error, refetch } = useBlogPost(slug, !!slug);

  if (isLoading) {
    return (
      <Card className={`group rounded-[28px] border border-teal-400/30 bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-teal-500/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(20,184,166,0.35)] ${className}`}>
        <CardHeader>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`group rounded-[28px] border border-red-400/30 bg-gradient-to-br from-red-500/25 via-red-500/10 to-red-500/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(239,68,68,0.35)] ${className}`}>
        <CardContent className="p-6 text-center">
          <p className="text-red-400 mb-4">{error.message}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => refetch()}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-red-500/70 via-red-500/50 to-red-500/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(239,68,68,0.45)] transition duration-200 hover:border-red-300/40 hover:from-red-500/80 hover:via-red-500/60 hover:to-red-500/40 backdrop-blur-sm"
            >
              Retry
            </Button>
            <Button
              onClick={() => router.push("/blog")}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Back to Blog
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!post) {
    return (
      <EmptyState
        message="Blog post not found"
        subtitle="The post you're looking for doesn't exist or has been removed"
        icon="/food.svg"
      />
    );
  }

  // Format published date
  const publishedDate = new Date(post.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Card className={`group rounded-[28px] border border-teal-400/30 bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-teal-500/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(20,184,166,0.35)] overflow-hidden ${className}`}>
      {/* Header with Back Button */}
      <CardHeader className="relative bg-gradient-to-r from-teal-900/50 to-cyan-900/50 border-b border-teal-500/30 rounded-t-[28px]">
        <div className="flex items-start justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/blog")}
            className="hover:bg-teal-500/20 text-gray-400 hover:text-teal-400"
            aria-label="Back to blog"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
              {post.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
          {post.title}
        </CardTitle>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
          {post.author && (
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-teal-300" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{post.author.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {timeAgo}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.title || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-teal-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-white">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-teal-500/20 text-teal-300 border-teal-500/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BlogPostDetail.displayName = "BlogPostDetail";

export default BlogPostDetail;
