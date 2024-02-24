import { fetchLists } from '@/app/lib/actions/list.actions';
import EmptyContent from '@/app/components/EmptyContent';
import ListIcon from '@mui/icons-material/List';
import ListItem from './ListItem';
import ListWrap from '../links/ListWrap';

async function ListItems({ query }: { query: string }) {
  const lists = await fetchLists({ query });

  return lists.length ? (
    <ListWrap id="lists">
      <div className="max-w-screen-sm w-full overflow-x-hidden p-0">
        {lists.map((l) => (
          <ListItem key={l.id} list={l} />
        ))}
      </div>
    </ListWrap>
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

export default ListItems;
