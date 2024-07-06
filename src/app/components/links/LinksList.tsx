import LinkIcon from '@mui/icons-material/Link';
import { fetchLinks } from '@/app/lib/actions/links.actions';
import EmptyContent from '@/app/components/EmptyContent';
import LinkItem from './Link';
import { ListLinkWithLink } from '@/app/lib/actions/lists.actions';
import ListWrap from './ListWrap';
import clsx from 'clsx';
import { ILink } from '@/db/models/link';

async function LinksList({
  query,
  links,
  listId,
}: {
  query?: string;
  links?: ListLinkWithLink[];
  listId?: string;
}) {
  const fetchedLinks = links || (await fetchLinks({ query }));

  return fetchedLinks.length ? (
    <ListWrap id="links" classes={clsx({'lg:mt-20': listId})}>
      <ul className="max-w-screen-sm w-full overflow-x-hidden p-0 max-lg:pb-[60px]">
        {fetchedLinks.map((link) => {
          const linkItem = 'link' in link ? link.link : link;
          return <LinkItem key={link._id.toString()} link={linkItem as ILink} listId={listId} />;
        })}
      </ul>
    </ListWrap>
  ) : (
    <EmptyContent
      query={query || ''}
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
