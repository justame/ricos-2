import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import type { PluginContainerData_Alignment } from 'ricos-schema';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { alignmentsMap, defaultAlignments } from '../../buttons/NodeAlignmentButton/consts';
import { ListItemSelect } from '../ListItem';
import DropdownModal from './DropdownModal';

type Props = {
  getSelectedAlignment: () => string;
  onClick: (commandKey: string) => void;
  options?: PluginContainerData_Alignment[];
};

const AlignmentPanel: React.FC<Props> = ({ getSelectedAlignment, onClick, options }) => {
  const { t } = useContext(RicosContext) || {};
  const OPTIONS = options ? options.map(option => alignmentsMap[option]) : defaultAlignments;

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = OPTIONS.map(({ dataHook, icon: Icon, text, commandKey, tooltip }) => (
    <ListItemSelect
      key={commandKey}
      dataHook={dataHook}
      prefix={<Icon />}
      title={t(text)}
      selected={commandKey === getSelectedAlignment()}
      tooltip={t(tooltip)}
      onKeyDown={e => {
        onKeyDown(e, commandKey);
      }}
      onClick={() => onClick(commandKey)}
    />
  ));

  return <DropdownModal options={DropdownOptions} />;
};

export default AlignmentPanel;
