import { fetchPublicLists } from '@/app/lib/actions/lists.actions';
import EmptyContent from '@/app/components/EmptyContent';
import ListIcon from '@mui/icons-material/List';
import ListWrap from '@/app/components/links/ListWrap';
import ListItem from './ListItem';
import { getIdOrNull } from '@/app/lib/actions/utils';

async function ListList({ query }: { query: string }) {
  const lists = await fetchPublicLists({ query });
  const uid = await getIdOrNull();

  return lists.length ? (
    <ListWrap id="lists">
      <div className="max-w-screen-sm w-full overflow-x-hidden p-0">
        {lists.map((l) => <ListItem key={l._id.toString()} list={l} uid={uid} />)}
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

export default ListList;
