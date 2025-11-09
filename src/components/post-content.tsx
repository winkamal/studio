"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PostContentProps {
    content: string;
    className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
    const processedContent = useMemo(() => {
        const hashtagRegex = /#(\w+)/g;
        const replacedContent = content.replace(hashtagRegex, (match, tag) => {
            return `<a href="/search?tag=${tag}" class="text-primary hover:underline font-semibold">#${tag}</a>`;
        });
        return replacedContent.replace(/\n/g, '<br />');
    }, [content]);

    return (
        <div
            className={cn("prose dark:prose-invert prose-lg max-w-none text-foreground prose-headings:font-headline prose-a:text-primary prose-a:no-underline hover:prose-a:underline", className)}
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    );
}
