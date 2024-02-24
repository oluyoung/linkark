'use client';

import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import {
  createList,
  updateList,
  State,
  Fields,
} from '@/app/lib/actions/list.actions';
import ClearIcon from '@mui/icons-material/Clear';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/toastSlice';
import { ListSchema } from '@/app/lib/actions/schemas';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { StyledForm } from '../links/AddLinkForm';
import { List } from '@prisma/client';
import { grey } from '@mui/material/colors';

const ListForm = ({
  createMode,
  list,
  onClose,
}: {
  createMode: boolean;
  list?: List;
  onClose: () => void;
}) => {
  const [state, setState] = useState<State>({});
  const dispatch = useAppDispatch();

  const formik = useFormik<Fields>({
    initialValues: {
      name: list?.name || '',
      description: list?.description || '',
      isPublic: list?.isPublic || false,
    },
    validationSchema: toFormikValidationSchema(ListSchema),
    onSubmit: (values) => {
      (createMode ? createList(values) : updateList(values, list?.id || ''))
        .then(() => {
          dispatch(
            showToast({
              severity: 'success',
              message: `List ${createMode ? 'created' : 'updated'} successfully.`,
              id: `${createMode ? 'create' : 'update'}-list-snackbar`,
            })
          );
          onClose && onClose();
        })
        .catch((error) => {
          if (error.errors) setState(error.errors);
          dispatch(
            showToast({
              severity: 'error',
              message: `Could not ${createMode ? 'create' : 'update'} the list, please try again.`,
              id: `${createMode ? 'create' : 'update'}-list-snackbar`,
              error,
            })
          );
        });
    },
  });

  const resetField = (field: string) => {
    formik.setValues((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const getFirstError = useCallback(
    (field: string) => {
      const stateError =
        state &&
        state.errors &&
        field in state.errors &&
        state.errors[field as unknown as number].length
          ? state.errors[field as unknown as number][0]
          : '';
      return formik.errors[field] || stateError;
    },
    [state, formik.errors]
  );

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        formik.submitForm();
      }}
    >
      <Typography component="h1" variant="h6" mb={2}>{createMode ? 'Add a new' : 'Edit'} list</Typography>
      <TextField
        fullWidth
        name="name"
        id="name-field"
        label="Name"
        variant="outlined"
        error={!!getFirstError('name')}
        helperText={getFirstError('name')}
        value={formik.values.name}
        onChange={formik.handleChange}
        required
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ViewStreamOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => resetField('name')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
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
        size="small"
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
          ),
        }}
        sx={{
          mb: 2,
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.isPublic}
            onChange={formik.handleChange}
            inputProps={{ 'aria-label': 'list-isPublic' }}
            id="list-isPublic"
            name="isPublic"
            sx={{
              color: grey[600],
              '&.Mui-checked': {
                color: grey[800],
              },
            }}
          />
        }
        label="Share list with public"
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!formik.dirty}>
          Save
        </Button>
      </div>
    </StyledForm>
  );
};

export default ListForm;
