import { Link as LinkModel } from '@prisma/client';
import { format } from 'date-fns';
import MoreMenuButton from './MoreMenuButton';
import LinkContent from './LinkContent';

function Link({ link, listId }: { link: LinkModel; listId?: string }) {
  const hasTitle = !!(link.title || link.ogTitle);
  const hasDescription = !!(link.description || link.ogDescription);

  return (
    <div className="bg-white rounded-lg p-4 w-full card-shadow mb-4 border-l-[10px] border-l-blue-500">
      <LinkContent link={link} hasTitle={hasTitle} hasDescription={hasDescription}>
        <div className="flex flex-col items-end justify-between h-full">
          <p className="text-gray-400 text-sm">
            {format(link.createdAt, 'dd MMM yy')}
          </p>
          <MoreMenuButton link={link} listId={listId} />
        </div>
      </LinkContent>
    </div>
  );
}

export default Link;
