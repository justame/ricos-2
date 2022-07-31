import { compact } from 'lodash';
import htmlDataDefaults from 'ricos-schema/dist/statics/html.defaults.json';
import type { AddButton } from 'ricos-types';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import { htmlButtonsTypes } from './defaults';
import { AdsenseIcon, InsertPluginIcon } from './icons';
import { HTML_TYPE } from './types';

export const getAddButtons = (config, _services): AddButton[] => {
  const { exposeButtons = [htmlButtonsTypes.html], siteDomain } = config || {};
  const index = exposeButtons.indexOf(htmlButtonsTypes.adsense);
  if (!siteDomain && index > -1) {
    exposeButtons.splice(index, 1);
  }
  const buttonsMap: Record<string, AddButton> = {
    [htmlButtonsTypes.html]: {
      id: 'html',
      label: INSERT_PLUGIN_BUTTONS.HTML,
      dataHook: INSERT_PLUGIN_BUTTONS.HTML,
      icon: InsertPluginIcon,
      tooltip: 'HtmlPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        editorCommands.insertBlock(HTML_TYPE, htmlDataDefaults);
        return true;
      },
      menuConfig: {
        tags: 'Video_plugin_search_tags',
      },
    },
    [htmlButtonsTypes.adsense]: {
      id: 'adsense',
      label: INSERT_PLUGIN_BUTTONS.ADSENSE,
      dataHook: INSERT_PLUGIN_BUTTONS.ADSENSE,
      icon: AdsenseIcon,
      tooltip: 'AdSensePlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => {
        editorCommands.insertBlock(HTML_TYPE, htmlDataDefaults);
        return true;
      },
      menuConfig: {
        tags: 'Video_plugin_search_tags',
        group: 'embed',
      },
    },
  };

  return compact(exposeButtons.map(buttonType => buttonsMap[buttonType]));
};
