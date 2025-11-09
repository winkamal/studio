
'use client';

import { PostCard } from "@/components/post-card";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { getPostsByTag, searchPosts } from "@/lib/posts";
import type { BlogPost } from "@/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

interface SearchPageProps {
  searchParams: {
    q?: string;
    tag?: string;
  };
}

function SearchResultsSkeleton() {
    return (
        <>
            <Skeleton className="h-10 w-1/2 mb-8" />
            <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="p-0">
                            <Skeleton className="h-48 w-full" />
                        </CardHeader>
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full mt-1" />
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}


function SearchResults({ searchParams }: SearchPageProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    let heading = "Search Results";

    useEffect(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        if (searchParams.q) {
            const results = await searchPosts(searchParams.q);
            setPosts(results);
        } else if (searchParams.tag) {
            const results = await getPostsByTag(searchParams.tag);
            setPosts(results);
        }
        setIsLoading(false);
      }
      fetchPosts();
    }, [searchParams]);
    
    if (searchParams.q) {
        heading = `Results for "${searchParams.q}"`;
    } else if (search_params.tag) {
        heading = `Posts tagged with #${search_params.tag}`;
    }

    if (isLoading) {
        return <SearchResultsSkeleton />
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

function SearchPageInternal() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const tag = searchParams.get('tag');

  return (
    <SidebarProvider>
      <div className="relative flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1">
          <Sidebar>
            <SiteSidebar />
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <main className="container mx-auto px-4 py-8">
              <SearchResults searchParams={{ q, tag }} />
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchPageInternal />
        </Suspense>
    )
}
