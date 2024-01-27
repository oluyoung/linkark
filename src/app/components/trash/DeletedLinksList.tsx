import { fetchTrashLinks } from '@/app/lib/actions/links.actions';
import EmptyTrash from './EmptyTrash';
import DeletedLink from './DeletedLink';

async function DeletedLinksList({ query }: { query: string }) {
  const links = await fetchTrashLinks(query);

  return links.length ? (
    <div
      className="flex flex-col flex-nowrap items-center pt-10 h-full w-full"
      id="links-list"
      style={{ maxHeight: 'calc(90vh - 120px)' }}
    >
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4">
        {links.map((l) => (
          <DeletedLink key={l.id} link={l} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyTrash query={query} />
  );
}

export default DeletedLinksList;
