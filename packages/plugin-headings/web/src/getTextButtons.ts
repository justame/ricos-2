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
          documentStyle => {
            // eslint-disable-next-line no-console
            console.log('TODO: setAndSaveHeading');
          },
        removeInlineStyles:
          ({ editorCommands }) =>
          (exclude?: string[]) => {
            // eslint-disable-next-line no-console
            console.log('TODO: removeInlineStyles');
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
      },
    },
  ];
};
