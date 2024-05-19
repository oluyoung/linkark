'use client';

import React, { useState, MouseEvent } from 'react';
import { IconButton, Divider, Menu, MenuItem, SvgIconTypeMap } from '@mui/material';
import { styled, alpha } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface MoreMenuItems {
  Icon: OverridableComponent<SvgIconTypeMap<unknown, "svg">> & {
    muiName: string;
  };
  text: string;
  noDivider?: boolean;
  onClick: () => void;
}

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    id="more-menu"
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
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 100,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: 0,
    },
    '& .MuiDivider-root': {
      margin: 0,
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
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function MoreMenuButton({ menuItems }: { menuItems: MoreMenuItems[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

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
        onClose={closeMenu}
      >
        {menuItems.map((i) => {
          return (
            <div key={i.text} className="contents">
              <MenuItem onClick={() => {
                i.onClick();
                closeMenu();
              }} disableRipple>
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
