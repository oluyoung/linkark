'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { headerHeight } from '@/app/components/Header';

export const drawerWidth = 250;

export const navItems = [
  {
    title: 'Links',
    href: '/home/links',
    Icon: LinkIcon,
  },
  {
    title: 'Lists',
    href: '/home/lists',
    Icon: FormatListBulletedIcon,
  },
  {
    title: 'Tags',
    href: '/home/tags',
    Icon: LocalOfferOutlinedIcon,
    disabled: true,
  },
  {
    title: 'Settings',
    href: '/home/settings',
    Icon: SettingsOutlinedIcon,
    disabled: true,
  },
  {
    title: 'Trash',
    href: '/home/trash',
    Icon: DeleteForeverOutlinedIcon,
  },
];

function Nav() {
  const pathname = usePathname();
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
                onClick={() => setOpen(false)}
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
    </Drawer>
  );
}

export default Nav;
