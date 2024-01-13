
import { getServerSession } from 'next-auth';
import { fetchLinks } from '@/app/lib/data/links';
import { authOptions } from '@/app/api/auth/authOptions';
import EmptyLinks from './EmptyLinks';
import Link from './Link';

async function LinksList() {
  const session = await getServerSession(authOptions);
  const creatorId = session?.user?.id;
  const links = await fetchLinks({ creatorId });

  return links.length ? (
    <div className="flex flex-col flex-nowrap items-center pt-10 h-full w-full overflow-y-scroll" id="links-list">
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4 px-4">
        {links.map((l) => <Link key={l.id} link={l} />)}
      </div>
    </div>
  ) : <EmptyLinks />;
}

export default LinksList;
