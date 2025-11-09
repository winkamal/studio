
'use client';

import Image from "next/image";

export function HeroBanner() {
    return (
        <div className="relative w-full h-80 text-white">
            <Image 
                src="https://picsum.photos/seed/main-banner/1920/1080"
                alt="Vibrant abstract banner"
                fill
                className="object-cover"
                priority
                data-ai-hint="vibrant abstract"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">VT blogs</h1>
                <p className="text-lg md:text-xl max-w-2xl">
                    A beautifully crafted space for thoughts, stories, and moments of inspiration.
                </p>
            </div>
        </div>
    )
}
