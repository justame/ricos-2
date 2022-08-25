import { camelCase } from 'lodash';
import type { IToolbarItemConfigTiptap, ToolbarSettingsFunctions, ToolbarType } from 'ricos-types';
import { isiOS } from './isiOS';

const cleanTitleIfNeeded = (
  tiptapToolbarItemsConfig: IToolbarItemConfigTiptap[]
): IToolbarItemConfigTiptap[] => {
  if (
    tiptapToolbarItemsConfig.some(button => button.id === 'headings') &&
    tiptapToolbarItemsConfig.some(button => button.id === 'title')
  ) {
    return tiptapToolbarItemsConfig.filter(button => button.id !== 'title');
  } else {
    return tiptapToolbarItemsConfig;
  }
};

export function toTiptapToolbarItemsConfig(
  toolbarConfig: ToolbarSettingsFunctions | undefined,
  tiptapToolbarConfig: IToolbarItemConfigTiptap[],
  toolbarType: ToolbarType,
  buttonsType: 'desktop' | 'mobile'
) {
  if (!toolbarConfig) {
    console.error(`${toolbarType} doesn't exists`);
    return [];
  }

  const buttonsPerType = toolbarConfig.getButtons?.();

  let buttons;
  if (buttonsType === 'desktop') {
    buttons = buttonsPerType?.desktop || [];
  } else if (buttonsType === 'mobile' && isiOS()) {
    buttons = buttonsPerType?.mobile?.ios || [];
  } else if (buttonsType === 'mobile' && !isiOS()) {
    buttons = buttonsPerType?.mobile?.android || [];
  } else {
    buttons = [];
  }

  const buttonsList = buttons.map(button => {
    let buttonName = '';

    if (button === '|') {
      buttonName = 'separator';
    } else {
      buttonName = camelCase(button);
    }
    return buttonName;
  });

  const tiptapToolbarItemsConfig: IToolbarItemConfigTiptap[] = [];
  buttonsList.forEach(button => {
    const buttonConfig = tiptapToolbarConfig.find(config => config.id === button);
    if (buttonConfig) {
      tiptapToolbarItemsConfig.push(buttonConfig);
    }
  });

  const finalTiptapToolbarItemsConfig = cleanTitleIfNeeded(tiptapToolbarItemsConfig);
  return finalTiptapToolbarItemsConfig;
}
