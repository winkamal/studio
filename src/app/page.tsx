
"use client";
import { SiteHeader } from "@/components/site-header";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/site-sidebar";
import { PostCard } from "@/components/post-card";
import { HeroBanner } from "@/components/hero-banner";

export default function Home() {
  const firestore = useFirestore();
  const blogsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'blogs'), orderBy('date', 'desc')) : null),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<BlogPost>(blogsQuery);

  return (
    <SidebarProvider>
      <div className="relative flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex">
          <Sidebar>
            <SiteSidebar />
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="flex-1">
            <HeroBanner />
            <main className="container mx-auto px-4 py-8 pt-12">
              {isLoading && !posts ? (
                <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
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
              ) : posts && posts.length > 0 ? (
                <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
                  {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                    <h2 className="font-headline text-2xl font-bold">Welcome to VT blogs</h2>
                    <p className="text-muted-foreground mt-2">No posts yet. Create one in the admin dashboard!</p>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
