'use client';

import { ListWithSubscribers } from '@/app/lib/actions/lists.actions';
import { Chip, IconButton } from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';
import MoreMenuButton, { MoreMenuItems } from '@/app/components/MoreMenuButton';
import { useState } from 'react';
import {
  RssFeedOutlined,
  Face as FaceIcon,
  AccessTime as AccessTimeIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import SubscribeDialog from './SubscribeDialog';

export default function List({ list, uid }: { list: ListWithSubscribers; uid: string | null }) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const isSm = useMediaQuery('(max-width:480px)');
  const hasTitle = list.name;
  const hasDescription = list.name && list.description && !isSm;
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const isSubscriber = uid && list.subscribers.findIndex(s => s.subscriberId === uid) > -1;

  const toggleModal = (
    setStateFn: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    setStateFn(value);
  };

  const menuItems: MoreMenuItems[] = [
    {
      Icon: RssFeedOutlined,
      text: !isSubscriber ? 'Subscribe' : 'Unsubscribe',
      onClick: () => toggleModal(setSubscribeDialogOpen, true),
    },
  ];

  return (
    <>
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
                {!!uid && list.creatorId !== uid ? <MoreMenuButton menuItems={menuItems} /> : null}
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
      {subscribeDialogOpen ? (
        <SubscribeDialog
          open={subscribeDialogOpen}
          onClose={() => toggleModal(setSubscribeDialogOpen, false)}
          name={list.name}
          id={list.id}
          subscribe={!!isSubscriber}
        />
      ) : null}
    </>
  );
}
