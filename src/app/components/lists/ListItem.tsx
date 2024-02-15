'use client';
import { ListWithUser } from '@/app/lib/actions/list.actions';
import { Chip, IconButton } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';

export default function List({ list }: { list: ListWithUser }) {
  const hasTitle = list.name;
  const hasDescription = list.name && list.description;

  return (
    <div className="bg-white rounded-lg p-4 w-full card-shadow mb-4">
      <div className={clsx('flex items-center justify-between')}>
        <div className="flex items-center h-full">
          <span className="h-4 w-4 bg-blue-500 inline-block rounded-full mr-3"></span>
          <div
            className={clsx('text-wrap max-w-96 h-full flex flex-col', {
              'justify-between': hasTitle && hasDescription,
              'justify-center': !hasDescription
            })}
          >
            <div className={clsx('w-full', {'mb-3': hasDescription})}>
              {hasTitle ? (
                <p className={clsx('text-sm truncate mb-1')}>
                  {list.name}
                </p>
              ) : null}
              {hasDescription ? (
                <p className="text-sm text-gray-500 truncate">
                  {list.description}
                </p>
              ) : null}
            </div>
            <div className="flex items-center">
              <span className="inline-block mr-2">
                {list.isPublic ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
              </span>
              <span className="inline-block mr-4">
                <Chip icon={<FaceIcon />} label={list.creator.name} variant="outlined" size="small" />
              </span>
              <span className="inline-block mr-4">
                <Chip icon={<RssFeedIcon />} label={40} variant="outlined" size="small" />
              </span>
              <span className="inline-block">
                <Chip icon={<AccessTimeIcon />} label={format(list.createdAt, 'dd MMM yy')} variant="outlined" size="small" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <IconButton href={`list/${list.id}`} LinkComponent={Link} size="large">
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
