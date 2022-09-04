import React, { useRef } from 'react';
import { Page } from '../Components/StoryParts';
// import ExampleApplication from '../Components/ExampleApplication';
import EditorWrapper from '../Components/EditorWrapper';
import exampleAppContent from '../../../../e2e/tests/fixtures/storybook-tiptap-example-app.json';

export default () => {
  const editorExternalContainer = useRef(null);

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
    container: () => editorExternalContainer.current,
  };

  return (
    <Page title="Tiptap inside container">
      <div
        ref={editorExternalContainer}
        style={{
          height: 500,
          border: '1px solid black',
          overflow: 'scroll',
          paddingLeft: '50px',
        }}
      >
        <EditorWrapper content={exampleAppContent} {...editorProps} />
      </div>
    </Page>
  );
};
