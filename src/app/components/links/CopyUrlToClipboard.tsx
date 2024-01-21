import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

function CopyUrlToClipboard({ url, onClose }: { url: string; onClose: () => void }) {
  const dispatch = useAppDispatch();

  const copyUrl = async () => {
    if ('clipboard' in navigator) return await navigator.clipboard.writeText(url);
    else return document.execCommand('copy', true, url);
  };

  useEffect(() => {
    copyUrl().then(() => {
      dispatch(showToast({
        severity: 'success',
        message: 'Link copied successfully.',
        id: 'copy-link-snackbar'
      }));
      onClose();
    }).catch((error) => {
      dispatch(showToast({
        severity: 'error',
        message: 'Could not copy this link, please try again.',
        id: 'copy-link-snackbar',
        error
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default CopyUrlToClipboard;
