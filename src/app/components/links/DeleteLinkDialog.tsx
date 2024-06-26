'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { trashLink } from '@/app/lib/actions/links.actions';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

interface Props {
  open: boolean;
  id: string;
  onClose: () => void;
}

export default function DeleteLinkDialog({ open, id, onClose }: Props) {
  const dispatch = useAppDispatch();

  const onDelete = () => {
    trashLink(id)
      .then((res) => {
        if (res.success) {
          dispatch(
            showToast({
              severity: 'success',
              message: 'Link moved to trash successfully.',
              id: 'trash-link-snackbar',
            })
          );
          onClose();
        }
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: 'Could not move link to trash, please try again.',
            error,
            id: 'trash-link-snackbar',
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title="Move link to trash"
      message="Are you sure you want to move this link to trash?"
      ariaId="trash-link"
      open={open}
      onClose={onClose}
      onSuccess={onDelete}
    />
  );
}
