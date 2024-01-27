'use client';

import { Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { trashLink } from '@/app/lib/actions/links.actions';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

interface Props {
  open: boolean;
  id: string;
  onClose: () => void;
}

export default function DeleteLinkDialog({ open, id, onClose }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const onDelete = () => {
    trashLink(id).then((res) => {
      if (res.success) {
        dispatch(showToast({
          severity: 'success',
          message: 'Link deleted successfully.',
          id: 'delete-link-snackbar'
        }));
        onClose();
      }
    }).catch(error => {
      dispatch(showToast({
        severity: 'error',
        message: 'Could not delete this link, please try again.',
        id: 'delete-link-snackbar',
        error
      }));
    });
  }

  return (
    <Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="delete-link-dialog"
      >
        <DialogTitle id="delete-link-dialog">
          Delete Link
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this link?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus aria-label="no-button">
            No
          </Button>
          <Button onClick={onDelete} aria-label="yes-button">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}