import React from 'react';
import { withToolbarContext, withStylesContext } from 'ricos-context';
import HeadingsPanel from './HeadingsPanel';
import type { ToolbarContextType } from 'ricos-context';
import type { TranslationFunction, TextBlockType, EditorCommands, HeadingType } from 'ricos-types';
import type { RicosStyles } from 'ricos-styles';
import { translateHeading } from './utils';

const onSave = (
  data: TextBlockType,
  selectedHeading: HeadingType,
  editorCommands: EditorCommands,
  closeModal: () => void
) => {
  editorCommands.clearSelectedBlocksInlineStyles();
  const shouldSetBlockType = selectedHeading !== data;
  shouldSetBlockType && editorCommands.setBlockType(data);
  closeModal();
};

const onChange = (editorCommands: EditorCommands, closeModal: () => void) => {
  //TODO: updateDocumentStyle should be called without parameters (type will fixed after draft deprecated)
  editorCommands.updateDocumentStyle({});
  closeModal();
};

const onReset = (types, editorCommands: EditorCommands, closeModal: () => void) => {
  Object.keys(types).forEach(type => {
    editorCommands.resetDocumentStyleByNodeType(type);
  });
  closeModal();
};

const HeadingsPanelController = ({
  closeModal,
  context,
  styles: ricosStyles,
}: {
  closeModal: () => void;
  context: ToolbarContextType & { t: TranslationFunction };
  styles: RicosStyles;
}) => {
  const { isMobile, t, theme, getEditorCommands, headingsData } = context || {};

  const editorCommands = getEditorCommands?.();
  if (!editorCommands) return null;

  const selectedHeading = editorCommands.getCurrentHeading();

  const headingsPanelProps = {
    isMobile,
    t,
    theme,
    translateHeading,
    currentSelect: selectedHeading,
    customHeadings: headingsData?.customHeadings,
    allowHeadingCustomization: false,
    onSave: ({ data }) => onSave(data, selectedHeading, editorCommands, closeModal),
  };

  const customHeadingsPanelProps = {
    ...headingsPanelProps,
    documentStyle: ricosStyles.toDraftDocumentStyle(),
    allowHeadingCustomization: true,
    currentInlineStyles: editorCommands.getInlineStylesInSelection(),
    wiredFontStyles: editorCommands.getWiredFontStyles(theme?.customStyles, isMobile),
    onChange: () => onChange(editorCommands, closeModal),
    onResetType: types => onReset(types, editorCommands, closeModal),
  };

  return (
    <HeadingsPanel
      {...headingsPanelProps}
      {...(!!headingsData?.allowHeadingCustomization && { ...customHeadingsPanelProps })}
    />
  );
};

export default withStylesContext(withToolbarContext(HeadingsPanelController));
