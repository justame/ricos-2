import {
  TOOLBARS,
  STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED,
  VIDEO_PLUGIN,
  AUDIO_PLUGIN,
  SOUND_CLOUD,
  SOCIAL_EMBED,
} from '../cypress/dataHooks';
import { getTestPrefix } from '../cypress/utils';

const LINKS = {
  YOUTUBE: 'https://www.youtube.com/watch?v=whbidPR4nVA',
  SOUNDCLOUD: 'https://soundcloud.com/martingarrix/martin-garrix-animals-original',
};

const modalHandler = (ADD_BUTTON: string, INPUT?: string, LINK?: string) => {
  LINK && INPUT && cy.get(`[data-hook=${INPUT}]`).wait(500).type(LINK);
  cy.get(`[data-hook=${ADD_BUTTON}]`).click();
  cy.waitForMediaToLoad(1); //editor only
};

const additionalCommands = {
  VIDEO: () => {
    cy.wait(500);
    modalHandler(VIDEO_PLUGIN.ADD, VIDEO_PLUGIN.INPUT, LINKS.YOUTUBE);
    cy.wait(500);
  },
  SOUND_CLOUD: () => {
    modalHandler(SOUND_CLOUD.ADD, SOUND_CLOUD.INPUT, LINKS.SOUNDCLOUD);
  },
  YOUTUBE: () => {
    modalHandler(SOCIAL_EMBED.ADD, SOCIAL_EMBED.INPUT, LINKS.YOUTUBE);
  },
  CODE_BLOCK: () => {
    cy.moveCursorToEnd(); //DO NOT REMOVE - fix flakiness
  },
  EMOJI: () => {
    cy.get(`[data-hook=emoji-5]:first`).click();
  },
  AUDIO: () => {
    cy.wait(500);
    modalHandler(AUDIO_PLUGIN.CUSTOM);
  },
  // GIPHY: () => {
  //   cy.get(`[data-hook=${GIPHY_PLUGIN.UPLOAD_MODAL}]`);
  //   cy.get(`[role=button][tabindex=0]:first`).click();
  // },
  // ADSENSE: () => {},
};

const EXCLUDE_PLUGINS = ['map', 'video'];

const testInsertPlugin =
  (toolbar: string) =>
  ([plugin = '', pluginButtonName]: [string, string]) => {
    const pluginLowercase = plugin.toLocaleLowerCase();
    if (EXCLUDE_PLUGINS.indexOf(pluginLowercase) === -1) {
      cy.focusEditor().type('{downarrow}').insertPlugin(toolbar, pluginButtonName);
      additionalCommands[plugin]?.();
      cy.wait(1500);
    }
  };

// const testNativeUploadMediaPlugin = toolbar => ([plugin, pluginButtonName]) =>
//   it(`should upload native ${plugin?.toLocaleLowerCase()}`, function() {
//     const testAppConfig = {
//       ...useUploadConfig,
//     };
//     cy.loadRicosEditorAndViewer('empty', testAppConfig)
//       .wait(500)
//       .insertPlugin(toolbar, pluginButtonName)
//       .then(el => {
//         const mockFileList = new DataTransfer();
//         const file = new File(['image'], 'native.jpg', { type: 'image/png' });
//         mockFileList.items.add(file);
//         el[0].files = mockFileList.files;
//         el[0].dispatchEvent(
//           new Event('change', {
//             bubbles: true,
//           })
//         );
//       });

//     cy.wait(2000);

//     cy.percySnapshot();
//   });

[true, false].forEach(useTiptap => {
  describe(`${getTestPrefix(useTiptap)} insert plugins tests`, () => {
    beforeEach('load editor', () => {
      cy.switchToDesktop();
      cy.toggleTiptap(useTiptap);
      cy.loadRicosEditor('empty');
    });

    afterEach(() => {
      cy.matchContentSnapshot();
      cy.switchToDraft();
    });

    const testTitlePerfix = getTestPrefix(useTiptap);

    it(`${testTitlePerfix} side toolbar`, () => {
      Object.entries(STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED).forEach(testInsertPlugin(TOOLBARS.SIDE));
      // TODO: fix flaky tests
      // Object.entries(STATIC_TOOLBAR_BUTTONS_MEDIA).forEach(
      //   testNativeUploadMediaPlugin(TOOLBARS.SIDE)
      // );
      cy.percySnapshot(`${testTitlePerfix} side toolbar`);
    });

    it(`${testTitlePerfix} footer toolbar`, () => {
      Object.entries(STATIC_TOOLBAR_BUTTONS_WITHOUT_EMBED).forEach(
        testInsertPlugin(TOOLBARS.FOOTER)
      );
      // TODO: fix flaky tests
      // Object.entries(STATIC_TOOLBAR_BUTTONS_MEDIA).forEach(
      //   testNativeUploadMediaPlugin(TOOLBARS.FOOTER)
      // );
      cy.percySnapshot(`${testTitlePerfix} footer toolbar`);
    });
  });
});
