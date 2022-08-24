import React from 'react';
import { Page } from '../Components/StoryParts';
import ExampleApplication from '../Components/ExampleApplication';
import exampleAppContent from '../../../../e2e/tests/fixtures/storybook-tiptap-example-app.json';

export default () => {
  const editorProps = {
    linkSettings: {
      anchorTarget: '_blank',
      relValue: 'nofollow',
    },
    experiments: {
      tiptapEditor: {
        enabled: true,
      },
    },
  };
  return (
    <Page title="Example App">
      <div style={{ width: 500, height: 500, border: '1px solid black', overflow: 'scroll' }}>
        <ExampleApplication initialState={exampleAppContent} editorProps={editorProps} />
      </div>
    </Page>
  );
};
