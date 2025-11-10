
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useState, type FormEvent, useEffect, useRef, type ChangeEvent } from "react";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const postRef = useMemoFirebase(() => (firestore && id ? doc(firestore, 'blogs', id as string) : null), [firestore, id]);
  const { data: post, isLoading: isPostLoading } = useDoc<BlogPost>(postRef);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
      setCoverImage(post.coverImage);
    }
  }, [post]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCoverImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !user || !postRef) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to update a post.",
        });
        return;
    }
    
    setIsLoading(true);

    const updatedPost = {
        title,
        content,
        coverImage,
        tags: tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
        excerpt: content.substring(0, 150) + "...",
    };

    try {
        updateDocumentNonBlocking(postRef, updatedPost);
        
        toast({
            title: "Post Updated!",
            description: "Your blog post has been successfully updated.",
        });

        router.push('/admin/posts');

    } catch (error) {
        console.error("Error updating post:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not update your post. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (isPostLoading) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
           <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/posts">
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Posts
                </Link>
              </Button>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-48" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-40 w-full" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                 </div>
              </CardContent>
            </Card>
          </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Posts
            </Link>
          </Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Edit Post</CardTitle>
            <CardDescription>Make changes to your post below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Your post title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  {coverImage && (
                    <div className="relative w-48 h-24 rounded-md overflow-hidden">
                      <Image src={coverImage} alt="Cover image preview" fill className="object-cover" />
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Write your blog post here..." className="min-h-[300px]" value={content} onChange={(e) => setContent(e.target.value)} required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g., travel, food, tech" value={tags} onChange={(e) => setTags(e.target.value)} />
                <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
