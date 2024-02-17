'use client';

import React, { useState, useMemo, useCallback, MouseEvent } from 'react';
import { Modal, IconButton, Divider, MenuItem } from '@mui/material';
import { List } from '@prisma/client';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListForm from '@/app/components/lists/ListForm';
import DeleteListDialog from '@/app/components/lists/DeleteListDialog';
import { StyledMenu } from '@/app/components/links/MoreMenuButton';

function MoreMenuButton({ list }: { list: List }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpenOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
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

  const menuItems = useMemo(
    () => [
      {
        Icon: EditIcon,
        text: 'Edit',
        onClick: () => toggleModal(setEditModalOpen, true),
      },
      {
        Icon: DeleteIcon,
        text: 'Delete',
        noDivider: true,
        onClick: () => toggleModal(setDeleteDialogOpenOpen, true),
      },
    ],
    [toggleModal]
  );

  return (
    <>
      <IconButton
        id="more-menu-button"
        aria-controls={menuOpen ? 'more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={openMenu}
      >
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu
        id="more-menu"
        anchorEl={anchorEl}
        open={menuOpen}
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
      {editModalOpen && (
        <Modal
          open={editModalOpen}
          onClose={() => toggleModal(setEditModalOpen, false)}
          aria-labelledby="edit-link-modal-title"
          aria-describedby="edit-link-modal-description"
        >
          <div className="contents">
            <ListForm
              createMode={false}
              list={list}
              onClose={() => toggleModal(setEditModalOpen, false)}
            />
          </div>
        </Modal>
      )}
      {deleteDialogOpen && (
        <DeleteListDialog
          open={deleteDialogOpen}
          onClose={() => toggleModal(setDeleteDialogOpenOpen, false)}
          name={list.name}
          id={list.id}
        />
      )}
    </>
  );
}

export default MoreMenuButton;
