/* eslint-disable max-len */
import React from 'react';

const ColorsIcon = props => {
  const { colors } = props;
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Group</title>
      <g id="📟--Specs-for-devs" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Icons" transform="translate(-123.000000, -57.000000)">
          <g id="Group" transform="translate(123.000000, 57.000000)">
            <circle
              id="Oval-Copy-7"
              stroke="#C9C9C9"
              cx="12"
              cy="12"
              r="11.5"
              fill={colors['background-color'] || 'white'}
            />
            <path
              d="M8.73879454,16.5308689 L9.85879454,13.5208689 L14.0867945,13.5208689 L15.1787945,16.5308689 L16.6487945,16.5308689 L12.7427945,6.53486888 L11.2727945,6.53486888 L7.38079454,16.5308689 L8.73879454,16.5308689 Z M13.6667945,12.4008689 L10.2787945,12.4008689 L11.9727945,7.73886888 L12.0007945,7.73886888 L13.6667945,12.4008689 Z"
              id="A"
              fill={colors.color || '#000000'}
              fillRule="nonzero"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default ColorsIcon;
