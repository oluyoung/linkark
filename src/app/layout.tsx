import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { authOptions } from '@/app/api/auth/authOptions';
import SessionProvider from './components/SessionProvider';
import Header from './components/Header';
import MuiTheme from './components/MuiTheme';
import './globals.css';

export const inter = Inter({ subsets: ['latin'] });

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
            <MuiTheme>
              <Header />
              {children}
            </MuiTheme>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
