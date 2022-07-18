import {
  PLUGIN_COMPONENT,
  PLUGIN_TOOLBAR_BUTTONS,
  DIVIDER_DROPDOWN_OPTIONS,
  STATIC_TOOLBAR_BUTTONS,
  INLINE_TOOLBAR_BUTTONS,
  COLLAPSIBLE_LIST_SETTINGS,
  ACTION_BUTTONS,
} from '../cypress/dataHooks';
import { usePlugins, plugins, usePluginsConfig, useTheming } from '../cypress/testAppConfig';
import { DEFAULT_MOBILE_WIDTHS } from './settings';

describe('plugins', () => {
  afterEach(() => cy.matchContentSnapshot());

  context('html', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    it('render html plugin with url', () => {
      cy.loadRicosEditorAndViewer('empty').addUrl().waitForHtmlToLoad();
      cy.percySnapshot();
    });

    it('render html plugin toolbar', () => {
      cy.loadRicosEditorAndViewer('empty').addHtml().waitForHtmlToLoad();
      cy.get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.EDIT}]`).click({ multiple: true }).click();
      cy.percySnapshot();
    });
  });

  context('spoiler', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

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

    function editText(dataHook, title) {
      cy.get(`[data-hook="${dataHook}"]`).click().type(' - In Plugin Editing').blur();
      cy.percySnapshot(title);
    }

    function revealSpoilerOnBlock() {
      cy.get('[data-hook="revealSpoilerBtn"]').click({ multiple: true });
    }

    it(`check spoilers on an image in editor and reveal it in viewer`, () => {
      cy.loadRicosEditorAndViewer('images', usePlugins(plugins.spoilerPreset));
      cy.get('[data-hook="imageViewer"]:first').parent().click();

      // check spoiler from inline toolbar
      // cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();

      //check spoiler from settings modal
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
      cy.get(`[data-hook=imageSpoilerToggle]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();

      cy.wait(100); //wait for setRef to get width and adjust correct blur
      cy.percySnapshot('adding spoiler on an image');
      editText('spoilerTextArea', 'change the description - image');
      editText('revealSpoilerContent', 'change the reveal button content - image');
      revealSpoilerOnBlock();
      cy.percySnapshot('reveal spoiler in viewer - image');
    });

    it(`check spoilers on a gallery in editor and reveal it in viewer`, () => {
      cy.loadRicosEditorAndViewer('gallery', usePlugins(plugins.spoilerPreset));
      cy.get('[data-hook="galleryViewer"]:first').parent().click();
      cy.get('[data-hook="baseToolbarButton_layout"]').click();
      cy.get('[data-hook="Slideshow_dropdown_option"]').click();
      cy.wait(100);

      // check spoiler from inline toolbar
      // cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();

      //check spoiler from settings modal
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
      cy.get(`[data-hook=gallerySpoilerToggle]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
      // cy.wait(300);
      // cy.percySnapshot('adding spoiler on a gallery');
      editText('spoilerTextArea', 'change the description - gallery');
      editText('revealSpoilerContent', 'change the reveal button content - gallery');
      revealSpoilerOnBlock();
      cy.percySnapshot('reveal spoiler in viewer - gallery');
    });

    // it(`check spoilers on a video in editor and reveal it in viewer`, () => {
    //   cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.spoilerPreset));
    //   cy.openVideoUploadModal().addVideoFromURL();
    //   cy.waitForMediaToLoad();
    //   cy.get('[data-hook="videoPlayer"]:first')
    //     .parent()
    //     .click();
    //   cy.get(`[data-hook=${PLUGIN_TOOLBAR_BUTTONS.SPOILER}]:visible`).click();
    //   cy.percySnapshot('adding spoiler on a video');
    //   editText('spoilerTextArea', 'change the description');
    //   editText('revealSpoilerContent', 'change the reveal button content');
    //   revealSpoilerOnBlock();
    // });
  });

  context('divider', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    it('render plugin toolbar and change styling', () => {
      cy.loadRicosEditorAndViewer('divider')
        .openPluginToolbar(PLUGIN_COMPONENT.DIVIDER)
        .openDropdownMenu();
      cy.percySnapshot('render divider plugin toolbar');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SMALL);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_LEFT);

      cy.get('#RicosEditorContainer [data-hook=divider-double]').parent().click();
      cy.get('[data-hook*="PluginToolbar"]:first');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.MEDIUM);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_RIGHT);

      cy.get('#RicosEditorContainer [data-hook=divider-dashed]').parent().click();
      cy.get('[data-hook*="PluginToolbar"]:first').openDropdownMenu(
        `[data-hook=${DIVIDER_DROPDOWN_OPTIONS.DOUBLE}]`
      );
      cy.percySnapshot('change divider styling');
    });
  });

  context('map', () => {
    before('load editor', () => {
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('map');
      cy.get('.dismissButton').eq(1);
    });

    // it('render map plugin toolbar and settings', () => {
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.MAP);
    //   cy.percySnapshot('render map plugin toolbar');
    //   cy.openMapSettings();
    //   cy.get('.gm-style-cc');
    //   cy.percySnapshot('render map settings');
    // });
  });

  context('file-upload', () => {
    before('load editor', () => {
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('file-upload');
    });

    it('render file-upload plugin toolbar', () => {
      cy.openPluginToolbar(PLUGIN_COMPONENT.FILE_UPLOAD);
      cy.percySnapshot();
    });
  });

  context('drag and drop', () => {
    before('load editor', () => {
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('dragAndDrop');
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('drag and drop plugins', () => {
      cy.focusEditor();
      const src = `[data-hook=${PLUGIN_COMPONENT.IMAGE}] + [data-hook=componentOverlay]`;
      const dest = `span[data-offset-key="fjkhf-0-0"]`;
      cy.dragAndDropPlugin(src, dest);
      cy.get('img[style="opacity: 1;"]');
      cy.percySnapshot();
    });
  });

  context('alignment', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    function testAtomicBlockAlignment(align: 'left' | 'right' | 'center') {
      it('align atomic block ' + align, () => {
        cy.loadRicosEditorAndViewer('images').alignImage(align);
        cy.percySnapshot();
      });
    }

    testAtomicBlockAlignment('left');
    testAtomicBlockAlignment('center');
    testAtomicBlockAlignment('right');
  });

  context('link preview', () => {
    beforeEach('load editor', () =>
      cy.loadRicosEditorAndViewer('link-preview', usePlugins(plugins.embedsPreset))
    );

    const takeSnapshot = name => {
      cy.waitForHtmlToLoad();
      cy.triggerLinkPreviewViewerUpdate();
      cy.percySnapshot();
    };

    it('change link preview settings', function () {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW);
      cy.setLinkSettings();
      takeSnapshot(this.test.title);
    });
    //TODO: fix this flaky test
    // eslint-disable-next-line mocha/no-skipped-tests
    it('convert link preview to regular link', function () {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW);
      cy.clickToolbarButton('baseToolbarButton_replaceToLink');
      takeSnapshot(this.test.title);
    });
    it('backspace key should convert link preview to regular link', function () {
      cy.focusEditor().type('{downarrow}{downarrow}').type('{backspace}');
      takeSnapshot(this.test.title);
    });
    it('delete link preview', function () {
      cy.openPluginToolbar(PLUGIN_COMPONENT.LINK_PREVIEW).wait(100);
      cy.clickToolbarButton('blockButton_delete');
      takeSnapshot(this.test.title);
    });
  });

  context('convert link to preview', () => {
    context('with default config', () => {
      const testAppConfig = {
        ...usePlugins(plugins.embedsPreset),
        ...usePluginsConfig({
          linkPreview: {
            enableEmbed: undefined,
            enableLinkPreview: undefined,
          },
        }),
      };

      beforeEach('load editor', () => cy.loadRicosEditorAndViewer('empty', testAppConfig));

      it('should create link preview from link after enter key', () => {
        cy.insertLinkAndEnter('www.wix.com', { isPreview: true });
        cy.percySnapshot();
      });

      it('should embed link that supports embed', () => {
        cy.insertLinkAndEnter('www.mockUrl.com');
        cy.percySnapshot();
      });
    });
    context('with custom config', () => {
      const testAppConfig = {
        ...usePlugins(plugins.embedsPreset),
        ...usePluginsConfig({
          linkPreview: {
            enableEmbed: false,
            enableLinkPreview: false,
          },
        }),
      };

      beforeEach('load editor', () => cy.loadRicosEditorAndViewer('empty', testAppConfig));

      it('should not create link preview when enableLinkPreview is off', () => {
        cy.insertLinkAndEnter('www.wix.com');
        cy.percySnapshot();
      });

      it('should not embed link when enableEmbed is off', () => {
        cy.insertLinkAndEnter('www.mockUrl.com');
        cy.percySnapshot();
      });
    });
  });

  context('social embed', () => {
    const testAppConfig = {
      plugins: [plugins.linkPreview],
    };
    beforeEach('load editor', () => {
      cy.switchToDesktop();
      cy.loadRicosEditorAndViewer('empty', testAppConfig);
    });

    const embedTypes = ['TWITTER', 'INSTAGRAM'];
    embedTypes.forEach(embedType => {
      it(`render ${embedType.toLowerCase()} upload modals`, function () {
        cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
        cy.percySnapshot(this.test.title + ' modal');
        cy.addSocialEmbed('www.mockUrl.com').waitForHtmlToLoad();
        cy.get(`#RicosViewerContainer [data-hook=HtmlComponent]`);
        cy.percySnapshot(this.test.title + ' added');
      });
    });
  });

  context('list', () => {
    beforeEach('load editor', () => cy.loadRicosEditorAndViewer());

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
    it(`lists with line height`, function () {
      cy.loadRicosEditorAndViewer(
        'lists-with-line-height',
        useTheming({ skipCssOverride: true, useParagraphLineHeight: true })
      );
      cy.percySnapshot(this.test.title);
    });
  });

  context('verticals embed', () => {
    context('verticals embed modal', () => {
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.verticalEmbed));
      });
      // const embedTypes = ['EVENT', 'PRODUCT', 'BOOKING'];
      const embedTypes = ['PRODUCT', 'BOOKING', 'EVENT'];
      it('render upload modals', () => {
        embedTypes.forEach(embedType => {
          cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
          cy.percySnapshot(`verticals embed modal ${embedType}`);
          cy.get(`[data-hook*=verticalsItemsList]`).children().first().click();
          cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
        });
      });
    });

    context('verticals embed widget', () => {
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('vertical-embed', usePlugins(plugins.verticalEmbed));
      });
      it('should replace widget', () => {
        cy.openPluginToolbar(PLUGIN_COMPONENT.VERTICAL_EMBED);
        cy.clickToolbarButton('baseToolbarButton_replace');
        cy.get(`[data-hook*=verticalsItemsList]`).children().first().click();
        cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
      });
    });
  });

  context('link button', () => {
    beforeEach('load editor', () => cy.loadRicosEditorAndViewer('link-button'));

    //TODO: fix this flaky test
    // eslint-disable-next-line mocha/no-skipped-tests
    // it.skip('create link button & customize it', function() {
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.BUTTON)
    //     .get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS}][tabindex!=-1]`)
    //     .click()
    //     .get(`[data-hook*=ButtonInputModal][placeholder="Enter a URL"]`)
    //     .type('www.wix.com')
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DESIGN_TAB}]`)
    //     .click()
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.BUTTON_SAMPLE}]`)
    //     .click()
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DONE}]`)
    //     .click();
    //   cy.percySnapshot();
    // });
  });

  context('action button', () => {
    beforeEach('load editor', () =>
      cy.loadRicosEditorAndViewer('action-button', usePlugins(plugins.actionButton))
    );

    // it('create action button & customize it', function() {
    //   cy.focusEditor();
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.BUTTON)
    //     .wait(100)
    //     .get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.ADV_SETTINGS}][tabindex!=-1]`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DESIGN_TAB}]`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.BUTTON_SAMPLE}] button`)
    //     .click({ force: true })
    //     .wait(100)
    //     .get(`[data-hook*=${BUTTON_PLUGIN_MODAL.DONE}]`)
    //     .click({ force: true });
    //   cy.percySnapshot();
    // });

    it('create action button & click it', () => {
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get(`[data-hook*=${PLUGIN_COMPONENT.BUTTON}]`)
        .last()
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('onClick event..');
        });
      cy.percySnapshot();
    });
  });

  context('headings', () => {
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
    beforeEach(() => cy.switchToDesktop());

    it('Should render header-two', () => {
      cy.loadRicosEditorAndViewer().type('{$h').type('2}Header-two{$h').type('}');
      cy.percySnapshot();
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

  context('anchor', () => {
    const testAppConfig = {
      ...usePlugins(plugins.all),
      ...usePluginsConfig({
        link: {
          linkTypes: { anchor: true },
        },
      }),
    };

    function selectAnchorAndSave() {
      cy.get(`[data-hook=test-blockKey`).click({ force: true });
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
    }

    context('anchor desktop', () => {
      beforeEach('load editor', () => {
        cy.switchToDesktop();
        cy.loadRicosEditorAndViewer('plugins-for-anchors', testAppConfig);
      });

      it('should create anchor in text', () => {
        cy.setEditorSelection(0, 6);
        cy.wait(500);
        cy.get(`[data-hook=inlineToolbar] [data-hook=${INLINE_TOOLBAR_BUTTONS.LINK}]`).click({
          force: true,
        });
        cy.get(`[data-hook=linkPanelContainer] [data-hook=anchor-radio]`).click();
        cy.wait(1000);
        cy.percySnapshot();
        selectAnchorAndSave();
      });

      it('should create anchor in image', () => {
        cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE);
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK);
        cy.get(`[data-hook=linkPanelContainer] [data-hook=anchor-radio]`).click();
        cy.wait(1000);
        cy.percySnapshot();
        selectAnchorAndSave();
      });
    });

    context('anchor mobile', () => {
      beforeEach('load editor', () => {
        cy.switchToMobile();
        cy.loadRicosEditorAndViewer('plugins-for-anchors', testAppConfig);
      });

      it('should create anchor in text', function () {
        cy.setEditorSelection(0, 6);
        cy.get(`[data-hook=mobileToolbar] [data-hook=LinkButton]`).click({ force: true });
        cy.get(`[data-hook=linkPanelContainerAnchorTab]`).click({ force: true });
        cy.wait(1000);
        cy.percySnapshot(this.test.title, DEFAULT_MOBILE_WIDTHS);
        selectAnchorAndSave();
      });

      it('should create anchor in image', function () {
        cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE);
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.LINK);
        cy.get(`[data-hook=linkPanelContainerAnchorTab]`).click({ force: true });
        cy.wait(1000);
        cy.percySnapshot(this.test.title, DEFAULT_MOBILE_WIDTHS);
        selectAnchorAndSave();
      });
    });
  });

  context('collapsible list', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
    });

    const setCollapsibleListSetting = setting => {
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
      cy.get(`[data-hook=${setting}]`).click();
      cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
    };

    it('should change collapsible list settings', function () {
      cy.loadRicosEditorAndViewer('collapsible-list-rich-text', {
        plugins: [plugins.collapsibleList, plugins.embedsPreset, plugins.textPlugins],
      });
      cy.getCollapsibleList();
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.RTL_DIRECTION);
      cy.percySnapshot(this.test.title + ' - rtl direction');
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.COLLAPSED);
      cy.percySnapshot(this.test.title + ' - collapsed');
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.EXPANDED);
      cy.percySnapshot(this.test.title + ' - final');
    });

    it('should focus & type', () => {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList))
        .focusCollapsibleList(1)
        .type('Yes\n')
        .focusCollapsibleList(2);
      cy.percySnapshot();
    });

    it('should insert image in collapsible list', () => {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.all))
        .focusCollapsibleList(2)
        .type('Image in collapsible list');
      cy.insertPluginFromSideToolbar('ImagePlugin_InsertButton');
      cy.wait(1000);
      cy.percySnapshot();
    });

    it('should collapse first pair', () => {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList))
        .getCollapsibleList()
        .toggleCollapseExpand(0);
      cy.percySnapshot();
    });

    it('should have only one expanded pair', () => {
      cy.loadRicosEditorAndViewer(
        'empty-collapsible-list',
        usePlugins(plugins.collapsibleList)
      ).getCollapsibleList();
      setCollapsibleListSetting(COLLAPSIBLE_LIST_SETTINGS.ONE_PAIR_EXPANDED);
      cy.getCollapsibleList().toggleCollapseExpand(1);
      cy.percySnapshot();
    });

    it('should delete second pair', () => {
      cy.loadRicosEditorAndViewer('empty-collapsible-list', usePlugins(plugins.collapsibleList));
      cy.focusCollapsibleList(3).type('{backspace}');
      cy.percySnapshot();
    });
  });
});
