'use client';

import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

const smMaxH = 40;
const mdMaxH = 20;
const dMaxH = 60;

function ListWrap({ children, id, classes = '' }: React.PropsWithChildren & { id: string; listId?: string; classes?: string }) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const mdMaxQuery = useMediaQuery('(max-width:540px)');

  return (
    <div
      className={clsx('flex flex-col flex-nowrap items-center h-full w-full mt-10', { 'mt-4': isMobile, [classes]: !!classes})}
      id={`${id}-list`}
      style={{ maxHeight: `calc(90vh - ${isMobile ? mdMaxQuery ? mdMaxH : smMaxH : dMaxH}px)` }}
    >
      {children}
    </div>
  );
}

export default ListWrap;
