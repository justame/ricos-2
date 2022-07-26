import React from 'react';
import { ContextMenuIcon } from '../../../icons';
import { ToolbarButton } from '../ToolbarButton';

const MoreButton = ({ onClick, showMore }) => {
  return <ToolbarButton active={showMore} onClick={onClick} icon={() => <ContextMenuIcon />} />;
};

export default MoreButton;
