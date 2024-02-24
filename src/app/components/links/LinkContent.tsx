'use client';

import { Link as LinkModel } from '@prisma/client';
import clsx from 'clsx';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useMediaQuery } from '@mui/material';
import React from 'react';

type Props = React.PropsWithChildren & {
  link: LinkModel;
  hasTitle: boolean;
  hasDescription: boolean;
};

function LinkContent({ link, hasTitle, hasDescription, children }: Props) {
  const isSm = useMediaQuery('(max-width:480px)');

  return (
    <div
      className={clsx('flex items-center justify-between', {
        'h-[70px]': !isSm && hasTitle,
        'h-[45px]': isSm || !hasTitle,
      })}
    >
      <div className="flex items-center h-full">
        {!isSm ? (
          <span className="h-4 w-4 bg-blue-500 inline-block rounded-full mr-3" />
        ) : null}
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
      {children}
    </div>
  );
}

export default LinkContent;
