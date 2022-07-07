/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from '../../Clickoutside/ClickOutside';
import cx from 'classnames';
import styles from './HighlightColorButton.scss';
import { withToolbarContext } from 'ricos-context';
import { ColorPicker } from 'wix-rich-content-plugin-commons';
import { getLangDir } from 'wix-rich-content-common';
import { extractPalette, getBlockDocumentStyle } from './utils';
import { colorPicker } from '../TextColorButton/utils';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onChange = (color, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.setHighlightColor({ color });
  setModalOpen(false);
};

const onResetColor = (toolbarItem, setModalOpen) => {
  toolbarItem.commands?.resetHighlightColor();
  setModalOpen(false);
};

const HighlightColorButton = ({ toolbarItem, context, dataHook }) => {
  const { isMobile, t, theme, locale, getEditorCommands, colorPickerData, portal } = context || {};
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

  const settings = colorPickerData.TEXT_COLOR || {};
  const { colorScheme } = settings;
  const palette = extractPalette(colorScheme);
  const paletteColors = isMobile ? palette.slice(0, 5) : palette.slice(0, 6);

  const userColors = colorPickerData.TEXT_COLOR?.getUserColors?.();

  const onColorAdded = ({ color }) => colorPickerData.TEXT_COLOR?.onColorAdded?.(color);

  const editorCommands = getEditorCommands?.();
  const documentStyles = getBlockDocumentStyle(editorCommands);
  const currentColor =
    toolbarItem.attributes.selectedHighlightColor || documentStyles?.['background-color'];

  const Icon = toolbarItem.presentation?.icon;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside} wrapper="div">
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          onMouseDown={e => e.preventDefault()}
          className={cx(styles.highlightColorModalButtonWrapper, {
            [styles.mobileHighlightColorModalButtonWrapper]: isMobile,
          })}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={cx(styles.highlightColorModalButton, {
              [styles.mobileHighlightColorModalButton]: isMobile,
            })}
            role="button"
            onClick={() => setModalOpen(!isModalOpen)}
            tabIndex={0}
          >
            <Icon
              className={styles.highlightColorModalButtonIcon}
              style={{ color: currentColor }}
            />
          </div>
        </div>
      </Tooltip>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={!isMobile ? setPopperElement : () => null}
            style={isMobile ? {} : { ...popperStyles.popper, zIndex: 9 }}
            {...attributes.popper}
          >
            <div data-id="toolbar-modal-button" tabIndex={-1} className={styles.modal}>
              <ColorPicker
                color={currentColor}
                palette={paletteColors}
                userColors={userColors.slice(-12)}
                onColorAdded={onColorAdded}
                theme={theme}
                isMobile={isMobile}
                onChange={({ color }) => onChange(color, toolbarItem, setModalOpen)}
                t={t}
                onResetColor={() => onResetColor(toolbarItem, setModalOpen)}
              >
                {colorPicker({ isMobile, header: t('Color_Picker_TextHighlightButton_Header') })}
              </ColorPicker>
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(HighlightColorButton);
