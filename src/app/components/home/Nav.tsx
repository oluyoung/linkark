'use client';

import Box from '@mui/material/Box';
import { useMediaQuery, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

export const drawerWidth = 250;
export const headerHeight = '68px';

export const navItems = [{
  title: 'All Links',
  href: '/home',
  Icon: LinkIcon
}, {
  title: 'Trash',
  href: '/trash',
  Icon: DeleteForeverOutlinedIcon
}, {
  title: 'Settings',
  href: '/settings',
  Icon: SettingsOutlinedIcon
}, {
  title: 'Tags',
  href: '/tags',
  Icon: LocalOfferOutlinedIcon
}];

function Nav() {
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
          marginTop: { sm: headerHeight, xs: 0 }
        }
      }}
    >
      <Box role="presentation" component="nav" sx={{ width: { sm: drawerWidth, xs: '100vw' } }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title} disablePadding sx={({ spacing }) => ({ pl: spacing(2) })}>
              <ListItemButton href={item.href} title={item.title} sx={{ fontWeight: 'normal' }}>
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Nav;
