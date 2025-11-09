
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SiteSettingsPage() {
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
            <CardTitle className="font-headline">Site Settings</CardTitle>
            <CardDescription>Manage your site's appearance and configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="VT blogs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input id="siteDescription" defaultValue="A blog about daily life moments." />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Select a theme for your site.</p>
                </div>
                <ThemeToggle />
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
