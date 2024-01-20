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
import { deleteLink } from '@/app/lib/actions/links.actions';

interface Props {
  open: boolean;
  id: string;
  onClose: () => void;
}

export default function DeleteLinkDialog({ open, id, onClose }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const onDelete = () => {
    deleteLink(id).then((res) => {
      if (res.success) {
        onClose();
      }
    })
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