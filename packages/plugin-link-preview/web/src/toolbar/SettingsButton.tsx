import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { PluginSettingsIcon } from 'wix-rich-content-plugin-commons';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

export const LinkPreviewSettingsButton: FC<Props> = ({ toolbarItem, dataHook }) => {
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
      dataHook={dataHook}
      tooltip={t('LinkPreview_Settings_Tooltip')}
      setRef={setReferenceElement}
    />
  );
};
