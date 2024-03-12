'use client';

import { useState } from 'react';
import { Box, ClickAwayListener, Fab } from '@mui/material';
import SearchBar from '@/app/components/SearchBar';
import { SearchOutlined, CloseOutlined } from '@mui/icons-material';
import { grey, red } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

const openClasses = {
  color: red[500],
  boxShadow: 'none',
};

const desktopOpenClasses = {
  // borderRadius: 0,
};

const desktopClasses = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};

const boxSxOpen = {
  backgroundColor: grey[300],
  width: '85%',
  borderTopLeftRadius: '50px',
  borderBottomLeftRadius: '50px',
};

const fieldSx = {
  '> .MuiInputBase-root': {
    borderWidth: 0,
    borderRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: '50px',
    borderBottomLeftRadius: '50px',
  },
};

function SearchFab({ fromPublic }: { fromPublic?: boolean }) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(!anchorEl ? event.currentTarget : null);
  };

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box
        className={clsx(
          '!fixed flex items-center justify-end pl-1 max-w-[640px] w-fit transition-all',
          {
            'rounded-tl-[50px] rounded-bl-[50px]': open,
            'rounded-tr-[50px] rounded-br-[50px] right-4': isMobile,
            'top-14 right-0': !isMobile,
            'bottom-20': isMobile && !fromPublic,
            'bottom-5': isMobile && fromPublic,
          }
        )}
        sx={{ ...(open ? boxSxOpen : {}) }}
      >
        {open ? (
          <SearchBar
            autoFocus
            classes={clsx('!mt-0 rounded-lg')}
            sx={fieldSx}
          />
        ) : null}
        <Fab
          variant={'circular'}
          sx={{
            color: grey[800],
            ...(!isMobile ? desktopClasses : {}),
            ...(open ? openClasses : {}),
            ...(open && !isMobile ? desktopOpenClasses : {}),
          }}
          onClick={handleClick}
          size={'medium'}
        >
          {open ? <CloseOutlined /> : <SearchOutlined />}
        </Fab>
      </Box>
    </ClickAwayListener>
  );
}

export default SearchFab;
