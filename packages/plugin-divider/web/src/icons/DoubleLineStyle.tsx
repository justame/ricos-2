import React from 'react';

const DoubleLineStyle = props => (
  <svg
    width="118"
    height="12"
    viewBox="0 0 118 6"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line x1="0.5" y1="0.5" x2="117.5" y2="0.5" stroke="currentColor" />
    <line x1="0.5" y1="8.5" x2="117.5" y2="8.5" stroke="currentColor" />
  </svg>
);

export default DoubleLineStyle;
