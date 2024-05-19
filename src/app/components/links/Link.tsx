'use client';

import { Link as LinkModel } from '@prisma/client';
import { format } from 'date-fns';
import { usePathname } from 'next/navigation';
import MoreMenuButton, { MoreMenuItems } from '@/app/components/MoreMenuButton';
import clsx from 'clsx';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useMediaQuery } from '@mui/material';
import React, { useState, useCallback } from 'react';
import CopyUrlToClipboard from './CopyUrlToClipboard';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLinkForm from '@/app/components/links/EditLinkForm';
import DeleteLinkDialog from '@/app/components/links/DeleteLinkDialog';
import RemoveListLinksDialog from '@/app/components/list/RemoveListLinksDialog';

function Link({ link, listId }: { link: LinkModel; listId?: string }) {
  const pathname = usePathname();
  const isSm = useMediaQuery('(max-width:480px)');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [removeListLinksDialogOpen, setRemoveDialogOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  const hasTitle = !!(link.title || link.ogTitle);
  const hasDescription = !!(link.description || link.ogDescription);

  const toggleModal = useCallback(
    (
      setStateFn: React.Dispatch<React.SetStateAction<boolean>>,
      value: boolean
    ) => {
      setStateFn(value);
    },
    []
  );

  const menuItems: MoreMenuItems[] = [
    {
      Icon: EditIcon,
      text: 'Edit',
      noDivider: false,
      onClick: () => toggleModal(setEditModalOpen, true),
    },
    {
      Icon: ContentCopyIcon,
      text: 'Copy',
      onClick: () => toggleModal(setCopyOpen, true),
    },
  ];

  if (listId) {
    menuItems.push({
      Icon: DoDisturbOnOutlinedIcon,
      text: 'Remove From List',
      noDivider: true,
      onClick: () => toggleModal(setRemoveDialogOpen, true),
    });
  }

  menuItems.push({
    Icon: DeleteIcon,
    text: 'Move to Trash',
    noDivider: true,
    onClick: () => toggleModal(setDeleteDialogOpen, true),
  });


  return (
    <>
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
          {pathname.includes('home') ? <MoreMenuButton menuItems={menuItems} /> : null}
        </div>
      </div>
    </li>
          {editModalOpen ? (
            <EditLinkForm
              open={editModalOpen}
              onClose={() => toggleModal(setEditModalOpen, false)}
              link={link}
            />
          ) : null}
          {deleteDialogOpen ? (
            <DeleteLinkDialog
              open={deleteDialogOpen}
              onClose={() => toggleModal(setDeleteDialogOpen, false)}
              id={link.id}
            />
          ) : null}
          {copyOpen ? (
            <CopyUrlToClipboard
              onClose={() => toggleModal(setCopyOpen, false)}
              url={link.rawUrl}
            />
          ) : null}
          {listId && removeListLinksDialogOpen ? (
            <RemoveListLinksDialog
              open={removeListLinksDialogOpen}
              onClose={() => toggleModal(setRemoveDialogOpen, false)}
              listId={listId}
              linkId={link.id}
            />
          ) : null}
    </>
  );
}

export default Link;
