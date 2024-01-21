'use client';

import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Modal
} from '@mui/material';
import {
  updateLink,
  State,
  Fields
} from '@/app/lib/actions/links.actions';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import { Link } from '@prisma/client';
import { StyledForm } from './AddLinkForm';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';

interface Props {
  open: boolean;
  link: Link
  onClose: () => void;
}

const EditLinkForm = ({ open, onClose, link }: Props) => {
  const [state, setState] = useState<State>({});
  const dispatch = useAppDispatch();

  const formik = useFormik<Fields>({
    initialValues: {
      url: link.rawUrl,
      title: link.title || link.ogTitle || '',
      description: link.description || link.ogDescription || '',
      tags: []
    },
    onSubmit: async (values) => {
      updateLink(link.id, values).then((res) => {
        if (res.success) {
          dispatch(showToast({
            severity: 'success',
            message: 'Link updated successfully.',
            id: 'update-link-snackbar'
          }));
          onClose();
        }
        if (res.errors) setState(res);
      }).catch((error) => {
        dispatch(showToast({
          severity: 'error',
          message: 'Could not update this link, please try again.',
          id: 'update-link-snackbar',
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-link-modal-title"
      aria-describedby="edit-link-modal-description"
    >
      <div className="contents">
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
            <Button type="submit" disabled={!formik.dirty}>Update Link</Button>
          </div>
        </StyledForm>
      </div>
    </Modal>
  );
}

export default EditLinkForm;
