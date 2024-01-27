import LinkIcon from '@mui/icons-material/Link';

function EmptyLinks({ query }: { query: string }) {
  return (
    <div
      className="h-full flex flex-col justify-center items-center"
      id="empty-links"
    >
      <div className="mb-4 text-blue-500">
        <LinkIcon
          color="inherit"
          sx={{ width: '75px', height: '75px', transform: 'rotate(-30deg)' }}
        />
      </div>
      <p className="text-gray-600">
        {!query ? 'No links saved yet' : 'None of your links match this query'}
      </p>
      <p className="text-gray-600">
        Click on the &apos;+&apos; below to add a link
      </p>
    </div>
  );
}

export default EmptyLinks;
