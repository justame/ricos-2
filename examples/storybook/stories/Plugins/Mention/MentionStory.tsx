/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import TabsWrapper from '../../Components/TabsWrapper';
import { Page } from '../../Components/StoryParts';
import apiData from '../apiData';
import { RicosEditor } from 'ricos-editor';
import { pluginMentions } from 'wix-rich-content-plugin-mentions';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import styles from './mentions.scss';

export default () => {
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorRef, setEditorRef] = useState<any>();

  const mentionConfig = {
    repositionSuggestions: true,
    visibleItemsBeforeOverflow: 5,
    popoverComponent: <div />,
    supportWhitespace: false,
    handleDropdownOpen: () => setIsSuggestionOpen(true),
    handleDropdownClose: () => setIsSuggestionOpen(false),
    getMentions: searchQuery =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              mentionsList.filter(({ name }) =>
                name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            ),
          250
        )
      ),
  };
  return (
    <TabsWrapper apiData={apiData.VERTICAL_EMBED}>
      <Page title="Mention with external handlers">
        <div className={styles.editorContainer}>
          <div>
            Mock external toolbar
            <div className={styles.externalToolbar}>
              <div
                onClick={() => editorRef.getEditorCommands().triggerDecoration('ricos-mention')}
                className={styles.button}
              >
                Add mention
              </div>
              <div className={styles.separator} />
            </div>
          </div>
          <RicosEditor
            experiments={{ tiptapEditor: { enabled: true } }}
            plugins={[pluginMentions(mentionConfig)]}
            ref={ref => ref && !editorRef && setEditorRef(ref)}
            toolbarSettings={{
              getToolbarSettings: () => [
                { name: TOOLBARS.SIDE },
                { name: TOOLBARS.FORMATTING },
                { name: TOOLBARS.FOOTER },
              ],
            }}
          />
        </div>
        {isSuggestionOpen && (
          <MentionSuggestion
            insertMention={mention =>
              editorRef.getEditorCommands().insertDecoration('ricos-mention', {
                mention,
              })
            }
          />
        )}
      </Page>
    </TabsWrapper>
  );
};

const MentionSuggestion = ({ insertMention }) => {
  return (
    <div className={styles.suggestions}>
      {mentionsList.map(({ name, avatar }) => (
        <div key={name} className={styles.item} onClick={() => insertMention({ name })}>
          <img className={styles.avatar} src={avatar} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
};

const mentionsList = [
  {
    name: 'Oded Soffrin',
    slug: 'oddedsoffrin',
    avatar: 'https://ca.slack-edge.com/T02T01M9Y-U0MN7A3H8-38d64543367b-192',
  },
  {
    name: 'Alex Greenstein',
    slug: 'alexgreenstein',
    avatar: 'https://ca.slack-edge.com/T02T01M9Y-U6FQCJ5GT-65d722ddfc28-192',
  },
  { name: 'Yaron Nachshon', slug: 'yaronnachshon' },
  {
    name: 'Dana Rish',
    slug: 'danarish',
    avatar: 'https://ca.slack-edge.com/T02T01M9Y-UEBDPSU2W-ad52085040c0-192',
  },
  {
    name: 'Judith Gabriela Jaroslavsky',
    slug: 'judithjaroslavsky',
    avatar: 'https://ca.slack-edge.com/T02T01M9Y-UHMNZJ9P1-c693bb66ca93-512',
  },
  { name: 'Test One.5', slug: 'testone5' },
  { name: 'Test One.6', slug: 'testone6' },
  { name: 'Test One.7', slug: 'testone7' },
  { name: 'Test One.8', slug: 'testone8' },
  {
    name: 'Test Two',
    slug: 'testwo',
    avatar: 'https://via.placeholder.com/100x100?text=Image=50',
  },
];
