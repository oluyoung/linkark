import { Metadata } from 'next';
import { Suspense } from 'react';
import DeletedLinksList from '@/app/components/trash/DeletedLinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import SearchLinks from '@/app/components/links/SearchLinks';

export const metadata: Metadata = {
  title: 'Trash | LinkArk',
};

export default async function page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  return (
    <>
      <SearchLinks placeholder="Search deleted links..." />
      <Suspense key={query} fallback={<LinksSkeleton />}>
        <DeletedLinksList query={query} />
      </Suspense>
      {/* restore all and delete all inside menu fab */}
    </>
  );
}
