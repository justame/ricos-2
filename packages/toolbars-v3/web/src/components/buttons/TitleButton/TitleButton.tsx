import React from 'react';
import { TitleIcon, TitleOneIcon, TitleTwoIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';

const titleStateMap = {
  unstyled: {
    icon: TitleIcon,
    action: 'header-two',
    active: false,
  },
  'header-two': {
    icon: TitleOneIcon,
    action: 'header-three',
    active: true,
  },
  'header-three': {
    icon: TitleTwoIcon,
    action: 'unstyled',
    active: true,
  },
};

const TitleButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t } = context || {};
  const selectedHeading = toolbarItem.attributes.selectedHeading;
  const currentTitleState = titleStateMap[selectedHeading] || titleStateMap.unstyled;
  const onClick = () => toolbarItem.commands?.click({ heading: currentTitleState.action });
  const isActive = currentTitleState.active;
  const tooltip = t(toolbarItem.presentation?.tooltip);

  return (
    <ToolbarButton
      isMobile={isMobile}
      active={isActive}
      tooltip={tooltip}
      onClick={onClick}
      icon={currentTitleState.icon}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(TitleButton);
