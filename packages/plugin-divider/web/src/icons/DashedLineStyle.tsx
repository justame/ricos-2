import React from 'react';

const DashedLineStyle = props => (
  <svg
    width="126"
    height="1"
    viewBox="0 0 126 1"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line x1="4.5" y1="0.5" x2="121.5" y2="0.5" stroke="currentColor" strokeDasharray="10 10" />
  </svg>
);

export default DashedLineStyle;
