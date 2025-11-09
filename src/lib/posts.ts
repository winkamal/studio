
import type { BlogPost } from "@/types";
import { collection, getDocs, query as firestoreQuery, where } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

// This file is used for providing static data for some pages, 
// but will be modified to fetch from Firestore.

// Note: The top-level `getFirestore` instance might not be initialized when this module is first imported.
// We will get the instance when needed inside the functions.
const { firestore } = initializeFirebase();

export async function getPosts(): Promise<BlogPost[]> {
  const postsCollection = collection(firestore, 'blogs');
  const postSnapshot = await getDocs(postsCollection);
  const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  return postList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const postsCollection = collection(firestore, 'blogs');
  const q = firestoreQuery(postsCollection, where("slug", "==", slug));
  const postSnapshot = await getDocs(q);
  if (postSnapshot.empty) {
    return undefined;
  }
  const doc = postSnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogPost;
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const allPosts = await getPosts();
    return allPosts.filter(post => post.tags.includes(tag.toLowerCase()));
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
    const lowerCaseQuery = query.toLowerCase();
    const allPosts = await getPosts();
    return allPosts.filter(post => 
        post.title.toLowerCase().includes(lowerCaseQuery) || 
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery)
    );
}

export async function getAllTags(): Promise<string[]> {
    const allPosts = await getPosts();
    const allTags = allPosts.flatMap(post => post.tags);
    return [...new Set(allTags)];
}
