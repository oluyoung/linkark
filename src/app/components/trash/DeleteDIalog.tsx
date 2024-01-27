'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';
import { deleteLink } from '@/app/lib/actions/links.actions';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteDialog({ id, open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const onRestore = () => {
    deleteLink(id)
      .then((res) => {
        if (res.success) {
          dispatch(
            showToast({
              severity: 'success',
              message: 'Link has been deleted permanently.',
              id: 'delete-link-snackbar',
            })
          );
          onClose();
        }
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: 'Could not remove this link, please try again.',
            id: 'delete-link-snackbar',
            error,
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title="Delete link"
      message="This link will be deleted permanently, are you sure?"
      ariaId="restore-link"
      open={open}
      onClose={onClose}
      onSuccess={onRestore}
    />
  );
}
