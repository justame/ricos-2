/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import styles from './AlignmentButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import AlignmentPanel from '../../../modals/alignment/AlignmentPanel';
import { getLangDir } from 'wix-rich-content-common';
import { getDefaultAlignment, alignmentMap } from './utils';
import { ToolbarButton } from '../ToolbarButton';
import { onModalKeyDown } from '../modal-buttons-utils';

const onSave = (data, toolbarItem) => {
  toolbarItem.commands?.setAlignment(data);
};

const AlignmentButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, theme, locale, portal } = context || {};
  const [isModalOpen, setModalOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const onClickOutside = e => {
    const modalRef = popperElement;
    if (!modalRef || modalRef.contains(e.target as Node)) {
      return;
    }
    setModalOpen(false);
  };

  const selectedAlignment = toolbarItem.attributes.selectedAlignment || getDefaultAlignment(locale);
  const SelectedAlignmentIcon = alignmentMap[`${selectedAlignment}`];

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <div ref={setReferenceElement}>
        <ToolbarButton
          isMobile={isMobile}
          active={isModalOpen}
          tooltip={tooltip}
          onClick={() => setModalOpen(!isModalOpen)}
          icon={() => (
            <>
              <SelectedAlignmentIcon />
              <DropdownArrowIcon />
            </>
          )}
          dataHook={dataHook}
        />
      </div>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={!isMobile ? setPopperElement : () => null}
            style={isMobile ? {} : { ...popperStyles.popper }}
            {...attributes.popper}
            className={isMobile ? '' : styles.popperContainer}
          >
            <div
              data-id="toolbar-modal-button"
              tabIndex={-1}
              className={styles.modal}
              onKeyDown={e => onModalKeyDown(e, () => setModalOpen(false))}
            >
              <AlignmentPanel
                isMobile={isMobile}
                t={t}
                theme={theme}
                currentSelect={selectedAlignment}
                onSave={({ data }) => onSave(data, toolbarItem)}
                closeModal={() => setModalOpen(false)}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(AlignmentButton);
