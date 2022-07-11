import React, { useContext } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import DesignIcon from '../assets/icons/DesignIcon';

type Props = {
  toolbarItem: IToolbarItem;
};

export const PollDesignButton: FC<Props> = ({ toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const node = toolbarItem.attributes.selectedNode;

  return (
    <ToggleButton
      Icon={DesignIcon}
      onClick={() => toolbarItem.commands?.click({ modalService, isMobile, node })}
      dataHook="baseToolbarButton_design"
      tooltip={t('Poll_PollSettings_Tab_Design_TabName')}
    />
  );
};
