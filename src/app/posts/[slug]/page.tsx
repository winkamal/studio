
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
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
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

function PostPageContent({ post }: { post: BlogPost }) {
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

function PostPageSkeleton() {
    return (
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-96 w-full mb-8" />
            <div className="max-w-3xl mx-auto">
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                 <Skeleton className="h-6 w-full mt-4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </div>
        </main>
    );
}

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const firestore = useFirestore();
  const postQuery = useMemoFirebase(
    () => (firestore && slug ? query(collection(firestore, 'blogs'), where('slug', '==', slug)) : null),
    [firestore, slug]
  );
  
  const { data: posts, isLoading } = useCollection<BlogPost>(postQuery);

  const post = useMemo(() => posts?.[0], [posts]);

  // The 404 is triggered if loading is complete AND there is still no post.
  if (!isLoading && !post) {
    notFound();
  }

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
            {isLoading || !post ? (
               <PostPageSkeleton />
            ) : (
              <PostPageContent post={post} />
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
