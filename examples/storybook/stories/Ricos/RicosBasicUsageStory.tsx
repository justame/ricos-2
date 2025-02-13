import React from 'react';

import { RicosViewer } from 'ricos-viewer';
import {
  RichContentEditorBox,
  RichContentViewerBox,
  Section,
  Page,
} from '../Components/StoryParts';

import { pluginDivider } from 'wix-rich-content-plugin-divider/dist/module.viewer';

import dividerContentState from '../../../../e2e/tests/fixtures/divider.json';
import DividerEditor from './RicosBasicUsage';
// eslint-disable-next-line import/no-unresolved
import sourcecode from './RicosBasicUsage.tsx?raw';

export default () => {
  return (
    <Page title="Ricos Basic Usage">
      <Section type={Section.Types.COMPARISON}>
        <RichContentEditorBox sourcecode={sourcecode} content={dividerContentState}>
          <DividerEditor content={dividerContentState} />
        </RichContentEditorBox>
        <RichContentViewerBox>
          <RicosViewer content={dividerContentState} plugins={[pluginDivider()]} />
        </RichContentViewerBox>
      </Section>
    </Page>
  );
};
