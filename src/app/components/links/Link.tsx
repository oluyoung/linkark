'use client';

import { Link as LinkModel } from '@prisma/client';
import { format } from 'date-fns';
import { usePathname } from 'next/navigation';
import MoreMenuButton from './MoreMenuButton';
import clsx from 'clsx';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useMediaQuery } from '@mui/material';
import React from 'react';

function Link({ link, listId }: { link: LinkModel; listId?: string }) {
  const pathname = usePathname();
  const isSm = useMediaQuery('(max-width:480px)');

  const hasTitle = !!(link.title || link.ogTitle);
  const hasDescription = !!(link.description || link.ogDescription);

  return (
    <li className="bg-white rounded-lg p-4 w-full card-shadow mb-4 border-l-[10px] border-l-blue-500">
      <div
      className={clsx('flex items-center justify-between', {
        'h-[70px]': !isSm && hasTitle,
        'h-[45px]': isSm || !hasTitle,
      })}
    >
      <div className="flex items-center h-full">
        <div
          className={clsx('text-wrap h-full flex flex-col', {
            'max-w-96': !isSm,
            'max-w-60': isSm,
            'justify-between': hasTitle && hasDescription,
            'justify-center': (!hasTitle && !hasDescription) || !hasDescription,
          })}
        >
          <div className="w-full">
            {hasTitle ? (
              <p className="text-sm truncate mb-0.5">
                {link.title || link.ogTitle}
              </p>
            ) : null}
            {!isSm && hasTitle && hasDescription ? (
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
            <span className="underline">{hasTitle ? 'Open' : link.rawUrl}</span>
          </a>
        </div>
      </div>
        <div className="flex flex-col items-end justify-between h-full">
          <p className="text-gray-400 text-sm">
            {format(link.createdAt, 'dd MMM yy')}
          </p>
          {pathname.includes('home') ? <MoreMenuButton link={link} listId={listId} /> : null}
        </div>
      </div>
    </li>
  );
}

export default Link;
