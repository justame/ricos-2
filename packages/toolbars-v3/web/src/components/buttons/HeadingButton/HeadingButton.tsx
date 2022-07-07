/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import { getLangDir } from 'wix-rich-content-common';
import cx from 'classnames';
import styles from './HeadingButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import HeadingsPanel from '../../../modals/heading/HeadingsPanel';
import { headingsMap, translateHeading } from './utils';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onSave = (data, selectedHeading, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.removeInlineStyles();
  const shouldSetBlockType = selectedHeading !== data;
  shouldSetBlockType && toolbarItem.commands?.setHeading(data);
  setModalOpen(false);
};

const HeadingButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, theme, headingsData, locale, portal } = context || {};
  if (!context) return null;
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

  const selectedHeading = toolbarItem.attributes.selectedHeading;
  const Label = translateHeading(headingsMap[selectedHeading], t);

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          className={cx(styles.headingModalButtonWrapper, isModalOpen ? styles.active : '')}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={styles.headingModalButton}
            role="button"
            onClick={() => setModalOpen(!isModalOpen)}
            tabIndex={0}
          >
            {Label}
            <DropdownArrowIcon />
          </div>
        </div>
      </Tooltip>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={!isMobile ? setPopperElement : () => null}
            style={{ ...popperStyles.popper, zIndex: 9 }}
            {...attributes.popper}
          >
            <div data-id="toolbar-modal-button" tabIndex={-1} className={styles.modal}>
              <HeadingsPanel
                isMobile={isMobile}
                t={t}
                theme={theme}
                translateHeading={translateHeading}
                currentSelect={selectedHeading}
                customHeadings={headingsData?.customHeadings}
                allowHeadingCustomization={false}
                onSave={({ data }) => onSave(data, selectedHeading, toolbarItem, setModalOpen)}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(HeadingButton);
