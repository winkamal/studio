
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
import { getAllTags, getPosts } from "@/lib/posts";
import Link from "next/link";

export function SiteSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const allTags = getAllTags();
  const recentPosts = getPosts().slice(0, 5);

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
              src="https://picsum.photos/seed/author/100/100"
              alt="Vibha"
              data-ai-hint="person portrait"
            />
            <AvatarFallback>V</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Vibha</span>
            <span className="text-sm text-muted-foreground">Author & Dreamer</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Twitter / X">
                <a href="#" target="_blank">
                  <Twitter />
                  <span>Twitter / X</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="GitHub">
                <a href="#" target="_blank">
                  <Github />
                  <span>GitHub</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="LinkedIn">
                <a href="#" target="_blank">
                  <Linkedin />
                  <span>LinkedIn</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
                {recentPosts.map(post => (
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
        <div className="flex items-center justify-between p-2">
            <span className="text-xs text-muted-foreground">© 2024 VT blogs</span>
            <ThemeToggle />
        </div>
      </SidebarFooter>
    </>
  );
}
