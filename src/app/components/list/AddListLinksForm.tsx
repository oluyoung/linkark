'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Modal,
  Autocomplete,
  TextField,
  IconButton,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { StyledForm } from '@/app/components/links/AddLinkForm';
import { addListLinks } from '@/app/lib/actions/lists.actions';
import { LinkAsAutocompleteOption } from '@/app/lib/actions/links.actions';
import Add from '@mui/icons-material/Add';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import { MultiLinkSchema } from '@/app/lib/actions/schemas';
import { IList } from '@/db/models/list';
import z from 'zod';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<LinkAsAutocompleteOption>();

type Errors = Record<number, string>;

const urlSchema = z.string().url();

interface Props {
  open: boolean;
  onClose: () => void;
  list: IList;
  links: readonly LinkAsAutocompleteOption[];
}

function AddListLinksForm({ open, onClose, list, links }: Props) {
  const [urls, setUrls] = useState<LinkAsAutocompleteOption[]>([
    { rawUrl: '' },
  ]);
  const [errors, setErrors] = useState<Errors>({});
  const [expanded, setExpanded] = useState<string | false>(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const getUriMeta = useCallback((link: LinkAsAutocompleteOption, index: number) => {
    if (!link.rawUrl || link.isOption || urls[index].rawUrl === link.rawUrl)
      return;

    setFetchingMeta(true);
    fetch('/api/ogs', {
      method: 'POST',
      body: JSON.stringify({ uri: link.rawUrl }),
    })
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
          isOption: false,
        };
        setUrls(newUrls);
        setFetchingMeta(false);
      })
      .catch((error) => {
        resetErrorAtIndex(error, index);
      });
  }, [urls]);

  const handleAccordionChange = (panel: string) => () => {
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
    (
      value: LinkAsAutocompleteOption | null,
      index: number,
      isOption = false
    ) => {
      resetErrorAtIndex('', index);

      if (!value) {
        const newUrls = [...urls];
        newUrls[index] = { rawUrl: '' };
        setUrls(newUrls);
        return;
      }

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
    [getUriMeta, urls]
  );

  const handleLinkMetaField = useCallback(
    (field: string, value: string | null, index: number) => {
      const newUrls = [...urls];
      newUrls[index] = { ...newUrls[index], [field]: value };
      setUrls(newUrls);
    },
    [urls]
  );

  const resetLinkMetaField = useCallback(
    (field: string, index: number) => {
      const newUrls = [...urls];
      newUrls[index] = { ...newUrls[index], [field]: '' };
      setUrls(newUrls);
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
      console.log(validatedFields.error)
      const firstErrors = Object.entries(errors).reduce((acc, [k, e]) => {
        e && e.length && (acc[Number(k)] = e[0]);
        return acc;
      }, {} as Errors);
      setErrors(firstErrors);
      return;
    }

    await addListLinks(list._id.toString(), urls);
  };

  useEffect(() => {
    return () => {
      setUrls([{ rawUrl: '' }]);
      setErrors([]);
    };
  }, []);

  const urlsReady = urls.some((url) => !!url.rawUrl);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-link-modal-title"
      aria-describedby="create-link-modal-description"
    >
      <div className="contents">
        <StyledForm onSubmit={handleSubmit}>
          <Typography sx={{ marginBottom: 2 }}>Add new links to <em>{list.name}</em></Typography>
          {urls.map((url, index) => {
            const NAME = `url${index}`;
            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Accordion
                  expanded={expanded === NAME}
                  sx={{ width: '100%', boxShadow: 'none' }}
                >
                  <AccordionSummary
                    expandIcon={
                      url.rawUrl && !url.isOption ? (
                        <IconButton onClick={handleAccordionChange(NAME)}>
                          <ExpandMoreIcon />
                        </IconButton>
                      ) : null
                    }
                    id={NAME}
                    aria-controls={`${NAME}-content`}
                    sx={{
                      p: 0,
                      '&.Mui-focusVisible': {
                        backgroundColor: 'transparent',
                        cursor: 'default'
                      },
                      '& > .MuiAccordionSummary-content.Mui-expanded': {
                        m: 0,
                      },
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      fullWidth
                      options={links}
                      openOnFocus
                      freeSolo
                      size="small"
                      getOptionKey={(option) =>
                        (option as LinkAsAutocompleteOption)._id?.toString() as string
                      }
                      getOptionLabel={(option_) => {
                        if (typeof option_ === 'string') {
                          return option_;
                        }
                        if (option_.inputValue) {
                          return option_.inputValue;
                        }
                        const option = option_ as LinkAsAutocompleteOption;
                        return (
                          option.ogTitle || option.title || option.rawUrl || ''
                        );
                      }}
                      renderOption={(props, option) => (
                        <MenuItem {...props} key={option._id?.toString()}>
                          {option.ogTitle ||
                            option.title ||
                            option.rawUrl ||
                            ''}
                        </MenuItem>
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.rawUrl === value.rawUrl
                      }
                      value={url}
                      onChange={(e, newValue) => {
                        if (typeof newValue === 'string') {
                          handleUrlChange({ rawUrl: newValue }, index);
                        } else if (newValue && newValue.inputValue) {
                          handleUrlChange(
                            { rawUrl: newValue.inputValue },
                            index
                          );
                        } else {
                          handleUrlChange(newValue, index, true);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;

                        const isExisting = options.some(
                          (option) => inputValue === option.rawUrl
                        );
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
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            type: 'url',
                          }}
                          error={!!errors[index]}
                          helperText={errors[index]}
                        />
                      )}
                    />
                  </AccordionSummary>
                  {url.rawUrl && !url.isOption ? (
                    <AccordionDetails
                      sx={({ spacing, palette }) => ({
                        p: spacing(2),
                        borderLeft: `1px solid ${palette.grey[300]}`,
                      })}
                    >
                      <Stack>
                        <TextField
                          fullWidth
                          size="small"
                          id="title-field"
                          label="Title"
                          type="title"
                          name="title"
                          variant="outlined"
                          value={url.title || url.ogTitle || ''}
                          onChange={(e) =>
                            handleLinkMetaField('title', e.target.value, index)
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment:
                              url.title || url.ogTitle ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      resetLinkMetaField('title', index)
                                    }
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </InputAdornment>
                              ) : null,
                          }}
                          // error={!!getFirstError('url')}
                          // helperText={getFirstError('url')}
                          sx={{
                            mb: 3,
                          }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          id="description-field"
                          label="Description"
                          type="description"
                          name="description"
                          variant="outlined"
                          value={url.description || url.ogDescription || ''}
                          onChange={(e) =>
                            handleLinkMetaField(
                              'description',
                              e.target.value,
                              index
                            )
                          }
                          multiline
                          rows={3}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ViewStreamOutlinedIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment:
                              url.description || url.ogDescription ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      resetLinkMetaField('description', index)
                                    }
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </InputAdornment>
                              ) : null,
                          }}
                          // error={!!getFirstError('url')}
                          // helperText={getFirstError('url')}
                        />
                      </Stack>
                    </AccordionDetails>
                  ) : null}
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
          <Button type="submit" disabled={!urlsReady}>
            SAVE LINKS
          </Button>
        </StyledForm>
      </div>
    </Modal>
  );
}

export default AddListLinksForm;
