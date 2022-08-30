import type { ToolbarButton } from 'ricos-types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  decorateComponentWithProps,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import VideoSettingsModal from './modals/SettingsModal';
import { videoModals, VIDEO_BUTTONS } from './constants';
import {
  AlignmentPanel,
  NodeAlignmentButton,
  NodeSizeButton,
  SizePanel,
} from 'wix-rich-content-toolbars-ui';
import React from 'react';
import type { PluginContainerData_Width_Type } from 'ricos-schema';
import { SPOILER_TYPE, VIDEO_TYPE } from 'ricos-content';
import { getVisibleOnlyOnDesktopResolver } from 'wix-rich-content-plugin-commons';

export const getToolbarButtons = (config, services): ToolbarButton[] => {
  const { enableCustomUploadOnMobile, getVideoUrl, handleFileSelection, handleFileUpload } =
    config || {};

  const {
    modals,
    context: { isMobile },
  } = services;
  const modalBaseProps = {
    enableCustomUploadOnMobile,
    getVideoUrl,
    handleFileSelection,
    handleFileUpload,
  };

  const shouldShowSpoiler = () => {
    const spoilerPlugin = services.plugins
      .asArray()
      .find(plugin => plugin.getType() === SPOILER_TYPE);
    return (
      spoilerPlugin &&
      (!spoilerPlugin.getConfig().supportedPlugins ||
        spoilerPlugin.getConfig().supportedPlugins.includes(VIDEO_TYPE))
    );
  };

  const settingsVisibilityResolver = {
    id: 'IS_VIDEO_SETTINGS_BUTTON_VISIBLE',
    resolve: content => {
      if (Array.isArray(content) && content.length > 0) {
        const isCustomVideo = !!content[0].attrs.video?.src?.id;
        return shouldShowSpoiler() || isCustomVideo;
      }
      return false;
    },
  };

  return [
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SIZE,
      modal: {
        Component: decorateComponentWithProps(SizePanel, {
          options: ['SMALL', 'CONTENT'] as PluginContainerData_Width_Type[],
        }),
        id: VIDEO_BUTTONS.size,
      },
      renderer: toolbarItem => <NodeSizeButton id={VIDEO_BUTTONS.size} toolbarItem={toolbarItem} />,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.ALIGNMENT,
      modal: {
        Component: AlignmentPanel,
        id: VIDEO_BUTTONS.alignment,
      },
      renderer: toolbarItem => (
        <NodeAlignmentButton toolbarItem={toolbarItem} id={VIDEO_BUTTONS.alignment} />
      ),
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: getVisibleOnlyOnDesktopResolver(isMobile),
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SETTINGS,
      modal: {
        id: videoModals.settings,
        Component: VideoSettingsModal,
      },
      attributes: {
        visible: settingsVisibilityResolver,
      },
      command: ({ isMobile, attributes: { selectedNode } }) => {
        modals?.openModal(videoModals.settings, {
          componentProps: {
            nodeId: selectedNode.attrs.id,
          },
          positioning: { placement: 'right' },
          layout: isMobile ? 'fullscreen' : 'drawer',
        });
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
      attributes: {
        visible: settingsVisibilityResolver,
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.REPLACE,
      modal: {
        Component: decorateComponentWithProps(InsertModal, { modalId: videoModals.replace }),
        id: videoModals.replace,
      },
      command: ({ isMobile, referenceElement, attributes: { selectedNode } }) => {
        const {
          video: { src },
          id,
        } = selectedNode.attrs;
        if (modals?.isModalOpen(videoModals.replace)) {
          modals.closeModal(videoModals.replace);
        } else {
          modals?.openModal(videoModals.replace, {
            componentProps: {
              componentData: { isCustomVideo: src.id, src: src.url || src.id }, //TODO: convert to draft
              nodeId: id,
              ...modalBaseProps,
            },
            positioning: { placement: 'bottom', referenceElement },
            layout: isMobile ? 'fullscreen' : 'popover',
          });
        }
      },
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.SEPARATOR,
    },
    {
      id: PLUGIN_TOOLBAR_BUTTON_ID.DELETE,
    },
  ];
};
