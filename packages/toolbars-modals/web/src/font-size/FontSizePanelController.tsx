import React from 'react';
import { RICOS_FONT_SIZE_TYPE } from 'wix-rich-content-common';
import { withToolbarContext } from 'ricos-context';
import { FontSizePanel } from './FontSizePanel';
import type { TranslationFunction, EditorCommands } from 'ricos-types';
import type { ToolbarContextType } from 'ricos-context';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

const onSave = (data: string, editorCommands: EditorCommands | void, closeModal: () => void) => {
  if (!editorCommands) {
    console.error('No editor commands available');
  } else {
    const fontSize = Math.min(Math.max(MIN_FONT_SIZE, parseInt(data)), MAX_FONT_SIZE);
    editorCommands.insertDecoration(RICOS_FONT_SIZE_TYPE, { fontSize: `${fontSize}` });
    closeModal();
  }
};

const FontSizePanelController = ({
  closeModal,
  context,
}: {
  closeModal: () => void;
  context: ToolbarContextType & { t: TranslationFunction };
}) => {
  const { t, theme, getEditorCommands } = context || {};

  const editorCommands = getEditorCommands();

  const selectedFontSize = editorCommands?.getFontSize();

  return (
    <FontSizePanel
      t={t}
      theme={theme}
      currentSelect={selectedFontSize}
      onSave={({ data }) => onSave(data, editorCommands, closeModal)}
    />
  );
};

export default withToolbarContext(FontSizePanelController);
