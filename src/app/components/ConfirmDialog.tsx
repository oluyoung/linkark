'use client';

import { Fragment } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onSuccess: () => void;
  ariaId: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  ariaId,
  title,
  message,
  onSuccess,
}: Props) {
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby={`${ariaId}-dialog`}
      >
        <DialogTitle id={`${ariaId}-dialog`}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus aria-label="no-button">
            No
          </Button>
          <Button onClick={onSuccess} aria-label="yes-button">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
