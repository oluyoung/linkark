'use client';

import { ListWithUser } from '@/app/lib/actions/lists.actions';
import { Modal, Chip, IconButton } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreMenuButton, { MoreMenuItems } from '@/app/components/MoreMenuButton';
import { format } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListForm from '@/app/components/lists/ListForm';
import DeleteListDialog from '@/app/components/lists/DeleteListDialog';

export default function List({
  list,
  creatorId,
}: {
  list: ListWithUser;
  creatorId: string;
}) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const isSm = useMediaQuery('(max-width:480px)');
  const hasTitle = list.name;
  const hasDescription = list.name && list.description && !isSm;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const toggleModal = useCallback(
    (
      setStateFn: React.Dispatch<React.SetStateAction<boolean>>,
      value: boolean
    ) => {
      setStateFn(value);
    },
    []
  );

  const menuItems: MoreMenuItems[] = useMemo(
    () => [
      {
        Icon: EditIcon,
        text: 'Edit',
        onClick: () => toggleModal(setEditModalOpen, true),
      },
      {
        Icon: DeleteIcon,
        text: 'Delete',
        noDivider: true,
        onClick: () => toggleModal(setDeleteDialogOpen, true),
      },
    ],
    [toggleModal]
  );

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
                {list.isPublic ? (
                  <LockOpenIcon fontSize="small" />
                ) : (
                  <LockIcon fontSize="small" />
                )}
              </span>
              {list.creatorId !== creatorId ? (
                <span className="inline-block mr-2">
                  <Chip
                    icon={<FaceIcon />}
                    label={list.creator.name}
                    variant="outlined"
                    size="small"
                  />
                </span>
              ) : null}
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
              <MoreMenuButton menuItems={menuItems} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <IconButton
            href={`lists/${list.id}`}
            LinkComponent={Link}
            size="large"
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </div>
    {editModalOpen && (
      <Modal
        open={editModalOpen}
        onClose={() => toggleModal(setEditModalOpen, false)}
        aria-labelledby="edit-link-modal-title"
        aria-describedby="edit-link-modal-description"
      >
        <div className="contents">
          <ListForm
            createMode={false}
            list={list}
            onClose={() => toggleModal(setEditModalOpen, false)}
          />
        </div>
      </Modal>
    )}
    {deleteDialogOpen && (
      <DeleteListDialog
        open={deleteDialogOpen}
        onClose={() => toggleModal(setDeleteDialogOpen, false)}
        name={list.name}
        id={list.id}
      />
    )}
    </>
  );
}
