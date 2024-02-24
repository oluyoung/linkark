'use client';

import { useMediaQuery } from '@mui/material';

function LinksListWrap({ children }: React.PropsWithChildren) {
  const isMobile = useMediaQuery('(max-width:1024px)');

  return (
    <div
      className="flex flex-col flex-nowrap items-center mt-10 h-full w-full"
      id="links-list"
      style={{ maxHeight: `calc(90vh - ${isMobile ? 40 : 80}px)` }}
    >
      {children}
    </div>
  )
}

export default LinksListWrap;
