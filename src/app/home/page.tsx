import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LinkArk',
};

async function page() {
  return redirect('/home/links');
}

export default page;
