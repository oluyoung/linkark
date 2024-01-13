'use client';

import { useCallback } from 'react';
import { useFormState } from 'react-dom';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { createLink } from '@/app/lib/actions/links.actions';
import LinkIcon from '@mui/icons-material/Link';

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

  const [state, dispatch] = useFormState(createLink, initialState);

  const getFirstError = useCallback(
    (field: string) =>
      state.errors &&
      field in state.errors &&
      state.errors[field as unknown as number].length
        ? state.errors[field as unknown as number][0]
        : '',
    [state.errors]
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
      action={dispatch}
    >
      <TextField
        fullWidth
        id="url-field"
        label="Link"
        type="url"
        name="url"
        variant="outlined"
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
      />
      <TextField
        fullWidth
        name="description"
        id="description-field"
        label="Description"
        variant="outlined"
        error={!!getFirstError('description')}
        helperText={getFirstError('description')}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Link</Button>
      </div>
    </Box>
  );
}

export default AddLinkForm;
