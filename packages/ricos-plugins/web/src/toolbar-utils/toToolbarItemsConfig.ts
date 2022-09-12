import type { IToolbarItemConfigTiptap, ToolbarSettingsFunctions, ToolbarType } from 'ricos-types';
import { Decoration_Type, Node_Type } from 'ricos-types';
import { isiOS } from './isiOS';
import type { PluginTextButton } from '../plugin-text-button';
import toConstantCase from 'to-constant-case';
import { FORMATTING_BUTTONS } from 'wix-rich-content-editor-common';

const cleanTitleIfNeeded = (
  tiptapToolbarItemsConfig: IToolbarItemConfigTiptap[]
): IToolbarItemConfigTiptap[] => {
  if (
    tiptapToolbarItemsConfig.some(button => button.id === `${Node_Type.HEADING}.dropdown`) &&
    tiptapToolbarItemsConfig.some(button => button.id === `${Node_Type.HEADING}.title`)
  ) {
    return tiptapToolbarItemsConfig.filter(button => button.id !== `${Node_Type.HEADING}.title`);
  } else {
    return tiptapToolbarItemsConfig;
  }
};

// maps FORMATTING_BUTTONS to Node_Type/Decoration_Type with some modifications
const toSchemaBasedId = (formattingButtonId: string): string => {
  const compatibleIds = [
    'LINE_SPACING',
    'UNDO',
    'REDO',
    'separator',
    Node_Type.CODE_BLOCK,
    Decoration_Type.BOLD,
    Decoration_Type.ITALIC,
    Decoration_Type.UNDERLINE,
    Decoration_Type.SPOILER,
    Decoration_Type.LINK,
    Decoration_Type.FONT_SIZE,
    Node_Type.ORDERED_LIST,
    Node_Type.BLOCKQUOTE,
  ];
  const specificMapping = {
    ALIGNMENT: 'TextAlignment.ALIGNMENT',
    ALIGN_LEFT: 'TextAlignment.LEFT',
    ALIGN_CENTER: 'TextAlignment.CENTER',
    ALIGN_RIGHT: 'TextAlignment.RIGHT',
    JUSTIFY: 'TextAlignment.JUSTIFY',
    TITLE: `${Node_Type.HEADING}.title`,
    HEADINGS: `${Node_Type.HEADING}.dropdown`,
    UNORDERED_LIST: Node_Type.BULLETED_LIST,
    INCREASE_INDENT: `INDENT.increase`,
    DECREASE_INDENT: `INDENT.decrease`,
    TEXT_COLOR: `${Decoration_Type.COLOR}.foreground`,
    TEXT_HIGHLIGHT: `${Decoration_Type.COLOR}.background`,
    ADD_PLUGIN: 'addPlugin',
  };
  if (compatibleIds.includes(formattingButtonId)) {
    return formattingButtonId;
  }
  const id = specificMapping[formattingButtonId];
  if (!id) {
    console.error(`toSchemaBasedId: unknown formattingButtonId: ${formattingButtonId}`);
  }
  return id;
};

function getButtonsListFromConfig(
  toolbarConfig: ToolbarSettingsFunctions,
  buttonsType: 'desktop' | 'mobile'
) {
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

  return buttons;
}

function mapButtonsFromConfig(configButtonId: string) {
  let buttonName = '';

  if (configButtonId === '|') {
    buttonName = 'separator';
  } else {
    buttonName = toConstantCase(configButtonId);
  }
  return buttonName;
}

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

  const buttonsListFromConfig = getButtonsListFromConfig(toolbarConfig, buttonsType);

  const buttonsList = buttonsListFromConfig.map(mapButtonsFromConfig);

  const tiptapToolbarItemsConfig: IToolbarItemConfigTiptap[] = [];
  buttonsList.map(toSchemaBasedId).forEach(button => {
    const buttonConfig = tiptapToolbarConfig.find(config => config.id === button);
    if (buttonConfig) {
      tiptapToolbarItemsConfig.push(buttonConfig);
    }
  });

  const finalTiptapToolbarItemsConfig = cleanTitleIfNeeded(tiptapToolbarItemsConfig);
  return finalTiptapToolbarItemsConfig;
}

function handleDeprecatedButtons(configButtonId: string | { name: string }) {
  if (typeof configButtonId === 'string') return configButtonId;
  if (configButtonId.name === 'Alignment') {
    return FORMATTING_BUTTONS.ALIGNMENT;
  }
}

export function toExternalToolbarItemsConfig(
  toolbarConfig: ToolbarSettingsFunctions | undefined,
  pluginTextButtons: PluginTextButton[],
  toolbarType: ToolbarType,
  buttonsType: 'desktop' | 'mobile'
) {
  if (!toolbarConfig) {
    console.error(`${toolbarType} doesn't exists`);
    return [];
  }

  const buttonsListFromConfig = getButtonsListFromConfig(toolbarConfig, buttonsType);

  const buttonsList = buttonsListFromConfig.map(handleDeprecatedButtons).map(mapButtonsFromConfig);

  const externalToolbarItemsConfig: PluginTextButton[] = [];
  buttonsList.map(toSchemaBasedId).forEach(button => {
    const buttonConfig = pluginTextButtons.find(b => b.getButtonId() === button);
    if (buttonConfig) {
      externalToolbarItemsConfig.push(buttonConfig);
    }
  });

  return externalToolbarItemsConfig;
}
