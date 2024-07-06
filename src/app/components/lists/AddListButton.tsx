'use client';

import { useState } from 'react';
import { Fab, Modal } from '@mui/material';
import ListForm from './ListForm';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';

function AddListButton() {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="contents">
      <Fab
        variant={!isMobile ? 'extended' : 'circular'}
        color="primary"
        className="!fixed bottom-6 right-6"
        onClick={handleOpen}
      >
        {!isMobile ? 'Add Lists' : null}
        <AddIcon sx={{ ml: !isMobile ? 1 : 0 }} />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-link-modal-title"
        aria-describedby="create-link-modal-description"
      >
        <div className="contents">
          <ListForm createMode onClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
}

export default AddListButton;
