'use client';

import Logo from './Logo';
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

function Header() {
  const { data: session } = useSession();
  const path = usePathname();
  const isLanding = path === '/' && !session;
  const isLoggedIn = session && session?.user?.name;

  return (
    <div className={clsx('flex justify-between items-center px-6 py-4', { 'bg-black': isLanding })}>
      <Logo shade={isLanding ? 'light' : 'dark'}  />
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <button className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full" onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full" onClick={() => signIn()}>Login</button>
        )}
      </div>
    </div>
  );
}

export default Header;
