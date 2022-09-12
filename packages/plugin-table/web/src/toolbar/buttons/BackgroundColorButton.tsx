import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import { BGColorIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { TABLE_COLOR_PICKER } from '../../consts';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const BackgroundColorButton: FC<Props> = ({ dataHook, toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const currentColor = toolbarItem.attributes?.cellBackgroundColor || 'transparent';

  const closeModal = () => modalService.closeModal(TABLE_COLOR_PICKER);
  const resetColor = () => onChange('transparent');
  const onChange = backgroundColor => {
    toolbarItem.commands.click({ backgroundColor });
    closeModal();
  };

  return (
    <div ref={setReferenceElement}>
      <ToggleButton
        Icon={BGColorIcon}
        onClick={() => {
          const isModalOpen = modalService.isModalOpen(TABLE_COLOR_PICKER);
          !isModalOpen
            ? modalService.openModal(TABLE_COLOR_PICKER, {
                componentProps: { closeModal, onChange, currentColor, resetColor },
                positioning: { placement: 'bottom', referenceElement },
                layout: isMobile ? 'drawer' : 'toolbar',
              })
            : closeModal();
        }}
        dataHook={dataHook}
        tooltip={t('TablePlugin_Toolbar_BGColor_Tooltip')}
      />
    </div>
  );
};

export default BackgroundColorButton;
