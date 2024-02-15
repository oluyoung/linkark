'use client';
import { Typography, Breadcrumbs } from '@mui/material';
import { List } from '@prisma/client';
import NextLink from 'next/link';

export default function ListBreadCrumbs ({ list }: { list: List; }) {

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <NextLink key={1} href="/home/lists">
        Lists
      </NextLink>
      <Typography key={2} color="text.primary">
        {list.name}
      </Typography>
    </Breadcrumbs>
  )
}