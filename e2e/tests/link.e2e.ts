import { INLINE_TOOLBAR_BUTTONS, ACTION_BUTTONS } from '../cypress/dataHooks';
import { usePluginsConfig } from '../cypress/testAppConfig';
import { getTestPrefix } from '../cypress/utils';

[true, false].forEach(useTiptap => {
  describe(`${getTestPrefix(useTiptap)} link`, () => {
    beforeEach(() => {
      cy.switchToDesktop();
      cy.toggleTiptap(useTiptap);
    });

    afterEach(() => {
      cy.matchContentSnapshot();
      cy.switchToDraft();
    });

    it('allow to enter hashtag with link', () => {
      cy.loadRicosEditor()
        .enterParagraphs([
          '#wix.com wix.com #this_is_not_a_link #will_be_a_link thisislink#youknow.com ',
        ])
        .setLink([37, 15], 'https://www.wix.com/');
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
  });
});
