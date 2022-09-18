import type { EditorCommands, TextBlockType } from 'ricos-types';
import { TitleIcon, TitleOneIcon, TitleTwoIcon } from './icons';

const titleStateMap = {
  unstyled: {
    icon: TitleIcon,
    action: 'header-two',
  },
  'header-two': {
    icon: TitleOneIcon,
    action: 'header-three',
  },
  'header-three': {
    icon: TitleTwoIcon,
    action: 'unstyled',
  },
};

const getCurrentTitleState = (editorCommands: EditorCommands) => {
  const selectedHeading = editorCommands.getCurrentHeading() as keyof typeof titleStateMap;
  return titleStateMap[selectedHeading] || titleStateMap.unstyled;
};

export const getTitleIcon = (editorCommands: EditorCommands) => {
  const currentTitleState = getCurrentTitleState(editorCommands);
  return currentTitleState.icon;
};

export const getTitleOnClick = (editorCommands: EditorCommands) => {
  const currentTitleState = getCurrentTitleState(editorCommands);
  const currentTitleAction = currentTitleState.action as TextBlockType;
  return () => editorCommands.setBlockType(currentTitleAction);
};
