import { Metadata } from 'next';
import { Suspense } from 'react';
import ListLinks from '@/app/components/links/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import { fetchList } from '@/app/lib/actions/lists.actions';
import AddListLinksButton from '@/app/components/list/AddListLinksButton';
import { fetchLinksAsAutocompleteOptions } from '@/app/lib/actions/links.actions';
import ListTitle from '@/app/components/lists/ListTitle';
import SearchFab from '@/app/components/list/SearchFab';
import SearchBar from '@/app/components/SearchBar';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

export default async function page({ params }: { params: { id: string } }) {
  const { links, ...list } = await fetchList({ id: params?.id as string });
  const allLinks = await fetchLinksAsAutocompleteOptions(links);

  return (
    <>
      <ListTitle list={list} />
      <Suspense fallback={<LinksSkeleton />}>
        <ListLinks links={links} listId={list.id} />
      </Suspense>
      <div className="contents">
        <SearchFab />
        <AddListLinksButton list={list} links={allLinks} />
      </div>
    </>
  );
}
