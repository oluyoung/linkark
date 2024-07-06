import { Metadata } from 'next';
import { Suspense } from 'react';
import ListLinks from '../../../components/links/LinksList';
import LinksSkeleton from '../../../components/links/LinksSkeleton';
import { fetchList, ListWithUser } from '../../../lib/actions/lists.actions';
import AddListLinksButton from '../../../components/list/AddListLinksButton';
import { fetchLinksAsAutocompleteOptions } from '../../../lib/actions/links.actions';
import ListTitle from '../../../components/lists/ListTitle';
import SearchFab from '../../../components/list/SearchFab';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

export default async function page({ params }: { params: { id: string } }) {
  const { links, ...list } = await fetchList({ id: params?.id as string });
  const allLinks = await fetchLinksAsAutocompleteOptions(links);

  return (
    <>
      <ListTitle list={list as ListWithUser} />
      <Suspense fallback={<LinksSkeleton />}>
        <ListLinks links={links} listId={list._id.toString()} />
      </Suspense>
      <div className="contents">
        <SearchFab />
        <AddListLinksButton list={list} links={allLinks} />
      </div>
    </>
  );
}
