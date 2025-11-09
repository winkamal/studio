
'use client';
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { AboutContent } from "@/types";
import { doc } from "firebase/firestore";
import Image from "next/image";

function AboutPageContent({ content }: { content: AboutContent }) {
    return (
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
                    src={content.imageUrl}
                    alt={content.name}
                    fill
                    className="object-cover"
                    data-ai-hint="person smiling"
                />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-bold mb-2">{content.name}</h2>
                    <p className="text-lg text-muted-foreground mb-4">
                        {content.bio}
                    </p>
                </div>
            </div>
            
            <div 
                className="prose dark:prose-invert prose-lg max-w-none text-foreground prose-headings:font-headline"
                dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br />') }}
            />
        </div>
    )
}

function AboutPageSkeleton() {
    return (
        <div className="max-w-3xl mx-auto">
             <header className="mb-12 text-center">
                <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </header>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <Skeleton className="w-48 h-48 rounded-full flex-shrink-0" />
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
            </div>
             <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
            </div>
        </div>
    )
}


export default function AboutPage() {
    const firestore = useFirestore();
    const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
    const { data: aboutContent, isLoading } = useDoc<AboutContent>(aboutRef);

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
              {isLoading || !aboutContent ? <AboutPageSkeleton /> : <AboutPageContent content={aboutContent} />}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
