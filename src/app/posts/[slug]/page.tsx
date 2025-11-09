
'use client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PostRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      router.replace(`/search?slug=${slug}`);
    } else {
        notFound();
    }
  }, [slug, router]);

  return null;
}
