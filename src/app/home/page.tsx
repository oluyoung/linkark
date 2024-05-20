import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LinkArk',
};

async function page() {
  return <p>PAGE HOME</p>;
}

export default page;
