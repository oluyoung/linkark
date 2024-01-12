import { Metadata } from 'next';
import Fab from '@mui/material/Fab';
import clsx from 'clsx';
import LinksList from './LinksList';

export const metadata: Metadata = {
  title: 'All Links | LinkMe',
};

// if not empty add classes to keep it at top with padding
// if empty then display empty as centered

async function page() {
  return (
    <>
      <div className="text-center flex justify-center items-center flex-col flex-nowrap">
        <LinksList />
      </div>
      <Fab
        variant="extended"
        color="primary"
        className="!absolute bottom-[16px] right-[16px]"
      >
        ADD LINK
        <span className="ml-2">+</span>
      </Fab>
    </>
  );
}

export default page;
