import React, { useContext } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal, ListItemSection } from 'wix-rich-content-toolbars-ui';
import { galleryModals } from '../consts';
import { galleryLayoutsData } from './galleryLayoutsData';

type Props = {
  getSelectedLayout: () => number;
  onClick: (commandKey: number) => void;
  onCustomizeButtonClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFileSelection: (node: any) => void;
  handleFileUpload: () => void;
  accept: string;
  activeTab: string;
};

const GalleryLayoutPanel: React.FC<Props> = ({
  getSelectedLayout,
  onClick,
  node,
  handleFileSelection,
  handleFileUpload,
  accept,
  activeTab,
}) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);

  const onKeyDown = (e, onClick) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick();
      e.stopPropagation();
    }
  };

  const onCustomizeButtonClick = () => {
    modalService?.openModal(galleryModals.settings, {
      componentProps: {
        nodeId: node?.attrs?.id,
        handleFileSelection: () => handleFileSelection(node),
        handleFileUpload,
        accept,
        activeTab,
      },
      positioning: { placement: 'right' },
      layout: isMobile ? 'fullscreen' : 'drawer',
    });
  };

  const CustomizeButton = (
    <>
      <ListItemSection type={'divider'} />
      <ListItemSelect
        title={t('GalleryPlugin_Layouts_Customize_Button')}
        onClick={onCustomizeButtonClick}
        onKeyDown={e => onKeyDown(e, onCustomizeButtonClick)}
      />
    </>
  );

  const LayoutButtons = galleryLayoutsData.map(({ dataHook, icon: Icon, text, commandKey }) => {
    const onButtonClick = () => onClick(commandKey);
    return (
      <ListItemSelect
        key={commandKey}
        dataHook={dataHook}
        prefix={<Icon />}
        title={t(text)}
        selected={commandKey === getSelectedLayout()}
        onClick={onButtonClick}
        onKeyDown={e => onKeyDown(e, onButtonClick)}
      />
    );
  });

  const DropdownOptions = [...LayoutButtons, CustomizeButton];

  return <DropdownModal options={DropdownOptions} />;
};

export default GalleryLayoutPanel;
