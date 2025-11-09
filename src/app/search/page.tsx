
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
import { PostContent } from '@/components/post-content';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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

function PostPageContent({ post }: { post: BlogPost }) {
  if (!post) {
    return null;
  }

  return (
    <main className="py-8">
      <article>
        <header className="container mx-auto px-4 mb-8">
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              data-ai-hint={post.coverImageHint}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link href={`/search?tag=${tag}`} key={tag}>
                  <Badge
                    variant="secondary"
                    className="transition-colors hover:bg-accent"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="https://picsum.photos/seed/author/40/40"
                  alt={post.author}
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">
                  Published on {format(new Date(post.date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 max-w-3xl">
          <PostContent content={post.content} />
        </div>
      </article>
    </main>
  );
}


function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');

    const firestore = useFirestore();

    const blogsCollection = useMemoFirebase(
        () => (firestore ? collection(firestore, 'blogs') : null),
        [firestore]
    );

    // Build the query
    const resultsQuery = useMemoFirebase(() => {
        if (!blogsCollection) return null;
        if (tag) {
            return query(blogsCollection, where('tags', 'array-contains', tag));
        }
        if (slug) {
            return query(blogsCollection, where('slug', '==', slug));
        }
        // General query will be filtered client-side
        if (q) {
            return query(blogsCollection);
        }
        return null;
    }, [blogsCollection, tag, slug, q]);

    const { data: postsData, isLoading } = useCollection<BlogPost>(resultsQuery);

    const [posts, setPosts] = useState<BlogPost[]>([]);
    
    let heading = "Search Results";

    useEffect(() => {
        if (!postsData) {
            setPosts([]);
            return;
        }
        if (tag || slug) {
            setPosts(postsData);
        } else if (q) {
            const lowerCaseQuery = q.toLowerCase();
            const filtered = postsData.filter(post => 
                post.title.toLowerCase().includes(lowerCaseQuery) || 
                post.content.toLowerCase().includes(lowerCaseQuery)
            );
            setPosts(filtered);
        } else {
             setPosts([]);
        }
    }, [q, tag, slug, postsData]);
    
    if (q) {
        heading = `Results for "${q}"`;
    } else if (tag) {
        heading = `Posts tagged with #${tag}`;
    } else if (slug && posts.length > 0) {
        // Don't show a heading for single post view
        heading = "";
    }


    if (isLoading) {
        return <SearchResultsSkeleton />
    }

    if (slug && posts.length > 0) {
        return <PostPageContent post={posts[0]} />;
    }

    return (
        <>
            {heading && <h1 className="font-headline text-4xl font-bold mb-8">{heading}</h1>}
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
