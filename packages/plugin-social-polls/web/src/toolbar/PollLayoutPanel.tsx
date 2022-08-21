import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import { layoutData } from './PollButtonsData';

type Props = {
  getSelectedLayout: () => string;
  onClick: (commandKey: string) => void;
  onCustomizeButtonClick: () => void;
};

const LineStylePanel: React.FC<Props> = ({
  getSelectedLayout,
  onClick,
  onCustomizeButtonClick,
}) => {
  const { t } = useContext(RicosContext) || {};

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = layoutData.map(
    ({ dataHook, icon: Icon, commandKey, text, component: Component }) =>
      Component ? (
        <Component text={t(text)} onClick={onCustomizeButtonClick} />
      ) : (
        <ListItemSelect
          key={commandKey}
          title={t(text)}
          dataHook={dataHook}
          prefix={<Icon />}
          selected={commandKey === getSelectedLayout()}
          onClick={() => onClick(commandKey)}
          onKeyDown={e => {
            onKeyDown(e, commandKey);
          }}
        />
      )
  );

  return <DropdownModal options={DropdownOptions} />;
};

export default LineStylePanel;
