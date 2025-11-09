
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Github,
  Hash,
  Home,
  Info,
  Linkedin,
  Mail,
  Rss,
  Search,
  Twitter,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useRouter, usePathname } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";
import { useCollection, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { AboutContent, BlogPost } from "@/types";
import { collection, doc, query, orderBy, limit } from "firebase/firestore";
import { useMemo } from "react";

export function SiteSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  
  const blogsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'blogs') : null, [firestore]);
  const { data: posts } = useCollection<BlogPost>(blogsCollection);

  const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
  const { data: aboutContent } = useDoc<AboutContent>(aboutRef);
  
  const recentPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogs'), orderBy('date', 'desc'), limit(5));
  }, [firestore]);
  const { data: recentPosts } = useCollection<BlogPost>(recentPostsQuery);

  const allTags = useMemo(() => {
    if (!posts) return [];
    const tags = posts.flatMap(post => post.tags);
    return [...new Set(tags)];
  }, [posts]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage
              src={aboutContent?.imageUrl || "https://picsum.photos/seed/author/100/100"}
              alt={aboutContent?.name || "Vibha"}
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{aboutContent?.name?.charAt(0) || "V"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{aboutContent?.name || "Vibha"}</span>
            <span className="text-sm text-muted-foreground">{aboutContent?.bio || "Author & Dreamer"}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <div className="flex items-center justify-between pr-2">
                <SidebarMenuItem className="w-full">
                    <SidebarMenuButton
                    asChild
                    isActive={pathname === "/"}
                    tooltip="Homepage"
                    >
                    <Link href="/">
                        <Home />
                        <span>Home</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <ThemeToggle />
            </div>
            <SidebarMenuItem>
                <SidebarMenuButton
                asChild
                isActive={pathname === "/about"}
                tooltip="About Me"
                >
                <Link href="/about">
                    <Info />
                    <span>About Me</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Follow Me</SidebarGroupLabel>
          <SidebarMenu>
            {aboutContent?.twitterUrl && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Twitter / X">
                  <a href={aboutContent.twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter />
                    <span>Twitter / X</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {aboutContent?.githubUrl && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="GitHub">
                  <a href={aboutContent.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github />
                    <span>GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {aboutContent?.linkedinUrl && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="LinkedIn">
                  <a href={aboutContent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin />
                    <span>LinkedIn</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <form onSubmit={handleSearch} className="px-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SidebarInput
                name="search"
                placeholder="Search posts..."
                className="pl-8"
              />
            </div>
          </form>
        </SidebarGroup>

        <SidebarSeparator />
        
        <SidebarGroup>
            <SidebarGroupLabel>Recent Posts</SidebarGroupLabel>
            <SidebarMenu>
                {recentPosts?.map(post => (
                    <SidebarMenuItem key={post.slug}>
                        <SidebarMenuButton asChild isActive={pathname === `/posts/${post.slug}`} size="sm" tooltip={post.title}>
                             <Link href={`/posts/${post.slug}`}>
                                <Rss />
                                <span>{post.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />


        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <div className="flex flex-wrap gap-2 p-2">
            {allTags.map((tag) => (
              <Link
                href={`/search?tag=${tag}`}
                key={tag}
                className="flex items-center gap-1 rounded-full bg-accent/50 px-2 py-1 text-xs text-accent-foreground transition-colors hover:bg-accent"
              >
                <Hash className="h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-end p-2">
            <span className="text-xs text-muted-foreground">© 2024 VT blogs</span>
        </div>
      </SidebarFooter>
    </>
  );
}
