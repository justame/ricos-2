const modalContentStyles: React.CSSProperties = {
  width: 363,
  padding: 20,
  boxSizing: 'border-box',
  border: 'solid 1px rgba(51, 51, 51, 0.1)',
  borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
  boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
};

export const audioModalContentStyles: React.CSSProperties = {
  height: 232,
  ...modalContentStyles,
};

export const embedModalContentStyles: React.CSSProperties = {
  height: 180,
  ...modalContentStyles,
};

export const downloadFile = (url: string, fileName) => {
  fetch(url, {
    method: 'GET',
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    });
};

export const getAudioSrc = (src, settings) => {
  if (src?.url) return src.url;
  if (typeof src === 'object') {
    if (settings && settings.getAudioUrl) {
      return settings.getAudioUrl(src);
    } else {
      console.error('must set getAudioUrl in plugin config when using custom audio source!', src); //eslint-disable-line no-console
    }
  }
  return src;
};

export const playbackRates = [
  {
    text: '0.25',
    rate: 0.25,
  },
  {
    text: '0.5',
    rate: 0.5,
  },
  {
    text: '0.75',
    rate: 0.75,
  },
  {
    text: 'Normal',
    rate: 1,
  },
  {
    text: '1.25',
    rate: 1.25,
  },
  {
    text: '1.5',
    rate: 1.5,
  },
  {
    text: '1.75',
    rate: 1.75,
  },
  {
    text: '2',
    rate: 2,
  },
];

export const SETTINGS_IMG_SIZE = '120px';

interface IAudioActionNames {
  fileDownloaded: 'fileDownloaded';
  playAudio: 'playAudio';
  changeTitle: 'changeTitle';
  changeCreator: 'changeCreator';
  changeCover: 'changeCover';
  downloadAudio: 'downloadAudio';
}

export const AUDIO_ACTION_NAMES: IAudioActionNames = {
  fileDownloaded: 'fileDownloaded',
  playAudio: 'playAudio',
  changeTitle: 'changeTitle',
  changeCreator: 'changeCreator',
  changeCover: 'changeCover',
  downloadAudio: 'downloadAudio',
};

export const AUDIO_BI_VALUES = {
  PLAY: 'play',
  PAUSE: 'pause',
  PLAYBACK_COMPLETED: 'playbackCompleted',
  YES: 'yes',
  NO: 'no',
  click: 'Click',
};

export const AUDIO_TYPES: { custom: 'File Upload'; spotify: 'Spotify'; soundCloud: 'SoundCloud' } =
  { custom: 'File Upload', spotify: 'Spotify', soundCloud: 'SoundCloud' };

export const audioFileTypes = '.mp3,.pcm,.wav,.aiff,.aif,.aac,.ogg,.wma,.m4a,.flac';

export const audioModals = {
  insert: 'audioInsertModal',
  settings: 'audioSettings',
  insertAudio: 'audioInsertModal',
  insertSoundCloud: 'soundCloudInsertModal',
  insertSpotify: 'spotifyInsertModal',
  replace: 'audioReplaceModal',
};

export const fileInputAccept = '.jpg,.png,.gif,.jpeg,.jpe,.jfif,.bmp,.heic,.heif,.tfif,.tif,.webp';
