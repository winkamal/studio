import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dummy data for now
const posts = [
  { id: 1, title: "A quiet morning", status: "Published", createdAt: "2024-05-10" },
  { id: 2, title: "City lights at dusk", status: "Draft", createdAt: "2024-05-12" },
  { id: 3, title: "Into the misty forest", status: "Published", createdAt: "2024-05-15" },
];


export default function ManagePostsPage() {
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
            <CardTitle className="font-headline">Manage Posts</CardTitle>
            <CardDescription>Here you can edit, delete, and view your blog posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
