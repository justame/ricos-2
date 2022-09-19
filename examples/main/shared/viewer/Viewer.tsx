import type { RefObject } from 'react';
import React, { PureComponent } from 'react';
import { RichContentViewer } from 'wix-rich-content-viewer';
import type {
  DraftContent,
  SEOSettings,
  AvailableExperiments,
  LinkPreviewData,
} from 'wix-rich-content-common';
import * as Plugins from './ViewerPlugins';
import theme from '../theme/theme'; // must import after custom styles
import { TextSelectionToolbar, TwitterButton } from 'wix-rich-content-text-selection-toolbar';
import { GALLERY_TYPE } from 'wix-rich-content-plugin-gallery';
import type { RicosViewerProps } from 'ricos-viewer';
import { RicosViewer } from 'ricos-viewer';

const anchorTarget = '_blank';
const rel = { nofollow: true };

interface ExampleViewerProps {
  initialState?: DraftContent;
  isMobile?: boolean;
  locale: string;
  scrollingElementFn?: () => Element;
  seoMode?: SEOSettings;
  experiments: AvailableExperiments;
  linkPreviewPopoverFetchData?: (url: string) => Promise<LinkPreviewData>;
}

interface ExampleViewerState {
  disabled: boolean;
}

export default class Viewer extends PureComponent<ExampleViewerProps, ExampleViewerState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewerRef: RefObject<any>;

  plugins: RicosViewerProps['plugins'];

  constructor(props: ExampleViewerProps) {
    super(props);
    this.state = {
      disabled: false,
    };
    this.viewerRef = React.createRef();
    const config = this.getConfig(props);
    this.plugins = Object.entries(Plugins.ricosViewerPlugins).map(([pluginType, plugin]) =>
      pluginType in config ? plugin(config[pluginType]) : plugin()
    );
  }

  getConfig = props => {
    const { scrollingElementFn } = props;
    const additionalConfig = {
      [GALLERY_TYPE]: { scrollingElement: scrollingElementFn() },
    };
    return Plugins.getConfig(additionalConfig);
  };

  render() {
    const { isMobile, initialState, locale, seoMode, experiments, linkPreviewPopoverFetchData } =
      this.props;
    const { disabled } = this.state;
    const helpers = {
      // This is for debugging only
      onViewerAction: async (...args) =>
        // eslint-disable-next-line no-console
        console.log('onViewerAction', ...args),
      // eslint-disable-next-line no-console
      onViewerLoaded: async (...args) => console.log('onViewerLoaded', ...args),
    };

    return (
      <>
        <div id="rich-content-viewer" ref={this.viewerRef} className="viewer">
          <RicosViewer
            content={initialState}
            plugins={this.plugins}
            locale={locale}
            linkSettings={{ rel, anchorTarget }}
            isMobile={isMobile}
            cssOverride={theme}
            mediaSettings={{ pauseMedia: disabled }}
            seoSettings={seoMode}
            experiments={experiments}
            linkPreviewPopoverFetchData={linkPreviewPopoverFetchData}
          >
            <RichContentViewer helpers={helpers} />
          </RicosViewer>
        </div>
        {!isMobile ? (
          <TextSelectionToolbar container={this.viewerRef.current}>
            {selectedText => (
              <TwitterButton selectedText={selectedText} onClick={helpers.onViewerAction} />
            )}
          </TextSelectionToolbar>
        ) : null}
      </>
    );
  }
}
