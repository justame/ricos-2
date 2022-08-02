import {
  PLUGIN_COMPONENT,
  PLUGIN_TOOLBAR_BUTTONS,
  DIVIDER_DROPDOWN_OPTIONS,
  STATIC_TOOLBAR_BUTTONS,
  INLINE_TOOLBAR_BUTTONS,
  COLLAPSIBLE_LIST_SETTINGS,
  ACTION_BUTTONS,
} from '../cypress/dataHooks';
import { usePlugins, plugins, usePluginsConfig } from '../cypress/testAppConfig';
import { DEFAULT_MOBILE_WIDTHS } from './settings';
import { getTestPrefix } from '../cypress/utils';

[true, false].forEach(useTiptap => {
  describe('plugins', () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
      cy.toggleTiptap(useTiptap);
    });
    afterEach(() => cy.matchContentSnapshot());
    context('html', () => {
      it(`${getTestPrefix(useTiptap)} add html with src url`, function () {
        cy.loadRicosEditorAndViewer('empty').newLine().addUrl().waitForHtmlToLoad();
        cy.percySnapshot(this.test.title);
      });

      // it(`${getTestPrefix(useTiptap)} add html with src html`, function () {
      //   cy.loadRicosEditorAndViewer('empty').newLine().addHtml().waitForHtmlToLoad();
      //   cy.get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.EDIT}]`).click({ multiple: true }).click();
      //   cy.percySnapshot(this.test.title);
      // });
    });

    context('spoiler', () => {
      function editText(dataHook, title) {
        cy.get(`[data-hook="${dataHook}"]`).click().type(' - In Plugin Editing').blur();
      }

      function revealSpoilerOnBlock() {
        cy.get('[data-hook="revealSpoilerBtn"]').click({ multiple: true });
      }

      it(`${getTestPrefix(
        useTiptap
      )} check spoilers on an image in editor and reveal it in viewer`, function () {
        cy.loadRicosEditorAndViewer('images', usePlugins(plugins.spoilerPreset));
        cy.get('[data-hook="imageViewer"]:first').parent().click();

        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
        cy.get(`[data-hook=imageSpoilerToggle]`).click();
        cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();

        cy.wait(100); //wait for setRef to get width and adjust correct blur
        editText('spoilerTextArea', 'change the description - image');
        editText('revealSpoilerContent', 'change the reveal button content - image');
        revealSpoilerOnBlock();
        cy.percySnapshot(this.test.title);
      });

      it(`${getTestPrefix(
        useTiptap
      )} check spoilers on a gallery in editor and reveal it in viewer`, function () {
        cy.loadRicosEditorAndViewer('gallery', usePlugins(plugins.spoilerPreset));
        cy.get('[data-hook="galleryViewer"]:first').parent().click();
        cy.get('[data-hook="baseToolbarButton_layout"]').click();
        cy.get(
          `[data-hook="${
            useTiptap ? 'GalleryPlugin_Layout_Slideshow' : 'Slideshow_dropdown_option'
          }"]`
        ).click();
        cy.wait(100);

        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SETTINGS);
        cy.get(`[data-hook=gallerySpoilerToggle]`).click();
        cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
        editText('spoilerTextArea', 'change the description - gallery');
        editText('revealSpoilerContent', 'change the reveal button content - gallery');
        revealSpoilerOnBlock();
        cy.percySnapshot(this.test.title);
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
      it(`${getTestPrefix(useTiptap)} render plugin toolbar and change styling`, function () {
        cy.loadRicosEditorAndViewer('divider')
          .openPluginToolbar(PLUGIN_COMPONENT.DIVIDER)
          .openDividerStyles();
        cy.percySnapshot(this.test.title);

        const openDividerSizeDropdown = () =>
          cy.get('[data-hook*=dividerSizeDropdownButton]').click({ force: true });

        useTiptap && openDividerSizeDropdown();
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SMALL);

        useTiptap && cy.get('[data-hook*=dividerAlignment]').click({ force: true });

        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_LEFT);

        cy.get('#RicosEditorContainer [data-hook=divider-double]').parent().click({ force: true });
        cy.get(`[data-hook*=${useTiptap ? 'floating-plugin-toolbar' : 'PluginToolbar'}]:first`);

        useTiptap && openDividerSizeDropdown();
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.MEDIUM);

        useTiptap && cy.get('[data-hook*=dividerAlignment]').click({ force: true });
        cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_RIGHT);

        cy.get('#RicosEditorContainer [data-hook=divider-dashed]').parent().click();
        cy.get(
          `[data-hook*=${useTiptap ? 'floating-plugin-toolbar' : 'PluginToolbar'}]:first`
        ).openDividerStyles(`[data-hook=${DIVIDER_DROPDOWN_OPTIONS.DOUBLE}]`);
        cy.percySnapshot(this.test.title);
      });
    });

    // context('map', () => {
    // before('load editor', () => {
    //   cy.switchToDesktop();
    //   cy.loadRicosEditorAndViewer('map');
    //   cy.get('.dismissButton').eq(1);
    // });
    // it('render map plugin toolbar and settings', () => {
    //   cy.openPluginToolbar(PLUGIN_COMPONENT.MAP);
    //   cy.percySnapshot('render map plugin toolbar');
    //   cy.openMapSettings();
    //   cy.get('.gm-style-cc');
    //   cy.percySnapshot('render map settings');
    // });
    // });

    context('file-upload', () => {
      it(`${getTestPrefix(useTiptap)} render file-upload plugin toolbar`, function () {
        cy.loadRicosEditorAndViewer('file-upload');
        cy.openPluginToolbar(PLUGIN_COMPONENT.FILE_UPLOAD);
        cy.percySnapshot(this.test.title);
      });
    });

    if (!useTiptap) {
      context('drag and drop', () => {
        // eslint-disable-next-line mocha/no-skipped-tests
        it.skip('drag and drop plugins', () => {
          cy.loadRicosEditorAndViewer('dragAndDrop');
          cy.focusEditor();
          const src = `[data-hook=${PLUGIN_COMPONENT.IMAGE}] + [data-hook=componentOverlay]`;
          const dest = `span[data-offset-key="fjkhf-0-0"]`;
          cy.dragAndDropPlugin(src, dest);
          cy.get('img[style="opacity: 1;"]');
          cy.percySnapshot();
        });
      });
    }

    context('alignment', () => {
      function testAtomicBlockAlignment(align: 'left' | 'right' | 'center') {
        it(`${getTestPrefix(useTiptap)} align atomic block ` + align, function () {
          cy.loadRicosEditorAndViewer('images').alignImage(align);
          cy.percySnapshot(this.test.title);
        });
      }
      testAtomicBlockAlignment('left');
      testAtomicBlockAlignment('center');
      testAtomicBlockAlignment('right');
    });

    if (!useTiptap) {
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
    }

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

        beforeEach('load editor', () => {
          cy.loadRicosEditorAndViewer('empty', testAppConfig);
        });

        it(`${getTestPrefix(
          useTiptap
        )} should create link preview from link after enter key`, function () {
          cy.insertLinkAndEnter('www.wix.com', { isPreview: true });
          cy.percySnapshot(this.test.title);
        });

        it(`${getTestPrefix(useTiptap)} should embed link that supports embed`, function () {
          cy.insertLinkAndEnter('www.mockUrl.com');
          cy.percySnapshot(this.test.title);
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

        it(`${getTestPrefix(
          useTiptap
        )} should not create link preview/embed when enableLinkPreview is off`, function () {
          cy.insertLinkAndEnter('www.wix.com');
          cy.insertLinkAndEnter('www.mockUrl.com');
          cy.percySnapshot(this.test.title);
        });
      });
    });

    context('social embed', () => {
      const testAppConfig = {
        plugins: [plugins.linkPreview],
      };
      beforeEach('load editor', () => {
        cy.loadRicosEditorAndViewer('empty', testAppConfig);
      });

      const embedTypes = ['TWITTER', 'INSTAGRAM'];
      embedTypes.forEach(embedType => {
        it(`${getTestPrefix(
          useTiptap
        )} render ${embedType.toLowerCase()} upload modals`, function () {
          cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
          cy.percySnapshot(this.test.title + ' modal');
          cy.addSocialEmbed('www.mockUrl.com').waitForHtmlToLoad();
          cy.get(`#RicosViewerContainer [data-hook=HtmlComponent]`);
          cy.percySnapshot(this.test.title + ' added');
        });
      });
    });

    context('verticals embed', () => {
      context('verticals embed modal', () => {
        beforeEach('load editor', () => {
          cy.loadRicosEditorAndViewer('empty', usePlugins(plugins.verticalEmbed));
        });
        const embedTypes = ['PRODUCT', 'BOOKING', 'EVENT'];
        it(`${getTestPrefix(useTiptap)} render upload modals`, () => {
          embedTypes.forEach(embedType => {
            cy.openEmbedModal(STATIC_TOOLBAR_BUTTONS[embedType]);
            cy.percySnapshot(`${getTestPrefix(useTiptap)} verticals embed modal ${embedType}`);
            cy.get(`[data-hook*=verticalsItemsList]`).children().first().click();
            cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
          });
        });
      });

      context('verticals embed widget', () => {
        it(`${getTestPrefix(useTiptap)} should replace widget`, () => {
          cy.loadRicosEditorAndViewer('vertical-embed', usePlugins(plugins.verticalEmbed));
          if (useTiptap) {
            cy.get(`[data-hook*=${PLUGIN_COMPONENT.VERTICAL_EMBED}]`)
              .first()
              .parent()
              .parent()
              .click();
          } else {
            cy.openPluginToolbar(PLUGIN_COMPONENT.VERTICAL_EMBED);
          }
          cy.clickToolbarButton('baseToolbarButton_replace');
          cy.get(`[data-hook*=verticalsItemsList]`).children().first().click();
          cy.get(`[data-hook=${ACTION_BUTTONS.SAVE}]`).click();
        });
      });
    });

    // context('link button', () => {
    //   beforeEach('load editor', () => cy.loadRicosEditorAndViewer('link-button'));

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
    // });

    if (!useTiptap) {
      context('action button', () => {
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
          cy.loadRicosEditorAndViewer('action-button', usePlugins(plugins.actionButton));
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
    }

    if (!useTiptap) {
      context('collapsible list', () => {
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
          cy.loadRicosEditorAndViewer(
            'empty-collapsible-list',
            usePlugins(plugins.collapsibleList)
          );
          cy.focusCollapsibleList(3).type('{backspace}');
          cy.percySnapshot();
        });
      });
    }
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
