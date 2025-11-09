
'use client';

import type { BlogPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { summarizeText } from "@/ai/flows/summarize-text-flow";
import { Skeleton } from "./ui/skeleton";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  useEffect(() => {
    async function generateSummary() {
      if (post.content) {
        try {
          const result = await summarizeText({ text: post.content });
          setSummary(result.summary);
        } catch (error) {
          console.error("Failed to generate summary:", error);
          setSummary(post.excerpt); // Fallback to excerpt
        } finally {
          setIsLoadingSummary(false);
        }
      }
    }
    generateSummary();
  }, [post.content, post.excerpt]);


  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
      <Link href={`/posts/${post.slug}`} className="block">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.coverImageHint}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link href={`/search?tag=${tag}`} key={tag}>
                <Badge variant="secondary" className="transition-colors hover:bg-accent">{tag}</Badge>
            </Link>
          ))}
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          <CardTitle className="font-headline text-2xl mb-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          {isLoadingSummary ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
             <p className="text-muted-foreground">{summary || post.excerpt}</p>
          )}
        </Link>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://picsum.photos/seed/author/40/40"
              alt={post.author}
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.date), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
