'use client';

import { signOut } from "next-auth/react";
import clsx from 'clsx';

interface SignInButtonProps {
  size?: 'sm' | 'md' | 'lg';
  isLoggedIn?: boolean;
}

function SignOut({ size = 'sm', isLoggedIn = true }: SignInButtonProps) {
  return (
    <>
      {isLoggedIn ? (
        <button className={clsx('bg-blue-500 text-white py-2 rounded-full', { 'text-sm px-4': size === 'sm', 'px-6': size === 'md', 'text-md px-10': size === 'lg' })} onClick={() => signOut()}>Sign Out</button>
      ) : null}
    </>
  );
}

export default SignOut;
