import { Skeleton } from '@mui/material';

function LinksSkeleton() {
  return (
    <div className="flex flex-col flex-nowrap items-center pt-10 w-full max-w-screen-sm" id="links-list-skeleton" style={{ height: 'calc(100vh - 68px)'}}>
      {[1,2,3,4].map((a) => {
        return <Skeleton key={a} variant="rounded" className="w-full" height={68} sx={{ mb: 2 }} />;
      })}
    </div>
  );
}

export default LinksSkeleton;
