/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import { getLangDir } from 'wix-rich-content-common';
import cx from 'classnames';
import styles from './CustomHeadingButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import HeadingsPanel from '../../../modals/heading/HeadingsPanel';
import { translateHeading, getCustomHeadingsLabel } from './utils';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onSave = (data, selectedHeading, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.removeInlineStyles();
  setTimeout(() => {
    const shouldSetBlockType = selectedHeading !== data;
    shouldSetBlockType && toolbarItem.commands?.setHeading(data);
  });
  setModalOpen(false);
};

const onChange = (documentStyle, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.setAndSaveHeading(documentStyle);
  setModalOpen(false);
};

const CustomHeadingButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, theme, getEditorCommands, headingsData, locale, portal } = context || {};
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

  const editorCommands = getEditorCommands?.();

  const selectedHeading = toolbarItem.attributes.selectedHeading;
  const Label = getCustomHeadingsLabel(selectedHeading, t, editorCommands);

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          className={cx(styles.customHeadingModalButtonWrapper, isModalOpen ? styles.active : '')}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            dir={getLangDir(locale)}
            className={styles.customHeadingModalButton}
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
                documentStyle={editorCommands.getDocumentStyle()}
                customHeadings={headingsData?.customHeadings}
                allowHeadingCustomization
                currentInlineStyles={editorCommands.getInlineStylesInSelection()}
                wiredFontStyles={editorCommands.getWiredFontStyles(theme?.customStyles, isMobile)}
                onSave={({ data }) => onSave(data, selectedHeading, toolbarItem, setModalOpen)}
                onChange={documentStyle => onChange(documentStyle, toolbarItem, setModalOpen)}
                // onCancel={() => console.log('onCancel')}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(CustomHeadingButton);
