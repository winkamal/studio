import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
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
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Your post title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Write your blog post here..." className="min-h-[300px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g., travel, food, tech" />
                <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Post</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
