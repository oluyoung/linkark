import { Metadata } from 'next';
import { Suspense } from 'react';
import Fab from '@mui/material/Fab';
import clsx from 'clsx';
import LinksList from './LinksList';
import LinksSkeleton from './LinksSkeleton';

export const metadata: Metadata = {
  title: 'All Links | LinkMe',
};

// if not empty add classes to keep it at top with padding
// if empty then display empty as centered

async function page() {
  return (
    <>
      <Suspense fallback={<LinksSkeleton />}>
        <LinksList />
      </Suspense>
      <Fab
        variant="extended"
        color="primary"
        className="!fixed bottom-[16px] right-[16px]"
      >
        ADD LINK
        <span className="ml-2">+</span>
      </Fab>
    </>
  );
}

export default page;
