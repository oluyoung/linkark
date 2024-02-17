import { ReactNode } from 'react';
import { AlertColor } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

export interface ToastProps {
  /** Whether to show the toast or not. */
  open?: boolean;

  /** The message to appear within the toast. */
  message: string;

  /** Severity of the message. Affects the color of the toast. */
  severity: AlertColor;

  /** Whether the message should be hidden automatically.
   * If true, it will hide after 5 seconds.
   * If unset and severity is not error, autoHide is assumed to be true.
   * Error messages will never autoHide unless explicitly passed a value of true. */
  autoHide?: boolean;

  /** An optional icon to appear at the start of the toast. */
  icon?: ReactNode;

  /** The ID attribute to apply to the alert. */
  id?: string;
}

const initialState: ToastProps = {
  open: false,
  message: '',
  severity: 'error',
  autoHide: true,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    close(state) {
      state.open = false;
    },
    showToast(state, action: PayloadAction<ToastProps & { error?: Error }>) {
      state.severity = action.payload.severity;
      state.message = action.payload.message;
      state.open = true;
      if (action.payload.autoHide) state.autoHide = action.payload.autoHide;
      if (action.payload.id) state.id = action.payload.id;
      if (action.payload.icon) state.icon = action.payload.icon;
      if (action.payload.error) console.error(action.payload.error);
    },
  },
});

export const { close, showToast } = toastSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
