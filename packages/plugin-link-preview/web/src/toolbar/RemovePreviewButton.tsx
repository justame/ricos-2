import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { RemovePreviewIcon } from '../icons';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

export const RemovePreviewButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const { t } = useContext(RicosContext) || {};

  return (
    <ToggleButton
      Icon={RemovePreviewIcon}
      onClick={() => toolbarItem.commands?.click()}
      dataHook={dataHook}
      tooltip={t('LinkPreview_RemovePreview_Tooltip')}
    />
  );
};
