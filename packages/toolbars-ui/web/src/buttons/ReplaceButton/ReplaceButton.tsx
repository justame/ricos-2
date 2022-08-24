import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { ToggleButton } from '../../components';
import { RicosContext } from 'ricos-context';
import { ReplaceIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

const ReplaceButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t, isMobile } = useContext(RicosContext) || {};

  const onClick = () => toolbarItem.commands.click({ referenceElement, isMobile });

  return (
    <ToggleButton
      Icon={ReplaceIcon}
      onClick={onClick}
      dataHook={dataHook}
      tooltip={t('Settings_Replace_Image_Tooltip')}
      setRef={setReferenceElement}
    />
  );
};

export default ReplaceButton;
