'use client';

import React, { useCallback, useState, ChangeEvent } from 'react';
import {
  Fab,
  Button,
  Modal,
  Autocomplete,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { StyledForm } from '@/app/components/links/AddLinkForm';
import { State, addListLinks } from '@/app/lib/actions/list.actions';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import z from 'zod';
import { List } from '@prisma/client';
import Add from '@mui/icons-material/Add';

const urlSchema = z.string().url();

function AddListLinksButton({
  list,
  links,
}: {
  list: List;
  links: readonly LinkAsAutocompleteOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({});
  const [urls, setUrls] = useState<Partial<LinkAsAutocompleteOption>[]>([
    { rawUrl: '' },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getFirstError = useCallback(
    (field: string) => {
      const stateError =
        state &&
        state.errors &&
        field in state.errors &&
        state.errors[field as unknown as number].length
          ? state.errors[field as unknown as number][0]
          : '';
      return stateError;
    },
    [state]
  );

  const resetErrorAtIndex = (value = '', index: number) => {
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [index]: value,
      };
    });
  };

  const handleChange = useCallback(
    (value: Partial<LinkAsAutocompleteOption> | null, index: number) => {
      resetErrorAtIndex('', index);

      console.log('---value', value);
      if (!value) return;

      let errorMessage = '';
      if (!urlSchema.safeParse(value.rawUrl).success) {
        errorMessage = 'Please enter a valid url';
        resetErrorAtIndex(errorMessage, index);
      }

      const newUrls = [...urls];
      newUrls[index] = value;
      setUrls(newUrls);
    },
    [urls]
  );

  const handleDeleteUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleAddUrl = useCallback(() => {
    const hasOnlyValidUrls = urls.every(
      (url) => urlSchema.safeParse(url.rawUrl).success
    );
    if (hasOnlyValidUrls && urls.length <= 10)
      setUrls([...urls, { rawUrl: '' }]);
  }, [urls]);

  // const resetUrl = (index: number) => {
  //   const newUrls = [...urls];
  //   newUrls[index] = { rawUrl: '' };
  //   setUrls(newUrls);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addListLinks(list.id, urls);
  };

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-link-modal-title"
        aria-describedby="create-link-modal-description"
      >
        <div className="contents">
          <StyledForm onSubmit={handleSubmit}>
            {urls.map((url, index) => {
              return (
                <Autocomplete
                  key={index}
                  disablePortal
                  fullWidth
                  options={links}
                  openOnFocus
                  freeSolo
                  getOptionKey={(option) =>
                    (option as LinkAsAutocompleteOption).id
                  }
                  getOptionLabel={(option_) => {
                    const option = option_ as LinkAsAutocompleteOption;
                    return option.ogTitle || option.title || option.rawUrl;
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.rawUrl === value.rawUrl
                  }
                  value={url}
                  onChange={(e, newValue) => {
                    if (typeof newValue === 'string') {
                      handleChange({ rawUrl: newValue }, index);
                    } else {
                      handleChange(newValue, index);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={`Link ${index + 1}`}
                      name={`url${index}`} // url or use url1
                      type="url"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        type: 'url',
                      }}
                      aria-required="true"
                      sx={{
                        mb: 4,
                      }}
                      error={!!errors[index]}
                      helperText={errors[index]}
                    />
                  )}
                />
              );
            })}
            <IconButton onClick={handleAddUrl}>
              <Add />
            </IconButton>
            <Button type="submit">SAVE LINKS</Button>
          </StyledForm>
        </div>
      </Modal>
    </div>
  );
}

export default AddListLinksButton;
