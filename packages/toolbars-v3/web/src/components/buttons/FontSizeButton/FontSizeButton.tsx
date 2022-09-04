/* eslint-disable jsx-a11y/click-events-have-key-events */
import cx from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ModalContext, withToolbarContext } from 'ricos-context';
import { RICOS_FONT_SIZE_TYPE } from 'wix-rich-content-common';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { DropdownArrowIcon } from '../../../icons';
import styles from './FontSizeButton.scss';
import type { ToolbarContextType } from 'ricos-context';
import type { TranslationFunction } from 'ricos-types';
import { Decoration_Type } from 'ricos-types';
import type { ToolbarItem } from '../../../ToolbarItemCreator';
import type { EditorCommands } from 'wix-rich-content-common';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

const onInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setInputValue: React.Dispatch<React.SetStateAction<string | number>>,
  editorCommands: EditorCommands
) => {
  const { value } = e.target;
  const valueAsNumber = Number.parseInt(value);
  if (!valueAsNumber && value !== '') return;
  setInputValue(value);
  const fontSize = Math.min(Math.max(MIN_FONT_SIZE, valueAsNumber), MAX_FONT_SIZE);
  editorCommands.insertDecoration(RICOS_FONT_SIZE_TYPE, { fontSize: `${fontSize}` });
};

const FontSizeButton = ({
  toolbarItem,
  context,
  dataHook,
}: {
  toolbarItem: ToolbarItem;
  context: ToolbarContextType & { t: TranslationFunction };
  dataHook: string;
}) => {
  const { t, getEditorCommands } = context || {};
  const modalService = useContext(ModalContext) || {};
  const inputRef = useRef<HTMLInputElement>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<number | string>('');
  const editorCommands = getEditorCommands?.();

  useEffect(() => {
    setInputValue(selectedFontSize);
  }, [toolbarItem.attributes.selectedFontSize]);

  const selectedFontSize = toolbarItem.attributes.selectedFontSize;

  const disabled = toolbarItem.attributes.disabled;
  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
      <div
        className={cx(
          styles.fontSizeModalButtonWrapper,
          modalService.isModalOpen(`${Decoration_Type.FONT_SIZE}.modal`) ? styles.active : '',
          { [styles.disabled]: disabled }
        )}
        ref={setReferenceElement}
      >
        <div
          data-hook={dataHook}
          className={styles.fontSizeModalButton}
          role="button"
          onClick={() => toolbarItem.commands?.click({ referenceElement })}
          tabIndex={-1}
        >
          <input
            className={styles.fontSizeModalInputButton}
            required
            value={inputValue}
            onChange={e => onInputChange(e, setInputValue, editorCommands)}
            onClick={() => inputRef.current?.select()}
            ref={inputRef}
          />
          <DropdownArrowIcon />
        </div>
      </div>
    </Tooltip>
  );
};

export default withToolbarContext(FontSizeButton);
