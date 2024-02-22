'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Autocomplete,
  TextField,
  IconButton,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem
} from '@mui/material';
import { StyledForm } from '@/app/components/links/AddLinkForm';
import { addListLinks } from '@/app/lib/actions/list.actions';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import Add from '@mui/icons-material/Add';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MultiLinkSchema } from '@/app/lib/actions/schemas';
import { List } from '@prisma/client';
import z from 'zod';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<LinkAsAutocompleteOption>();

type Errors = Record<number, string>;

const urlSchema = z.string().url();

interface Props {
  open: boolean;
  onClose: () => void;
  list: List;
  links: readonly LinkAsAutocompleteOption[];
}

function AddListLinksForm({
  open,
  onClose,
  list,
  links,
}: Props) {
  const [urls, setUrls] = useState<LinkAsAutocompleteOption[]>([
    { rawUrl: '' },
  ]);
  const [errors, setErrors] = useState<Errors>({});
  const [expanded, setExpanded] = useState<string | false>(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const handleAccordionChange =
    (panel: string) => () => {
      setExpanded((prev) => (prev !== panel ? panel : false));
    };

  const resetErrorAtIndex = (value = '', index: number) => {
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [index]: value,
      };
    });
  };

  const handleUrlChange = useCallback(
    (value: LinkAsAutocompleteOption | null, index: number, isOption = false) => {
      resetErrorAtIndex('', index);

      if (!value) {
        const newUrls = [...urls];
        newUrls[index] = { rawUrl: '' };
        setUrls(newUrls);
        return;
      };

      let errorMessage = '';
      if (!urlSchema.safeParse(value.rawUrl).success) {
        errorMessage = 'Please enter a valid url';
        resetErrorAtIndex(errorMessage, index);
        return;
      }

      if (!isOption) getUriMeta(value, index);
      else {
        const newUrls = [...urls];
        newUrls[index] = { ...value, isOption };
        setUrls(newUrls);
      }
    },
    [urls]
  );

  const deleteField = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const hasOnlyValidUrls = useMemo(
    () => urls.every((url) => urlSchema.safeParse(url.rawUrl).success),
    [urls]
  );

  const addField = useCallback(() => {
    if (hasOnlyValidUrls && urls.length <= 10)
      setUrls([...urls, { rawUrl: '' }]);
  }, [urls, hasOnlyValidUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedFields = MultiLinkSchema.safeParse(urls);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      console.log(errors);
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
    return () => {
      setUrls([{ rawUrl: '' }]);
      setErrors([]);
    };
  }, []);

  const getUriMeta = (link: LinkAsAutocompleteOption, index: number) => {
    if (!link.rawUrl || link.isOption || urls[index].rawUrl === link.rawUrl) return;

    setFetchingMeta(true);
    fetch('/api/ogs', { method: 'POST', body: JSON.stringify({ uri: link.rawUrl }) })
      .then((res) => {
        if (!res.ok) {
          throw 'This URL does not exist';
        }
        return res.json();
      })
      .then((data) => {
        const newUrls = urls.slice();
        newUrls[index] = {
          ...newUrls[index],
          ...data,
          isOption: false
        };
        setUrls(newUrls);
        setFetchingMeta(false);
      })
      .catch((error) => {
        resetErrorAtIndex(error, index);
      });
  };

  const urlsReady = urls.some(url => !!url.rawUrl);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-link-modal-title"
      aria-describedby="create-link-modal-description"
    >
      <div className="contents">
        <Typography>Add new links to {list.name}</Typography>
        <StyledForm onSubmit={handleSubmit}>
          {urls.map((url, index) => {
            const NAME = `url${index}`;
            console.log
            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Accordion expanded={expanded === NAME} sx={{ width: '100%' }}>
                  <AccordionSummary
                    expandIcon={url.rawUrl && !url.isOption ? (
                      <IconButton onClick={handleAccordionChange(NAME)}>
                        <ExpandMoreIcon />
                      </IconButton>
                    ) : null}
                    id={NAME}
                    aria-controls={`${NAME}-content`}
                  >
                    <Autocomplete
                      disablePortal
                      fullWidth
                      options={links}
                      openOnFocus
                      freeSolo
                      getOptionKey={(option) =>
                        (option as LinkAsAutocompleteOption).id as string
                      }
                      getOptionLabel={(option_) => {
                        if (typeof option_ === 'string') {
                          return option_;
                        }
                        if (option_.inputValue) {
                          return option_.inputValue;
                        }
                        const option = option_ as LinkAsAutocompleteOption;
                        return option.ogTitle || option.title || option.rawUrl || '';
                      }}
                      renderOption={(props, option) => <MenuItem {...props}>{option.ogTitle || option.title || option.rawUrl || ''}</MenuItem>}
                      isOptionEqualToValue={(option, value) =>
                        option.rawUrl === value.rawUrl
                      }
                      value={url}
                      onChange={(e, newValue) => {
                        if (typeof newValue === 'string') {
                          handleUrlChange({ rawUrl: newValue }, index);
                        } else if (newValue && newValue.inputValue) {
                          handleUrlChange({ rawUrl: newValue.inputValue }, index);
                        } else {
                          handleUrlChange(newValue, index, true);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;

                        const isExisting = options.some((option) => inputValue === option.rawUrl);
                        if (inputValue !== '' && !isExisting) {
                          filtered.push({
                            inputValue,
                            rawUrl: `Add "${inputValue}"`,
                          } as LinkAsAutocompleteOption);
                        }

                        return filtered;
                      }}
                      loading={fetchingMeta}
                      onBlur={() => getUriMeta(url, index)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label={`Link ${index + 1}`}
                          name={NAME}
                          type="url"
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            type: 'url',
                          }}
                          aria-required="true"
                          error={!!errors[index]}
                          helperText={errors[index]}
                        />
                      )}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>TODO: Add link form</p>
                  </AccordionDetails>
                </Accordion>
                {urls.length > 1 ? (
                  <IconButton
                    onClick={() => deleteField(index)}
                    sx={{ marginLeft: 1 }}
                  >
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
          <Button type="submit" disabled={!urlsReady}>SAVE LINKS</Button>
        </StyledForm>
      </div>
    </Modal>
  );
}

export default AddListLinksForm;
