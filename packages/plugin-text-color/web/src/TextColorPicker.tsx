import React from 'react';
import type { EditorCommands } from 'wix-rich-content-common';
import { DRAFT_TO_DOC_TYPE_WITH_LISTS } from 'wix-rich-content-common';

type ColorSchemeType = Record<string, { color: string; index: number }>;

const DEFAULT_PALETTE = Object.freeze([
  '#ff0000',
  '#ffffff',
  '#303030',
  '#3a54b4',
  '#bfad80',
  '#dddddd',
]);

export const extractPalette = (colorScheme: ColorSchemeType) => {
  if (!colorScheme) {
    return DEFAULT_PALETTE;
  }
  return Object.values(colorScheme)
    .sort((entry1, entry2) => (entry1.index > entry2.index ? 1 : -1))
    .map(entry => entry.color);
};

export const getBlockDocumentStyle = (editorCommands: EditorCommands) => {
  const blockType = editorCommands.getAnchorBlockType();
  const documentStyle = editorCommands.getDocumentStyle();
  return documentStyle?.[DRAFT_TO_DOC_TYPE_WITH_LISTS[blockType]];
};

export const colorPicker = ({ isMobile, header }) => {
  return ({
    renderPalette,
    renderUserColors,
    renderAddColorButton,
    renderResetColorButton,
    mergedStyles,
  }) => (
    <>
      {isMobile && (
        <>
          <div className={mergedStyles.colorPicker_header}>{header}</div>
          <div className={mergedStyles.colorPicker_separator} />
        </>
      )}
      <div className={mergedStyles.colorPicker_palette}>
        <div className={mergedStyles.colorPicker_buttons_container}>
          {renderPalette()}
          {renderUserColors()}
          {isMobile && renderAddColorButton()}
        </div>
        {!isMobile && (
          <>
            <hr className={mergedStyles.colorPicker_separator} />
            <div className={mergedStyles.colorPicker_bottom_container}>
              {renderResetColorButton()}
              {renderAddColorButton()}
            </div>
          </>
        )}
      </div>
    </>
  );
};
