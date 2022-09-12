import React from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import { BORDER_TYPES } from '../../consts';
import { BorderIcon, BorderOutsideIcon } from '../../icons';
import type { bordersType } from '../../types';

type Props = {
  getSelectedStyle: () => string;
  onClick: (type: bordersType) => void;
};

const BorderPanel: React.FC<Props> = ({ onClick }) => {
  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = [
    <ListItemSelect
      key={'border'}
      dataHook={'border-color-around'}
      prefix={<BorderOutsideIcon />}
      onClick={() => onClick(BORDER_TYPES.outsideBorders)}
      onKeyDown={e => {
        onKeyDown(e, BORDER_TYPES.outsideBorders);
      }}
    />,
    <ListItemSelect
      key={'outsideBorder'}
      dataHook={'border-color-all'}
      prefix={<BorderIcon />}
      onClick={() => onClick(BORDER_TYPES.borders)}
      onKeyDown={e => {
        onKeyDown(e, BORDER_TYPES.borders);
      }}
    />,
  ];

  return <DropdownModal options={DropdownOptions} />;
};

export default BorderPanel;
