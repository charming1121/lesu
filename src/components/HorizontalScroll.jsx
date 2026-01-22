import React from 'react';

const HorizontalScroll = ({ children }) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-2">{children}</div>
    </div>
  );
};

export default HorizontalScroll;
