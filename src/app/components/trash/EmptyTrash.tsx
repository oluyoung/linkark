import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function EmptyTrash({ query }: { query: string; }) {
  return (
    <div className="h-full flex flex-col justify-center items-center" id="empty-links">
      <div className="mb-4 text-red-500">
        <DeleteOutlinedIcon
          color="inherit"
          sx={{ width: '75px', height: '75px' }}
        />
      </div>
      <p className="text-gray-600">{!query ? 'No links in trash' : `There are no links in trash that match: ${query}`}</p>
    </div>
  );
}

export default EmptyTrash;
