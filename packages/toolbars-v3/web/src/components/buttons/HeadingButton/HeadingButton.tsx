import React, { useState, useContext } from 'react';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext, ModalContext } from 'ricos-context';
import { translateHeading, headingsMap } from 'wix-rich-content-toolbars-modals';
import { ToolbarButton } from '../ToolbarButton';
import { Node_Type } from 'ricos-schema';

const HeadingButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);

  const selectedHeading = toolbarItem.attributes.selectedHeading;
  const Label = translateHeading(headingsMap[selectedHeading], t);

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ToolbarButton
      ref={setReferenceElement}
      disabled={toolbarItem.attributes.disabled}
      isMobile={isMobile}
      active={modalService.isModalOpen(`${Node_Type.HEADING}.modal`)}
      tooltip={tooltip}
      onClick={() => toolbarItem.commands?.click({ referenceElement })}
      icon={() => (
        <>
          {Label}
          <DropdownArrowIcon />
        </>
      )}
      dataHook={dataHook}
    />
  );
};

export default withToolbarContext(HeadingButton);
