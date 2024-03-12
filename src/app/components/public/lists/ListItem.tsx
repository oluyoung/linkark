'use client';

import { ListWithUser } from '@/app/lib/actions/lists.actions';
import { Chip, IconButton } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';

export default function List({ list }: { list: ListWithUser }) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const isSm = useMediaQuery('(max-width:480px)');
  const hasTitle = list.name;
  const hasDescription = list.name && list.description && !isSm;

  return (
    <div className="bg-white rounded-lg p-4 w-full card-shadow mb-4">
      <div className={clsx('flex items-center justify-between')}>
        <div className="flex items-center h-full">
          <div
            className={clsx('text-wrap h-full flex flex-col', {
              'max-w-96': !isSm,
              'max-w-72': isSm,
              'justify-between': hasTitle && hasDescription,
              'justify-center': !hasDescription,
            })}
          >
            <div className={clsx('w-full', { 'mb-3': hasDescription })}>
              {hasTitle ? (
                <p className={clsx('text-sm mb-1')}>{list.name}</p>
              ) : null}
              {hasDescription ? (
                <p className="text-sm text-gray-500 truncate">
                  {list.description}
                </p>
              ) : null}
            </div>
            <div className="flex items-center">
              <span className="inline-block mr-2">
                <Chip
                  icon={<FaceIcon />}
                  label={list.creator.name}
                  variant="outlined"
                  size="small"
                />
              </span>
              {!isMobile ? (
                  <>
                    <span className="inline-block ml-2">
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={format(list.createdAt, 'dd MMM yy')}
                        variant="outlined"
                        size="small"
                      />
                    </span>
                  </>
                ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <IconButton
            href={`/lists/${list.id}`}
            LinkComponent={Link}
            size="large"
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
