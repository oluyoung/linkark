import { Metadata } from 'next';
import { Suspense } from 'react';
import AddLinkButton from '@/app/components/links/AddLinkButton';
import LinksList from '@/app/components/links/LinksList';
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
        <LinksList query={query} />
      </Suspense>
      <AddLinkButton />
    </>
  );
}
