'use client';

import React from 'react';
import { Snackbar, IconButton, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { close, selectToast } from '@/store/toastSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const DEFAULT_AUTO_HIDE_DURATION = 5000;

const StyledAlert = styled(Alert)(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  alignItems: 'center',
}));

const SeverityIcons: {
  success: React.ReactNode;
  error: React.ReactNode;
  info: React.ReactNode;
  warning: React.ReactNode;
} = {
  success: <CheckCircleOutlineIcon color="success" fontSize="small" />,
  error: <CancelOutlinedIcon color="error" fontSize="small" />,
  info: <InfoOutlinedIcon color="info" fontSize="small" />,
  warning: <ReportProblemOutlinedIcon color="warning" fontSize="small" />,
};

/**
 * Toast notification
 */
const Toast = () => {
  const { open, message, severity, autoHide, icon, id } =
    useAppSelector(selectToast);
  const dispatch = useAppDispatch();

  const closeSnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    dispatch(close());
  };

  const hideDuration =
    !!autoHide || autoHide === undefined ? DEFAULT_AUTO_HIDE_DURATION : null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={hideDuration}
      onClose={closeSnack}
    >
      <StyledAlert
        id={id}
        icon={icon ? icon : SeverityIcons[severity]}
        severity={severity}
        action={
          <IconButton
            onClick={closeSnack}
            aria-label="Close Snackbar"
            title="Close"
            id={`${id}-toast-close-btn`}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default Toast;
