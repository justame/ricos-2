import type {
  FormattingToolbarButtonConfig,
  EditorCommands,
  TranslationFunction,
} from 'ricos-types';
import { Node_Type } from 'ricos-types';
import type { HeadingsPluginEditorConfig } from './types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { getCurrentHeadingIcon } from 'wix-rich-content-toolbars-modals/libs/getCurrentHeadingIcon';
import HeadingPanelComponent from './HeadingsPanelComponent';

const HEADINGS_MODAL_ID = `${Node_Type.HEADING}.modal`;

type GetIconType = (
  editorCommands: EditorCommands,
  t: TranslationFunction
) => (props) => JSX.Element;

const getHeadingsIcon = (isCustomHeadings: boolean): GetIconType => {
  return getCurrentHeadingIcon(isCustomHeadings);
};

export const getTextButtons = (
  config?: HeadingsPluginEditorConfig
): FormattingToolbarButtonConfig[] => {
  const isCustomHeadings = !!config?.allowHeadingCustomization;
  return [
    {
      id: `${Node_Type.HEADING}.dropdown`,
      type: 'modal',
      presentation: {
        dataHook: 'headingsDropdownButton',
        tooltip: 'FormattingToolbar_TextStyleButton_Tooltip',
        getIcon: getHeadingsIcon(isCustomHeadings),
      },
      attributes: {
        isStylesMatch: RESOLVERS_IDS.IS_TEXT_STYLES_MATCH_DOCUMENT_STYLES,
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHeading: RESOLVERS_IDS.GET_HEADING_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      modal: {
        id: HEADINGS_MODAL_ID,
        Component: HeadingPanelComponent(isCustomHeadings ? 230 : 143),
      },
    },
  ];
};
