import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import IconEmptyClip from '@/app/components/Icon.EmptyClip';
import Fab from '@mui/material/Fab';

export const metadata: Metadata = {
  title: 'Home | LinkMe',
};

async function Home() {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="text-center flex justify-center items-center flex-col flex-nowrap">
        <div className="mb-4 text-blue-500">
          <IconEmptyClip />
        </div>
        <div className="mb-6 text-gray-600">
          <p>No links saved yet</p>
          <p>Click on the '+' below to add a link</p>
        </div>
      </div>
      <Fab variant="extended" color="primary" className="!absolute bottom-[16px] right-[16px]">
        ADD LINK
        <span className="ml-2">+</span>
      </Fab>
    </div>
  );
}

export default Home;
