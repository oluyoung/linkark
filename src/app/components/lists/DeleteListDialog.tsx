'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { deleteList } from '@/app/lib/actions/list.actions';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

interface Props {
  open: boolean;
  id: string;
  name: string;
  onClose: () => void;
}

export default function DeleteListDialog({ open, name, id, onClose }: Props) {
  const dispatch = useAppDispatch();

  const onDelete = () => {
    deleteList(id)
      .then((res) => {
        if (res.success) {
          dispatch(
            showToast({
              severity: 'success',
              message: 'List was deleted successfully.',
              id: 'delete-list-snackbar',
            })
          );
          onClose();
        }
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: 'Could not delete list, please try again.',
            error,
            id: 'delete-list-snackbar',
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title={`Delete ${name}`}
      message="Are you sure you want to delete ${name} permanently?"
      ariaId="delete-list"
      open={open}
      onClose={onClose}
      onSuccess={onDelete}
    />
  );
}
