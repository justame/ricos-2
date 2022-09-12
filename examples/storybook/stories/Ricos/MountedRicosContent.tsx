import React, { useState } from 'react';
import { Page } from '../Components/StoryParts';
import { RicosEditor } from 'ricos-editor';
import { pluginImage } from 'wix-rich-content-plugin-image';
import { pluginGallery } from 'wix-rich-content-plugin-gallery';
import exampleAppContent from '../../../../e2e/tests/fixtures/storybook-example-app.json';
import longPostContent from '../../../../e2e/tests/fixtures/very-big-post.json';
import { ToggleTiptapButton } from '../Components/ToggleTiptapButton';

export default () => {
  const [toggled, setToggled] = useState(true);
  const [isTiptap, setIsTiptap] = useState(false);
  const plugins = [pluginImage(), pluginGallery()];

  const toggle = () => setToggled(toggled => !toggled);
  return (
    <Page title="Change Content to Mounted Ricos">
      <button onClick={toggle}>{'Switch Content'}</button>
      <ToggleTiptapButton isTiptap={isTiptap} setIsTiptap={setIsTiptap} />
      <RicosEditor
        content={exampleAppContent}
        injectedContent={toggled ? exampleAppContent : longPostContent}
        plugins={plugins}
        experiments={{ tiptapEditor: { enabled: isTiptap } }}
      />
    </Page>
  );
};
