/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React from 'react';
import { version } from '../../package.json';
import type { RicosEditorProps, DraftEditorSettings } from '../index';
import { RicosEditor } from '../RicosEditor';
import type { RicosEditor as RicosEditorType } from '../RicosEditor';
import type { RicosEngine } from 'ricos-common';
import { RichContentEditor } from 'wix-rich-content-editor';
import type { BICallbacks, InlineStyle } from 'wix-rich-content-common';
import {
  RICOS_DIVIDER_TYPE,
  RICOS_GIPHY_TYPE,
  RICOS_HTML_TYPE,
  RICOS_GALLERY_TYPE,
  RICOS_POLL_TYPE,
  RICOS_VIDEO_TYPE,
  RICOS_FILE_TYPE,
  RICOS_IMAGE_TYPE,
  RICOS_LINK_TYPE,
  RICOS_HASHTAG_TYPE,
  RICOS_SPOILER_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
  ToolbarType,
} from 'wix-rich-content-common';
import introState from '../../../../../e2e/tests/fixtures/intro.json';
import { pluginHashtag, HASHTAG_TYPE } from '../../../../plugin-hashtag/web/src';
import { pluginDivider, DIVIDER_TYPE } from '../../../../plugin-divider/web/src';
import { pluginGiphy, GIPHY_TYPE } from '../../../../plugin-giphy/web/src';
import { pluginHtml, HTML_TYPE } from 'wix-rich-content-plugin-html/src';
import { pluginGallery, GALLERY_TYPE } from 'wix-rich-content-plugin-gallery/src';
import { pluginPoll, POLL_TYPE } from '../../../../plugin-social-polls/web/src';
import { pluginVideo, VIDEO_TYPE } from 'wix-rich-content-plugin-video/src';
import { pluginFileUpload, FILE_UPLOAD_TYPE } from '../../../../plugin-file-upload/web/src';
import { pluginImage, IMAGE_TYPE } from 'wix-rich-content-plugin-image/src';
import { pluginLink, LINK_TYPE } from '../../../../plugin-link/web/src';
import { pluginMentions, MENTION_TYPE } from '../../../../plugin-mentions/web/src';
import { pluginSpoiler, SPOILER_TYPE } from '../../../../plugin-spoiler/web/src';
import { pluginTextColor, pluginTextHighlight } from 'wix-rich-content-plugin-text-color/src';
import { colorScheme } from '../../../../../examples/main/src/text-color-style-fn';

import { convertNodeDataToDraft } from 'ricos-content/libs/toDraftData';
import {
  content,
  blockKey,
  selection,
  inlineStylesTestConfig,
  pluginsTestConfig,
  decorationsTestConfig,
  contentWithDocumentStyleTest,
} from '../utils/editorCommandsTestsUtil';
import { shallow, mount } from 'enzyme';
import { default as hebResource } from 'wix-rich-content-common/dist/statics/locale/messages_he.json';
import { RICOS_FONT_SIZE_TYPE } from 'wix-rich-content-common/src';
import { getEmptyDraftContent } from 'wix-rich-content-editor-common';
import { experiments } from 'webpack';

const expectedPluginsList = [
  DIVIDER_TYPE,
  GIPHY_TYPE,
  HTML_TYPE,
  GALLERY_TYPE,
  POLL_TYPE,
  VIDEO_TYPE,
  FILE_UPLOAD_TYPE,
  IMAGE_TYPE,
  LINK_TYPE,
  HASHTAG_TYPE,
  MENTION_TYPE,
  SPOILER_TYPE,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
];

const expectedPluginsListRicosSchema = [
  RICOS_DIVIDER_TYPE,
  RICOS_GIPHY_TYPE,
  RICOS_HTML_TYPE,
  RICOS_GALLERY_TYPE,
  RICOS_POLL_TYPE,
  RICOS_VIDEO_TYPE,
  RICOS_FILE_TYPE,
  RICOS_IMAGE_TYPE,
  RICOS_LINK_TYPE,
  RICOS_HASHTAG_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_SPOILER_TYPE,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
];

jest.mock('react-modal', () => {
  const TestReactModal = class MockReactModal extends React.Component {
    static setAppElement() {
      // in our application we use #setAppElement for accessibility
      // if you use this or any other functions you'll have to mock them
    }

    render() {
      return <div />;
    }
  };
  return TestReactModal;
});

const configs = {
  textColor: {
    colorScheme,
  },
};

const plugins = [
  pluginDivider(),
  pluginGiphy(),
  pluginHtml(),
  pluginGallery(),
  pluginPoll(),
  pluginVideo(),
  pluginFileUpload(),
  pluginImage(),
  pluginLink(),
  pluginHashtag(),
  pluginMentions(),
  pluginSpoiler(),
  pluginTextColor(configs.textColor),
  pluginTextHighlight(configs.textColor),
];

const getRicosEditor = (ricosEditorProps?: RicosEditorProps) =>
  mount(<RicosEditor {...(ricosEditorProps || {})} />);

const getStaticToolbar = ricosEditor => ricosEditor.children().first();

const getRicosEngine = (ricosEditorProps?: RicosEditorProps) =>
  getRicosEditor(ricosEditorProps).children().last().instance();

const getRicosEditorInstance = (ricosEditorProps?: RicosEditorProps) =>
  getRicosEditor(ricosEditorProps).instance() as RicosEditorType;

const getRCE = (ricosEditorProps?: RicosEditorProps, asWrapper?: boolean) => {
  const toRender = !asWrapper ? (
    <RicosEditor {...(ricosEditorProps || {})} />
  ) : (
    <RicosEditor {...(ricosEditorProps || {})}>
      <RichContentEditor />
    </RicosEditor>
  );

  const element = shallow(toRender).children().last().dive().children();

  return element.at(element.length - 1); // due to add html by strategies
};

type Settings = { isRicosSchema?: boolean };

const isMention = type => type === RICOS_MENTION_TYPE;

const setSelection = (ricosEditor, blockKey, selection) =>
  ricosEditor.getEditorCommands()._setSelection(blockKey, selection);

const toggleInlineStyleTest = result => inlineStyle =>
  it(`should ${result ? '' : 'not '}have ${inlineStyle} inline style`, () => {
    const ricosEditor = getRicosEditorInstance({ plugins, content });
    setSelection(ricosEditor, blockKey, selection);
    ricosEditor.getEditorCommands().toggleInlineStyle(inlineStyle);
    !result && ricosEditor.getEditorCommands().toggleInlineStyle(inlineStyle);
    expect(ricosEditor.getEditorCommands().hasInlineStyle(inlineStyle)).toEqual(result);
  });

const insertPluginTest =
  (settings: Settings) =>
  ([pluginName, { type, nodeType, data1, expectedData1 }]) =>
    it(`should insert ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      data1 = settings?.isRicosSchema ? data1 : convertNodeDataToDraft(nodeType, data1);
      ricosEditor.getEditorCommands().insertBlock(type, data1, settings);
      expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual(expectedData1);
    });

const setPluginTest =
  (settings: Settings) =>
  ([pluginName, { type, nodeType, data1, data2, expectedData2 }]) =>
    it(`should set ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      data1 = settings?.isRicosSchema ? data1 : convertNodeDataToDraft(nodeType, data1);
      data2 = settings?.isRicosSchema ? data2 : convertNodeDataToDraft(nodeType, data2);
      const blockKey = ricosEditor.getEditorCommands().insertBlock(type, data1, settings);
      ricosEditor.getEditorCommands().setBlock(blockKey as string, type, data2, settings);
      expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual(expectedData2);
    });

const deletePluginTest =
  (settings: Settings) =>
  ([pluginName, { type, nodeType, data1 }]) =>
    it(`should remove ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      data1 = settings?.isRicosSchema ? data1 : convertNodeDataToDraft(nodeType, data1);
      const blockKey = ricosEditor.getEditorCommands().insertBlock(type, data1, settings);
      ricosEditor.getEditorCommands().deleteBlock(blockKey as string);
      expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual({});
    });

const insertDecorationTest =
  (settings: Settings) =>
  ([pluginName, { type, data1, selection1, expectedData1, selection2 }]) =>
    it(`should insert ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      setSelection(ricosEditor, blockKey, selection1);
      isMention(type) && ricosEditor.getEditorCommands().triggerDecoration(type);
      ricosEditor.getEditorCommands().insertDecoration(type, data1, settings);
      setSelection(ricosEditor, blockKey, selection2);
      if (type === RICOS_TEXT_COLOR_TYPE || type === RICOS_TEXT_HIGHLIGHT_TYPE) {
        expect(ricosEditor.getEditorCommands().getColor(type)).toEqual(expectedData1);
      } else if (type === RICOS_FONT_SIZE_TYPE) {
        expect(ricosEditor.getEditorCommands().getFontSize()).toEqual(expectedData1);
      } else {
        expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual(expectedData1);
      }
    });

const setDecorationTest =
  (settings: Settings) =>
  ([pluginName, { type, data1, selection1, data2, selection2, expectedData2 }]) =>
    !isMention(type) &&
    it(`should set ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      setSelection(ricosEditor, blockKey, selection1);
      ricosEditor.getEditorCommands().insertDecoration(type, data1, settings);
      setSelection(ricosEditor, blockKey, selection1);
      ricosEditor.getEditorCommands().insertDecoration(type, data2, settings);
      setSelection(ricosEditor, blockKey, selection2);
      if (type === RICOS_TEXT_COLOR_TYPE || type === RICOS_TEXT_HIGHLIGHT_TYPE) {
        expect(ricosEditor.getEditorCommands().getColor(type)).toEqual(expectedData2);
      } else if (type === RICOS_FONT_SIZE_TYPE) {
        expect(ricosEditor.getEditorCommands().getFontSize()).toEqual(expectedData2);
      } else {
        expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual(expectedData2);
      }
    });

const deleteDecorationTest =
  (settings: Settings) =>
  ([pluginName, { type, data1, selection1, selection2 }]) =>
    !isMention(type) &&
    it(`should remove ${pluginName}`, () => {
      const ricosEditor = getRicosEditorInstance({ plugins, content });
      setSelection(ricosEditor, blockKey, selection1);
      ricosEditor.getEditorCommands().insertDecoration(type, data1, settings);
      setSelection(ricosEditor, blockKey, selection2);
      ricosEditor.getEditorCommands().deleteDecoration(type);
      expect(ricosEditor.getEditorCommands().getSelectedData()).toEqual({});
    });

describe('RicosEditor', () => {
  it('should render editor', () => {
    const element = getRicosEditor();
    expect(element).toBeTruthy();
  });
  it('should render editor with locale', () => {
    const element = getRicosEditor({ locale: 'he' });
    expect(element).toBeTruthy();
  });
  it('should render locale="en" if unspecified', () => {
    const rceProps = getRCE().props();
    expect(rceProps).toHaveProperty('locale');
    expect(rceProps.locale).toEqual('en');
  });
  it('should render locale="he"', () => {
    const rceProps = getRCE({ locale: 'he' }).props();
    expect(rceProps).toHaveProperty('locale');
    expect(rceProps.locale).toEqual('he');
  });
  it('should render with pluginsStrategy output', () => {
    const rceProps = getRCE({ plugins }).props();
    expect(rceProps).toHaveProperty('config');
    expect(rceProps.config).toHaveProperty('wix-draft-plugin-hashtag');
  });
  it('should render with themeStrategy output', () => {
    const rceProps = getRCE({ theme: { palette: 'darkTheme' } }).props();
    expect(rceProps).toHaveProperty('theme');
    expect(rceProps.theme).toHaveProperty('modalTheme');
  });
  it('should initial experiments if not defined', () => {
    const ricosEngineInstance = getRicosEngine() as RicosEngine;
    expect(ricosEngineInstance.props).toMatchObject({ experiments: {} });
  });
  // locale strategy moved from RicosEngine to RicosEditor/RicosViewer
  //
  // it('should call updateLocale on componentDidMount', () => {
  //   const ricosEngineInstance = getRicosEngine() as RicosEngine;
  //   const spyUpdate = spyOn(ricosEngineInstance, 'updateLocale');
  //   ricosEngineInstance.componentDidMount();
  //   expect(spyUpdate.calls.count()).toEqual(1);
  // });
  // it('should render localeStrategy in strategies', async () => {
  //   const ricosEngineInstance = getRicosEngine({ locale: 'he' }) as RicosEngine;
  //   await ricosEngineInstance.updateLocale();
  //   const renderResult = ricosEngineInstance.render();
  //   expect(renderResult[1].props).toMatchObject({
  //     locale: 'he',
  //     localeResource: hebResource,
  //   });
  // });
  it('should call updateLocale on componentDidMount', () => {
    const ricosEditor = getRicosEditorInstance();
    const spyUpdate = spyOn(ricosEditor, 'updateLocale');
    ricosEditor.componentDidMount();
    expect(spyUpdate.calls.count()).toEqual(1);
  });
  it('should render localeStrategy in strategies', async () => {
    const ricosEditor = getRicosEditorInstance({ locale: 'he' });
    await ricosEditor.updateLocale();
    expect(ricosEditor.state.localeData).toMatchObject({
      locale: 'he',
      localeResource: hebResource,
    });
  });
  it('should render a static text toolbar', () => {
    const ricosEditor = getRicosEditor({ toolbarSettings: { useStaticTextToolbar: true } });
    const staticToolbar = getStaticToolbar(ricosEditor);
    expect(staticToolbar.props().StaticToolbar).toBeTruthy();
  });
  it('should render a static text toolbar', () => {
    const container = document.createElement('div');
    const ricosEditor = getRicosEditor({ toolbarSettings: { textToolbarContainer: container } });
    const staticToolbarProps = getStaticToolbar(ricosEditor).props();
    expect(staticToolbarProps.StaticToolbar).toBeTruthy();
    expect(staticToolbarProps.textToolbarContainer).toEqual(container);
  });
  it('should create same props with & without a wrapping component', () => {
    const props: RicosEditorProps = {
      theme: { palette: 'darkTheme' },
      locale: 'fr',
      content: introState,
      isMobile: true,
      _rcProps: {
        helpers: { dummyFunction: () => true },
        config: { [HASHTAG_TYPE]: {} },
      },
      plugins,
      placeholder: 'dummyPlaceHolder',
      onError: () => true,
    };
    const rceProps = getRCE(props).props();
    const rcePropsWrapped = getRCE(props, true).props();
    // hashed theme classnames can be different; assert keys only.
    const themeKeys = Object.keys(rceProps.theme);
    const themeKeys_wrapped = Object.keys(rcePropsWrapped.theme);
    expect(themeKeys).toStrictEqual(themeKeys_wrapped);
    const rceProps_noTheme = JSON.stringify({ ...rceProps, theme: {} });
    const rcePropsWrapped_noTheme = JSON.stringify({ ...rcePropsWrapped, theme: {} });
    expect(rceProps_noTheme).toStrictEqual(rcePropsWrapped_noTheme);
  });
  it('should only accept valid Draft-js editor props', () => {
    const draftEditorSettings: DraftEditorSettings & { notADraftSetting: boolean } = {
      tabIndex: -1,
      spellCheck: true,
      stripPastedStyles: false,
      notADraftSetting: false,
    };
    const rceProps = getRCE({ draftEditorSettings }).props();
    expect(rceProps).toHaveProperty('theme');
    expect(rceProps.tabIndex).toEqual(-1);
    expect(rceProps.spellCheck).toEqual(true);
    expect(rceProps).not.toHaveProperty('notADraftSetting');
  });
  describe('onOpenEditorSuccess', () => {
    let params: Parameters<NonNullable<BICallbacks['onOpenEditorSuccess']>> = [
      '',
      ToolbarType.FOOTER,
      '',
    ];
    const onOpenEditorSuccessMock: BICallbacks['onOpenEditorSuccess'] = (...args) =>
      (params = args);
    it('should trigger upon mount', () => {
      const fn = jest.fn(onOpenEditorSuccessMock);
      const element = getRicosEditor({
        _rcProps: { helpers: { onOpenEditorSuccess: fn } },
      });
      element.render();
      expect(fn).toBeCalledTimes(1);
      expect(params[0]).toEqual(version);
      expect(params[1]).toEqual('INLINE');
      expect(params[2]).toBeTruthy();
    });
    it('should send the existing ID of content', () => {
      const fn = jest.fn(onOpenEditorSuccessMock);
      const newContent = getEmptyDraftContent();
      const ID = newContent.ID;
      const element = getRicosEditor({
        _rcProps: { helpers: { onOpenEditorSuccess: fn } },
        content: newContent,
      });
      element.render();
      expect(fn).toBeCalledTimes(1);
      expect(params[2]).toEqual(ID);
    });
  });
  describe('Modal API', () => {
    it('should pass openModal & closeModal to helpers', () => {
      const modalSettings = { openModal: () => 'open', closeModal: () => 'close' };
      const rceProps = getRCE({ modalSettings }).props();
      expect(rceProps).toHaveProperty('helpers');
      const { openModal, closeModal } = rceProps.helpers;
      expect({ openModal, closeModal }).toStrictEqual(modalSettings);
    });
  });
  describe('Editor Commands API', () => {
    beforeEach(() => {
      global.window.getSelection = jest.fn().mockImplementation(() => {
        return {
          removeAllRanges: () => {},
        };
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).MutationObserver = class {
        disconnect() {}

        observe() {}
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).ResizeObserver = class {
        observe() {}

        unobserve() {}
      };
    });

    describe('Editor text formatting API', () => {
      it('should have left text alignment', () => {
        const ricosEditor = getRicosEditorInstance({ content });
        const textAlignment = ricosEditor.getEditorCommands().getTextAlignment();
        expect(textAlignment).toEqual('left');
      });
      it('should have right text alignment', () => {
        const ricosEditor = getRicosEditorInstance({ content });
        const alignment = 'right';
        ricosEditor.getEditorCommands().setTextAlignment(alignment);
        const textAlignment = ricosEditor.getEditorCommands().getTextAlignment();
        expect(textAlignment).toEqual(alignment);
      });
      inlineStylesTestConfig.forEach(toggleInlineStyleTest(true));
      inlineStylesTestConfig.forEach(toggleInlineStyleTest(false));
      it('should undo stack be empty', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        expect(ricosEditor.getEditorCommands().isUndoStackEmpty()).toBeTruthy();
      });
      it('should redo stack be empty', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        expect(ricosEditor.getEditorCommands().isRedoStackEmpty()).toBeTruthy();
      });
      it('should undo stack be not empty', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        setSelection(ricosEditor, blockKey, selection);
        ricosEditor.getEditorCommands().toggleInlineStyle('bold');
        expect(ricosEditor.getEditorCommands().isUndoStackEmpty()).toBeFalsy();
      });
      it('should redo stack be not empty', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        setSelection(ricosEditor, blockKey, selection);
        ricosEditor.getEditorCommands().toggleInlineStyle('bold');
        ricosEditor.getEditorCommands().undo();
        expect(ricosEditor.getEditorCommands().isRedoStackEmpty()).toBeFalsy();
      });
      it('should change block to numbered list', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        setSelection(ricosEditor, blockKey, selection);
        ricosEditor.getEditorCommands().setBlockType('ordered-list-item');
        expect(
          ricosEditor.getEditorCommands().isBlockTypeSelected('ordered-list-item')
        ).toBeTruthy();
      });
      it('should get empty plugins list', async () => {
        const ricosEditor = getRicosEditorInstance({ content });
        const pluginsList = ricosEditor.getEditorCommands().getPluginsList();
        expect(pluginsList).toEqual([]);
      });
      it('should get plugins list', async () => {
        const ricosEditor = getRicosEditorInstance({ content, plugins });
        const pluginsList = ricosEditor.getEditorCommands().getPluginsList();
        expect(pluginsList).toEqual(expectedPluginsList);
      });
      it('should get plugins list (Ricos Schema)', async () => {
        const ricosEditor = getRicosEditorInstance({ content, plugins });
        const pluginsList = ricosEditor.getEditorCommands().getPluginsList({ isRicosSchema: true });
        expect(pluginsList).toEqual(expectedPluginsListRicosSchema);
      });
    });
    describe('Editor Decorations API (Ricos Schema)', () => {
      const settings = { isRicosSchema: true };
      Object.entries(decorationsTestConfig).forEach(insertDecorationTest(settings));
      Object.entries(decorationsTestConfig).forEach(setDecorationTest(settings));
      Object.entries(decorationsTestConfig).forEach(deleteDecorationTest(settings));
    });
    describe('Editor Plugins API (Ricos Schema)', () => {
      const settings = { isRicosSchema: true };
      Object.entries(pluginsTestConfig).forEach(insertPluginTest(settings));
      Object.entries(pluginsTestConfig).forEach(setPluginTest(settings));
      Object.entries(pluginsTestConfig).forEach(deletePluginTest(settings));
    });
    describe('Editor Plugins API (Old Schema)', () => {
      const settings = {};
      Object.entries(pluginsTestConfig).forEach(insertPluginTest(settings));
      Object.entries(pluginsTestConfig).forEach(setPluginTest(settings));
      Object.entries(pluginsTestConfig).forEach(deletePluginTest(settings));
    });
    describe('Editor DocumentStyle API', () => {
      it('should apply decorations and set document style', () => {
        const ricosEditor = getRicosEditorInstance({ plugins, content });
        setSelection(ricosEditor, blockKey, selection);
        ['bold', 'italic'].forEach((inlineStyle: InlineStyle) =>
          ricosEditor.getEditorCommands().toggleInlineStyle(inlineStyle)
        );
        ricosEditor
          .getEditorCommands()
          .insertDecoration(RICOS_TEXT_COLOR_TYPE, { color: 'color3' });
        ricosEditor
          .getEditorCommands()
          .insertDecoration(RICOS_TEXT_HIGHLIGHT_TYPE, { color: 'color2' });
        const paragraph = ricosEditor.getEditorCommands().getAnchorBlockInlineStyles();
        ricosEditor.getEditorCommands().updateDocumentStyle({ paragraph });
        expect(ricosEditor.getEditorCommands().getDocumentStyle()).toEqual({ paragraph });
        ricosEditor.getEditorCommands().clearSelectedBlocksInlineStyles();
        ricosEditor
          .getContentPromise()
          .then(currentContent => expect(currentContent).toEqual(contentWithDocumentStyleTest));
      });
    });
  });
});
