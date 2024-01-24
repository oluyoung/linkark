import { fetchLinks } from '@/app/lib/actions/links.actions';
import EmptyLinks from './EmptyLinks';
import Link from './Link';

async function LinksList({
  query,
}: {
  query: string;
}) {
  const links = await fetchLinks(query);

  return links.length ? (
    <div className="flex flex-col flex-nowrap items-center pt-10 h-full w-full" id="links-list">
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4 px-4">
        {links.map((l) => <Link key={l.id} link={l} />)}
      </div>
    </div>
  ) : <EmptyLinks query={query} />;
}

export default LinksList;
