import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal, ListItemSection } from 'wix-rich-content-toolbars-ui';
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

  const onKeyDown = (e, onClick) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick();
      e.stopPropagation();
    }
  };

  const CustomizeButton = (
    <>
      <ListItemSection type={'divider'} />
      <ListItemSelect
        title={t('Poll_Mobile_Editor_Toolbar_Customize')}
        onClick={onCustomizeButtonClick}
        dataHook={'poll_layout_modal_button'}
        onKeyDown={e => onKeyDown(e, onCustomizeButtonClick)}
      />
    </>
  );

  const LayoutButtons = layoutData.map(({ dataHook, icon: Icon, text, commandKey }) => {
    const onButtonClick = () => onClick(commandKey);
    return (
      <ListItemSelect
        key={commandKey}
        title={t(text)}
        dataHook={dataHook}
        prefix={<Icon />}
        selected={commandKey === getSelectedLayout()}
        onClick={onButtonClick}
        onKeyDown={e => onKeyDown(e, onButtonClick)}
      />
    );
  });

  const DropdownOptions = [...LayoutButtons, CustomizeButton];

  return <DropdownModal options={DropdownOptions} />;
};

export default LineStylePanel;
