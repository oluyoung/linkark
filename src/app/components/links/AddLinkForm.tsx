'use client';

import { useCallback, useState, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  createLink,
  State,
  Fields
} from '@/app/lib/actions/links.actions';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddLinkForm = ({ onClose }: { onClose: () => void }) => {
  const initialState = { message: null, errors: {} };
  const formRef = useRef();
  const [state, setState] = useState<State>(initialState);

  const formik = useFormik<Fields>({
    initialValues: {
      url: '',
      title: '',
      description: '',
      tags: []
    },
    onSubmit: async (values) => {
      setState(await createLink(values));
    }
  });

  const resetField = (field: string) => {
    formik.setValues((prev) => ({
      ...prev,
      [field]: field === 'tag' ? [] : ''
    }));
  }

  const getFirstError = useCallback(
    (field: string) =>
      state &&
      state.errors &&
      field in state.errors &&
      state.errors[field as unknown as number].length
        ? state.errors[field as unknown as number][0]
        : '',
    [state]
  );

  return (
    <Box
      component="form"
      sx={{
        ...style,
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        formik.submitForm();
      }}
      ref={formRef}
    >
      <TextField
        fullWidth
        id="url-field"
        label="Link"
        type="url"
        name="url"
        variant="outlined"
        value={formik.values.url}
        onChange={formik.handleChange}
        required
        aria-required="true"
        multiline
        rows={4}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => resetField('url')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        error={!!getFirstError('url')}
        helperText={getFirstError('url')}
      />

      <TextField
        fullWidth
        name="title"
        id="title-field"
        label="Title"
        variant="outlined"
        error={!!getFirstError('title')}
        helperText={getFirstError('title')}
        value={formik.values.title}
        onChange={formik.handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => resetField('title')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        fullWidth
        name="description"
        id="description-field"
        label="Description"
        variant="outlined"
        value={formik.values.description}
        onChange={formik.handleChange}
        error={!!getFirstError('description')}
        helperText={getFirstError('description')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => resetField('description')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formik.dirty}>Create Link</Button>
      </div>
    </Box>
  );
}

export default AddLinkForm;
