import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { fetchTrashLinks } from '@/app/lib/actions/links.actions';
import DeletedLink from './DeletedLink';
import EmptyContent from '@/app/components/EmptyContent';

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
          <DeletedLink key={l._id.toString()} link={l} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyContent
      query={query}
      id="empty-trash"
      Icon={DeleteOutlinedIcon}
      noItemText="No links in trash"
      noMatchedQueryText={`There are no links in trash that match: ${query}`}
      iconClass="text-red-500"
    />
  );
}

export default DeletedLinksList;
