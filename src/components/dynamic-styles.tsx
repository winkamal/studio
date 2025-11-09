
'use client';

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { AboutContent } from "@/types";
import { doc } from "firebase/firestore";

function DynamicStyles() {
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'about') : null, [firestore]);
  const { data: settings } = useDoc<AboutContent>(settingsRef);

  const styles = `
    :root {
      ${settings?.backgroundColor ? `--background: ${settings.backgroundColor};` : ''}
      
      --gradient-color-1: ${settings?.gradientColor1 ? `hsl(${settings.gradientColor1})` : 'hsl(var(--primary) / 0.1)'};
      --gradient-color-2: ${settings?.gradientColor2 ? `hsl(${settings.gradientColor2})` : 'hsl(var(--accent) / 0.1)'};
      --gradient-color-3: ${settings?.gradientColor3 ? `hsl(${settings.gradientColor3})` : 'hsl(var(--background))'};
      --gradient-color-4: ${settings?.gradientColor4 ? `hsl(${settings.gradientColor4})` : 'hsl(var(--muted))'};
    }
    .prose {
        ${settings?.blogFontColor ? `color: hsl(${settings.blogFontColor});` : ''}
    }
  `;

  return <style>{styles}</style>;
}

export default DynamicStyles;
