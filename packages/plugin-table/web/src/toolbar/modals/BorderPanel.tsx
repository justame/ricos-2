import React from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import { BorderIcon, BorderOutsideIcon } from '../../icons';

type Props = {
  getSelectedStyle: () => string;
  onClick: (data: { borders?: string; outsideBorders?: string }) => void;
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
      onClick={() => onClick({ outsideBorders: 'green' })}
      onKeyDown={e => {
        onKeyDown(e, 'red');
      }}
    />,
    <ListItemSelect
      key={'outsideBorder'}
      dataHook={'border-color-all'}
      prefix={<BorderIcon />}
      onClick={() => onClick({ borders: 'red' })}
      onKeyDown={e => {
        onKeyDown(e, 'red');
      }}
    />,
  ];

  return <DropdownModal options={DropdownOptions} />;
};

export default BorderPanel;
