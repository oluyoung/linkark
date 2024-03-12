'use client';

import {
  Stack,
  Typography,
  useMediaQuery,
  Breadcrumbs,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Chip,
} from '@mui/material';
import { useState } from 'react';
import NextLink from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import FaceIcon from '@mui/icons-material/Face';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreMenuButton from './MoreMenuButton';
import { format } from 'date-fns';
import { ListWithUser } from '@/app/lib/actions/lists.actions';

function ListTitle({ list, fromPublic }: { list: ListWithUser, fromPublic?: boolean }) {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack
      spacing={2}
      sx={{ pt: 2, position: !isMobile ? 'absolute' : '', left: 25 }}
    >
      {!isMobile ? (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <NextLink key={1} href={fromPublic ? '/lists' : "/home/lists"}>
            Lists
          </NextLink>
          <Typography key={2} color="text.primary">
            {list.name}
          </Typography>
        </Breadcrumbs>
      ) : (
        <Accordion
          expanded={expanded}
          sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}
        >
          <AccordionSummary
            expandIcon={
              <IconButton onClick={() => setExpanded(!expanded)}>
                <ExpandMoreIcon />
              </IconButton>
            }
            id="open-list-info"
            aria-controls="open-list-summary"
            sx={{
              p: 0,
              '&.Mui-focusVisible': {
                backgroundColor: 'transparent',
                cursor: 'default',
              },
              '& > .MuiAccordionSummary-content.Mui-expanded': {
                m: 0,
              },
            }}
          >
            <Typography component="h1" variant="body1">
              {list.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={(theme) => ({
              p: 1.5,
              backgroundColor: theme.palette.grey[200],
            })}
          >
            {list.description ? (
              <Typography id="list-description" variant="subtitle2">
                {list.description}
              </Typography>
            ) : null}
            <div className="flex items-center">
              {fromPublic ? (<span className="inline-block mr-2">
                {list.isPublic ? (
                  <LockOpenIcon fontSize="small" />
                ) : (
                  <LockIcon fontSize="small" />
                )}
              </span>) : null}
              {!list.isPublic ? (
                <span className="inline-block mr-4">
                  <Chip
                    icon={<FaceIcon />}
                    label={list.creator.name}
                    variant="outlined"
                    size="small"
                  />
                </span>
              ) : null}
              <span className="inline-block mr-4">
                <Chip
                  icon={<RssFeedIcon />}
                  label={40}
                  variant="outlined"
                  size="small"
                />
              </span>
              <span className="inline-block">
                <Chip
                  icon={<AccessTimeIcon />}
                  label={format(list.updatedAt, 'dd MMM yy')}
                  variant="outlined"
                  size="small"
                />
              </span>
              {!fromPublic ? (
              <span className="inline-block">
                <MoreMenuButton list={list} />
              </span>) : null}
            </div>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}

export default ListTitle;
