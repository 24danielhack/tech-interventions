'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { initializeApi } from '@/lib/api-client';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeApi();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
