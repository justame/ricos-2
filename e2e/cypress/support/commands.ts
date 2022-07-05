import 'cypress-plugin-snapshots/commands';
import {
  INLINE_TOOLBAR_BUTTONS,
  PLUGIN_TOOLBAR_BUTTONS,
  IMAGE_SETTINGS,
  GALLERY_SETTINGS,
  VIDEO_PLUGIN,
  HTML_PLUGIN,
  PLUGIN_COMPONENT,
  STATIC_TOOLBAR_BUTTONS,
  ACTION_BUTTONS,
  TOOLBARS,
  COLOR_PICKER,
  COLLAPSIBLE_LIST_SETTINGS,
} from '../dataHooks';
import { defaultConfig, useExperiments } from '../testAppConfig';
import { fireEvent as testFireEvent } from '@testing-library/react';
import RicosDriver from '../../../packages/ricos-driver/web/src/RicosDriver';
import { merge } from 'lodash';
import type { TestAppConfig } from '../../../examples/main/src/types';
import { TABLE_COMMANDS } from './tableCommands'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { checkValidity } from '../../../packages/common/web/src/Utils/data-schema-validator';
import contentSchema from '../../../packages/common/web/statics/schemas/content-state.schema.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToCommand<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => Cypress.Chainable<ReturnType<F>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoveFirstArg<F> = F extends (arg0: any, ...args: infer R) => any
  ? (...args: R) => ReturnType<F>
  : never;

declare global {
  interface Window {
    richContentHideTooltips?: boolean;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable extends ChainableCommands, ChainableCommandsWithSubject {}
  }
}

// Computed command types
type ChainableCommands = {
  [key in keyof typeof COMMANDS]: ToCommand<typeof COMMANDS[key]>;
};

// Commands that use the prevSubject option
interface ChainableCommandsWithSubject {
  typeAllAtOnce: RemoveFirstArg<ToCommand<typeof typeAllAtOnce>>;
  waitForMediaToLoad: RemoveFirstArg<ToCommand<typeof waitForMediaToLoad>>;
  fireEvent: RemoveFirstArg<ToCommand<typeof fireEvent>>;
}

const defaultExperiments = {
  /*lazyImagesAndIframes: { enabled: true }*/
};

const ONCHANGE_DEBOUNCE_TIME = 200;

let isMobile = false;
let isHebrew = false;
let isSeoMode = false;
let isTiptap = false;

// All new commands should be added to the COMMANDS object
const COMMANDS = {
  ...TABLE_COMMANDS,
  switchToMobile: () => {
    isMobile = true;
    resizeForMobile();
  },

  switchToDesktop: () => {
    isMobile = false;
    resizeForDesktop();
  },

  switchOnSeoMode: () => {
    isSeoMode = true;
  },

  switchOffSeoMode: () => {
    isSeoMode = false;
  },

  switchToHebrew: () => {
    isHebrew = true;
  },

  switchToEnglish: () => {
    isHebrew = false;
  },

  toggleTiptap: (useTiptap: boolean) => {
    isTiptap = useTiptap;
  },
  switchToTiptap: () => {
    isTiptap = true;
  },

  switchToDraft: () => {
    isTiptap = false;
  },

  loadIsolatedEditorAndViewer: (fixtureName?: string) => run('rce-isolated', fixtureName),

  loadRicosEditorAndViewer: (fixtureName?: string, config?: TestAppConfig) =>
    isTiptap ? loadTiptap(fixtureName, config) : run('ricos', fixtureName, config),

  loadRicosEditor: (fixtureName?: string, config?: TestAppConfig) =>
    isTiptap
      ? loadTiptap(fixtureName, { ...config, viewMode: 'EDITOR' })
      : run('ricos', fixtureName, { ...config, viewMode: 'EDITOR' }),

  loadRicosViewer: (fixtureName?: string, config?: TestAppConfig) =>
    run('ricos', fixtureName, { ...config, viewMode: 'VIEWER' }),

  loadTestAppOnSsr: (compName: string, fixtureName?: string, config?: TestAppConfig) => {
    cy.request(getUrl(compName, fixtureName, config))
      .its('body')
      .then((html: string) => {
        // remove the application code bundle
        const _html = html.replace('<script src="/index.bundle.js"></script>', '');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: state should be part of cy
        cy.state('document').write(_html);
      });
  },

  matchContentSnapshot: () => {
    if (Cypress.env('MATCH_CONTENT_STATE')) {
      cy.wait(ONCHANGE_DEBOUNCE_TIME);
      let contentState;
      cy.window()
        .then(win => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contentState = (win as any).__CONTENT_STATE__;
        })
        .then(() => {
          const result = checkValidity(contentState, contentSchema);
          if (!result.valid && result.errors) {
            result.errors.forEach(error => console.error('schema validation error:', error)); // eslint-disable-line no-console
          }
          expect(result.valid).to.equal(true);
        });

      cy.window().its('__CONTENT_SNAPSHOT__').toMatchSnapshot();
    }
  },

  getViewer: () => {
    cy.wait(ONCHANGE_DEBOUNCE_TIME);
    return cy.get('[data-hook="ricos-viewer"]');
  },

  getTwitterButton: () => {
    cy.get('[data-hook="twitter-button"]');
  },

  setViewerSelection: (start: number, offset: number) => {
    setSelection(start, offset, cy.getViewer());
  },

  setEditorSelection: (start: number, offset: number) => {
    setSelection(start, offset, cy.focusEditor());
  },

  enterText: (text: string) => {
    cy.getEditor().type(text);
  },

  enterParagraphs: (paragraphs: string[]) => {
    cy.enterText(paragraphs.join('{enter}'));
  },

  newLine: () => {
    cy.enterText('{enter}');
  },

  blurEditor: () => {
    cy.getEditor().blur();

    //TIPTAP TODO - blur should remove floating toolbar
    if (!isTiptap) {
      cy.get(RicosDriver.editor.floatingFormattingToolbar(isTiptap)).should('not.exist');
    }
  },

  getEditor: () => cy.get(RicosDriver.editor.contentEditable),

  getCollapsibleList: () => {
    cy.openPluginToolbar(PLUGIN_COMPONENT.COLLAPSIBLE_LIST);
  },

  focusCollapsibleList: (idx: number) => {
    cy.getCollapsibleList().get(RicosDriver.editor.contentEditable).eq(idx).focus();
  },

  toggleCollapseExpand: (idx: number) => {
    cy.get(`[data-hook=ExpandCollapseButton_${idx}]`).first().click();
  },

  focusEditor: () => cy.getEditor().first().focus(),

  moveCursorToStart: () => {
    cy.focusEditor().type('{selectall}{uparrow}');
  },

  moveCursorToEnd: () => {
    cy.focusEditor().type('{selectall}{downarrow}');
  },

  getInlineButton: (buttonSelector: string, selection?: [number, number]) => {
    if (selection) {
      cy.setEditorSelection(selection[0], selection[1]);
    }
    cy.get(
      `${
        isMobile
          ? RicosDriver.editor.mobileToolbar
          : RicosDriver.editor.floatingFormattingToolbar(isTiptap)
      } [data-hook=${buttonSelector}]`
    );
  },

  setTextStyle: (buttonSelector: string, selection?: [number, number]) =>
    cy.getInlineButton(buttonSelector, selection).click({ force: true }),

  openCustomColorModal: () => {
    cy.get(`[data-hook="${COLOR_PICKER.ADD_COLOR}"]`).click();
  },

  setColorByHex: color => {
    cy.get(`[data-hook="${COLOR_PICKER.COLOR_INPUT}"]`).clear().type(color);
  },

  updateTextColor: () => {
    cy.get(`[data-hook="${COLOR_PICKER.UPDATE_BUTTON}"]`).click({ force: true });
  },

  resetColor: () => {
    cy.get(`[data-hook="${COLOR_PICKER.RESET_COLOR}"]`).click();
  },

  setTextColor: (selection: [number, number], color: string) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.COLOR, selection);
    cy.get(`[data-scheme-color="${color}"]`).click();
  },

  setHighlightColor: (selection: [number, number], color: string) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.HIGHTLIGHT, selection);
    cy.get(`[data-scheme-color="${color}"]`).click();
  },

  increaseIndent: (selection: [number, number]) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.INCREASE_INDENT, selection);
  },

  decreaseIndent: (selection: [number, number]) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.DECREASE_INDENT, selection);
  },

  setLink: (selection: [number, number], link: string) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.LINK, selection)
      .get(`[data-hook=linkPanelContainer] [data-hook=linkPanelInput]`)
      .type(link)
      .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
      .click();
  },

  setLinkSettings: () => {
    cy.clickToolbarButton(INLINE_TOOLBAR_BUTTONS.LINK)
      .get(`[data-hook=linkPanelContainer] [data-hook=linkPanelRelCheckbox]`)
      .click()
      .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
      .click();
  },

  setAlignment: (alignment: string) => {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.ALIGNMENT).setTextStyle(alignment);
  },

  setColor: (buttonIndex = 3, selection: [number, number]) => {
    setInlineToolbarMenuItem(INLINE_TOOLBAR_BUTTONS.COLOR, selection, buttonIndex);
  },

  setLineSpacing: (buttonIndex = 3, selection: [number, number]) => {
    setInlineToolbarMenuItem(INLINE_TOOLBAR_BUTTONS.LINE_SPACING, selection, buttonIndex);
  },

  openSideToolbar: () => {
    cy.get(RicosDriver.editor.addPanelButton).click();
    cy.get('[data-hook="floatingAddPluginMenu"]');
  },

  openAddPluginModal: () => {
    cy.get('[data-hook="addPluginButton"]').click();
    cy.get('[data-hook="addPluginMenu"]');
  },

  openFooterPluginMenu: () => {
    cy.get('[data-hook="moreButton"]').click();
    cy.get('[data-hook="addPluginMenu"]');
  },

  openSettings: (settings = 'SETTINGS') => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS[settings]);
    cy.get('[data-hook="settings"]');
  },

  openMapSettings: () => {
    cy.get(`[data-hook=${PLUGIN_COMPONENT.MAP}]:first`).parent().click();
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
    cy.get('[data-hook="mapSettings"]');
  },

  openGalleryAdvancedSettings: () => {
    cy.get(`[data-hook=${PLUGIN_COMPONENT.GALLERY}]:first`).parent().click();
    cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS}]:first`)
      .scrollIntoView()
      .click({ force: true });
  },

  shrinkPlugin: (dataHook: string) => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SMALL_CENTER)
      .get(`[data-hook=${dataHook}]:first`, { timeout: 15000 })
      .should('have.css', 'width', '350px');
  },

  pluginSizeBestFit: () => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.BEST_FIT);
  },

  pluginSizeFullWidth: () => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.FULL_WIDTH);
  },

  pluginSizeOriginal: () => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ORIGINAL);
  },

  clickToolbarButton: (buttonName: string) => {
    cy.get(`button[data-hook=${buttonName}][tabindex=0]`).click({
      force: true, //fixes element getting detached from dom and not clicking (maybe because of click scroll strategy)
    });
  },

  openGallerySettings: () => {
    cy.get('[data-hook="manage_media_Tab"]').click();
  },

  openGalleryImageSettings: () => {
    cy.get(`[data-hook=${GALLERY_SETTINGS.IMAGE}]:first`).click();
    cy.get(`[data-hook=${GALLERY_SETTINGS.EDIT_IMAGE}]`).click();
  },

  addImageTitle: () => {
    cy.get(`[data-hook=${IMAGE_SETTINGS.CAPTION}]`)
      .click()
      .type('Title')
      .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
      .click();
  },

  editImageTitle: () => {
    cy.get(`[data-hook=${PLUGIN_COMPONENT.IMAGE}]:first`)
      .find('textarea')
      .click()
      .type(' - In Plugin Editing')
      .blur();
  },

  deleteImageTitle: () => {
    cy.get(`[data-hook=${IMAGE_SETTINGS.CAPTION}]`)
      .click()
      .clear()
      .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
      .click();
  },

  addGalleryImageTitle: (pluginToClick?: string) => {
    cy.get(`[data-hook=${GALLERY_SETTINGS.TITLE}]`).type('Title');
    cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]:first`).click({ multiple: true });
    cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
    pluginToClick && cy.get(`[data-hook=${pluginToClick}]:first`).parent().click();
  },

  checkTitle: () => {
    cy.get('[data-hook=galleryViewer]:first').parent().click();
    cy.get(`[data-hook=${GALLERY_SETTINGS.VIEWER_IMAGE}]:first`);
  },

  addImageLink: () => {
    cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK)
      .get(`[data-hook=linkPanelContainer] [data-hook=linkPanelInput]`)
      .fireEvent('change', 'www.wix.com')
      .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
      .click()
      .wait(200);
    // .get('href=www.wix.com');
  },

  getImageLink: () => {
    cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE)
      .clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK)
      .get(`[data-hook=linkPanelContainer] [data-hook=linkPanelInput]`)
      .should('have.value', 'www.wix.com');
  },

  alignImage: (alignment: 'left' | 'right' | 'center') => {
    let button: string;
    switch (alignment) {
      case 'left':
        button = PLUGIN_TOOLBAR_BUTTONS.SMALL_LEFT;
        break;
      case 'center':
        button = PLUGIN_TOOLBAR_BUTTONS.SMALL_CENTER;
        break;
      case 'right':
      default:
        button = PLUGIN_TOOLBAR_BUTTONS.SMALL_RIGHT;
    }
    cy.get(`${RicosDriver.viewer.image.root}:first`).parent().click();
    cy.clickToolbarButton(button);
  },

  openPluginToolbar: (plugin: string) => {
    cy.get(`[data-hook*=${plugin}]`).first().parent().click();
    cy.get('[data-hook*="PluginToolbar"]:first');
  },

  openDropdownMenu: (selector = '') => {
    cy.get('button[role=combobox][data-hook=baseToolbarButton_type]').click();
    if (selector) {
      cy.get(selector).click();
    }
  },

  undo: () => {
    cy.getEditor().first().type('{ctrl+z}').type('{cmd+z}');
    cy.wait(100);
  },

  redo: () => {
    cy.getEditor().first().type('{ctrl+shift+z}').type('{cmd+shift+z}');
    cy.wait(100);
  },

  addCollapsibleListPair: () => {
    cy.get(`[data-hook*=${COLLAPSIBLE_LIST_SETTINGS.NEW_PAIR}]`).click({ force: true });
  },

  openVideoUploadModal: () => {
    cy.clickOnStaticButton(STATIC_TOOLBAR_BUTTONS.VIDEO);
  },

  openEmbedModal: (modalType: string) => cy.clickOnStaticButton(modalType),

  addSoundCloud: () => {
    cy.get(`[data-hook*=${'soundCloudUploadModalInput'}]`).type(
      'https://soundcloud.com/nlechoppa/camelot'
    );
    cy.get(`[data-hook*=${ACTION_BUTTONS.SAVE}]`).click({ force: true });
    cy.get(`[data-hook=${PLUGIN_COMPONENT.SOUND_CLOUD}]:first`).parent().click({ force: true });
  },

  addSocialEmbed: (url: string) => {
    cy.get(`[data-hook*=${'socialEmbedUploadModalInput'}]`).type(url);
    cy.get(`[data-hook*=${ACTION_BUTTONS.SAVE}]`).click();
  },

  addVideoFromURL: () => {
    cy.get(`[data-hook*=${VIDEO_PLUGIN.INPUT}]`).type('https://youtu.be/BBu5codsO6Y');
    cy.get(`[data-hook*=${VIDEO_PLUGIN.ADD}]`).click();
    cy.get(`[data-hook=${PLUGIN_COMPONENT.VIDEO}]:first`).parent().click();
  },

  clickOnStaticButton: (dataHook: string, args: { force?: boolean } = {}) =>
    cy.get(`[data-hook*=footerToolbar] [data-hook*=${dataHook}]`).click(args),

  clickOnPluginMenuButton: (dataHook: string) =>
    cy.get(`[data-hook*=addPluginMenu] [data-hook*=${dataHook}]`).click({ force: true }),

  addUrl: () => {
    addHtmlPlugin('https://cdn.bitdegree.org/learn/test-iframe.htm', true);
  },

  addHtml: () => {
    addHtmlPlugin(
      // eslint-disable-next-line max-len
      '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The updates, insights and stories of the engineering challenges we encounter, and our way of solving them. Subscribe to our fresh, monthly newsletter and get these goodies right to your e-mail:<a href="https://t.co/0ziRSJJAxK">https://t.co/0ziRSJJAxK</a> <a href="https://t.co/nTHlsG5z2a">pic.twitter.com/nTHlsG5z2a</a></p>&mdash; Wix Engineering (@WixEng) <a href="https://twitter.com/WixEng/status/1076810144774868992?ref_src=twsrc%5Etfw">December 23, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    );
  },

  addCustomVideo: () => {
    cy.get(`[data-hook*=${VIDEO_PLUGIN.CUSTOM}]`).click();
    cy.get(`[data-hook=${PLUGIN_COMPONENT.VIDEO}]:first`).parent().click();
  },

  dragAndDrop: (src, dest, elem: 0) => {
    cy.get(dest)
      .eq(elem)
      .then(target => {
        target[0].getBoundingClientRect();
        cy.get(src)
          .trigger('mousedown', { which: 1 })
          .trigger('mousemove', { which: 1, pageX: dest.x + 50, pageY: dest.y + 20 })
          .trigger('mouseup', { force: true });
      });
  },

  dragAndDropPlugin: (src: string, dest: string) => {
    const dataTransfer = new DataTransfer();
    cy.get(src)
      .trigger('mousedown')
      .trigger('dragstart', { dataTransfer })
      .get(dest)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
  },

  waitForHtmlToLoad: () => {
    cy.get('iframe', { timeout: 15000 })
      .each($el => {
        cy.wrap($el).its('0.contentDocument.body').should('not.be.undefined');
      })
      .wait(4000);
  },

  insertLinkAndEnter: (url: string, { isPreview }: { isPreview?: boolean } = {}) => {
    cy.focusEditor();
    cy.moveCursorToEnd()
      .type(url)
      .type('{enter}')
      .moveCursorToEnd()
      .get(`a[href*="${url}"]${isPreview ? ' figure' : ''}`);
  },

  insertCollapsibleList: () => {
    cy.getEditor()
      .first()
      .focus()
      .get(`[data-hook*=${'footerToolbar'}] [data-hook*=${'CollapsibleList_InsertButton'}]`)
      .click({ force: true });
  },

  triggerLinkPreviewViewerUpdate: () => {
    cy.moveCursorToEnd();
    cy.focusEditor().get(RicosDriver.editor.addPanelButton).should('be.visible');
  },

  insertPlugin: (toolbar: string, pluginInsertButtonName: string) => {
    cy.focusEditor();
    if (toolbar === TOOLBARS.FOOTER) {
      cy.insertPluginFromFooterToolbar(pluginInsertButtonName);
    }
    if (toolbar === TOOLBARS.SIDE) {
      cy.insertPluginFromSideToolbar(pluginInsertButtonName);
    }
  },

  insertPluginFromFooterToolbar: (pluginInsertButtonName: string) => {
    cy.get(`[data-hook*=${TOOLBARS.FOOTER}] [data-hook*=${pluginInsertButtonName}]`).click({
      force: true,
    });
  },

  insertPluginFromSideToolbar: (pluginInsertButtonName: string) => {
    cy.get(`[data-hook=${TOOLBARS.SIDE}]`)
      .click({
        force: true, //fixes element getting detached from dom and not clicking
      })
      .get(`[data-hook*=addPluginMenu] [data-hook*=${pluginInsertButtonName}]`)
      .click({
        force: true, //fixes element getting detached from dom and not clicking
      });
  },

  waitForDocumentMutations: () => {
    cy.document().then(async (doc: Document) => {
      await waitForMutations(doc.body);
    });
  },
  paste: (pastePayload: string, isHtml = false) => {
    cy.getEditor().then($destination => {
      const pasteEvent = Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
        clipboardData: {
          getData: (type = 'Text') => {
            if (type === 'Text' || type === (isHtml ? 'text/html' : 'text/plain')) {
              return pastePayload;
            }
          },
        },
      });

      $destination[0].dispatchEvent(pasteEvent);
    });
  },

  waitForGalleryImagesToLoad: () => {
    cy.get(`[data-hook=${'gallery-item-image-img-preload'}]`, { timeout: 200000 }).should(
      'not.exist'
    );
  },

  loadOutOfViewImagesInGallery: () => {
    cy.get(`[data-hook=${'gallery-item-image-img'}]`).each($el =>
      cy.wrap($el).invoke('attr', 'loading', 'eager').should('have.attr', 'loading', 'eager')
    );
  },
};

// Add all commands to Cypress
Object.entries(COMMANDS).forEach(([command, fn]) => Cypress.Commands.add(command, fn));

//////// Commands with prevSubject ////////

const typeAllAtOnce = ($subject: HTMLElement, value: string) => {
  const el = $subject[0];
  el.value = value;
  return cy.wrap($subject).type('t{backspace}');
};

const waitForMediaToLoad = (_, count = 2) => {
  cy.get('[data-loaded=true]', { timeout: 15000 }).should('have.length', count);
};

const fireEvent = (element: HTMLElement, event: string, value: string) => {
  element.focus();
  testFireEvent[event](element[0], { target: { value } });
};

// Add all commands with prevSubject
Cypress.Commands.add('typeAllAtOnce', { prevSubject: 'element' }, typeAllAtOnce);
Cypress.Commands.add('waitForMediaToLoad', { prevSubject: 'optional' }, waitForMediaToLoad);
Cypress.Commands.add('fireEvent', { prevSubject: true }, fireEvent);

//////// Non-command functions ////////

// Viewport size commands
const resizeForDesktop = () => cy.viewport('macbook-15');
const resizeForMobile = () => cy.viewport('iphone-6');

const buildQuery = params => {
  const parameters = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      const res = value === true ? key : `${key}=${value}`;
      parameters.push(res);
    }
  });
  if (parameters.length === 0) return '';
  return '?' + parameters.join('&');
};

const getUrl = (componentId: string, fixtureName = '', config: TestAppConfig = {}) => {
  const testAppConfig = JSON.stringify({
    ...defaultConfig,
    ...merge({}, useExperiments(defaultExperiments), config),
  });
  return `/${componentId}${fixtureName ? '/' + fixtureName : ''}${buildQuery({
    mobile: isMobile,
    hebrew: isHebrew,
    seoMode: isSeoMode,
    testAppConfig,
  })}`;
};

const run = (app: string, fixtureName?: string, config?: TestAppConfig) => {
  cy.visit(getUrl(app, fixtureName, config)).then(contentWindow => {
    disableTransitions();
    cy.get(RicosDriver.editor.root(app === 'tiptap'), { timeout: 60000 });
    contentWindow.richContentHideTooltips = true;
  });
};

const loadTiptap = (fixtureName?: string, config?: TestAppConfig) =>
  run('tiptap', fixtureName, {
    ...(config || {}),
    experiments: {
      ...(config?.experiments || {}),
      tiptapEditor: { enabled: true },
      newFormattingToolbar: { enabled: true },
    },
  });

function disableTransitions() {
  Cypress.$('head').append('<style> * {transition: none !important;}</style>');
}

export function setSelection(start: number, offset: number, container: Cypress.Chainable) {
  container.then(args => {
    const getTextElmentAndLocalOffset = getTextElements(args[0]);
    const document = args[0].ownerDocument;
    const range = document.createRange();
    const startObj = getTextElmentAndLocalOffset(start);
    if (startObj.element) {
      range.setStart(startObj.element, startObj.offset);
      const endObj = getTextElmentAndLocalOffset(start + offset);
      range.setEnd(endObj.element, endObj.offset);
      document.getSelection().removeAllRanges(range);
      document.getSelection().addRange(range);
    }
  });
}

Cypress.on('window:before:load', (win: Cypress.AUTWindow & { IntersectionObserver }) => {
  // noinspection JSAnnotator
  delete win.IntersectionObserver; // eslint-disable-line fp/no-delete
  win.IntersectionObserver = class IntersectionObserverMock {
    cb;

    options;

    constructor(cb, options) {
      this.cb = cb;
      this.options = options;
    }

    thresholds = [0];

    root = win;

    rootMargin = '0px';

    observe = element =>
      this.cb([
        {
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: element.getBoundingClientRect(),
          isIntersecting: true,
          rootBounds: {},
          target: element,
          time: new Date().getTime(),
        },
      ]);

    unobserve = () => null;

    disconnect = () => {};
  };
});

/* eslint-disable */
function getTextElements(rootElement: HTMLElement) {
  let textElement: Node,
    offset = 0;
  const textElements: Node[] = [],
    textOffsets: number[] = [];
  const walk = rootElement.ownerDocument.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null,
    // @ts-ignore
    false
  );
  while ((textElement = walk.nextNode())) {
    textElements.push(textElement);
    // @ts-ignore
    offset += textElement.length;
    textOffsets.push(offset);
  }
  return (offset: number) => {
    const i = textOffsets.findIndex(v => v > offset);
    return { element: textElements[i], offset: i === 0 ? offset : offset - textOffsets[i - 1] };
  };
}
/* eslint-enable */

function setInlineToolbarMenuItem(item: string, selection: [number, number], buttonIndex: number) {
  cy.setTextStyle(item, selection).get('.ReactModalPortal').find('button').eq(buttonIndex).click();
}

function addHtmlPlugin(htmlSrc: string, isUrl = false) {
  cy.clickOnStaticButton(HTML_PLUGIN.STATIC_TOOLBAR_BUTTON);
  if (isUrl) {
    cy.get(`[data-hook*=${HTML_PLUGIN.RADIO_URL}]`).click();
  }
  cy.get(`[data-hook*=${HTML_PLUGIN.INPUT}]`).click().clear();
  cy.get(`[data-hook*=${HTML_PLUGIN.INPUT}]`).typeAllAtOnce(htmlSrc);
  cy.get(`[data-hook*=${HTML_PLUGIN.UPDATE}]`).click();
}

function waitForMutations(container: HTMLElement, { timeToWaitForMutation = 400 } = {}) {
  return new Promise<void>(resolve => {
    let timeoutId = setTimeout(onDone, timeToWaitForMutation);

    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onDone, timeToWaitForMutation);
    });
    observer.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });

    function onDone() {
      clearTimeout(timeoutId);
      observer.disconnect();
      resolve();
    }
  });
}
