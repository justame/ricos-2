import { INLINE_TOOLBAR_BUTTONS, ACTION_BUTTONS } from '../cypress/dataHooks';
import { usePlugins, usePluginsConfig, plugins } from '../cypress/testAppConfig';
import { getTestPrefix } from '../cypress/utils';
import { DEFAULT_MOBILE_WIDTHS } from './settings';

const changeTextColor = (title: string, useTiptap, isMobile = false) => {
  const prefix = `${getTestPrefix(useTiptap)} ${title}`;
  const percyParam = isMobile ? DEFAULT_MOBILE_WIDTHS : {};
  cy.loadRicosEditor('plain')
    .setTextStyle(INLINE_TOOLBAR_BUTTONS.COLOR, [20, 15])
    .openCustomColorModal();
  cy.percySnapshot(prefix + ' - custom color modal', percyParam);
  cy.setColorByHex('d932c3');
  cy.updateTextColor();
  cy.percySnapshot(prefix + ' - update color', percyParam);
  if (!title.includes('mobile')) {
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.COLOR, [20, 5]).resetColor();
    cy.percySnapshot(prefix + ' - final', percyParam);
  }
};

[true, false].forEach(useTiptap => {
  describe(`${getTestPrefix(useTiptap)} text`, () => {
    beforeEach(() => {
      cy.switchToDesktop();
      cy.toggleTiptap(useTiptap);
    });

    afterEach(() => {
      cy.matchContentSnapshot();
      cy.switchToDraft();
    });

    it('allow to enter text', () => {
      cy.loadRicosEditor()
        .enterParagraphs([
          'Leverage agile frameworks',
          'to provide a robust synopsis for high level overviews.',
        ])
        .setEditorSelection(0, 0)
        .blurEditor();
      cy.percySnapshot();
    });

    it('allow to change text color', function () {
      changeTextColor(this.test.title, useTiptap);
    });

    it('allow to apply inline styles and links', () => {
      if (useTiptap) {
        //TIPTAP TODO - Expected to find element: `.ReactModalPortal`, but never found it.
        return;
      }
      cy.loadRicosEditor('plain')
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [40, 10])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNDERLINE, [10, 5])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.ITALIC, [20, 5])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [30, 5])
        .setLineSpacing(1, [10, 50])
        .setColor(4, [200, 208])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNDERLINE)
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.ITALIC)
        .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_CENTER)
        .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_RIGHT)
        .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_LEFT)
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.QUOTE, [30, 170])
        .setLink([0, 10], 'https://www.wix.com/')
        .setLink([50, 65], 'https://www.one.co.il/')
        .setColor(1, [300, 305])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.TITLE, [250, 260])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.QUOTE, [250, 260])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.ORDERED_LIST)
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNORDERED_LIST)
        .setLineSpacing(3, [100, 150])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.CODE_BLOCK, [100, 300])
        .setLink([15, 30], 'https://www.sport5.co.il/')
        .setEditorSelection(0, 0)
        .enterParagraphs(['#LIVING THE DREAM\n'])
        .setLink([0, 17], 'https://www.sport5.co.il')
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.CODE_BLOCK, [0, 10])
        .setEditorSelection(0, 0)
        // TODO: should fix unstable behavior of mention
        // .enterParagraphs(['@NO_MORE\n'])
        .setLink([0, 10], 'https://www.wix.com/')
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.CODE_BLOCK, [0, 10])
        .blurEditor();
      cy.percySnapshot();
    });

    // it('allow to apply inline styles and links - isolated', function() {
    //   cy.loadIsolatedEditorAndViewer('plain')
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [40, 10])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNDERLINE, [10, 5])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.ITALIC, [20, 5])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [30, 5])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNDERLINE)
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.ITALIC)
    //     .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_CENTER)
    //     .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_RIGHT)
    //     .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_LEFT)
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.QUOTE, [30, 170])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.TITLE, [250, 260])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.QUOTE, [250, 260])
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.ORDERED_LIST)
    //     .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNORDERED_LIST)
    //     .setEditorSelection(0, 0)
    //     .enterParagraphs(['#LIVING THE DREAM\n'])
    //     .setEditorSelection(0, 0)
    //     .blurEditor();
    //   cy.percySnapshot();
    // });

    it('allow to enter hashtag with link', () => {
      cy.loadRicosEditor()
        .enterParagraphs([
          '#wix.com wix.com #this_is_not_a_link #will_be_a_link thisislink#youknow.com ',
        ])
        .setLink([37, 15], 'https://www.wix.com/');
      cy.percySnapshot();
    });

    it('remove hashtag inside quotes', () => {
      cy.loadRicosEditorAndViewer().enterParagraphs([
        'This is #hashtag! This #is not \'#hashtag\'! This is also not "#hashtag" ! hashtag #Test ',
      ]);
      cy.percySnapshot();
    });

    it('allow to create lists', () => {
      if (useTiptap) {
        //TIPTAP TODO - Expected to find element: `[data-hook="floating-formatting-toolbar"] [data-hook=textBlockStyleButton_Bulletedlist]`, but never found it.
        return;
      }
      cy.loadRicosEditorAndViewer('plain')
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.ORDERED_LIST, [300, 100])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNORDERED_LIST, [550, 1])
        .blurEditor();
      cy.percySnapshot();
    });

    it('open link toolbar (InlinePluginToolbar)', () => {
      // set link
      cy.loadRicosEditor('plain')
        .setLink([0, 10], 'https://www.wix.com/')
        // set cursor on link
        .setEditorSelection(5, 0)
        .wait(200);
      // take snapshot of the toolbar
      cy.percySnapshot();
      // edit link
      if (!useTiptap) {
        //TIPTAP todo - can't find `[data-hook=linkPluginToolbar] [data-hook=LinkButton]`
        cy.get(`[data-hook=linkPluginToolbar] [data-hook=LinkButton]`)
          .click()
          .get(`[data-hook=linkPanelContainer] [data-hook=linkPanelInput]`)
          .type('https://www.google.com/')
          .get(`[data-hook=${ACTION_BUTTONS.SAVE}]`)
          .click();
        // check url button
        //TIPTAP todo - can't find data-hook=linkPluginToolbar] a (link toolbar is closed after save)
        cy.setEditorSelection(5, 0)
          .get(`[data-hook=linkPluginToolbar] a`)
          .should('have.attr', 'href', 'https://www.google.com/');
        // remove link
        cy.get(`[data-hook=linkPluginToolbar] [data-hook=RemoveLinkButton]`).click();
        cy.blurEditor();
      }
    });

    it('should insert custom link', () => {
      const testAppConfig = {
        ...usePluginsConfig({
          link: {
            isCustomModal: true,
          },
        }),
      };
      const selection: [number, number] = [0, 11];
      cy.loadRicosEditor('empty', testAppConfig)
        .enterParagraphs(['Custom link.'])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.LINK, selection);
      cy.percySnapshot();
    });

    it('should enter text without linkify links (disableAutoLink set to true)', () => {
      const testAppConfig = {
        ...usePluginsConfig({
          link: {
            disableAutoLink: true,
          },
        }),
      };
      cy.loadRicosEditor('empty', testAppConfig).enterParagraphs(['www.wix.com\nwww.wix.com ']);
      cy.percySnapshot();
    });

    it('should break the link when enter new soft line', () => {
      cy.loadRicosEditor('empty').enterParagraphs(['www.thisIs\nseperateLink.com ']);
      cy.percySnapshot();
    });

    it('should paste plain text', () => {
      cy.loadRicosEditor().focusEditor().paste('This is pasted text');
      cy.percySnapshot();
    });

    it('should paste html correctly', () => {
      cy.loadRicosEditor().focusEditor().paste(
        // eslint-disable-next-line max-len
        `<meta charset='utf-8'><span style="color: rgb(32, 33, 34); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">called<span> </span></span><a href="https://en.wikipedia.org/wiki/Anchor_text" title="Anchor text" style="text-decoration: none; color: rgb(11, 0, 128); background: none rgb(255, 255, 255); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;">anchor text</a><span style="color: rgb(32, 33, 34); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">.<span> </span></span>`,
        true
      );
      cy.percySnapshot();
    });

    it('allow to enter tab character', () => {
      cy.loadRicosEditor()
        .focusEditor()
        .tab()
        .enterParagraphs(['How to eat healthy is a good question.'])
        .blurEditor();
      cy.percySnapshot();
    });

    it('allow to enter tab character and delete it using shift+tab', () => {
      cy.loadRicosEditor()
        .focusEditor()
        .tab()
        .moveCursorToStart()
        .type('{rightarrow}')
        .tab({ shift: true })
        .enterParagraphs(['Text should not include tab.'])
        .blurEditor();
      cy.percySnapshot();
    });

    it('Enter click should create new block with the same alignment', () => {
      if (useTiptap) {
        //TIPTAP TODO - Expected to find element: `[data-hook="floating-formatting-toolbar"] [data-hook=textAlignmentButton_center]`, but never found it.
        return;
      }
      cy.loadRicosEditor()
        .enterParagraphs(['Hey, next line should be centered!'])
        .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [0, 33])
        .setAlignment(INLINE_TOOLBAR_BUTTONS.TEXT_ALIGN_CENTER)
        .setEditorSelection(33, 0)
        .type('{enter}')
        .type('{enter}')
        .enterParagraphs(['I am centered!'])
        .blurEditor();
      cy.percySnapshot();
    });

    it('esc key event should make editor blurred', () => {
      cy.loadRicosEditor().enterParagraphs(['Magic! I am blurred.']).type('{esc}');
      cy.percySnapshot();
    });

    it('should enter link and further text in current block has no inline style', () => {
      cy.loadRicosEditor()
        .enterParagraphs(['wix.com '])
        .enterParagraphs(['no inline style'])
        .blurEditor();
      cy.percySnapshot();
    });

    it('should enter link and further text in next block has no inline style', () => {
      cy.loadRicosEditor()
        .enterParagraphs(['wix.com'])
        .type('{enter}')
        .enterParagraphs(['no inline style'])
        .blurEditor();
      cy.percySnapshot();
    });

    it('should not allow applying link to atomic blocks in selection', function () {
      cy.loadRicosEditor('content-with-video');
      cy.waitForMediaToLoad(1); //editor only
      cy.setEditorSelection(0, 5);
      cy.getInlineButton(INLINE_TOOLBAR_BUTTONS.LINK).should('not.be.disabled');
      cy.percySnapshot();
      if (!useTiptap) {
        //TIPTAP TODO - expected '<div._26obF>' to be 'disabled'
        cy.setEditorSelection(0, 40)
          .getInlineButton(INLINE_TOOLBAR_BUTTONS.LINK)
          .should('be.disabled');
        cy.percySnapshot(this.test.title + ' - final');
      }
    });

    context('indentation', () => {
      it('allow to apply indent on a single block with inline styling', () => {
        cy.loadRicosEditor('plain', usePlugins(plugins.textPlugins))
          .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [40, 10])
          .setTextStyle(INLINE_TOOLBAR_BUTTONS.UNDERLINE, [10, 5])
          .setTextStyle(INLINE_TOOLBAR_BUTTONS.ITALIC, [20, 5])
          .setTextStyle(INLINE_TOOLBAR_BUTTONS.BOLD, [30, 5])
          .increaseIndent([0, 100])
          .increaseIndent([0, 100])
          .increaseIndent([0, 100])
          .increaseIndent([0, 100])
          .increaseIndent([200, 100])
          .increaseIndent([200, 100])
          .decreaseIndent([200, 100])
          .decreaseIndent([200, 100])
          .blurEditor();
        cy.percySnapshot();
      });

      it('allow to apply indent on multiple text blocks', () => {
        cy.loadRicosEditor('text-blocks', usePlugins(plugins.textPlugins))
          .increaseIndent([0, 550])
          .increaseIndent([0, 550])
          .increaseIndent([0, 550])
          .decreaseIndent([0, 550])
          .moveCursorToStart()
          .blurEditor();
        cy.percySnapshot();
      });

      it('allow to apply indent only on text blocks', () => {
        cy.loadRicosEditor('non-text-only-blocks', usePlugins(plugins.textPlugins))
          .increaseIndent([0, 550])
          .increaseIndent([0, 550])
          .increaseIndent([0, 550])
          .moveCursorToStart()
          .blurEditor();
        cy.percySnapshot();
      });

      it('allow to apply indent and delete it when clicking backspace where cursor is at start of block', () => {
        cy.loadRicosEditor('', usePlugins(plugins.textPlugins))
          .enterParagraphs(['Text should have depth 1.'])
          .increaseIndent([0, 20])
          .increaseIndent([0, 20])
          .moveCursorToStart()
          .type('{backspace}')
          .blurEditor();
        cy.percySnapshot();
      });

      // TODO: figure out how to test keyboard combinations of command/ctrl keys in cypress ci
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('allow to apply indent when clicking CMD+M on selected block', () => {
        cy.loadRicosEditorAndViewer('', usePlugins(plugins.textPlugins))
          .focusEditor()
          .enterParagraphs(['Text should not include indentation.'])
          .type('{selectall}')
          .type('{command+m}')
          .moveCursorToStart()
          .type('{command+shift+m}')
          .blurEditor();
        cy.percySnapshot();
      });
    });
  });

  describe(`[${useTiptap ? 'tiptap' : 'draft'}] text color mobile`, () => {
    beforeEach(() => {
      cy.switchToMobile();
      cy.toggleTiptap(useTiptap);
    });

    afterEach(() => {
      cy.switchToDraft();
    });

    it('allow to change text color on mobile', function () {
      changeTextColor(this.test.title, useTiptap, true);
    });
  });
});
