import React, { ReactNode, useState, useMemo } from 'react';
import { Snackbar, IconButton, styled, Alert, AlertColor } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ToastProps {
  /** Whether to show the toast or not. */
  open: boolean;

  /** The contents to appear within the toast. */
  children: ReactNode;

  /** Severity of the message. Affects the color of the toast. */
  severity: AlertColor;

  /** Whether the message should be hidden automatically.
   * If true, it will hide after 8 seconds.
   * If unset and severity is not error, autoHide is assumed to be true.
   * Error messages will never autoHide unless explicitly passed a value of true. */
  autoHide?: boolean;

  /** An optional icon to appear at the start of the toast. */
  icon?: ReactNode;

  /** A callback that is called when the toast wants to close.
   * It is expected that this will reset the open prop otherwise the toast will never close. */
  handleClose?: () => void;

  /** The ID attribute to apply to the alert. */
  id?: string;
}

export const useToastInfo = () => {
  const [toastInfo, setToastInfo] = useState<{
    severity: AlertColor;
    message?: string;
  }>({
    severity: 'error',
    message: '',
  });

  const [open, setOpen] = useState(false);

  const showToast = (
    severity: AlertColor,
    message?: string,
    error?: Error
  ) => {
    setToastInfo({
      severity,
      message: message || 'An error has occurred.',
    });
    setOpen(true);

    if (error) {
      console.error(error);
    }
  };

  const close = () => {
    setOpen(false);
  };

  return useMemo(() => ({
    ...toastInfo,
    open,
    close,
    showToast,
  }), [toastInfo, open]);
};

const DEFAULT_AUTO_HIDE_DURATION = 5000;

const StyledAlert = styled(Alert)(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  alignItems: 'center',
}));

/**
 * A wrapper around the Material UI SnackBar and Alert components.
 * Provides close button automatically.
 */
const Toast = ({
  open,
  children,
  severity,
  id,
  autoHide,
  icon,
  handleClose,
}: ToastProps) => {
  const closeTooEarlySnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClose && handleClose();
  };

  const hideDuration =
    autoHide === true || (autoHide === undefined && severity !== 'error')
      ? DEFAULT_AUTO_HIDE_DURATION
      : null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={hideDuration}
      onClose={closeTooEarlySnack}
    >
      <StyledAlert
        id={id}
        icon={icon}
        severity={severity}
        action={
          <IconButton
            size="small"
            onClick={closeTooEarlySnack}
            aria-label="Close Snackbar"
            title="Close"
            id={`${id}-toast-close-btn`}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {children}
      </StyledAlert>
    </Snackbar>
  );
};

export default Toast;
