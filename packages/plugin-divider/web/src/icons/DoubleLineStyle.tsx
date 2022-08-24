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
    <line x1="0.5" y1="0.5" x2="117.5" y2="0.5" stroke="black" />
    <line x1="0.5" y1="5.5" x2="117.5" y2="5.5" stroke="black" />
  </svg>
);

export default DoubleLineStyle;
