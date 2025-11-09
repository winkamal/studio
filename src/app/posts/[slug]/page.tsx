
'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/site-header';
import Link from 'next/link';
import { PostContent } from '@/components/post-content';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { BlogPost } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarRail,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SiteSidebar } from '@/components/site-sidebar';
import { useMemo } from 'react';

function PostPageContent({ postId }: { postId: string }) {
  const firestore = useFirestore();
  const postRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'blogs', postId) : null),
    [firestore, postId]
  );
  const { data: post, isLoading } = useDoc<BlogPost>(postRef);

  if (isLoading) {
    return (
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          </div>
        </main>
    );
  }

  if (!post) {
    return notFound();
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

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const firestore = useFirestore();
  const blogsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'blogs') : null),
    [firestore]
  );
  
  // Fetch all posts to find the one with the matching slug.
  // This is a lightweight query as we're not fetching content here.
  const { data: posts, isLoading: arePostsLoading } = useCollection<BlogPost>(
    blogsCollection,
    { getDocs: true, noContent: true }
  );

  const postId = useMemo(() => {
    if (!posts) return null;
    const foundPost = posts.find((p) => p.slug === slug);
    return foundPost?.id ?? null;
  }, [posts, slug]);
  
  // This happens if the slug is invalid after checking all posts.
  if (!arePostsLoading && !postId) {
    notFound();
  }

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
            {arePostsLoading ? (
               <main className="container mx-auto px-4 py-8">
                  <Skeleton className="h-96 w-full mb-8" />
                  <div className="max-w-3xl mx-auto">
                      <Skeleton className="h-12 w-3/4 mb-4" />
                      <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-32" />
                          </div>
                      </div>
                      <div className="mt-8 space-y-4">
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-5/6" />
                      </div>
                  </div>
              </main>
            ) : postId ? (
              <PostPageContent postId={postId} />
            ) : null}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
