import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { RicosEditor } from 'ricos-editor';
import { RichContentEditorBox, Section, Page } from '../Components/StoryParts';
import { pluginImage } from 'wix-rich-content-plugin-image';
import { pluginGallery } from 'wix-rich-content-plugin-gallery';
import { pluginPoll } from 'wix-rich-content-plugin-social-polls';
import { SocialPollsServiceMock } from '../../../main/src/Components/SocialPollsServiceMock/SocialPollsServiceMock';
import MobileDetect from 'mobile-detect';
import ActionButton from '../Components/ActionButton';
import type { EditorEventsProps } from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import { withEditorContext } from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import { ToggleTiptapButton } from '../Components/ToggleTiptapButton';
import { POLL_TYPE } from 'ricos-content';

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const plugins = [pluginImage(), pluginGallery(), pluginPoll()];

const RicosPublishStory: FunctionComponent<EditorEventsProps> = ({ editorEvents }) => {
  const modalSettings = {
    // eslint-disable-next-line no-console
    onModalOpen: () => console.log('modal opened'),
    // eslint-disable-next-line no-console
    onModalClose: () => console.log('modal closed'),
  };
  const isMobile = mobileDetect.mobile() !== null;
  const [content, setContent] = useState('');
  const [isTiptap, setIsTiptap] = useState(false);
  const { publish } = editorEvents;

  return (
    <Page title="Ricos - editorEvents.publish()">
      <h4>
        See Usage{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://ricos.js.org/docs/ricos/editor-events-context"
        >
          here
        </a>
      </h4>
      <Section>
        <ToggleTiptapButton isTiptap={isTiptap} setIsTiptap={setIsTiptap} />
        <RichContentEditorBox>
          <RicosEditor
            rceNext={isTiptap}
            isMobile={isMobile}
            plugins={plugins}
            modalSettings={modalSettings}
            _rcProps={{
              helpers: {
                // eslint-disable-next-line no-console
                onPublish: async (...args) => console.log('biOnPublish', args),
              },
              config: { [POLL_TYPE]: { pollServiceApi: new SocialPollsServiceMock() } },
            }}
          />
          <ActionButton
            text={'Publish'}
            onClick={async () => {
              const editorContent = await publish();
              setContent(editorContent as string);
            }}
          />
        </RichContentEditorBox>
      </Section>
      <Section title="Returned Content:">
        <i>{JSON.stringify(content)}</i>
      </Section>
    </Page>
  );
};

export default withEditorContext(RicosPublishStory);
