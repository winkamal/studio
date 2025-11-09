import type { Post } from "@/types";

// This file is now used for providing static data for some pages, but the main blog logic fetches from Firestore.
const posts: Post[] = [];

export function getPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
    return getPosts().filter(post => post.tags.includes(tag.toLowerCase()));
}

export function searchPosts(query: string): Post[] {
    const lowerCaseQuery = query.toLowerCase();
    return getPosts().filter(post => 
        post.title.toLowerCase().includes(lowerCaseQuery) || 
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery)
    );
}

export function getAllTags(): string[] {
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
}
