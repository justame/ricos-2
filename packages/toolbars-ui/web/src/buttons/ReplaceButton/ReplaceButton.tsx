import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { RicosContext, ModalContext, UploadContext } from 'ricos-context';
import { ReplaceIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

const ReplaceButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const modalService = useContext(ModalContext) || {};
  const uploadContext = useContext(UploadContext);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t, isMobile } = useContext(RicosContext) || {};

  const onClick = () =>
    toolbarItem.commands.click({ node, referenceElement, uploadContext, modalService, isMobile });
  const node = toolbarItem.attributes.selectedNode;

  return (
    <ToggleButton
      Icon={ReplaceIcon}
      onClick={onClick}
      dataHook={dataHook}
      tooltip={t('ReplaceButton_Tooltip')}
      setRef={setReferenceElement}
    />
  );
};

export default ReplaceButton;
