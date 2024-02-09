import { fetchLinks } from '@/app/lib/actions/links.actions';
import EmptyContent from '@/app/components/EmptyContent';
import ListIcon from '@mui/icons-material/List';
import ListItem from './ListItem';

async function ListsItems({ query }: { query: string }) {
  const links = await fetchLinks({ query });

  return links.length ? (
    <div
      className="flex flex-col flex-nowrap items-center mt-10 h-full w-full"
      id="links-list"
      style={{ maxHeight: 'calc(90vh - 80px)' }}
    >
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4">
        {links.map((l) => (
          <ListItem key={l.id} link={l} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyContent
      query={query}
      id="empty-lists"
      Icon={ListIcon}
      noItemText="No lists have been added yet"
      noMatchedQueryText={`There are no lists with the name: ${query}`}
    />
  );
}

export default ListsItems;
