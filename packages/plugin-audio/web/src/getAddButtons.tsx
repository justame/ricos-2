import { DEFAULTS } from './audio-component';
import AudioInsertPluginIcon from './icons/InsertPluginIcon';
import { SoundCloudIcon, SpotifyIcon } from 'wix-rich-content-ui-components';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import type { AddButton } from 'ricos-types';
import { audioButtonsTypes } from './types';
import { audioModals } from './consts';
import { compact } from 'lodash';

export const getAddButtons = (config): AddButton[] => {
  const {
    getAudioUrl,
    exposeButtons = [audioButtonsTypes.audio],
    handleFileSelection,
    handleFileUpload,
    disableDownload = true,
    fetchData,
  } = config || {};

  const modalBaseProps = {
    getAudioUrl,
    handleFileSelection,
    handleFileUpload,
    fetchData,
  };

  const buttonsMap: Record<string, AddButton> = {
    [audioButtonsTypes.audio]: {
      id: 'audio',
      label: INSERT_PLUGIN_BUTTONS.AUDIO,
      dataHook: INSERT_PLUGIN_BUTTONS.AUDIO,
      icon: AudioInsertPluginIcon,
      tooltip: 'AudioPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: audioModals.insertAudio,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: { ...DEFAULTS, disableDownload },
          modalId: audioModals.insertAudio,
          ...modalBaseProps,
        }),
      },
      menuConfig: {
        tags: 'Audio_plugin_search_tags',
        group: 'embed',
      },
    },
    [audioButtonsTypes.soundCloud]: {
      id: 'soundcloud',
      label: INSERT_PLUGIN_BUTTONS.SOUND_CLOUD,
      dataHook: INSERT_PLUGIN_BUTTONS.SOUND_CLOUD,
      icon: SoundCloudIcon,
      tooltip: 'SoundCloudPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: audioModals.insertSoundCloud,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: { ...DEFAULTS, type: audioButtonsTypes.soundCloud },
          modalId: audioModals.insertSoundCloud,
          embedType: true,
          ...modalBaseProps,
        }),
      },
      menuConfig: {
        tags: 'SoundCloud_plugin_search_tags',
        group: 'embed',
      },
    },
    [audioButtonsTypes.spotify]: {
      id: 'spotify',
      label: INSERT_PLUGIN_BUTTONS.SPOTIFY,
      dataHook: INSERT_PLUGIN_BUTTONS.SPOTIFY,
      icon: SpotifyIcon,
      tooltip: 'Spotify_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: audioModals.insertSpotify,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: { ...DEFAULTS, type: audioButtonsTypes.spotify },
          modalId: audioModals.insertSpotify,
          embedType: true,
          ...modalBaseProps,
        }),
      },
      menuConfig: {
        tags: 'AudioPlugin_InsertButton',
        group: 'embed',
      },
    },
  };

  return compact(exposeButtons.map(buttonType => buttonsMap[buttonType]));
};
