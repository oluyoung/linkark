import React from 'react'
import { Fab } from '@mui/material';
import SearchBar from '@/app/components/SearchBar';
import { SearchOutlined } from '@mui/icons-material';

function SearchFab() {
  return (
    <>
      <Fab>
        <SearchOutlined />
      </Fab>
      {/* <SearchBar /> */}
    </>
  )
}

export default SearchFab;
