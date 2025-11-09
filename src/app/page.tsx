import { SiteHeader } from "@/components/site-header";
import { Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/site-sidebar";
import { getPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function Home() {
  const posts = getPosts();

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
            <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
