import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import { FormattingIcon } from '../../icons';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';

interface Props {
  toolbarItem: IToolbarItem;
  dataHook?: string;
}

const FormattingButton: FC<Props> = ({ dataHook }) => {
  const { t } = useContext(RicosContext) || {};

  return (
    <ToggleButton
      Icon={FormattingIcon}
      onClick={() => {}}
      dataHook={dataHook}
      tooltip={t('FormattingButton_Tooltip')}
    />
  );
};

export default FormattingButton;
