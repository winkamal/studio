
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center md:hidden">
          <SidebarTrigger />
        </div>
        <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold font-headline text-lg sm:inline-block">
              VT blogs
            </span>
        </Link>
      </div>
    </header>
  );
}
