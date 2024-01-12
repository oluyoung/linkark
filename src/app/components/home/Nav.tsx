'use client';

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
import { headerHeight } from '@/app/components/Header';

export const drawerWidth = 250;

export const navItems = [
  {
    title: 'All Links',
    href: '/home/links',
    Icon: LinkIcon,
  },
  {
    title: 'Trash',
    href: '/home/trash',
    Icon: DeleteForeverOutlinedIcon,
  },
  {
    title: 'Settings',
    href: '/home/settings',
    Icon: SettingsOutlinedIcon,
  },
  {
    title: 'Tags',
    href: '/home/tags',
    Icon: LocalOfferOutlinedIcon,
  },
];

function Nav() {
  const pathname = usePathname();
  const smScreenWidthMatches = useMediaQuery('(max-width:1024px)');

  return (
    <Drawer
      anchor="left"
      open={!smScreenWidthMatches}
      onClose={() => {}}
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
