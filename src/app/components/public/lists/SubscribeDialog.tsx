'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { subscribeToList } from '../../../lib/actions/listSubscriber.actions';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface Props {
  open: boolean;
  id: string;
  name: string;
  onClose: () => void;
  subscribe: boolean;
}

export default function SubscribeDialog({ open, name, id, onClose, subscribe }: Props) {
  const dispatch = useAppDispatch();
  const path = usePathname();

  const single = useMemo(() => path.includes(id), [id, path]);

  const message = !subscribe ? 'subscribe to' : 'unsubscribe from';

  const onSubscribe = () => {
    subscribeToList(id, !subscribe, single)
      .then(() => {
        dispatch(
          showToast({
            severity: 'success',
            message: `You have successfully ${!subscribe ? 'subscribed to' : 'unsubscribed from'} this list.`,
            id: 'subscribe-list-snackbar',
          })
        );
        onClose();
      })
      .catch((error) => {
        dispatch(
          showToast({
            severity: 'error',
            message: `Could not ${message} this list, please refresh and try again.`,
            error,
            id: 'subscribe-list-snackbar',
          })
        );
      });
  };

  return (
    <ConfirmDialog
      title={`Subscribe to ${name}`}
      message={`Are you sure you want to ${message} this list?`}
      ariaId="subscribe-list"
      open={open}
      onClose={onClose}
      onSuccess={onSubscribe}
    />
  );
}
