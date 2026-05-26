import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'IPL InsightX — AI Powered Cricket Analytics Studio',
  description: 'Ingest match records, run phase aggregations, compile tactical PDF reports, and query our interactive AI cricket assistant co-pilot.',
  keywords: ['IPL', 'Cricket Analytics', 'Sports Statistics', 'AI Sports Analytics', 'Next.js Dashboard'],
  authors: [{ name: 'DeepMind Advanced Agentic Coding' }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark h-full antialiased`}>
      <body className="h-full bg-background text-foreground transition-colors duration-300 font-sans flex flex-col">
        <AuthProvider>
          <ToastProvider>
            <AnalyticsProvider>
            <div className="flex h-full overflow-hidden relative">
              {/* Mesh background glow grid */}
              <div className="bg-mesh"></div>
              
              {/* Sidebar */}
              <Sidebar />

              {/* Main content viewport */}
              <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
                  {children}
                  <Footer />
                </main>
              </div>
            </div>
          </AnalyticsProvider>
        </ToastProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
