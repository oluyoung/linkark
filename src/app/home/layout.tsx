import { Fragment } from 'react';
import Nav from '@/app/components/home/Nav';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

async function layout({ children }: { children: React.ReactNode; }) {
  const session = await getServerSession();

  if (!session || !session.user) redirect('/api/auth/signin');

  return (
    <Fragment>
      <Nav />
      {children}
    </Fragment>
  );
}

export default layout;
