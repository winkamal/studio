'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { BlogPost } from '@/types';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ManagePostsPage() {
  const firestore = useFirestore();
  const blogsCollection = useMemoFirebase(
    () => collection(firestore, 'blogs'),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<BlogPost>(blogsCollection);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete || !firestore) return;
    setIsDeleting(postToDelete.id);
    setShowDeleteAlert(false);

    try {
      const postRef = doc(firestore, 'blogs', postToDelete.id);
      await deleteDoc(postRef);
      toast({
        title: 'Post Deleted',
        description: `"${postToDelete.title}" has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the post. Please try again.',
      });
    } finally {
      setIsDeleting(null);
      setPostToDelete(null);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Manage Posts</CardTitle>
              <CardDescription>
                Here you can edit, delete, and view your blog posts.
              </CardDescription>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant={'default'}>Published</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(post.date), 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(post)}
                            disabled={isDeleting === post.id}
                          >
                            {isDeleting === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            No posts found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              titled &quot;{postToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
