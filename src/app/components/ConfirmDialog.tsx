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
        onClose={(e, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            onClose();
            return;
          }
          onClose();
        }}
        aria-labelledby={`${ariaId}-dialog`}
      >
        <DialogTitle id={`${ariaId}-dialog`}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} aria-label="no-button">
            No
          </Button>
          <Button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            aria-label="yes-button"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
