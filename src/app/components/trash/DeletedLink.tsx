'use client';

import { useState } from 'react';
import { ILink as LinkModel } from '@/db/models/link';
import clsx from 'clsx';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RestoreDialog from './RestoreDialog';
import DeleteDIalog from './DeleteDIalog';

function Link({ link }: { link: LinkModel }) {
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpenOpen] = useState(false);

  const hasTitle = !!(link.title || link.ogTitle);

  return (
    <>
      <div className="bg-white rounded-lg p-4 w-full card-shadow mb-4">
        <div
          className={clsx('flex items-center justify-between', {
            'h-[45px]': hasTitle,
            'h-[30px]': !hasTitle,
          })}
        >
          <div className="flex items-center h-full">
            <div
              className={clsx('text-wrap max-w-96 h-full flex flex-col', {
                'justify-between': hasTitle,
                'justify-center': !hasTitle,
              })}
            >
              <div className="w-full">
                {hasTitle ? (
                  <p className="text-sm truncate mb-0.5">
                    {link.title || link.ogTitle}
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
          <div className="flex flex-col items-end justify-center h-full">
            <div className="flex items-end justify-center">
              <Divider orientation="vertical" variant="middle" flexItem />
              <IconButton
                title="Restore"
                onClick={() => setRestoreDialogOpen(true)}
              >
                <RestoreIcon fontSize="small" color="success" />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
              <IconButton
                title="Delete Permanently"
                onClick={() => setDeleteDialogOpenOpen(true)}
              >
                <DeleteForeverIcon fontSize="small" color="error" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      {restoreDialogOpen && (
        <RestoreDialog
          id={link._id.toString()}
          onClose={() => setRestoreDialogOpen(false)}
          open={restoreDialogOpen}
        />
      )}
      {deleteDialogOpen && (
        <DeleteDIalog
          id={link._id.toString()}
          onClose={() => setDeleteDialogOpenOpen(false)}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}

export default Link;
