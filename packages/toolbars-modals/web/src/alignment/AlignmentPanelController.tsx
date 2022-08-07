import React from 'react';
import { withToolbarContext } from 'ricos-context';
import AlignmentPanel from './AlignmentPanel';
import { getCurrentTextAlignment } from './utils';
import type { TranslationFunction, TextAlignment, EditorCommands } from 'ricos-types';
import type { ToolbarContextType } from 'ricos-context';

const onSave = (
  data: TextAlignment,
  editorCommands: EditorCommands | void,
  closeModal: () => void
) => {
  if (!editorCommands) {
    console.error('No editor commands available');
  } else {
    editorCommands.setTextAlignment(data);
    closeModal();
  }
};

const AlignmentButton = ({
  closeModal,
  context,
}: {
  closeModal: () => void;
  context: ToolbarContextType & { t: TranslationFunction };
}) => {
  const { isMobile, t, theme, getEditorCommands } = context || {};

  const editorCommands = getEditorCommands();

  const selectedAlignment = getCurrentTextAlignment(editorCommands);

  return (
    <AlignmentPanel
      isMobile={isMobile}
      t={t}
      theme={theme}
      currentSelect={selectedAlignment}
      onSave={({ data }) => onSave(data, editorCommands, closeModal)}
      closeModal={closeModal}
    />
  );
};

export default withToolbarContext(AlignmentButton);
