import { Metadata } from 'next';
import { Suspense } from 'react';
import AddLinkButton from '@/app/components/links/AddLinkButton';
import LinksList from '../../components/links/LinksList';
import LinksSkeleton from '../../components/links/LinksSkeleton';

export const metadata: Metadata = {
  title: 'All Links | LinkMe',
};

// if not empty add classes to keep it at top with padding
// if empty then display empty as centered

async function page() {
  return (
    <>
      <Suspense fallback={<LinksSkeleton />}>
        <LinksList />
      </Suspense>
      <AddLinkButton />
    </>
  );
}

export default page;
