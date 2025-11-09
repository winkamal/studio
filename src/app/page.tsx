"use client";
import { SiteHeader } from "@/components/site-header";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { BlogPost } from "@/types";
import { summarizeText } from "@/ai/flows/summarize-text-flow";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { PostContent } from "@/components/post-content";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

function BlogSelector({
  posts,
  summaries,
  onSelectPost,
  selectedPost,
  isLoading,
  summariesLoading,
}: {
  posts: BlogPost[] | null;
  summaries: Record<string, string>;
  onSelectPost: (post: BlogPost) => void;
  selectedPost: BlogPost | null;
  isLoading: boolean;
  summariesLoading: Record<string, boolean>;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg skew-card">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No blog posts yet. Create one in the admin dashboard!</p>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => onSelectPost(post)}
          className={cn(
            "w-full text-left p-4 rounded-2xl transition-all duration-300 skew-card",
            selectedPost?.id === post.id ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-card-foreground/5"
          )}
        >
          <h3 className="font-headline text-lg font-bold">{post.title}</h3>
          {summariesLoading[post.id] ? (
             <div className="space-y-2 mt-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
             </div>
          ) : (
             <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {summaries[post.id] || post.excerpt}
             </p>
          )}
        </button>
      ))}
    </div>
  );
}

function PostViewer({ post }: { post: BlogPost | null }) {
  if (!post) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
            <h2 className="font-headline text-2xl font-bold">Welcome to Life Canvas</h2>
            <p className="text-muted-foreground mt-2">Select a post from the left to start reading.</p>
        </div>
      </div>
    );
  }

  return (
    <article>
        <header className="mb-8">
            <div className="relative h-64 md:h-80 w-full mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                data-ai-hint={post.coverImageHint}
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-foreground">
                {post.title}
            </h1>
            <p className="text-sm text-muted-foreground">
                By {post.author} on {format(new Date(post.date), "MMMM d, yyyy")}
            </p>
        </header>
        <PostContent content={post.content} />
    </article>
  );
}


export default function Home() {
  const firestore = useFirestore();
  const blogsCollection = useMemoFirebase(
    () => collection(firestore, "blogs"),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<BlogPost>(blogsCollection);

  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summariesLoading, setSummariesLoading] = useState<Record<string, boolean>>({});
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (posts && posts.length > 0 && !selectedPost) {
        // Sort posts by date descending before selecting the first one
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSelectedPost(sortedPosts[0]);
    }
  }, [posts, selectedPost]);

  useEffect(() => {
    if (posts) {
      posts.forEach(async (post) => {
        if (!summaries[post.id] && !summariesLoading[post.id]) {
          setSummariesLoading((prev) => ({ ...prev, [post.id]: true }));
          try {
            const summary = await summarizeText({ text: post.content });
            setSummaries((prev) => ({ ...prev, [post.id]: summary.summary }));
          } catch (e) {
            console.error("Error generating summary for post", post.id, e);
            setSummaries((prev) => ({ ...prev, [post.id]: post.excerpt }));
          } finally {
            setSummariesLoading((prev) => ({ ...prev, [post.id]: false }));
          }
        }
      });
    }
  }, [posts, summaries, summariesLoading]);

  const sortedPosts = useMemoFirebase(() => {
      if (!posts) return null;
      return [...posts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 h-[calc(100vh-100px)]">
              <div className="md:col-span-1 lg:col-span-1">
                  <ScrollArea className="h-full pr-6">
                      <BlogSelector 
                          posts={sortedPosts} 
                          summaries={summaries}
                          onSelectPost={setSelectedPost}
                          selectedPost={selectedPost}
                          isLoading={isLoading}
                          summariesLoading={summariesLoading}
                      />
                  </ScrollArea>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                  <ScrollArea className="h-full">
                      <div className="skew-card p-8 lg:p-12">
                          <PostViewer post={selectedPost} />
                      </div>
                  </ScrollArea>
              </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
