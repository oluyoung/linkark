import { Metadata } from 'next';
import { Suspense } from 'react';
import LinksList from '@/app/components/lists/LinksList';
import LinksSkeleton from '@/app/components/links/LinksSkeleton';
import { Stack, Typography } from '@mui/material';
import { List as ListModel, Link as LinkModel } from '@prisma/client';
import { fetchList } from '@/app/lib/actions/list.actions';
import ListBreadCrumbs from '@/app/components/lists/BreadCrumbs';
import SearchBar from '@/app/components/SearchBar';

export const metadata: Metadata = {
  title: 'Links | LinkArk',
};

interface PageProps {
  params: { id: string };
  list: ListModel;
  links: LinkModel[];
}

export default async function page({ params }: PageProps) {
  const { listLinks, list } = await fetchList({ id: params?.id as string });

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
      {listLinks.length ? <SearchBar placeholder="" /> : null}
      <Suspense fallback={<LinksSkeleton />}>
        <LinksList links={listLinks} />
      </Suspense>
    </>
  );
}
