import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { authOptions } from '@/app/api/auth/authOptions';
import SessionProvider from '@/app/lib/providers/SessionProvider';
import MuiThemeProvider from '@/app/lib/providers/MuiThemeProvider';
import ReduxProvider from '@/app/lib/providers/ReduxProvider';
import Header from './components/Header';
import Toast from './components/Toast';
import clsx from 'clsx';
import './globals.css';

export const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkArk',
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
      <body className={clsx(inter.className, 'bg-gray-100')}>
        <SessionProvider session={session}>
          <AppRouterCacheProvider>
            <ReduxProvider>
              <MuiThemeProvider>
                <Header />
                {children}
                <Toast />
              </MuiThemeProvider>
            </ReduxProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
