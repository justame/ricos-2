import type {
  IToolbarItemConfigTiptap,
  ToolbarSettingsFunctions,
  ToolbarType,
  PluginAddButton,
} from 'ricos-types';
import { Decoration_Type, Node_Type } from 'ricos-types';
import { isiOS } from './isiOS';
import type { PluginTextButton } from '../plugin-text-button';
import toConstantCase from 'to-constant-case';
import { FORMATTING_BUTTONS, INSERT_PLUGIN_BUTTONS } from 'wix-rich-content-editor-common';

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

// maps INSERT_PLUGIN_BUTTONS to Node_Type/Decoration_Type with some modifications
const fromConfigToSchemaBasedId = (insertButtonId: string): string => {
  const specificMapping = {
    [INSERT_PLUGIN_BUTTONS.IMAGE]: Node_Type.IMAGE,
    [INSERT_PLUGIN_BUTTONS.GALLERY]: Node_Type.GALLERY,
    [INSERT_PLUGIN_BUTTONS.POLLS]: Node_Type.POLL,
    [INSERT_PLUGIN_BUTTONS.DIVIDER]: Node_Type.DIVIDER,
    [INSERT_PLUGIN_BUTTONS.HTML]: `${Node_Type.HTML}.html`,
    [INSERT_PLUGIN_BUTTONS.VIDEO]: `${Node_Type.VIDEO}.video`,
    [INSERT_PLUGIN_BUTTONS.INSTAGRAM]: `${Node_Type.LINK_PREVIEW}.instagram`,
    [INSERT_PLUGIN_BUTTONS.YOUTUBE]: `${Node_Type.VIDEO}.youTube`,
    [INSERT_PLUGIN_BUTTONS.TIKTOK]: `${Node_Type.LINK_PREVIEW}.tiktok`,
    [INSERT_PLUGIN_BUTTONS.TWITTER]: `${Node_Type.LINK_PREVIEW}.twitter`,
    [INSERT_PLUGIN_BUTTONS.PINTEREST]: `${Node_Type.LINK_PREVIEW}.pinterest`,
    [INSERT_PLUGIN_BUTTONS.FACEBOOK]: `${Node_Type.LINK_PREVIEW}.facebook`,
    [INSERT_PLUGIN_BUTTONS.STORES]: `${Node_Type.APP_EMBED}.product`,
    [INSERT_PLUGIN_BUTTONS.EVENTS]: `${Node_Type.APP_EMBED}.event`,
    [INSERT_PLUGIN_BUTTONS.BOOKINGS]: `${Node_Type.APP_EMBED}.booking`,
    [INSERT_PLUGIN_BUTTONS.BUTTON]: Node_Type.BUTTON,
    [INSERT_PLUGIN_BUTTONS.CODE_BLOCK]: Node_Type.CODE_BLOCK,
    [INSERT_PLUGIN_BUTTONS.SOUND_CLOUD]: `${Node_Type.AUDIO}.soundCloud`,
    [INSERT_PLUGIN_BUTTONS.GIF]: Node_Type.GIF,
    [INSERT_PLUGIN_BUTTONS.MAP]: Node_Type.MAP,
    [INSERT_PLUGIN_BUTTONS.FILE]: Node_Type.FILE,
    [INSERT_PLUGIN_BUTTONS.EMOJI]: 'wix-draft-plugin-emoji',
    [INSERT_PLUGIN_BUTTONS.UNDO]: 'UNDO',
    [INSERT_PLUGIN_BUTTONS.REDO]: 'REDO',
    [INSERT_PLUGIN_BUTTONS.TABLE]: Node_Type.TABLE,
    [INSERT_PLUGIN_BUTTONS.COLLAPSIBLE_LIST]: Node_Type.COLLAPSIBLE_LIST,
    [INSERT_PLUGIN_BUTTONS.ADSENSE]: `${Node_Type.HTML}.adsense`,
    [INSERT_PLUGIN_BUTTONS.AUDIO]: `${Node_Type.AUDIO}.audio`,
    [INSERT_PLUGIN_BUTTONS.SPOTIFY]: `${Node_Type.AUDIO}.spotify`,
  };

  const id = specificMapping[insertButtonId];
  if (!id) {
    console.error(`toSchemaBasedId: unknown insertButtonId: ${insertButtonId}`);
  }
  return id;
};

export function toExternalInsertPluginToolbarItemsConfig(
  toolbarConfig: ToolbarSettingsFunctions | undefined,
  pluginInsertButtons: PluginAddButton[],
  toolbarType: ToolbarType,
  buttonsType: 'desktop' | 'mobile'
) {
  if (!toolbarConfig) {
    console.error(`${toolbarType} doesn't exists`);
    return [];
  }

  const buttonsListFromConfig = getButtonsListFromConfig(toolbarConfig, buttonsType);

  const externalToolbarItemsConfig: PluginAddButton[] = [];
  buttonsListFromConfig.map(fromConfigToSchemaBasedId).forEach(button => {
    const buttonConfig = pluginInsertButtons.find(b => b.getButtonId() === button);
    if (buttonConfig) {
      externalToolbarItemsConfig.push(buttonConfig);
    }
  });

  return externalToolbarItemsConfig;
}
