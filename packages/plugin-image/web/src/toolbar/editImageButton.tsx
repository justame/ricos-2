import React, { useContext } from 'react';
import type { FC } from 'react';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { RicosContext, ModalContext } from 'ricos-context';
import { EditImageIcon } from '../icons';
import type { IToolbarItem } from 'ricos-types';

interface Props {
  toolbarItem: IToolbarItem;
}

const ImageEditorButton: FC<Props> = ({ toolbarItem }) => {
  const modalService = useContext(ModalContext) || {};
  const { isMobile, t } = useContext(RicosContext) || {};

  const onClick = toolbarItem.commands.click;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node = (toolbarItem.attributes as Record<string, any>).selectedNode;

  const nodeId = node?.attrs.id;
  const src = node?.attrs.image?.src.id;

  return (
    <ToggleButton
      Icon={EditImageIcon}
      onClick={() => onClick({ modalService, isMobile, nodeId, src })}
      dataHook="imageToolbarButton_image_editor"
      tooltip={t('ImageEditorButton_Tooltip')}
      disabled={!src}
    />
  );
};

export default ImageEditorButton;
