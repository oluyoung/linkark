import { fetchLinks } from '@/app/lib/actions/links.actions';
import EmptyLinks from './EmptyLinks';
import Link from './Link';

async function LinksList({
  query,
}: {
  query: string;
}) {
  const links = await fetchLinks({ query });

  return links.length ? (
    <div className="flex flex-col flex-nowrap items-center mt-10 h-full w-full" id="links-list" style={{ maxHeight: 'calc(90vh - 120px)' }}>
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4">
        {links.map((l) => <Link key={l.id} link={l} />)}
      </div>
    </div>
  ) : <EmptyLinks query={query} />;
}

export default LinksList;
