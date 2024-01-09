import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SessionProvider from './components/SessionProvider';
import Header from './components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkMe',
  description: 'Save & Store Your Links',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <AppRouterCacheProvider>
            <Header />
            {children}
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
