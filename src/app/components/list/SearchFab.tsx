'use client';

import { useState } from 'react';
import { Fab, Popper, Zoom } from '@mui/material';
import SearchBar from '@/app/components/SearchBar';
import { SearchOutlined, CloseOutlined } from '@mui/icons-material';
import { grey, red } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

function SearchFab() {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl ? event.currentTarget : null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'search-popover' : undefined;

  return (
    <>
      <Fab variant={'circular'}
        sx={{ color: open ? red[500] : grey[800] }}
        className={clsx("!fixed bottom-20 right-4", { 'bottom-20': isMobile, 'bottom-24': !isMobile })}
        onClick={handleClick}
        size={isMobile ? 'medium' : 'large'}
      >
        {open ? <CloseOutlined /> : <SearchOutlined />}
      </Fab>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="top-end"
        transition
        sx={{
          width: '100%',
          display: 'inline-flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {({ TransitionProps }) => (
          <Zoom {...TransitionProps}>
            <div className="contents">
              <SearchBar autoFocus extraClasses="!mt-0 mb-2 px-4" />
            </div>
          </Zoom>
        )}
      </Popper>
    </>
  )
}

export default SearchFab;
