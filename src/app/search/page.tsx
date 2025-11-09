
import { PostCard } from "@/components/post-card";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { getPostsByTag, searchPosts } from "@/lib/posts";
import type { Post } from "@/types";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: {
    q?: string;
    tag?: string;
  };
}

function SearchResults({ searchParams }: SearchPageProps) {
    let posts: Post[] = [];
    let heading = "Search Results";

    if (searchParams.q) {
        posts = searchPosts(searchParams.q);
        heading = `Results for "${searchParams.q}"`;
    } else if (searchParams.tag) {
        posts = getPostsByTag(searchParams.tag);
        heading = `Posts tagged with #${searchParams.tag}`;
    }

    return (
        <>
            <h1 className="font-headline text-4xl font-bold mb-8">{heading}</h1>
            {posts.length > 0 ? (
                <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center">No posts found.</p>
            )}
        </>
    )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Sidebar>
            <SiteSidebar />
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={<div>Loading...</div>}>
                  <SearchResults searchParams={searchParams} />
              </Suspense>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
