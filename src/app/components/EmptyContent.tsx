import React from 'react';
import clsx from 'clsx';

interface Props {
  query: string;
  Icon: React.ElementType;
  noItemText: string;
  noMatchedQueryText: string;
  addText?: string;
  id: string;
  iconClass?: string;
  iconRotateDeg?: string;
}

function EmptyContent({
  query,
  Icon,
  noItemText,
  noMatchedQueryText,
  addText,
  id,
  iconClass,
  iconRotateDeg,
}: Props) {
  return (
    <div className="h-full flex flex-col justify-center items-center" id={id}>
      <div className={clsx('mb-4', iconClass || 'text-blue-500')}>
        <Icon
          color="inherit"
          sx={{
            width: '75px',
            height: '75px',
            ...(iconRotateDeg ? { transform: `rotate(${iconRotateDeg})` } : {}),
          }}
        />
      </div>
      <p className="text-gray-600">
        {!query ? noItemText : noMatchedQueryText}
      </p>
      {addText && <p className="text-gray-600">{addText}</p>}
    </div>
  );
}

export default EmptyContent;
