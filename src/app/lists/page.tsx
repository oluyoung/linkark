import { Metadata } from 'next';
import { Suspense } from 'react';
import ListsList from '@/app/components/public/lists/ListsList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import SearchBar from '@/app/components/SearchBar';

export const metadata: Metadata = {
  title: 'Lists | LinkArk',
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
      <SearchBar placeholder="Search lists..." />
      <Suspense key={query} fallback={<LinksSkeleton />}>
        <ListsList query={query} />
      </Suspense>
    </>
  );
}
