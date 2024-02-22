'use client';

import React, { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import { List } from '@prisma/client';
import AddListLinksForm from './AddListLinksForm';

function AddListLinksButton({
  list,
  links,
}: {
  list: List;
  links: readonly LinkAsAutocompleteOption[];
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    return () => handleClose();
  }, []);

  return (
    <div className="contents">
      <Fab
        variant="extended"
        color="primary"
        className="!fixed bottom-6 right-6"
        onClick={handleOpen}
      >
        ADD LINKS
        <span className="ml-2">+</span>
      </Fab>
      <AddListLinksForm
        open={open}
        onClose={handleClose}
        list={list}
        links={links}
      />
    </div>
  );
}

export default AddListLinksButton;
