import { Link as LinkModel } from '@prisma/client';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { format } from 'date-fns';
import clsx from 'clsx';
import MoreMenuButton from './MoreMenuButton';

function Link({ link, listId }: { link: LinkModel, listId?: string }) {
  const hasTitle = !!(link.title || link.ogTitle);
  const hasDescription = !!(link.description || link.ogDescription);

  return (
    <div className="bg-white rounded-lg p-4 w-full card-shadow mb-4">
      <div
        className={clsx('flex items-center justify-between', {
          'h-[70px]': hasTitle,
          'h-[50px]': !hasTitle,
        })}
      >
        <div className="flex items-center h-full">
          <span className="h-4 w-4 bg-blue-500 inline-block rounded-full mr-3"></span>
          <div
            className={clsx('text-wrap max-w-96 h-full flex flex-col', {
              'justify-between': hasTitle && hasDescription,
              'justify-center':
                (!hasTitle && !hasDescription) || !hasDescription,
            })}
          >
            <div className="w-full">
              {hasTitle ? (
                <p className="text-sm truncate mb-0.5">
                  {link.title || link.ogTitle}
                </p>
              ) : null}
              {hasTitle && hasDescription ? (
                <p className="text-sm text-gray-500 truncate mb-0.5">
                  {link.description || link.ogDescription}
                </p>
              ) : null}
            </div>
            <a
              className="text-sm truncate inline-block max-w-96 text-blue-500"
              href={link.rawUrl}
              target="_blank"
            >
              <OpenInNewIcon fontSize="inherit" />{' '}
              <span className="underline">
                {hasTitle ? 'Open' : link.rawUrl}
              </span>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          <p className="text-gray-400 text-sm">
            {format(link.createdAt, 'dd MMM yy')}
          </p>
          <MoreMenuButton link={link} listId={listId} />
        </div>
      </div>
    </div>
  );
}

export default Link;
