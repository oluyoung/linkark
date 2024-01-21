'use client';

import { useState, useMemo, useCallback, MouseEvent } from 'react';
import { IconButton, Divider, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLinkForm from '@/app/components/links/EditLinkForm';
import DeleteLinkDialog from '@/app/components/links/DeleteLinkDialog';
import { Link } from '@prisma/client';
import CopyUrlToClipboard from './CopyUrlToClipboard';

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

function MoreMenuButton({ link }: { link: Link }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpenOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const openEditLinkModal = useCallback(() => {
    setEditModalOpen(true);
    closeMenu();
  }, []);

  const closeEditLinkModal = () => {
    setEditModalOpen(false);
    closeMenu();
  }

  const openDeleteLinkDialogModal = useCallback(() => {
    setDeleteDialogOpenOpen(true);
    closeMenu();
  }, []);

  const closeDeleteLinkDialogModal = () => {
    setDeleteDialogOpenOpen(false);
    closeMenu();
  }

  const copyUrlToClipboard = useCallback(() => {
    setCopyOpen(true);
    closeMenu();
  }, []);

  const closeCopyUrlToClipboard = () => {
    setCopyOpen(true);
    closeMenu();
  }

  const menuItems = useMemo(() => ([
    {
      Icon: EditIcon,
      text: 'Edit',
      onClick: openEditLinkModal
    },
    {
      Icon: ContentCopyIcon,
      text: 'Copy',
      onClick: copyUrlToClipboard
    },
    {
      Icon: DeleteIcon,
      text: 'Delete',
      noDivider: true,
      onClick: openDeleteLinkDialogModal
    },
  ]), [openEditLinkModal, copyUrlToClipboard, openDeleteLinkDialogModal]);
  
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
      {editModalOpen && <EditLinkForm open={editModalOpen} onClose={closeEditLinkModal} link={link} />}
      {deleteDialogOpen && <DeleteLinkDialog open={deleteDialogOpen} onClose={closeDeleteLinkDialogModal} id={link.id} />}
      {copyOpen && <CopyUrlToClipboard onClose={closeCopyUrlToClipboard} url={link.rawUrl} />}
    </>
  );
}

export default MoreMenuButton;