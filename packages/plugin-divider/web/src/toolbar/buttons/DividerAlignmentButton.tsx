import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { alignmentMap } from './dividerButtonsData';
import { DividerData_Width } from 'ricos-schema';

const getDefaultAlignment = langDir => {
  return langDir === 'rtl' ? 'RIGHT' : 'LEFT';
};

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const DividerAlignmentButton: FC<Props> = ({ toolbarItem, dataHook, id }) => {
  const { t, languageDir, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const node = toolbarItem.attributes.selectedNode;
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const getSelectedAlignment: () => string = () =>
    node?.attrs?.alignment || getDefaultAlignment(languageDir);
  const selectedAlignment = getSelectedAlignment();
  const SelectedAlignmentIcon = alignmentMap[`${selectedAlignment}`];
  const isButtonDisabled = node?.attrs?.width === DividerData_Width.LARGE;

  const closeModal = () => modalService.closeModal(id);

  const onAlignmentClick = alignment => {
    toolbarItem.commands?.click({ value: alignment });
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedAlignment,
            onClick: onAlignmentClick,
            closeModal,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  return (
    <DropdownButton
      dataHook={dataHook}
      active={modalService.isModalOpen(id)}
      onClick={onClick}
      disabled={isButtonDisabled}
      setRef={setReferenceElement}
      Icon={SelectedAlignmentIcon}
      tooltip={t('TextAlignmentButton_Tooltip')}
    />
  );
};
