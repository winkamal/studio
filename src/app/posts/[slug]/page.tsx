import { getPost, getPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/site-sidebar";
import Link from "next/link";
import { PostContent } from "@/components/post-content";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Sidebar>
          <SiteSidebar />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
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
                             <Badge variant="secondary" className="transition-colors hover:bg-accent">{tag}</Badge>
                           </Link>
                        ))}
                    </div>

                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/author/40/40" alt={post.author} data-ai-hint="person portrait"/>
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">{post.author}</p>
                            <p className="text-sm text-muted-foreground">
                                Published on {format(new Date(post.date), "MMMM d, yyyy")}
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
        </SidebarInset>
      </div>
    </div>
  );
}
