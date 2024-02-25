'use client';

import React, { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import { List } from '@prisma/client';
import AddListLinksForm from './AddListLinksForm';
import PlusIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';

function AddListLinksButton({
  list,
  links
}: {
  list: List;
  links: readonly LinkAsAutocompleteOption[];
}) {
  const isMobile = useMediaQuery('(max-width:1024px)');

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    return () => handleClose();
  }, []);

  return (
    <>
      <Fab
        variant={!isMobile ? 'extended' : 'circular'}
        color="primary"
        className="!fixed bottom-4 right-4"
        onClick={handleOpen}
        size={isMobile ? 'medium' : 'large'}
      >
        {!isMobile ? 'ADD LINKS' : null}
        <PlusIcon sx={{ ml: !isMobile ? 1 : 0 }} />
      </Fab>
      <AddListLinksForm
        open={open}
        onClose={handleClose}
        list={list}
        links={links}
      />
    </>
  );
}

export default AddListLinksButton;
