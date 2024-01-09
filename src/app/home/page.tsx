import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LinkMe',
};

async function page() {
  return redirect('/home/links');
}

export default page;
