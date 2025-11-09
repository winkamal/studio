
'use client';

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { AboutContent } from "@/types";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export function HeroBanner() {
    const firestore = useFirestore();
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
    const { data: settings, isLoading } = useDoc<AboutContent>(settingsRef);

    const imageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/main-banner/1920/1080";
    const title = settings?.heroTitle || "VT blogs";
    const subtitle = settings?.heroSubtitle || "A beautifully crafted space for thoughts, stories, and moments of inspiration.";

    if (isLoading) {
        return (
            <div className="relative w-full h-80 text-white">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                    <Skeleton className="h-14 w-1/3 mb-4" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2 mt-2" />
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-80 text-white">
            <Image 
                src={imageUrl}
                alt="Vibrant abstract banner"
                fill
                className="object-cover"
                priority
                data-ai-hint="vibrant abstract"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">{title}</h1>
                <p className="text-lg md:text-xl max-w-2xl">
                    {subtitle}
                </p>
            </div>
        </div>
    )
}
