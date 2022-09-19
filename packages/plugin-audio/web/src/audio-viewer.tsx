import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { RichContentTheme, ComponentData, Helpers, Store } from 'wix-rich-content-common';
import { mergeStyles } from 'wix-rich-content-common';
import type { AudioPluginViewerConfig } from './types';
import ReactPlayerWrapper from './ReactPlayerWrapper';
import styles from '../statics/styles/audio.rtlignore.scss';
import AudioEmbedViewer from './AudioEmbedViewer';
import { getAudioSrc } from './consts';
import type { ContentBlock } from 'draft-js';

interface Props {
  componentData: ComponentData;
  settings: AudioPluginViewerConfig;
  theme: RichContentTheme;
  helpers: Helpers;
  store?: Store;
  block?: ContentBlock;
  isMobile: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const AudioViewer: FC<Props> = ({
  theme,
  isMobile,
  helpers,
  settings,
  disabled,
  componentData,
  isLoading,
  store,
  block,
}) => {
  const classes = useMemo(() => mergeStyles({ styles, theme }), [theme]);
  const { audio = {}, authorName, name, coverImage, disableDownload } = componentData;
  const url = getAudioSrc(audio?.src, settings);
  const shouldEmbed = componentData.html;
  const saveDurationToData = duration => {
    store?.set(
      'componentData',
      { ...componentData, audio: { ...componentData.audio, duration } },
      block?.getKey()
    );
  };
  return (
    <div className={classes.container} data-hook="audioViewer">
      {!shouldEmbed ? (
        <ReactPlayerWrapper
          theme={theme}
          url={url}
          name={name}
          authorName={authorName}
          coverImage={coverImage}
          disableDownload={disableDownload}
          helpers={helpers}
          isMobile={isMobile}
          showControls={!!audio?.src?.url}
          disabled={disabled}
          isLoading={isLoading}
          saveDurationToData={saveDurationToData}
          isDownloadDisabled={settings?.disableDownload}
        />
      ) : (
        <AudioEmbedViewer
          componentData={componentData}
          settings={settings}
          theme={theme}
          isMobile={isMobile}
          helpers={helpers}
        />
      )}
    </div>
  );
};

export default AudioViewer;
