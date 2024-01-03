import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth';
import SessionProvider from '@/app/components/SessionProvider';
import NavMenu from './components/NavMenu';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkMe',
  description: 'Save & Store Your Links',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <NavMenu />
          {children}
        </SessionProvider>
        </body>
    </html>
  )
}
