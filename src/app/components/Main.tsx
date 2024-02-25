'use client';

import React from 'react';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '@/app/components/home/Nav';

const MainStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'mobile',
})<{
  mobile?: boolean;
}>(({ theme, mobile }) => ({
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${drawerWidth}px`,
  ...(mobile ? {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    padding: theme.spacing(0, 2)
  } : {}),
}));

function Main({ children }: { children: React.ReactNode }) {
  const smScreenWidthMatches = useMediaQuery('(max-width:1024px)');

  return (
    <MainStyled
      className="bg-gray-100 flex flex-col items-center grow relative"
      mobile={smScreenWidthMatches}
    >
      {children}
    </MainStyled>
  );
}

export default Main;
