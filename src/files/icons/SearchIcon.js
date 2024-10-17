import React from 'react';

function SearchIcon({ selectedColor }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={selectedColor} // Dynamic color fill
      width="20px" 
      height="20px"
    >
      <path d="M10 2a8 8 0 105.293 14.707l4.914 4.914a1 1 0 001.414-1.414l-4.914-4.914A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    </svg>
  );
}

export default SearchIcon;
