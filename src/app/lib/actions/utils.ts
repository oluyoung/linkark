'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';

async function getIdOrRedirect(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return redirect('/auth/signin');

  return session.user.id;
}

async function getIdOrNull(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return null;

  return session.user.id;
}

export {
  getIdOrRedirect,
  getIdOrNull
};