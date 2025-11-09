"use client";
import { SiteHeader } from "@/components/site-header";
import { Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/site-sidebar";
import { PostCard } from "@/components/post-card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { BlogPost } from "@/types";
import { summarizeText } from "@/ai/flows/summarize-text-flow";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function BlogList() {
  const firestore = useFirestore();
  const blogsCollection = useMemoFirebase(
    () => collection(firestore, "blogs"),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<BlogPost>(blogsCollection);

  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summariesLoading, setSummariesLoading] = useState<
    Record<string, boolean>
  >({});

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
            // Fallback to excerpt
            setSummaries((prev) => ({ ...prev, [post.id]: post.excerpt }));
          } finally {
            setSummariesLoading((prev) => ({ ...prev, [post.id]: false }));
          }
        }
      });
    }
  }, [posts, summaries, summariesLoading]);

  if (isLoading) {
    return (
      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
           <div key={i} className="flex flex-col space-y-3">
             <Skeleton className="h-[125px] w-full rounded-xl" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-[250px]" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
           </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post) => {
        const postWithSummary = {
          ...post,
          excerpt: summaries[post.id] || post.excerpt,
        };
        return <PostCard key={post.slug} post={postWithSummary} />;
      })}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Sidebar>
          <SiteSidebar />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <main className="container mx-auto px-4 py-8">
            <BlogList />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
