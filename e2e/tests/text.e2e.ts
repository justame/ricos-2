import { INLINE_TOOLBAR_BUTTONS } from '../cypress/dataHooks';
import { usePlugins, plugins } from '../cypress/testAppConfig';
import { getTestPrefix } from '../cypress/utils';

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
});
