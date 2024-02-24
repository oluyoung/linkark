import { Metadata } from 'next';
import { Suspense } from 'react';
import ListLinks from '@/app/components/links/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import { fetchList } from '@/app/lib/actions/list.actions';
import AddListLinksButton from '@/app/components/lists/AddListLinksButton';
import { fetchLinksAsAutocompleteOptions } from '@/app/lib/actions/links.actions';
import SearchFab from '@/app/components/lists/SearchFab';
import ListTitle from '@/app/components/lists/ListTitle';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

export default async function page({ params }: { params: { id: string } }) {
  const { links, ...list } = await fetchList({ id: params?.id as string });
  const allLinks = await fetchLinksAsAutocompleteOptions(links);

  /*
  breadcrumbs with name of list 
  description replaces searchbar with search on popover (closes on clickaway) icon underneath
  */

  return (
    <>
      <ListTitle list={list} />
      <Suspense fallback={<LinksSkeleton />}>
        <ListLinks links={links} listId={list.id} />
      </Suspense>
      {/* <SearchFab /> */}
      <AddListLinksButton list={list} links={allLinks} />
    </>
  );
}
