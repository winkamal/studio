
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useState, type FormEvent, useRef, type ChangeEvent } from "react";
import { useFirestore, useUser } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] =useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

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
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to create a post.",
        });
        return;
    }
    
    setIsLoading(true);

    const slug = generateSlug(title);
    const newPost = {
        title,
        content,
        slug,
        author: "Vibha",
        date: new Date().toISOString(),
        tags: tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
        coverImage: coverImage || `https://picsum.photos/seed/${slug}/1200/800`,
        coverImageHint: "blog post",
        excerpt: content.substring(0, 150) + "...",
    };

    try {
        const blogsCollection = collection(firestore, 'blogs');
        await addDocumentNonBlocking(blogsCollection, newPost);
        
        toast({
            title: "Post Published!",
            description: "Your new blog post is now live.",
        });

        router.push('/admin/dashboard');

    } catch (error) {
        console.error("Error creating post:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not publish your post. Please try again.",
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Dashboard
            </Link>
          </Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Create a new post</CardTitle>
            <CardDescription>Fill out the details below to publish a new blog post.</CardDescription>
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
                    <div className="relative w-48 h-24 rounded-md overflow-hidden border">
                      <Image src={coverImage} alt="Cover image preview" fill className="object-cover" />
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {coverImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Optional. A default image will be used if none is uploaded.</p>
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
                <Button variant="outline" type="button" disabled={isLoading}>Save Draft</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Publish Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
