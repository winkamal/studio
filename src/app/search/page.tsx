
'use client';

import { PostCard } from "@/components/post-card";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import type { BlogPost } from "@/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

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


function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const tag = searchParams.get('tag');

    const firestore = useFirestore();

    // Query for tags
    const tagQuery = useMemoFirebase(
      () => (firestore && tag ? query(collection(firestore, 'blogs'), where('tags', 'array-contains', tag)) : null),
      [firestore, tag]
    );
    const { data: tagPosts, isLoading: isLoadingTags } = useCollection<BlogPost>(tagQuery);

    // For general search, we fetch all and filter client-side for simplicity.
    // For a larger app, a dedicated search solution like Algolia/Elasticsearch would be better.
    const blogsCollection = useMemoFirebase(
        () => (firestore && q ? collection(firestore, 'blogs') : null),
        [firestore, q]
    );
    const { data: allPosts, isLoading: isLoadingAll } = useCollection<BlogPost>(blogsCollection);

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    let heading = "Search Results";

    useEffect(() => {
        if (tag) {
            setPosts(tagPosts || []);
            setIsLoading(isLoadingTags);
        } else if (q && allPosts) {
            const lowerCaseQuery = q.toLowerCase();
            const filtered = allPosts.filter(post => 
                post.title.toLowerCase().includes(lowerCaseQuery) || 
                post.content.toLowerCase().includes(lowerCaseQuery)
            );
            setPosts(filtered);
            setIsLoading(isLoadingAll);
        } else if (!q && !tag) {
            setPosts([]);
            setIsLoading(false);
        }
    }, [q, tag, tagPosts, allPosts, isLoadingTags, isLoadingAll]);
    
    if (q) {
        heading = `Results for "${q}"`;
    } else if (tag) {
        heading = `Posts tagged with #${tag}`;
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
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center">No posts found.</p>
            )}
        </>
    )
}

function SearchPageInternal() {
  return (
    <SidebarProvider>
      <div className="relative flex flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Sidebar>
            <SiteSidebar />
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <main className="container mx-auto px-4 py-8">
              <SearchResults />
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
