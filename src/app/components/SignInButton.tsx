'use client';

import { signIn } from "next-auth/react";
import clsx from 'clsx';

interface SignInButtonProps {
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoggedIn?: boolean;
}

function SignIn({ title = 'Login', size = 'sm', isLoggedIn = false }: SignInButtonProps) {
  return (
    <>
      {isLoggedIn ? null : (
        <button className={clsx('bg-blue-500 text-white py-2 rounded-full', { 'text-sm px-4': size === 'sm', 'px-6': size === 'md', 'text-md px-10': size === 'lg' })} onClick={() => signIn()}>{title}</button>
      )}
    </>
  );
}

export default SignIn;
