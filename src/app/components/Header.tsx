'use client';

import Logo from './Logo';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Nav from '@/app/components/header/Nav';
import SignIn from './SignInButton';
import clsx from 'clsx';

export const headerHeight = '56px';

function Header() {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const { data: session } = useSession();
  const path = usePathname();

  const [open, setOpen] = useState(false);

  const isPublic = !path.includes('/home');
  const isLoggedIn = !!session && !!session?.user?.name;

  const toggleDrawer =
    (open_: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      )
        return;
      setOpen(open_);
    };

  return (
    <header
      className={clsx('flex justify-center', {
        'bg-black': isPublic,
        'bg-white': !isPublic
      })}
    >
      {isMobile && isLoggedIn ? (
        <>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon color="info" />
          </IconButton>
          <Nav
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          />
        </>
      ) : null}
      <div
        className={clsx('flex justify-between items-center px-6 py-4 w-full')}
      >
        <Logo shade={isPublic ? 'light' : 'dark'} />
        <div className="flex space-x-4">
          <SignIn isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}

export default Header;
