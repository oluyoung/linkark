'use client';

import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

function MuiTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MuiTheme;
