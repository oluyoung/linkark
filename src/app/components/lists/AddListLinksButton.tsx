'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Fab,
  Button,
  Modal,
  Autocomplete,
  TextField,
  IconButton,
} from '@mui/material';
import { StyledForm } from '@/app/components/links/AddLinkForm';
import { addListLinks } from '@/app/lib/actions/list.actions';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import z from 'zod';
import { List } from '@prisma/client';
import Add from '@mui/icons-material/Add';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { MultiLinkSchema } from '@/app/lib/actions/schemas';

type Errors = Record<number, string>;

const urlSchema = z.string().url();

function AddListLinksButton({
  list,
  links,
}: {
  list: List;
  links: readonly LinkAsAutocompleteOption[];
}) {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState<Partial<LinkAsAutocompleteOption>[]>([
    { rawUrl: '' },
  ]);
  const [errors, setErrors] = useState<Errors>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const deleteField = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const hasOnlyValidUrls = useMemo(() => urls.every(
    (url) => urlSchema.safeParse(url.rawUrl).success
  ), [urls]);

  const addField = useCallback(() => {
    if (hasOnlyValidUrls && urls.length <= 10)
      setUrls([...urls, { rawUrl: '' }]);
  }, [urls, hasOnlyValidUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedFields = MultiLinkSchema.safeParse(urls);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      console.log(errors)
      const firstErrors = Object.entries(errors).reduce((acc, [k, e]) => {
        e && e.length && (acc[Number(k)] = e[0]);
        return acc;
      }, {} as Errors);
      setErrors(firstErrors);
      return;
    }

    await addListLinks(list.id, urls);
  };

  useEffect(() => {
    () => {
      setUrls([{ rawUrl: '' }]);
      setErrors([]);
      setOpen(false);
    };
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
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  mb={4}
                  sx={{}}
                >
                  <Autocomplete
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
                        error={!!errors[index]}
                        helperText={errors[index]}
                        // onBlur={(e) => handleChange({ rawUrl: e.target.value }, index)}
                        // onBlur={(e) => console.log(e.target.value)}
                      />
                    )}
                  />
                  {urls.length > 1 ? (
                    <IconButton onClick={() => deleteField(index)} sx={{ marginLeft: 1 }}>
                      <DoDisturbOnOutlinedIcon />
                    </IconButton>
                  ) : null}
                  {urls.length <= 10 ? (
                    <IconButton onClick={addField} sx={{ marginLeft: 1 }}>
                      <Add />
                    </IconButton>
                  ) : null}
                </Box>
              );
            })}
            <Button type="submit">SAVE LINKS</Button>
          </StyledForm>
        </div>
      </Modal>
    </div>
  );
}

export default AddListLinksButton;
