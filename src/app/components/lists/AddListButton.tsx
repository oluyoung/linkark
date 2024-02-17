'use client';

import { useState } from 'react';
import { Fab, Modal } from '@mui/material';
import AddListForm from './AddListForm';
import AddIcon from '@mui/icons-material/Add';

function AddListButton() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="contents">
      <Fab
        variant="extended"
        color="primary"
        className="!fixed bottom-6 right-6"
        onClick={handleOpen}
      >
        CREATE LIST
        <span className="ml-2 inline-flex items-center">
          <AddIcon fontSize="small" />
        </span>
      </Fab>
      {/** duplicate the form to be used in the edit link bit as well. */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-link-modal-title"
        aria-describedby="create-link-modal-description"
      >
        <div className="contents">
          <AddListForm onClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
}

export default AddListButton;
