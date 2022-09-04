import React, { useState, useContext } from 'react';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext, ModalContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';
import { LINE_SPACING_TYPE } from 'wix-rich-content-common';

const LineSpacingButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t } = context || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const Icon = toolbarItem.presentation?.icon;
  const tooltip = t(toolbarItem.presentation?.tooltip);
  const modalService = useContext(ModalContext);

  return (
    <ToolbarButton
      ref={setReferenceElement}
      disabled={toolbarItem.attributes.disabled}
      isMobile={isMobile}
      active={modalService.isModalOpen(`${LINE_SPACING_TYPE}.modal`)}
      tooltip={tooltip}
      onClick={() => toolbarItem.commands?.click({ referenceElement })}
      icon={() => (
        <>
          <Icon />
          <DropdownArrowIcon />
        </>
      )}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(LineSpacingButton);
