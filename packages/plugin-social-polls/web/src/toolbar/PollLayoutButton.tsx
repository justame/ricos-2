import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton } from 'wix-rich-content-toolbars-ui';
import { LayoutGridIcon } from '../assets/icons';
import { pollModals } from '../consts';
import PollSettingsModal from '../components/modals/SettingsModal';
import { layoutData } from './PollButtonsData';
import { TABS } from '../components/settings';

type Props = {
  toolbarItem: IToolbarItem;
  id: string;
  dataHook?: string;
};

export const PollLayoutButton: FC<Props> = ({ toolbarItem, id, dataHook }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const node = toolbarItem.attributes.selectedNode;
  const getSelectedLayout: () => string = () => node?.attrs?.layout?.poll?.type || 'GRID';
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const closeModal = () => modalService.closeModal(id);
  const selectedLayout = layoutData.find(({ commandKey }) => commandKey === getSelectedLayout());
  const Icon = selectedLayout?.icon || LayoutGridIcon;
  const label = selectedLayout?.text || 'Poll_PollSettings_Tab_Layout_Section_Answers_Layout_Grid';

  const onLayoutClick = layout => {
    toolbarItem.commands?.click({ layout, node });
    closeModal();
  };

  const onCustomizeButtonClick = () => {
    modalService?.openModal(pollModals.settings, {
      componentProps: {
        nodeId: toolbarItem.attributes.selectedNode.attrs.id,
        activeTab: TABS.LAYOUT,
      },
      positioning: { placement: 'right' },
      layout: isMobile ? 'fullscreen' : 'drawer',
    });
    closeModal();
  };

  const onClick = () => {
    modalService.isModalOpen(id)
      ? closeModal()
      : modalService?.openModal(id, {
          componentProps: {
            getSelectedLayout,
            onClick: onLayoutClick,
            onCustomizeButtonClick,
            closeModal,
          },
          layout: isMobile ? 'drawer' : 'toolbar',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  useEffect(() => {
    !modalService.getModal(pollModals.layout) &&
      modalService.register({
        Component: PollSettingsModal,
        id: pollModals.layout,
      });
  }, []);

  return (
    <DropdownButton
      dataHook={dataHook}
      onClick={onClick}
      setRef={setReferenceElement}
      Icon={() => <Icon width={15} />}
      label={t(label)}
      tooltip={t('Poll_PollSettings_Tab_Layout_TabName')}
    />
  );
};
