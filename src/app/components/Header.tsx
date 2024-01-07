'use client';

import Logo from './Logo';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import SignIn from './SignInButton';
import SignOut from './SignOutButton';
import clsx from 'clsx';

function Header() {
  const { data: session } = useSession();
  const path = usePathname();
  const isLanding = path === '/' && !session;
  const isLoggedIn = !!session && !!session?.user?.name;

  return (
    <header className={clsx('flex justify-center', { 'bg-black': isLanding })}>
      <div
        className={clsx('flex justify-between items-center px-6 py-4 w-full')}
      >
        <Logo shade={isLanding ? 'light' : 'dark'} />
        <div className="flex space-x-4">
          <SignIn isLoggedIn={isLoggedIn} />
          <SignOut isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}

export default Header;
