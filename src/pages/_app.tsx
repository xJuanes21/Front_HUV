// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';
import { ToastProvider } from '@/components/ui/toast/ToastContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  );
}