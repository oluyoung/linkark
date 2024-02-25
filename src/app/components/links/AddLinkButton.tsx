'use client';

import { useState } from 'react';
import { Fab, Modal } from '@mui/material';
import AddLinkForm from './AddLinkForm';
import { useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddLinkButton() {
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
        {!isMobile ? 'ADD LINK' : null}
        <AddIcon sx={{ ml: !isMobile ? 1 : 0 }} />
      </Fab>
      {/** TODO: duplicate the form to be used in the edit link bit as well. */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-link-modal-title"
        aria-describedby="create-link-modal-description"
      >
        <div className="contents">
          <AddLinkForm onClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
}

export default AddLinkButton;
