'use client';

import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import {
  createLink,
  State,
  Fields
} from '@/app/lib/actions/links.actions';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

export const StyledForm = styled((props: BoxProps) => (
  <Box
    component="form"
    noValidate
    autoComplete="off"
    {...props}
  />
))(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 640,
  backgroundColor: theme.palette.common.white,
  border: '2px solid #000',
  boxShadow: theme.shadows[24],
  padding: theme.spacing(6, 4, 4),
  borderRadius: 5,
  '& > :not(style)': { m: 1 },
}));

const AddLinkForm = ({ onClose }: { onClose: () => void }) => {
  const [state, setState] = useState<State>({});
  const dispatch = useAppDispatch();

  const formik = useFormik<Fields>({
    initialValues: {
      url: '',
      title: '',
      description: '',
      tags: []
    },
    onSubmit: (values) => {
      createLink(values).then((res) => {
        if (res.success) {
          dispatch(showToast({
            severity: 'success',
            message: 'Link created successfully.',
            id: 'create-link-snackbar'
          }));
          onClose();
        }
        if (res.errors) setState(res);
      }).catch((error) => {
        dispatch(showToast({
          severity: 'error',
          message: 'Could not create the link, please try again.',
          id: 'create-link-snackbar',
          error
        }));
      });
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
    <StyledForm
      onSubmit={e => {
        e.preventDefault();
        formik.submitForm();
      }}
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
        rows={1}
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
        sx={{
          mb: 4
        }}
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
          startAdornment: (
            <InputAdornment position="start">
              <ViewStreamOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => resetField('title')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          mb: 4
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
        multiline
        rows={4}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubtitlesOutlinedIcon />
            </InputAdornment>
          ),
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
    </StyledForm>
  );
}

export default AddLinkForm;
