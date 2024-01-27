'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';
import { restoreLink } from '@/app/lib/actions/links.actions';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
}

export default function RestoreDialog({ id, open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const onRestore = () => {
    restoreLink(id)
      .then((res) => {
        if (res.success) {
          dispatch(
            showToast({
              severity: 'success',
              message: 'Link restored successfully.',
              id: 'restore-link-snackbar',
            })
          );
          onClose();
        }
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: 'Could not restore this link, please try again.',
            id: 'restore-link-snackbar',
            error,
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title="Restore link"
      message="Are you sure you want to restore this link?"
      ariaId="restore-link"
      open={open}
      onClose={onClose}
      onSuccess={onRestore}
    />
  );
}
