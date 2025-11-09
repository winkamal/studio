import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Settings, LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="font-headline text-2xl font-bold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/">
                    <Home className="h-4 w-4 mr-2"/>
                    View Site
                </Link>
            </Button>
            <Button variant="outline" size="sm">
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
              <Button className="w-full">
                Start Writing
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
              <Button className="w-full" variant="secondary">
                View All Posts
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
              <Button className="w-full" variant="secondary">
                Customize Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
