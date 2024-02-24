'use client';

import React, { useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SearchOutlined, Clear } from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '> .MuiInputBase-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: '50px',
    border: 0,
  },
}));

const SearchBar = ({ placeholder }: { placeholder?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery('(max-width:1024px)');

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;

      const params = new URLSearchParams(searchParams);
      if (term) params.set('query', term);
      else params.delete('query');

      replace(`${pathname}?${params.toString()}`);
    }
  );

  const clear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    replace(`${pathname}?${params.toString()}`);
    inputRef.current && (inputRef.current.value = '');
  };

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={clsx('flex flex-col flex-nowrap items-center mt-10 w-full', { 'mt-4': isMobile, 'mt-16': !isMobile })}
      id="search-bar"
    >
      <div className="max-w-screen-sm w-full overflow-x-hidden">
        <StyledSearchField
          fullWidth
          placeholder={placeholder || 'Search links...'}
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
            ) : null,
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
