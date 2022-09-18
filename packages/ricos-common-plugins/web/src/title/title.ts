import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { heading } from './extension';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { getTitleIcon, getTitleOnClick } from './title-button-utils';

export const pluginTitle: TiptapEditorPlugin = {
  type: `${Node_Type.HEADING}.title`,
  textButtons: [
    {
      id: `${Node_Type.HEADING}.title`,
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Title',
        tooltip: 'TitleButton_Tooltip',
        getIcon: getTitleIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHeading: RESOLVERS_IDS.GET_HEADING_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
        active: RESOLVERS_IDS.IS_HEADER_TWO_OR_THREE_SELECTED,
      },
      command: editorCommands => () => {
        const onClick = getTitleOnClick(editorCommands);
        onClick();
        return true;
      },
    },
  ],
  config: {},
  tiptapExtensions: [heading],
};
