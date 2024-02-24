'use client';

import React, { useState, useCallback, MouseEvent } from 'react';
import { IconButton, Divider, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLinkForm from '@/app/components/links/EditLinkForm';
import DeleteLinkDialog from '@/app/components/links/DeleteLinkDialog';
import RemoveListLinksDialog from '@/app/components/list/RemoveListLinksDialog';
import { Link } from '@prisma/client';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import CopyUrlToClipboard from './CopyUrlToClipboard';

export const StyledMenu = styled((props: MenuProps) => (
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

function MoreMenuButton({ link, listId }: { link: Link; listId?: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [removeListLinksDialogOpen, setRemoveDialogOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const toggleModal = useCallback(
    (
      setStateFn: React.Dispatch<React.SetStateAction<boolean>>,
      value: boolean
    ) => {
      setStateFn(value);
      closeMenu();
    },
    []
  );

  const menuItems = [
    {
      Icon: EditIcon,
      text: 'Edit',
      noDivider: false,
      onClick: () => toggleModal(setEditModalOpen, true),
    },
    {
      Icon: ContentCopyIcon,
      text: 'Copy',
      onClick: () => toggleModal(setCopyOpen, true),
    },
  ];

  if (listId) {
    menuItems.push({
      Icon: DoDisturbOnOutlinedIcon,
      text: 'Remove From List',
      noDivider: true,
      onClick: () => toggleModal(setRemoveDialogOpen, true),
    });
  }

  menuItems.push({
    Icon: DeleteIcon,
    text: 'Move to Trash',
    noDivider: true,
    onClick: () => toggleModal(setDeleteDialogOpen, true),
  });

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
            <div key={i.text} className="contents">
              <MenuItem onClick={i.onClick} disableRipple>
                <i.Icon />
                {i.text}
              </MenuItem>
              {!i.noDivider ? <Divider sx={{ my: 0.5 }} /> : null}
            </div>
          );
        })}
      </StyledMenu>
      {editModalOpen ? (
        <EditLinkForm
          open={editModalOpen}
          onClose={() => toggleModal(setEditModalOpen, false)}
          link={link}
        />
      ) : null}
      {deleteDialogOpen ? (
        <DeleteLinkDialog
          open={deleteDialogOpen}
          onClose={() => toggleModal(setDeleteDialogOpen, false)}
          id={link.id}
        />
      ) : null}
      {copyOpen ? (
        <CopyUrlToClipboard
          onClose={() => toggleModal(setCopyOpen, false)}
          url={link.rawUrl}
        />
      ) : null}
      {listId && removeListLinksDialogOpen ? (
        <RemoveListLinksDialog
          open={removeListLinksDialogOpen}
          onClose={() => toggleModal(setRemoveDialogOpen, false)}
          listId={listId}
          linkId={link.id}
        />
      ) : null}
    </>
  );
}

export default MoreMenuButton;
