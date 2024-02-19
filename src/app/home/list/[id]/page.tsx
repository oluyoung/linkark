import { Metadata } from 'next';
import { Suspense } from 'react';
import ListLinks from '@/app/components/links/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import { Stack, Typography } from '@mui/material';
import { fetchList } from '@/app/lib/actions/list.actions';
import ListBreadCrumbs from '@/app/components/lists/BreadCrumbs';
import SearchBar from '@/app/components/SearchBar';
import AddListLinksButton from '@/app/components/lists/AddListLinksButton';
import { fetchLinksAsAutocompleteOptions } from '@/app/lib/actions/links.actions';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

export default async function page({ params }: { params: { id: string } }) {
  const { links, ...list } = await fetchList({ id: params?.id as string });
  const allLinks = await fetchLinksAsAutocompleteOptions();

  /*
  breadcrumbs with name of list 
  description replaces searchbar with search on popover (closes on clickaway) icon underneath
  */

  return (
    <>
      <Stack spacing={2} sx={{ position: 'absolute', top: 20, left: 25 }}>
        <ListBreadCrumbs list={list} />
        {list.description ? <Typography>{list.description}</Typography> : null}
      </Stack>
      {links.length ? <SearchBar placeholder="" /> : null}
      <Suspense fallback={<LinksSkeleton />}>
        <ListLinks links={links} listId={list.id} />
      </Suspense>
      <AddListLinksButton list={list} links={allLinks} />
    </>
  );
}
