import VideoSelectionInputModal from './toolbar/videoSelectionInputModal';
import VideoSettingsModal from './toolbar/VideoSettings';

const Modals = {
  VIDEO_SELECTION_INPUT: 'video-selection-input',
  VIDEO_SETTINGS: 'video-settings',
};

const ModalsMap = {
  [Modals.VIDEO_SELECTION_INPUT]: VideoSelectionInputModal,
  [Modals.VIDEO_SETTINGS]: VideoSettingsModal,
};

export { Modals, ModalsMap };
