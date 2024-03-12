'use client';

import { useState } from 'react';
import {
  Box,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import { headerHeight } from '@/app/components/Header';

export const drawerWidth = 250;

function Nav() {
  const smScreenWidthMatches = useMediaQuery('(max-width:1024px)');
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      anchor="left"
      open={open || !smScreenWidthMatches}
      onClose={() => setOpen(false)}
      variant="permanent"
      sx={{
        display: !smScreenWidthMatches ? 'block' : 'none',
        width: drawerWidth,
        flexShrink: { sm: 0 },
        '& .MuiPaper-root': {
          marginTop: { sm: headerHeight, xs: 0 },
        },
      }}
    >
      <Box role="presentation" sx={{ width: { sm: drawerWidth, xs: '100vw' } }}>
      </Box>
    </Drawer>
  );
}

export default Nav;
