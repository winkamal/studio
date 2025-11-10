
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { AboutContent } from "@/types";
import { useEffect, useState, type FormEvent, useRef, type ChangeEvent } from "react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { hexToHsl, hslToHex } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updatePassword, updateEmail } from "firebase/auth";

export default function SiteSettingsPage() {
    const firestore = useFirestore();
    const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
    const { data: aboutContent, isLoading: isAboutLoading } = useDoc<AboutContent>(aboutRef);
    const { user } = useUser();
    const auth = useAuth();


    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    const [backgroundColor, setBackgroundColor] = useState('');
    const [blogFontColor, setBlogFontColor] = useState('');
    const [gradientColor1, setGradientColor1] = useState('');
    const [gradientColor2, setGradientColor2] = useState('');
    const [gradientColor3, setGradientColor3] = useState('');
    const [gradientColor4, setGradientColor4] = useState('');

    const [username, setUsername] = useState('admin@example.com');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');


    const [isSaving, setIsSaving] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const heroImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (aboutContent) {
            setName(aboutContent.name || '');
            setBio(aboutContent.bio || '');
            setContent(aboutContent.content || '');
            setImageUrl(aboutContent.imageUrl || '');
            setTwitterUrl(aboutContent.twitterUrl || '');
            setGithubUrl(aboutContent.githubUrl || '');
            setLinkedinUrl(aboutContent.linkedinUrl || '');

            setBackgroundColor(aboutContent.backgroundColor || '');
            setBlogFontColor(aboutContent.blogFontColor || '');
            setGradientColor1(aboutContent.gradientColor1 || '');
            setGradientColor2(aboutContent.gradientColor2 || '');
            setGradientColor3(aboutContent.gradientColor3 || '');
            setGradientColor4(aboutContent.gradientColor4 || '');
            
            setHeroImageUrl(aboutContent.heroImageUrl || '');
            setHeroTitle(aboutContent.heroTitle || '');
            setHeroSubtitle(aboutContent.heroSubtitle || '');
        }
        if (user?.email) {
            setUsername(user.email);
        }
    }, [aboutContent, user]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleHeroImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !newPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter a new password.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters long.' });
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await updatePassword(user, newPassword);
            toast({ title: 'Password Updated', description: 'Your admin password has been changed.' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Password Update Failed', description: error.message || 'Could not update password.' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };
    
    const handleSaveSettings = async (e: FormEvent) => {
        e.preventDefault();
        if (!aboutRef) return;
        
        setIsSaving(true);
        
        try {
            if (user && user.email !== username) {
                await updateEmail(user, username);
                toast({ title: 'Username Updated', description: 'Your admin username has been changed.' });
            }

            const updatedContent: Partial<AboutContent> = { 
                name, 
                bio, 
                content, 
                imageUrl,
                twitterUrl,
                githubUrl,
                linkedinUrl,
                backgroundColor,
                blogFontColor,
                gradientColor1,
                gradientColor2,
                gradientColor3,
                gradientColor4,
                heroImageUrl,
                heroTitle,
                heroSubtitle,
            };
            
            await setDocumentNonBlocking(aboutRef, updatedContent, { merge: true });
            toast({
                title: "Settings Saved",
                description: "Your site settings have been updated.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Could not save settings.",
            });
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <div className="flex-1 flex flex-col bg-muted/40 pb-8">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Dashboard
            </Link>
          </Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <form onSubmit={handleSaveSettings}>
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
                        <h3 className="text-lg font-medium text-foreground font-headline">Hero Banner Settings</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-2">
                                <Label>Banner Image</Label>
                                <div className="flex items-center gap-4">
                                    {heroImageUrl && (
                                      <div className="relative w-48 h-24 rounded-md overflow-hidden">
                                        <Image src={heroImageUrl} alt="Hero Banner Preview" fill className="object-cover" />
                                      </div>
                                    )}
                                    <Button type="button" variant="outline" onClick={() => heroImageInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Banner
                                    </Button>
                                    <Input 
                                        type="file" 
                                        ref={heroImageInputRef} 
                                        className="hidden" 
                                        onChange={handleHeroImageUpload}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heroTitle">Banner Title</Label>
                                <Input id="heroTitle" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heroSubtitle">Banner Subtitle</Label>
                                <Textarea id="heroSubtitle" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} />
                            </div>
                        </div>

                        <Separator />
                        
                        <h3 className="text-lg font-medium text-foreground font-headline">About Me Section</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Profile Image</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={imageUrl} alt={name}/>
                                        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
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
                                <Label htmlFor="bio">Bio / Subtitle</Label>
                                <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aboutContent">About Page Content</Label>
                                <Textarea id="aboutContent" value={content} onChange={e => setContent(e.target.value)} className="min-h-40" />
                            </div>
                        </div>

                        <Separator />

                         <h3 className="text-lg font-medium text-foreground font-headline">Admin Account</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Admin Username (Email)</Label>
                                <Input id="username" type="email" value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                </div>
                                <Button type="submit" variant="secondary" disabled={isUpdatingPassword || !newPassword}>
                                    {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </form>
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

                        <Separator />

                        <h3 className="text-lg font-medium text-foreground font-headline">Theme Customization</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="backgroundColor">Background Color</Label>
                                    <div className="relative flex items-center">
                                        <Input
                                          id="backgroundColor"
                                          type="color"
                                          value={hslToHex(backgroundColor) || '#FFFFFF'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setBackgroundColor(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input
                                            value={backgroundColor}
                                            onChange={e => setBackgroundColor(e.target.value)}
                                            placeholder="e.g., 240 20% 98%"
                                            className="pl-14"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Pick a color or enter HSL values (e.g., 240 10% 3.9%).</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="blogFontColor">Blog Font Color</Label>
                                     <div className="relative flex items-center">
                                        <Input
                                          id="blogFontColor"
                                          type="color"
                                          value={hslToHex(blogFontColor) || '#000000'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setBlogFontColor(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input
                                            value={blogFontColor}
                                            onChange={e => setBlogFontColor(e.target.value)}
                                            placeholder="e.g., 240 10% 3.9%"
                                            className="pl-14"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Pick a color or enter HSL values (e.g., 240 10% 3.9%).</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Animated Gradient Colors (HSL)</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                     <div className="relative flex items-center">
                                        <Input
                                          type="color"
                                          value={hslToHex(gradientColor1) || '#FFFFFF'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setGradientColor1(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input value={gradientColor1} onChange={e => setGradientColor1(e.target.value)} placeholder="Color 1" className="pl-14"/>
                                    </div>
                                    <div className="relative flex items-center">
                                        <Input
                                          type="color"
                                          value={hslToHex(gradientColor2) || '#FFFFFF'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setGradientColor2(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input value={gradientColor2} onChange={e => setGradientColor2(e.target.value)} placeholder="Color 2" className="pl-14"/>
                                    </div>
                                    <div className="relative flex items-center">
                                        <Input
                                          type="color"
                                          value={hslToHex(gradientColor3) || '#FFFFFF'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setGradientColor3(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input value={gradientColor3} onChange={e => setGradientColor3(e.target.value)} placeholder="Color 3" className="pl-14"/>
                                    </div>
                                    <div className="relative flex items-center">
                                        <Input
                                          type="color"
                                          value={hslToHex(gradientColor4) || '#FFFFFF'}
                                          className="absolute h-full w-12 p-1"
                                          onChange={e => setGradientColor4(hexToHsl(e.target.value) || '')}
                                        />
                                        <Input value={gradientColor4} onChange={e => setGradientColor4(e.target.value)} placeholder="Color 4" className="pl-14"/>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">The animated background uses these four colors.</p>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
                </div>
            </CardContent>
            </Card>
        </form>
      </main>
    </div>
  );
}

    