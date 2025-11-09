
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import Image from "next/image";

export default function AboutPage() {
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
              <div className="max-w-3xl mx-auto">
                <header className="mb-12 text-center">
                  <h1 className="font-headline text-5xl font-bold mb-4">
                    About VT blogs
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Capturing the fleeting moments that make life beautiful.
                  </p>
                </header>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                    <Image
                      src="https://picsum.photos/seed/aboutme/400/400"
                      alt="Vibha"
                      fill
                      className="object-cover"
                      data-ai-hint="person smiling"
                    />
                  </div>
                  <div>
                      <h2 className="font-headline text-3xl font-bold mb-2">Vibha</h2>
                      <p className="text-lg text-muted-foreground mb-4">
                          Hi there! I'm Vibha, the voice and heart behind VT blogs. I started this blog as a personal project to document the small, everyday moments that often go unnoticed but hold the most meaning.
                      </p>
                  </div>
                </div>
                
                <div className="prose dark:prose-invert prose-lg max-w-none text-foreground prose-headings:font-headline">
                  <p>
                    I believe that life is a canvas, and we are the artists. Every day, we add new strokes, colors, and textures. Some days are bright and vibrant, others are more muted and contemplative. This blog is my attempt to capture that spectrum.
                  </p>
                  <p>
                    Here, you'll find reflections on everything from the simple joy of a morning coffee to thoughts on nature, creativity, and the human experience. It's a collection of my personal musings, a digital scrapbook of life's journey.
                  </p>
                  <p>
                    My hope is that by sharing my own canvas, I can inspire you to pay a little more attention to yours. Thank you for being here and sharing in these moments with me.
                  </p>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
