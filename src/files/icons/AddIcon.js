import React from 'react';

function AddIcon({ selectedColor }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={selectedColor} // Dynamic color fill
      width="19px" 
      height="19px"
    >
      <path d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" />
    </svg>
  );
}

export default AddIcon;
