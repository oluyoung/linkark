import { Link } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { fetchLinks } from '@/app/lib/data/links';
import { authOptions } from '@/app/api/auth/authOptions';
import EmptyLinks from './EmptyLinks'

async function LinksList() {
  const session = await getServerSession(authOptions);
  const creatorId = session?.user?.id;
  const links = await fetchLinks({ creatorId });

  return links.length ? links.map((l) => <p key={l.id}>{l.title || l.ogTitle || l.rawUrl}</p>) : <EmptyLinks />;
}

export default LinksList;
