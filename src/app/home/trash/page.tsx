import { Metadata } from 'next';
import { Suspense } from 'react';
import DeletedLinksList from '@/app/components/trash/DeletedLinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import SearchBar from '@/app/components/SearchBar';

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
      <SearchBar placeholder="Search trash..." />
      <Suspense key={query} fallback={<LinksSkeleton />}>
        <DeletedLinksList query={query} />
      </Suspense>
      {/* restore all and delete all inside menu fab */}
    </>
  );
}
