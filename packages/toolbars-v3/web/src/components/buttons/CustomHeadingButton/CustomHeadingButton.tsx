/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import { getLangDir } from 'wix-rich-content-common';
import styles from './CustomHeadingButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withStylesContext, withToolbarContext } from 'ricos-context';
import HeadingsPanel from '../../../modals/heading/HeadingsPanel';
import { translateHeading, getCustomHeadingsLabel } from './utils';
import { ToolbarButton } from '../ToolbarButton';
import { onModalKeyDown } from '../modal-buttons-utils';

const onSave = (data, selectedHeading, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.removeInlineStyles();
  const shouldSetBlockType = selectedHeading !== data;
  shouldSetBlockType && toolbarItem.commands?.setHeading(data);
  setModalOpen(false);
};

const onChange = (documentStyle, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.setAndSaveHeading(documentStyle);
  setModalOpen(false);
};

const CustomHeadingButton = ({ toolbarItem, context, dataHook, styles: ricosStyles }) => {
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
      <div ref={setReferenceElement}>
        <ToolbarButton
          isMobile={isMobile}
          active={isModalOpen}
          tooltip={tooltip}
          onClick={() => setModalOpen(!isModalOpen)}
          icon={() => (
            <>
              {Label}
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
            style={{ ...popperStyles.popper }}
            {...attributes.popper}
            className={isMobile ? '' : styles.popperContainer}
          >
            <div
              data-id="toolbar-modal-button"
              tabIndex={-1}
              className={styles.modal}
              onKeyDown={e => onModalKeyDown(e, () => setModalOpen(false))}
            >
              <HeadingsPanel
                isMobile={isMobile}
                t={t}
                theme={theme}
                translateHeading={translateHeading}
                currentSelect={selectedHeading}
                documentStyle={ricosStyles.toDraftDocumentStyle()}
                customHeadings={headingsData?.customHeadings}
                allowHeadingCustomization
                currentInlineStyles={editorCommands.getInlineStylesInSelection()}
                wiredFontStyles={editorCommands.getWiredFontStyles(theme?.customStyles, isMobile)}
                onSave={({ data }) => onSave(data, selectedHeading, toolbarItem, setModalOpen)}
                onChange={documentStyle => onChange(documentStyle, toolbarItem, setModalOpen)}
                onResetType={types => {
                  Object.keys(types).forEach(type => {
                    toolbarItem.commands?.resetToDefaultsByNodeType(type);
                  });
                  setModalOpen(false);
                }}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withStylesContext(withToolbarContext(CustomHeadingButton));
