
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Feedback } from '@/types';
import { collection, deleteDoc, doc, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Edit, Loader2, PlusCircle, Trash2, Upload, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent, useRef, type ChangeEvent } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

function NewFeedbackForm({ onSubmitted }: { onSubmitted: () => void }) {
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'bug' | 'feature'>('bug');
    const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleScreenshotUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!firestore || !description) return;

        setIsSubmitting(true);
        try {
            const feedbackCollection = collection(firestore, 'feedback');
            await addDoc(feedbackCollection, {
                description,
                type,
                status: 'New',
                comment: '',
                createdAt: new Date().toISOString(),
                screenshotUrl,
            });
            toast({ title: 'Feedback Submitted', description: 'Thank you for your feedback!' });
            setDescription('');
            setScreenshotUrl(null);
            onSubmitted();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit feedback.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value: 'bug' | 'feature') => setType(value)} defaultValue={type}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the bug or feature request..." required />
            </div>
            <div className="space-y-2">
                <Label>Screenshot</Label>
                {screenshotUrl && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                         <Image src={screenshotUrl} alt="Screenshot preview" fill className="object-contain" />
                    </div>
                )}
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {screenshotUrl ? 'Change Screenshot' : 'Upload Screenshot'}
                </Button>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleScreenshotUpload}
                    accept="image/*"
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                </Button>
            </div>
        </form>
    )
}

function EditFeedbackForm({ feedback, onSaved }: { feedback: Feedback; onSaved: () => void; }) {
    const [status, setStatus] = useState(feedback.status);
    const [comment, setComment] = useState(feedback.comment);
    const [screenshotUrl, setScreenshotUrl] = useState(feedback.screenshotUrl || null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleScreenshotUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!firestore) return;

        setIsSaving(true);
        try {
            const feedbackRef = doc(firestore, 'feedback', feedback.id);
            await updateDoc(feedbackRef, { status, comment, screenshotUrl });
            toast({ title: 'Feedback Updated' });
            onSaved();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update feedback.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
             <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm p-3 rounded-md bg-muted text-muted-foreground">{feedback.description}</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value: 'New' | 'In Progress' | 'Completed') => setStatus(value)} defaultValue={status}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="comment">Developer Comment</Label>
                <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
            </div>
            <div className="space-y-2">
                <Label>Screenshot</Label>
                {screenshotUrl && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                         <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                            <Image src={screenshotUrl} alt="Screenshot preview" fill className="object-contain" />
                         </a>
                    </div>
                )}
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {screenshotUrl ? 'Change Screenshot' : 'Upload Screenshot'}
                </Button>
                 <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleScreenshotUpload}
                    accept="image/*"
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}

export default function ManageFeedbackPage() {
  const firestore = useFirestore();
  const feedbackQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: feedbackItems, isLoading } = useCollection<Feedback>(feedbackQuery);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Feedback | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Feedback | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (item: Feedback) => {
    setItemToDelete(item);
    setShowDeleteAlert(true);
  };
  
  const handleEditClick = (item: Feedback) => {
    setItemToEdit(item);
    setShowEditDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !firestore) return;
    setIsDeleting(itemToDelete.id);
    setShowDeleteAlert(false);

    try {
      const itemRef = doc(firestore, 'feedback', itemToDelete.id);
      await deleteDoc(itemRef);
      toast({
        title: 'Feedback Deleted',
        description: `The feedback item has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the feedback. Please try again.',
      });
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const getStatusBadgeVariant = (status: Feedback['status']) => {
    switch (status) {
        case 'New': return 'secondary';
        case 'In Progress': return 'default';
        case 'Completed': return 'outline';
        default: return 'secondary';
    }
  }

  return (
    <>
      <div className="flex flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="ml-auto">
             <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Submit Feedback
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Bug or Feature Request</DialogTitle>
                        <DialogDescription>
                            Use this form to submit a new bug report or feature request.
                        </DialogDescription>
                    </DialogHeader>
                    <NewFeedbackForm onSubmitted={() => setShowNewDialog(false)} />
                </DialogContent>
            </Dialog>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Manage Feedback</CardTitle>
              <CardDescription>
                Here you can view, update, and delete bug reports and feature requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : feedbackItems && feedbackItems.length > 0 ? (
                    feedbackItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant={item.type === 'bug' ? 'destructive' : 'secondary'}>{item.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium truncate max-w-sm flex items-center gap-2">
                           {item.screenshotUrl && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                           {item.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(item)}
                            disabled={isDeleting === item.id}
                          >
                            {isDeleting === item.id ? (
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
                        <TableCell colSpan={5} className="text-center">
                            No feedback submitted yet.
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
              This action cannot be undone. This will permanently delete this feedback item.
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

      {itemToEdit && (
         <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update Feedback</DialogTitle>
                    <DialogDescription>
                        Update the status and add comments for this feedback item.
                    </DialogDescription>
                </DialogHeader>
                <EditFeedbackForm feedback={itemToEdit} onSaved={() => setShowEditDialog(false)} />
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
