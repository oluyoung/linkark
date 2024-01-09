import { Metadata } from 'next';
import LinkIcon from '@mui/icons-material/Link';
import Fab from '@mui/material/Fab';

export const metadata: Metadata = {
  title: 'All Links | LinkMe',
};

async function page() {
  return (
    <>
      <div className="text-center flex justify-center items-center flex-col flex-nowrap">
        <div className="mb-4 text-blue-500">
          <LinkIcon
            color="inherit"
            sx={{ width: '75px', height: '75px', transform: 'rotate(-30deg)' }}
          />
        </div>
        <div className="mb-6 text-gray-600">
          <p>No links saved yet</p>
          <p>Click on the &apos;+&apos; below to add a link</p>
        </div>
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
