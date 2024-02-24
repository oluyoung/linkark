'use client';

import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

function ListWrap({ children, id }: React.PropsWithChildren & { id: string }) {
  const isMobile = useMediaQuery('(max-width:1024px)');

  return (
    <div
      className={clsx('flex flex-col flex-nowrap items-center h-full w-full', { 'mt-4': isMobile, 'mt-16': !isMobile })}
      id={`${id}-list`}
      style={{ maxHeight: `calc(90vh - ${isMobile ? 80 : 40}px)` }}
    >
      {children}
    </div>
  )
}

export default ListWrap;
