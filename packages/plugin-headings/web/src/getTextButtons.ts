import type { FormattingToolbarButtonConfig } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: 'headings',
      type: 'modal',
      presentation: {
        dataHook: 'headingsDropdownButton',
        tooltip: 'FormattingToolbar_TextStyleButton_Tooltip',
      },
      attributes: {
        isStylesMatch: RESOLVERS_IDS.IS_TEXT_STYLES_MATCH_DOCUMENT_STYLES,
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHeading: RESOLVERS_IDS.GET_HEADING_IN_SELECTION,
      },
      commands: {
        setHeading:
          ({ editorCommands }) =>
          heading => {
            if (heading === 'unstyled') {
              editorCommands.chain().focus().setParagraph().run();
            } else {
              const headingMap = {
                'header-one': 1,
                'header-two': 2,
                'header-three': 3,
                'header-four': 4,
                'header-five': 5,
                'header-six': 6,
              };
              const headingLevel = headingMap[heading];
              editorCommands.chain().focus().toggleHeading({ level: headingLevel }).run();
            }
          },
        setAndSaveHeading:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().updateDocumentStyleBySelectedNode().run();
          },

        resetToDefaultsByNodeType: ({ editorCommands }) => {
          return nodeType => {
            return editorCommands
              .chain()
              .focus()
              .unsetAllMarks()
              .resetDocumentStyleByNodeType(nodeType)
              .run();
          };
        },
        removeInlineStyles:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().unsetAllMarks().run();
          },
      },
    },
    {
      id: 'title',
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Title',
        tooltip: 'TitleButton_Tooltip',
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHeading: RESOLVERS_IDS.GET_HEADING_IN_SELECTION,
      },
      command:
        editorCommands =>
        ({ heading }) => {
          editorCommands.setBlockType(heading);
          return true;
        },
    },
  ];
};
