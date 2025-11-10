
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Feedback } from "@/types";
import { collection, query, where }from "firebase/firestore";
import { PlusCircle, Edit, Settings, LogOut, Home, MessageSquarePlus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const openFeedbackQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'feedback'), where('status', '!=', 'Completed')) : null,
    [firestore]
  );
  const { data: openFeedbackItems, isLoading } = useCollection<Feedback>(openFeedbackQuery);
  
  const openFeedbackCount = openFeedbackItems?.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="font-headline text-2xl font-bold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
                <Link href="/">
                    <Home className="h-4 w-4 mr-2"/>
                    View Site
                </Link>
            </Button>
            <Button variant="secondary" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <PlusCircle className="h-6 w-6 text-primary" />
                Create New Post
              </CardTitle>
              <CardDescription>
                Write and publish a new blog post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/posts/new">Start Writing</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Edit className="h-6 w-6 text-primary" />
                Manage Posts
              </CardTitle>
              <CardDescription>
                Edit, delete, or view existing posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/posts">View All Posts</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <MessageSquarePlus className="h-6 w-6 text-primary" />
                Feedback & Bugs
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                    openFeedbackCount > 0 && <Badge variant="destructive">{openFeedbackCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                View and manage user feedback and bug reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/feedback">Manage Feedback</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Settings className="h-6 w-6 text-primary" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Manage site-wide settings and appearance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/settings">Customize</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
