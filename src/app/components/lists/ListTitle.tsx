'use client';

import { Stack, Typography, useMediaQuery, Breadcrumbs, Fab } from '@mui/material';
import NextLink from 'next/link';
import { List } from '@prisma/client';
import { InfoOutlined } from '@mui/icons-material';

function ListTitle({ list }: { list: List }) {
  const isMobile = useMediaQuery('(max-width:1024px)');

  return (
    <Stack spacing={2} sx={{ pt: 2, position: !isMobile ? 'absolute' : '', left: 25 }}>
      {!isMobile ? (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <NextLink key={1} href="/home/lists">
            Lists
          </NextLink>
          <Typography key={2} color="text.primary">
            {list.name}
          </Typography>
        </Breadcrumbs>
      ) : (
        <Typography component="h1" variant="body1">{list.name}</Typography>
      )}
      {list.description ? <Typography>{list.description}</Typography> : null}
      <Fab sx={{ display: 'none', position: 'absolute', bottom: 0, left: 0 }}>
        <InfoOutlined />
      </Fab>
    </Stack>
  );
}

export default ListTitle;
