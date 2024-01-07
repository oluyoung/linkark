import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LinkMe',
};

async function Links() {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  return <div>Links</div>;
}

export default Links;
