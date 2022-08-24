import { INLINE_TOOLBAR_BUTTONS } from '../cypress/dataHooks';
import { usePlugins, plugins, useTheming, usePluginsConfig } from '../cypress/testAppConfig';
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
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    cy.setTextStyle(INLINE_TOOLBAR_BUTTONS.COLOR, [20, 5]).resetColor();
    cy.percySnapshot(prefix + ' - final', percyParam);
  }
};

[true, false].forEach(useTiptap => {
  describe(`${getTestPrefix(useTiptap)} text formatting`, () => {
    beforeEach(() => {
      cy.switchToDesktop();
      cy.toggleTiptap(useTiptap);
    });

    afterEach(() => {
      cy.matchContentSnapshot();
      cy.switchToDraft();
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

    context('list', () => {
      if (useTiptap) {
        return;
      }
      // TODO: figure out how to test keyboard combinations of command/ctrl keys in cypress ci
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('create nested lists using CMD+M/CMD+SHIFT+M', () => {
        cy.loadRicosEditorAndViewer()
          .enterParagraphs(['1. Hey I am an ordered list in depth 1.'])
          .type('{command+m}')
          .enterParagraphs(['\n Hey I am an ordered list in depth 2.'])
          .type('{command+m}')
          .enterParagraphs(['\n Hey I am an ordered list in depth 1.'])
          .type('{command+shift+m}')
          .enterParagraphs(['\n\n1. Hey I am an ordered list in depth 0.']);

        // .enterParagraphs(['\n\n- Hey I am an unordered list in depth 1.'])
        // .tab()
        // .enterParagraphs(['\n Hey I am an unordered list in depth 2.'])
        // .tab()
        // .enterParagraphs(['\n Hey I am an unordered list in depth 1.'])
        // .tab({ shift: true })
        // .enterParagraphs(['\n\n- Hey I am an unordered list in depth 0.']);
        cy.percySnapshot();
      });
    });

    context('lists', () => {
      if (useTiptap) {
        return;
      }
      it(`lists with line height`, function () {
        cy.loadRicosEditorAndViewer(
          'lists-with-line-height',
          useTheming({ skipCssOverride: true, useParagraphLineHeight: true })
        );
        cy.percySnapshot(this.test.title);
      });
    });

    context('text spoilers', () => {
      if (useTiptap) {
        return;
      }
      it(`check text spoilers in editor and reveal it in viewer`, () => {
        cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.spoilerPreset)).enterParagraphs([
          'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
          'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.', // eslint-disable-line max-len
        ]);

        cy.setTextStyle('textSpoilerButton', [15, 5]);
        cy.blurEditor();
        cy.setTextStyle('textSpoilerButton', [30, 10]);
        cy.percySnapshot('adding some spoilers');
        cy.setLink([5, 5], 'https://www.wix.com/');
        cy.setTextStyle('textSpoilerButton', [0, 13]);
        cy.percySnapshot('adding spoiler around link');
        cy.setTextStyle('textSpoilerButton', [20, 10]);
        cy.percySnapshot('apply spoiler on two existing spoilers');
        cy.setTextStyle('textSpoilerButton', [20, 5]);
        cy.percySnapshot('split spoiler');
        cy.setTextStyle('textSpoilerButton', [70, 35]);
        cy.percySnapshot('spoiler on multiple blocks');
        cy.get('[data-hook="spoiler_0"]:first').click();
        cy.percySnapshot('reveal spoiler');
        cy.get('[data-hook="spoiler_3"]:last').click();
        cy.percySnapshot('reveal spoiler on multiple blocks');
      });
    });

    context('headings', () => {
      if (useTiptap) {
        return;
      }
      const testAppConfig = {
        ...usePlugins(plugins.headings),
        ...usePluginsConfig({
          headings: {
            customHeadings: ['P', 'H2', 'H3'],
          },
        }),
      };

      function setHeader(number, selection) {
        cy.setTextStyle('headingsDropdownButton', selection)
          .get(`[data-hook=headingsDropdownPanel] > :nth-child(${number})`)
          .click()
          .wait(500);
      }

      function testHeaders(config, title) {
        cy.loadRicosEditorAndViewer('empty', config).enterParagraphs([
          'Leverage agile frameworks',
          'to provide a robust synopsis for high level overviews.',
        ]);
        setHeader(3, [0, 24]);
        cy.percySnapshot(title);
        setHeader(2, [28, 40]);
        cy.setTextStyle('headingsDropdownButton', [28, 40]);
        cy.percySnapshot(title + ' - final');
      }

      it('Change headers - with customHeadings config', () => {
        testHeaders(testAppConfig, 'change headers (custom heading)');
      });

      it('Change headers - without customHeadings config', () => {
        testHeaders(usePlugins(plugins.headings), 'change headers');
      });
    });

    context('Headers markdown', () => {
      if (useTiptap) {
        return;
      }
      it('Should render header-two', () => {
        cy.loadRicosEditorAndViewer().type('{$h').type('2}Header-two{$h').type('}');
        cy.percySnapshot();
      });
    });
  });

  context('Text/Highlight Color - mobile', () => {
    beforeEach(() => cy.switchToMobile());

    it('allow to color text', function () {
      cy.loadRicosEditorAndViewer().enterParagraphs(['Color.']).setTextColor([0, 5], 'color4');
      cy.percySnapshot(this.test.title, DEFAULT_MOBILE_WIDTHS);
    });

    it('allow to highlight text', () => {
      cy.loadRicosEditorAndViewer()
        .enterParagraphs(['Highlight.'])
        .setHighlightColor([0, 9], 'color4');
      cy.percySnapshot();
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
