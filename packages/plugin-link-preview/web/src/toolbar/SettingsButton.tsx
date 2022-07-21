import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { PluginSettingsIcon } from 'wix-rich-content-plugin-commons';

type Props = {
  toolbarItem: IToolbarItem;
};

export const LinkPreviewSettingsButton: FC<Props> = ({ toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const node = toolbarItem.attributes.selectedNode;
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  return (
    <ToggleButton
      Icon={PluginSettingsIcon}
      onClick={() =>
        toolbarItem.commands?.click({ modalService, isMobile, node, referenceElement })
      }
      dataHook="LinkButton"
      tooltip={t('LinkPreview_Settings_Tooltip')}
      setRef={setReferenceElement}
    />
  );
};
