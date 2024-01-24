import { Metadata } from 'next';
import { Suspense } from 'react';
import AddLinkButton from '@/app/components/links/AddLinkButton';
import LinksList from '@/app/components/links/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import SearchLinks from '@/app/components/links/SearchLinks';

export const metadata: Metadata = {
  title: 'Links | LinkMe',
};

export default async function page({
  searchParams
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  return (
    <>
      <SearchLinks />
      <Suspense key={query} fallback={<LinksSkeleton />}>
        <LinksList query={query} />
      </Suspense>
      <AddLinkButton />
    </>
  );
}
