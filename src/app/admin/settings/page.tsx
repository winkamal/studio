
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { AboutContent } from "@/types";
import { useEffect, useState, type FormEvent } from "react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function SiteSettingsPage() {
    const firestore = useFirestore();
    const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
    const { data: aboutContent, isLoading: isAboutLoading } = useDoc<AboutContent>(aboutRef);

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (aboutContent) {
            setName(aboutContent.name || '');
            setBio(aboutContent.bio || '');
            setContent(aboutContent.content || '');
            setImageUrl(aboutContent.imageUrl || '');
            setTwitterUrl(aboutContent.twitterUrl || '');
            setGithubUrl(aboutContent.githubUrl || '');
            setLinkedinUrl(aboutContent.linkedinUrl || '');
        }
    }, [aboutContent]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!aboutRef) return;
        
        setIsSaving(true);
        const updatedContent: Partial<AboutContent> = { 
            name, 
            bio, 
            content, 
            imageUrl,
            twitterUrl,
            githubUrl,
            linkedinUrl
        };
        
        try {
            await setDocumentNonBlocking(aboutRef, updatedContent, { merge: true });
            toast({
                title: "Settings Saved",
                description: "Your site settings have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save settings.",
            });
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <div className="flex flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Dashboard
            </Link>
          </Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <form onSubmit={handleSave}>
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Site Settings</CardTitle>
                <CardDescription>Manage your site's appearance and configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isAboutLoading ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium text-foreground font-headline">About Me Section</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio / Subtitle</Label>
                                <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aboutContent">About Page Content</Label>
                                <Textarea id="aboutContent" value={content} onChange={e => setContent(e.target.value)} className="min-h-40" />
                            </div>
                        </div>

                        <Separator />

                        <h3 className="text-lg font-medium text-foreground font-headline">Follow Me Section</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                             <div className="space-y-2">
                                <Label htmlFor="twitterUrl">Twitter / X URL</Label>
                                <Input id="twitterUrl" value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/your-profile"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub URL</Label>
                                <Input id="githubUrl" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/your-username"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                <Input id="linkedinUrl" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/your-profile"/>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                </div>
            </CardContent>
            </Card>
        </form>
      </main>
    </div>
  );
}
