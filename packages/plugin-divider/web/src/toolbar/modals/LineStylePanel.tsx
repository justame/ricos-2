import React from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import { dividerStyleData } from '../buttons/dividerButtonsData';

type Props = {
  getSelectedStyle: () => string;
  onClick: (commandKey: string) => void;
};

const LineStylePanel: React.FC<Props> = ({ getSelectedStyle, onClick }) => {
  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = dividerStyleData.map(({ dataHook, icon: Icon, commandKey }) => (
    <ListItemSelect
      key={commandKey}
      dataHook={dataHook}
      prefix={<Icon />}
      selected={commandKey === getSelectedStyle()}
      onClick={() => onClick(commandKey)}
      onKeyDown={e => {
        onKeyDown(e, commandKey);
      }}
    />
  ));

  return <DropdownModal options={DropdownOptions} />;
};

export default LineStylePanel;
