'use client';

import { useMediaQuery, Box, SwipeableDrawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { drawerWidth, navItems } from '../home/Nav';

interface NavProps {
  open: boolean;
  onOpen: (event: React.KeyboardEvent | React.MouseEvent) => void;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

function Nav({ open, onOpen, onClose }: NavProps) {
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
        width: { sm: drawerWidth, xs: '100vw' }, flexShrink: { sm: 0 },
      }}
    >
      <Box role="presentation" component="nav" sx={{ width: { sm: drawerWidth, xs: '100vw' } }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton href={item.href} title={item.title}>
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  );
}

export default Nav;
