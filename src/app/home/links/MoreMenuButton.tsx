'use client';

import { useState, MouseEvent, Fragment } from 'react';
import { IconButton, Divider, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

const menuItems = [
  {
    Icon: EditIcon,
    text: 'Edit'
  },
  {
    Icon: ContentCopyIcon,
    text: 'Copy'
  },
  {
    Icon: DeleteIcon,
    text: 'Delete',
    noDivider: true
  }
];

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 100,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: 0,
    },
    '& .MuiDivider-root': {
      margin: 0
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'inherit',
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function MoreMenuButton({ id }: { id: string; }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="more-menu-button"
        aria-controls={open ? 'more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'more-menu-button',
        }}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((i) => {
          return (
            <div key={i.text} style={{ display: 'contents' }}>
              <MenuItem onClick={handleClose} disableRipple>
                <i.Icon />
                {i.text}
              </MenuItem>
              {!i.noDivider ? <Divider sx={{ my: 0.5 }} /> : null}
            </div>
          );
        })}
      </StyledMenu>
    </>
  );
}

export default MoreMenuButton;
