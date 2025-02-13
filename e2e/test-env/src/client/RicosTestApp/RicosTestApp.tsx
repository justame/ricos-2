import React, { PureComponent } from 'react';
import windowContentStateHoc from '../WindowContentStateHoc';
import { RichContentEditor } from 'wix-rich-content-editor';
import type { RicosEditorProps } from 'ricos-editor';
import { RicosEditor } from 'ricos-editor';
import { RicosViewer } from 'ricos-viewer';
import { default as editorPlugins } from './editorPlugins';
import { default as viewerPlugins } from './viewerPlugins';
import theme from '../../../../../examples/main/shared/theme/theme';
import { testVideos } from '../../../../../examples/storybook/src/shared/utils/mock';
import type { TestAppConfig } from '../../../../../examples/main/src/types';
import {
  mockTestImageUpload,
  mockTestImageNativeUpload,
  mockTestFileUpload,
  mockTestFileNativeUpload,
} from '../../../../../examples/storybook/src/shared/utils/fileUploadUtil';
import { createPreview } from 'wix-rich-content-preview';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import { ricosPalettes } from '../../../../../examples/storybook/src/shared/resources/palettesExample';
import { themes } from '../consumersThemes/themes';
import type { PaletteColors, DraftContent, SEOSettings } from 'wix-rich-content-common';
import type { EditorState } from '@wix/draft-js';
import { merge } from 'lodash';
import { customStylesMock } from './customStylesMock';

const onVideoSelected = (url: string, updateEntity) => {
  setTimeout(() => updateEntity(testVideos[1]), 1);
};
const determinePalette = (paletteType: 'light' | 'dark', fallbackColor?: string): PaletteColors =>
  paletteType
    ? merge(paletteType === 'light' ? ricosPalettes[1] : ricosPalettes[9], {
        fallbackColor,
      })
    : undefined;
const setBackground = (palette: PaletteColors, disableContainer: boolean) =>
  !disableContainer && palette ? { backgroundColor: palette.bgColor } : {};
const setForeground = (palette: PaletteColors) => (palette ? { color: palette.textColor } : {});

interface RicosTestAppProps {
  isMobile: boolean;
  locale?: string;
  contentState?: DraftContent;
  editorState?: EditorState;
  localeResource?: Record<string, string>;
  onRicosEditorChange?: RicosEditorProps['onChange'];
  seoMode?: SEOSettings;
  testAppConfig?: TestAppConfig;
}

class RicosTestApp extends PureComponent<RicosTestAppProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewerRef: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.viewerRef = React.createRef();
  }

  renderEditor = () => {
    const { contentState, onRicosEditorChange, locale, isMobile, testAppConfig = {} } = this.props;
    const { addPluginMenuConfig, footerToolbarConfig } = testAppConfig.toolbarConfig || {};
    const {
      skipCssOverride,
      paletteType,
      useCustomStyles,
      useParagraphLineHeight,
      fallbackColor,
      contentBgColor,
      settingsActionColor,
      focusActionColor,
    } = testAppConfig.theme || {};
    const { consumer } = testAppConfig;
    const consumerThemeConfig = { isViewer: false, isSeo: false, isMobile };
    const consumerTheme = themes[consumer]?.(consumerThemeConfig);
    const palette = determinePalette(paletteType, fallbackColor);
    const isNativeUpload = testAppConfig?.isNativeUpload;

    const createToolbarSettings = (addPluginMenuConfig, footerToolbarConfig) => ({
      getToolbarSettings: () => [
        { name: TOOLBARS.SIDE, addPluginMenuConfig },
        {
          name: TOOLBARS.MOBILE,
          addPluginMenuConfig,
        },
        { name: TOOLBARS.FOOTER, footerToolbarConfig },
      ],
    });

    const uploadHandler = isNativeUpload
      ? {
          onFileSelected: mockTestFileNativeUpload,
        }
      : {
          handleFileSelection: mockTestFileUpload,
        };
    const nativeFileUploadConfig = {
      fileUpload: uploadHandler,
    };

    const externalPluginsConfigs = { ...testAppConfig.pluginsConfig, ...nativeFileUploadConfig };

    return (
      <RicosEditor
        plugins={editorPlugins(testAppConfig.plugins, externalPluginsConfigs)}
        placeholder={'Add some text!'}
        content={contentState}
        isMobile={isMobile}
        locale={locale}
        theme={{
          palette,
          paletteConfig: { contentBgColor, settingsActionColor, focusActionColor },
          customStyles: useCustomStyles
            ? customStylesMock
            : useParagraphLineHeight
            ? { p: { lineHeight: '60px' } }
            : {},
        }}
        cssOverride={consumerTheme ? consumerTheme : !skipCssOverride && theme}
        toolbarSettings={createToolbarSettings(addPluginMenuConfig, footerToolbarConfig)}
        onChange={onRicosEditorChange}
        experiments={testAppConfig.experiments}
      >
        <RichContentEditor
          helpers={{
            onVideoSelected,
            handleFileSelection: !isNativeUpload ? mockTestImageUpload : undefined,
            // @ts-ignore
            handleFileUpload: isNativeUpload ? mockTestImageNativeUpload : undefined,
          }}
        />
      </RicosEditor>
    );
  };

  renderViewer = () => {
    const { isMobile, contentState, locale, seoMode, testAppConfig = {} } = this.props;
    const {
      skipCssOverride,
      paletteType,
      useCustomStyles,
      useParagraphLineHeight,
      fallbackColor,
      contentBgColor,
      settingsActionColor,
      focusActionColor,
    } = testAppConfig.theme || {};
    const { consumer } = testAppConfig;
    const consumerThemeConfig = { isViewer: true, isSeo: seoMode, isMobile };
    const consumerTheme = themes[consumer]?.(consumerThemeConfig);
    const palette = determinePalette(paletteType, fallbackColor);
    return (
      <RicosViewer
        plugins={viewerPlugins(testAppConfig.plugins)}
        content={contentState}
        isMobile={isMobile}
        locale={locale}
        theme={{
          palette,
          paletteConfig: { contentBgColor, settingsActionColor, focusActionColor },
          customStyles: useCustomStyles
            ? customStylesMock
            : useParagraphLineHeight
            ? { p: { lineHeight: '60px' } }
            : {},
        }}
        cssOverride={consumerTheme ? consumerTheme : !skipCssOverride && theme}
        seoSettings={seoMode}
        preview={testAppConfig.showDefaultPreview && createPreview()}
        textSelectionToolbar
        experiments={testAppConfig.experiments}
      />
    );
  };

  render() {
    const { isMobile, testAppConfig = {} } = this.props;
    const {
      theme: { paletteType, disableContainer } = {},
      applyOuterStyle,
      viewMode,
    } = testAppConfig;

    const viewerOnly = viewMode === 'VIEWER';
    const editorOnly = viewMode === 'EDITOR';
    const palette = determinePalette(paletteType);
    const addStyle = applyOuterStyle
      ? { color: 'white', fontFamily: 'Times', backgroundColor: 'black' }
      : {};
    return (
      <div
        className={`testApp ${isMobile ? 'mobile' : ''}`}
        style={{ ...setBackground(palette, disableContainer), ...addStyle }}
      >
        {!viewerOnly && (
          <div className={`${editorOnly ? 'full-width' : ''}`}>
            <h3 style={setForeground(palette)}>Editor</h3>
            <div className="rcWrapper rce" id="RicosEditorContainer" data-hook="ricos-editor">
              {this.renderEditor()}
            </div>
          </div>
        )}
        {!editorOnly && (
          <div className={`${viewerOnly ? 'full-width' : ''}`}>
            <h3 style={setForeground(palette)}>Viewer</h3>
            <div
              className="rcWrapper rcv"
              id="RicosViewerContainer"
              data-hook="ricos-viewer"
              ref={this.viewerRef}
            >
              {this.renderViewer()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default windowContentStateHoc(RicosTestApp);
