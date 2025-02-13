import React from 'react';
import { RichContentEditorBox, Section, Page } from '../../Components/StoryParts';
import headingsContentState from '../../../../../e2e/tests/fixtures/headings.json';
import HeadingsEditor from './HeadingsEditor';
// eslint-disable-next-line import/no-unresolved
import editorSourcecode from './HeadingsEditor.tsx?raw';

export default () => {
  return (
    <Page title="Headings Plugin">
      <Section type={Section.Types.COMPARISON}>
        <RichContentEditorBox
          title="With Headings Menu"
          sourcecode={editorSourcecode}
          content={headingsContentState}
        >
          <HeadingsEditor content={headingsContentState} withHeadingsMenu />
        </RichContentEditorBox>
        <RichContentEditorBox title="With Headings Button">
          <HeadingsEditor content={headingsContentState} withHeadingsMenu={false} />
        </RichContentEditorBox>
      </Section>
    </Page>
  );
};
