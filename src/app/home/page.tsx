import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LinkMe',
};

async function Home() {
  const session = await getServerSession();
  if (!session || !session.user) return redirect('/api/auth/signin');
  else return redirect('/home/links');
}

export default Home;
