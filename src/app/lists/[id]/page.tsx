import { Metadata } from 'next';
import { Suspense } from 'react';
import ListLinks from '@/app/components/links/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import { fetchList } from '@/app/lib/actions/lists.actions';
import ListTitle from '@/app/components/lists/ListTitle';
import SearchFab from '@/app/components/list/SearchFab';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

export default async function page({ params }: { params: { id: string } }) {
  const { links, ...list } = await fetchList({ id: params?.id as string });

  return (
    <>
      <ListTitle list={list} fromPublic />
      <Suspense fallback={<LinksSkeleton />}>
        <ListLinks links={links} listId={list._id.toString()} />
      </Suspense>
      <div className="contents">
        <SearchFab />
      </div>
    </>
  );
}
