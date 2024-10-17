import React from 'react';

function BellIcon({ selectedColor }) {
  return (
    <svg
      className="App-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={selectedColor} /* Dynamic color fill */
    >
      <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm7-5v-8c0-3.39-2.302-6.222-5.5-7v-.5c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5 1.5v.5c-3.198.778-5.5 3.61-5.5 7v8l-2 2v1h16v-1l-2-2zm-2-.994v.994h-10v-.994l1.004-.992h7.992l1.004.992z" />
    </svg>
  );
}

export default BellIcon;
