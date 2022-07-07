/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import cx from 'classnames';
import styles from './FontSizeButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import FontSizePanel from '../../../modals/fontSize/FontSizePanel';
import { getLangDir } from 'wix-rich-content-common';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onSave = (data, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.setFontSize(data);
  setModalOpen(false);
};

const onInputChange = (e, setInputValue, toolbarItem) => {
  const { value } = e.target;
  const valueAsNumber = Number.parseInt(value);
  if (!valueAsNumber && value !== '') return;
  setInputValue(value);
  toolbarItem.commands?.setFontSizeWithoutFocus(value);
};

const FontSizeButton = ({ toolbarItem, context, dataHook }) => {
  const { t, theme, locale, portal, isMobile } = context || {};
  const [isModalOpen, setModalOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<number | string>('');

  useEffect(() => {
    setInputValue(selectedFontSize);
  }, [toolbarItem.attributes.selectedFontSize]);

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

  const selectedFontSize = toolbarItem.attributes.selectedFontSize;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          className={cx(styles.fontSizeModalButtonWrapper, isModalOpen ? styles.active : '')}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={styles.fontSizeModalButton}
            role="button"
            onClick={() => setModalOpen(!isModalOpen)}
            tabIndex={0}
          >
            <input
              className={styles.fontSizeModalInputButton}
              required
              value={inputValue}
              onChange={e => onInputChange(e, setInputValue, toolbarItem)}
            />
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
              <FontSizePanel
                t={t}
                theme={theme}
                currentSelect={selectedFontSize}
                onSave={({ data }) => onSave(data, toolbarItem, setModalOpen)}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(FontSizeButton);
