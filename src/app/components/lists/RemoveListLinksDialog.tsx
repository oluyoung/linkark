'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { removeListLinks } from '@/app/lib/actions/list.actions';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

interface Props {
  open: boolean;
  linkId: string;
  listId: string;
  onClose: () => void;
}

export default function RemoveListLinkDialog({
  open,
  listId,
  linkId,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();

  const onRemove = () => {
    removeListLinks(listId, [linkId])
      .then(() => {
        dispatch(
          showToast({
            severity: 'success',
            message: 'Link has been removed from list successfully.',
            id: 'remove-list-snackbar',
          })
        );
        onClose();
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: 'There was a problem removing the link, please try again.',
            error,
            id: 'remove-list-snackbar',
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title={`Remove link`}
      message="Are you sure you want to remove this link from your list?"
      ariaId="remove-list"
      open={open}
      onClose={onClose}
      onSuccess={onRemove}
    />
  );
}
