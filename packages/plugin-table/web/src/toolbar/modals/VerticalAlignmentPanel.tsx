import React, { useContext } from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { RicosContext } from 'ricos-context';
import { ListItemSelect, DropdownModal } from 'wix-rich-content-toolbars-ui';
import {
  VerticalAlignmentBottom,
  VerticalAlignmentMiddle,
  VerticalAlignmentTop,
} from '../../icons';

const verticalIconMap = {
  TOP: <VerticalAlignmentTop />,
  MIDDLE: <VerticalAlignmentMiddle />,
  BOTTOM: <VerticalAlignmentBottom />,
};

const verticalTooltipMap = {
  TOP: 'TablePlugin_Toolbar_VerticalAlignment_AlignTop_Tooltip',
  MIDDLE: 'TablePlugin_Toolbar_VerticalAlignment_AlignMiddle_Tooltip',
  BOTTOM: 'TablePlugin_Toolbar_VerticalAlignment_AlignBottom_Tooltip',
};

const verticalDatahookMap = {
  TOP: 'vertical-alignment-align-top',
  MIDDLE: 'vertical-alignment-align-middle',
  BOTTOM: 'vertical-alignment-align-bottom',
};

type Props = {
  onClick: (verticalAlignment: 'TOP' | 'MIDDLE' | 'BOTTOM') => void;
  selectedAlign: 'TOP' | 'MIDDLE' | 'BOTTOM';
};

const VerticalAlignmentPanel: React.FC<Props> = ({ onClick, selectedAlign }) => {
  const { t } = useContext(RicosContext) || {};

  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick(commandKey);
      e.stopPropagation();
    }
  };

  const DropdownOptions = ['TOP', 'MIDDLE', 'BOTTOM'].map(
    (verticalAlign: 'TOP' | 'MIDDLE' | 'BOTTOM') => (
      <ListItemSelect
        key={verticalAlign}
        dataHook={verticalDatahookMap[verticalAlign]}
        prefix={verticalIconMap[verticalAlign]}
        tooltip={t(verticalTooltipMap[verticalAlign])}
        selected={selectedAlign === verticalAlign}
        onClick={() => onClick(verticalAlign)}
        onKeyDown={e => {
          onKeyDown(e, verticalAlign);
        }}
      />
    )
  );

  return <DropdownModal options={DropdownOptions} />;
};

export default VerticalAlignmentPanel;
