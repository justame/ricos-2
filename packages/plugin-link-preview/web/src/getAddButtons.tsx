import { TwitterIcon, InstagramIcon, FacebookIcon, TikTokIcon, PinterestIcon } from './icons';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import type { AddButton } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { socialModals } from './consts';
import { compact } from 'lodash';

export const getAddButtons = (config, services): AddButton[] => {
  const { exposeEmbedButtons = [], fetchData } = config || {};

  const buttonsMap: Record<string, AddButton> = {
    Instagram: {
      id: `${Node_Type.LINK_PREVIEW}.instagram`,
      label: INSERT_PLUGIN_BUTTONS.INSTAGRAM,
      dataHook: INSERT_PLUGIN_BUTTONS.INSTAGRAM,
      icon: InstagramIcon,
      tooltip: 'InstagramPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: socialModals.instagram,
        Component: decorateComponentWithProps(InsertModal, {
          fetchData,
          socialType: 'Instagram',
        }),
      },
      menuConfig: {
        tags: 'Instagram_plugin_search_tags',
        group: 'embed',
      },
    },
    Twitter: {
      id: `${Node_Type.LINK_PREVIEW}.twitter`,
      label: INSERT_PLUGIN_BUTTONS.TWITTER,
      dataHook: INSERT_PLUGIN_BUTTONS.TWITTER,
      icon: TwitterIcon,
      tooltip: 'TwitterPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: socialModals.twitter,
        Component: decorateComponentWithProps(InsertModal, {
          fetchData,
          socialType: 'Twitter',
        }),
      },
      menuConfig: {
        tags: 'YouTube_plugin_search_tags',
        group: 'embed',
      },
    },
    Pinterest: {
      id: `${Node_Type.LINK_PREVIEW}.pinterest`,
      label: INSERT_PLUGIN_BUTTONS.PINTEREST,
      dataHook: INSERT_PLUGIN_BUTTONS.PINTEREST,
      icon: PinterestIcon,
      tooltip: 'PinterestPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: socialModals.pinterest,
        Component: decorateComponentWithProps(InsertModal, {
          fetchData,
          socialType: 'Pinterest',
        }),
      },
      menuConfig: {
        tags: 'Pinterestsearch_tags',
        group: 'embed',
      },
    },
    Facebook: {
      id: `${Node_Type.LINK_PREVIEW}.facebook`,
      label: INSERT_PLUGIN_BUTTONS.FACEBOOK,
      dataHook: INSERT_PLUGIN_BUTTONS.FACEBOOK,
      icon: FacebookIcon,
      tooltip: 'FacebookPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: socialModals.facebook,
        Component: decorateComponentWithProps(InsertModal, {
          fetchData,
          socialType: 'Facebook',
        }),
      },
      menuConfig: {
        tags: 'Facebook_plugin_search_tags',
        group: 'embed',
      },
    },
    TikTok: {
      id: `${Node_Type.LINK_PREVIEW}.tiktok`,
      label: INSERT_PLUGIN_BUTTONS.TIKTOK,
      dataHook: INSERT_PLUGIN_BUTTONS.TIKTOK,
      icon: TikTokIcon,
      tooltip: 'TikTokPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: socialModals.tiktok,
        Component: decorateComponentWithProps(InsertModal, {
          fetchData,
          socialType: 'TikTok',
        }),
      },
      menuConfig: {
        tags: 'YouTube_plugin_search_tags',
        group: 'embed',
      },
    },
  };

  return compact(exposeEmbedButtons.map(buttonType => buttonsMap[buttonType]));
};
