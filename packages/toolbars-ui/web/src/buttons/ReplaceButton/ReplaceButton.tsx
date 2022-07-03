import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { UploadServiceContext } from 'wix-rich-content-common';
import { RicosContext, ModalContext } from 'ricos-context';
import { ReplaceIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

type Props = {
  toolbarItem: IToolbarItem;
};

const ReplaceButton: FC<Props> = ({ toolbarItem }) => {
  const modalService = useContext(ModalContext) || {};
  const uploadContext = useContext(UploadServiceContext);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t } = useContext(RicosContext) || {};

  const onClick = args => toolbarItem.commands.click(args);
  const node = toolbarItem.attributes.selectedNode;

  return (
    <ToggleButton
      Icon={ReplaceIcon}
      onClick={() => onClick({ node, referenceElement, uploadContext, modalService })}
      dataHook="baseToolbarButton_replace"
      tooltip={t('ReplaceButton_Tooltip')}
      setRef={setReferenceElement}
    />
  );
};

export default ReplaceButton;
