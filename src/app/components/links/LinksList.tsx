import LinkIcon from '@mui/icons-material/Link';
import { fetchLinks } from '@/app/lib/actions/links.actions';
import EmptyContent from '@/app/components/EmptyContent';
import Link from './Link';

async function LinksList({ query }: { query: string }) {
  const links = await fetchLinks({ query });

  return links.length ? (
    <div
      className="flex flex-col flex-nowrap items-center mt-10 h-full w-full"
      id="links-list"
      style={{ maxHeight: 'calc(90vh - 80px)' }}
    >
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4">
        {links.map((l) => (
          <Link key={l.id} link={l} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyContent
      query={query}
      id="empty-links"
      Icon={LinkIcon}
      noItemText="No links saved yet"
      noMatchedQueryText="None of your links match this query"
      addText="Click on the + below to add a link"
      iconRotateDeg="-45deg"
    />
  );
}

export default LinksList;
