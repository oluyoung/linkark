'use client';

import {
  useMediaQuery,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { drawerWidth, navItems } from '../home/Nav';
import React from 'react';

interface NavProps {
  open: boolean;
  onOpen: (event: React.KeyboardEvent | React.MouseEvent) => void;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

function Nav({ open, onOpen, onClose }: NavProps) {
  const pathname = usePathname();
  const smScreenWidthMatches = useMediaQuery('(max-width:1024px)');

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: smScreenWidthMatches ? 'block' : 'none',
        width: { sm: drawerWidth, xs: '100vw' },
        flexShrink: { sm: 0 },
      }}
    >
      <Box role="presentation" sx={{ width: { sm: drawerWidth, xs: '100vw' } }}>
        <List component="nav">
          {navItems.map((item) => (
            <ListItem
              key={item.title}
              sx={({ spacing }) => ({ p: spacing(0, 1) })}
            >
              <ListItemButton
                href={item.href}
                component={Link}
                title={item.title}
                selected={pathname.startsWith(item.href)}
                disabled={item.disabled}
                onClick={onClose}
                sx={({ spacing, palette }) => ({
                  py: spacing(1.5),
                  '&.Mui-selected': {
                    color: palette.primary.main,
                  },
                })}
              >
                <item.Icon />
                <Typography
                  component="span"
                  fontFamily="inherit"
                  ml={1.5}
                  display="inline-block"
                >
                  {item.title}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  );
}

export default Nav;
