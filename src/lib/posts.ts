import type { Post } from "@/types";

const posts: Post[] = [
  {
    slug: "a-quiet-morning",
    title: "A Quiet Morning",
    author: "Alex Doe",
    date: "2024-07-15",
    coverImage: "https://picsum.photos/seed/1/1200/800",
    coverImageHint: "coffee morning",
    excerpt: "The best mornings start with silence, a warm cup of coffee, and the gentle light of dawn painting the sky.",
    content: `
There's a certain magic to the early morning hours. The world is still, and the day is full of potential. I find that a simple cup of coffee can be a ritual, a moment of peace before the chaos begins.

This morning was particularly beautiful. The sun cast long shadows across the room, and the aroma of fresh coffee filled the air. It's in these quiet moments that I find clarity and inspiration.

What's your morning ritual? #morning #coffee #mindfulness
    `,
    tags: ["morning", "coffee", "mindfulness"],
  },
  {
    slug: "autumn-stroll",
    title: "An Autumn Stroll",
    author: "Alex Doe",
    date: "2024-07-14",
    coverImage: "https://picsum.photos/seed/2/1200/800",
    coverImageHint: "autumn park",
    excerpt: "Walking through the park in autumn is like stepping into a painting. The colors are vibrant, the air is crisp, and every leaf tells a story.",
    content: `
I went for a walk in the park today. The autumn colors were in full display - fiery reds, golden yellows, and deep oranges. The air was crisp and cool, a welcome change from the summer heat.

There's something deeply nostalgic about this season. It's a time for reflection, for cozy sweaters, and for appreciating the beauty of change. Every crunch of leaves underfoot feels like a tiny melody. #autumn #nature #walking
    `,
    tags: ["autumn", "nature", "walking"],
  },
  {
    slug: "the-joy-of-reading",
    title: "The Joy of Reading",
    author: "Alex Doe",
    date: "2024-07-13",
    coverImage: "https://picsum.photos/seed/3/1200/800",
    coverImageHint: "book cozy",
    excerpt: "Getting lost in a good book is one of life's simplest and greatest pleasures. It's a journey to another world without ever leaving your chair.",
    content: `
I finished a wonderful book last night. For a few hours, I was transported to a different time and place, living through the eyes of characters who felt as real as friends.

Reading is an escape, an education, and a comfort. It's a way to understand the world and ourselves a little better. What book has captivated you recently? I'd love some recommendations! #reading #books #joy
    `,
    tags: ["reading", "books", "joy"],
  },
  {
    slug: "city-lights",
    title: "City Lights at Dusk",
    author: "Alex Doe",
    date: "2024-07-12",
    coverImage: "https://picsum.photos/seed/4/1200/800",
    coverImageHint: "city dusk",
    excerpt: "Watching the city come alive at dusk is a breathtaking experience. The sky turns a beautiful shade of blue, and the lights begin to twinkle like stars.",
    content: `
From my apartment window, I have a perfect view of the city skyline. Last night, I watched as the sun set and the city's lights began to flicker on, one by one.

It's a reminder of the millions of stories unfolding simultaneously in this bustling metropolis. Each light is a home, a dream, a life in motion. #city #dusk #reflection
    `,
    tags: ["city", "dusk", "reflection"],
  },
  {
    slug: "thoughts-on-paper",
    title: "Thoughts on Paper",
    author: "Alex Doe",
    date: "2024-07-11",
    coverImage: "https://picsum.photos/seed/5/1200/800",
    coverImageHint: "writing journal",
    excerpt: "There's a unique power in putting pen to paper. Journaling is more than just recording events; it's a conversation with yourself.",
    content: `
I've been journaling for years, and it remains one of my most cherished habits. It's a space to untangle my thoughts, celebrate small victories, and process challenges.

The physical act of writing helps to solidify my thoughts in a way that typing never could. It's raw, it's real, and it's just for me. Do you keep a journal? #journaling #writing #selfcare
    `,
    tags: ["journaling", "writing", "selfcare"],
  },
  {
    slug: "into-the-mist",
    title: "Into the Mist",
    author: "Alex Doe",
    date: "2024-07-10",
    coverImage: "https://picsum.photos/seed/6/1200/800",
    coverImageHint: "misty forest",
    excerpt: "A hike through a misty forest feels like walking through a dream. The world is quiet, and the path ahead is a mystery waiting to be discovered.",
    content: `
This weekend, I went hiking on a trail that wound through a dense, misty forest. The silence was profound, broken only by the sound of my own footsteps.

The mist softened the edges of everything, creating an ethereal and mysterious atmosphere. It was a powerful reminder to embrace the unknown and enjoy the journey, even when you can't see the destination. #hiking #forest #adventure
    `,
    tags: ["hiking", "forest", "adventure"],
  },
];

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
