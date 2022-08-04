import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import { galleryLayoutsData } from './galleryLayoutsData';

type Props = {
  getSelectedLayout: () => number;
  onClick: (commandKey: number) => void;
};

const GalleryLayoutPanel: React.FC<Props> = ({ getSelectedLayout, onClick }) => {
  const { t } = useContext(RicosContext) || {};

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = galleryLayoutsData.map(({ dataHook, icon: Icon, text, commandKey }) => (
    <ListItemSelect
      key={commandKey}
      dataHook={dataHook}
      prefix={<Icon />}
      title={t(text)}
      selected={commandKey === getSelectedLayout()}
      onClick={() => onClick(commandKey)}
      onKeyDown={e => {
        onKeyDown(e, commandKey);
      }}
    />
  ));

  return <DropdownModal options={DropdownOptions} />;
};

export default GalleryLayoutPanel;
