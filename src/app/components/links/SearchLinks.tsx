'use client';

import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SearchOutlined, Clear } from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const StyledSearchField = styled(TextField)((({ theme }) => ({
  '> .MuiInputBase-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
    border: 0
  }
})));

function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (term) params.set('query', term);
    else params.delete('query');

    replace(`${pathname}?${params.toString()}`);
  });

  const clear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    replace(`${pathname}?${params.toString()}`);
    inputRef.current && (inputRef.current.value = '');
  }

  return (
    <div className="flex flex-col flex-nowrap items-center pt-10 w-full" id="search-bar">
      <div className="max-w-screen-sm w-full overflow-x-hidden py-4 px-4">
        <StyledSearchField
          fullWidth
          placeholder="Search links..."
          id="search-field"
          label={null}
          variant="outlined"
          size="small"
          onChange={handleSearch}
          defaultValue={searchParams.get('query')?.toString()}
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
            endAdornment: searchParams.get('query')?.toString() ? (
              <InputAdornment position="end">
                <IconButton onClick={clear}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      </div>
    </div>
  );
}

export default SearchInput;