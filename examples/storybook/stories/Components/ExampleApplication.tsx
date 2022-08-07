import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { RichContentEditorBox, RichContentViewerBox, Section } from './StoryParts';
import EditorWrapper from './EditorWrapper';
import ViewerWrapper from './ViewerWrapper';
// eslint-disable-next-line import/no-unresolved
import editorSourceCode from '../Components/EditorWrapper?raw';
// eslint-disable-next-line import/no-unresolved
import viewerSourceCode from '../Components/ViewerWrapper?raw';
import styles from './styles.scss';
import type { DraftContent, RicosTheme } from 'ricos-editor';
import type { AvailableExperiments } from 'ricos-types';

const ExampleApplication: FunctionComponent<{
  initialState?: DraftContent;
  theme?: RicosTheme;
  display?: 'Editor' | 'Viewer' | 'Both';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorProps?: Record<string, any>;
  experiments?: AvailableExperiments;
  modalSettings?: { container: HTMLElement };
}> = ({
  initialState,
  theme,
  display = 'Both',
  editorProps = {},
  experiments = {},
  modalSettings,
}) => {
  const [content, setContent] = useState(initialState);
  const showEditor = useMemo(() => display === 'Both' || display === 'Editor', [display]);
  const showViewer = useMemo(() => display === 'Both' || display === 'Viewer', [display]);
  return (
    <Section type={Section.Types.COMPARISON}>
      {showEditor && (
        <RichContentEditorBox sourcecode={editorSourceCode}>
          <EditorWrapper
            content={content}
            theme={{ ...theme, parentClass: styles['rce-wrapper'] }}
            onChange={setContent}
            experiments={experiments}
            modalSettings={modalSettings}
            {...editorProps}
          />
        </RichContentEditorBox>
      )}
      {showViewer && (
        <RichContentViewerBox sourcecode={viewerSourceCode}>
          <ViewerWrapper
            content={content}
            theme={{ ...theme, parentClass: styles['rcv-wrapper'] }}
          />
        </RichContentViewerBox>
      )}
    </Section>
  );
};

export default ExampleApplication;
