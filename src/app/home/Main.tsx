'use client';

import React from 'react';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '@/app/components/home/Nav';

const headerHeight = '68px';

const MainStyled = styled('main', { shouldForwardProp: (prop) => prop !== 'mobile' })<{
  mobile?: boolean;
}>(({ theme, mobile }) => ({
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${drawerWidth}px`,
  height: `calc(100vh - ${headerHeight})`,
  ...(mobile && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));


function Main({ children }: { children: React.ReactNode; }) {
  const smScreenWidthMatches = useMediaQuery('(max-width:1024px)');

  return (
    <MainStyled className="bg-gray-100 flex items-center justify-center grow" mobile={smScreenWidthMatches}>
      {children}
    </MainStyled>
  );
}

export default Main;
