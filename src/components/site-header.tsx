import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <SidebarTrigger className="md:hidden" />
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold font-headline text-lg sm:inline-block">
              Life Canvas
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
