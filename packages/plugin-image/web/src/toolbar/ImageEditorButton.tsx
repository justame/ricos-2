import React, { useContext } from 'react';
import type { FC } from 'react';
import { ToggleButton, EditIcon } from 'wix-rich-content-toolbars-ui';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const ImageEditorButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t } = useContext(RicosContext) || {};

  const onClick = toolbarItem.commands.click;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node = (toolbarItem.attributes as Record<string, any>).selectedNode;

  const src = node?.attrs.image?.src?.id;

  return (
    <ToggleButton
      Icon={EditIcon}
      onClick={() => onClick({ src })}
      dataHook={dataHook}
      tooltip={t('ImageEditorButton_Tooltip')}
      disabled={!src}
    />
  );
};

export default ImageEditorButton;
