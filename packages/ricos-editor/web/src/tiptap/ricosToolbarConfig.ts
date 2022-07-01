import { camelCase } from 'lodash';
import type { ToolbarSettingsFunctions } from 'wix-rich-content-common';
import type { TOOLBARS } from 'wix-rich-content-editor-common';
import {
  getToolbarTheme,
  DISPLAY_MODE,
  mergeToolbarSettings,
  isiOS,
} from 'wix-rich-content-editor-common';
import type { IToolbarItemConfigTiptap } from 'ricos-types';

export class ToolbarConfig {
  static toToolbarSettings(toolbarConfig: ToolbarSettingsFunctions, toolbarType: TOOLBARS) {}

  static toTiptapToolbarItemsConfig(
    toolbarConfig: ToolbarSettingsFunctions | undefined,
    tiptapToolbarConfig: IToolbarItemConfigTiptap[],
    toolbarType: TOOLBARS,
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
    return tiptapToolbarItemsConfig;
  }
}
export const toDesktopStaticToolbarConfig = (
  finalToolbarSettings: ToolbarSettingsFunctions[],
  tiptapToolbarConfig: IToolbarItemConfigTiptap[],
  toolbarType: TOOLBARS,
  buttonsType: 'desktop' | 'mobile'
): IToolbarItemConfigTiptap[] => {
  const toolbarConfig = finalToolbarSettings.find(setting => setting.name === toolbarType);

  if (!toolbarConfig) {
    console.error(`${toolbarType} doesn't exists`);
    return [];
  }

  const buttons = toolbarConfig.getButtons?.();

  let buttonsByType;
  if (buttonsType === 'desktop') {
    buttonsByType = buttons?.desktop || [];
  } else if (buttonsByType === 'mobile' && isiOS()) {
    buttonsByType = buttons?.mobile?.ios || [];
  } else if (buttonsByType === 'mobile' && !isiOS()) {
    buttonsByType = buttons?.mobile?.android || [];
  } else {
    buttonsByType = [];
  }

  const buttonsMap = new Map<string, boolean>();
  buttonsByType.forEach((button: string) => {
    let buttonName = '';

    if (button === '|') {
      buttonName = 'separator';
    } else {
      buttonName = camelCase(button);
    }
    buttonsMap.set(buttonName, true);
  });

  const tiptapToolbarItemsConfig: IToolbarItemConfigTiptap[] = [];
  buttonsMap.forEach((shouldBeExists, buttonId) => {
    if (shouldBeExists) {
      const buttonConfig = tiptapToolbarConfig.find(config => config.id === buttonId);
      if (buttonConfig) {
        tiptapToolbarItemsConfig.push(buttonConfig);
      } else {
        console.error(`buttonId:${buttonId} is missing`);
      }
    }
  });
  return tiptapToolbarItemsConfig;
};
