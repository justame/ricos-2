import type { TestAppConfig } from '../../examples/main/src/types';
import { usePlugins, plugins, useConsumerTheming } from '../cypress/testAppConfig';

export interface FixtureConfig {
  fixture: string;
  config?: TestAppConfig;
  label?: string;
  additionalCommands?: (cy: Cypress.cy) => void;
}

export type Fixture = string | FixtureConfig;

export const fixtures: Fixture[] = [
  'headers',
  'images',
  'inline-styles',
  'lists',
  'nested-lists',
  'aligment_with_punctuations',
  {
    fixture: 'multiple-collapsible-lists-rich-text',
    config: usePlugins(plugins.all),
  },
  'indent_blocks_lists_with_alignment',
  'quote',
  // {
  //   fixture: 'facebook-video',
  //   additionalCommands: cy => {
  //     cy.waitForMediaToLoad();
  //     cy.wait(200);
  //   },
  // },
  'gif',
  'giphy',
  // {
  //   fixture: 'html',
  //   additionalCommands: cy => {
  //     cy.waitForHtmlToLoad();
  //   },
  // },
  {
    fixture: 'gallery-layouts',
    additionalCommands: cy => {
      cy.scrollTo(0, 100);
      cy.waitForDocumentMutations();
      cy.scrollTo(0, 0);
      cy.loadOutOfViewImagesInGallery();
      cy.waitForGalleryImagesToLoad();
    },
  },
  'old-image-format',
  'hashtag-and-link',
  'images-sizes',
  'images-original-size',
  'all-images-cases-part-1',
  'all-images-cases-part-2',
  'all-images-cases-part-3',
  'unsupported-blocks',
  {
    fixture: 'file-inside-table',
    config: usePlugins(plugins.all),
  },
  {
    fixture: 'link-preview-render',
    config: usePlugins(plugins.all),
  },
  {
    fixture: 'blog-fixture',
    label: 'blog fixture - apply outer style',
    config: useConsumerTheming('blog', true),
  },
  {
    fixture: 'blog-fixture',
    label: 'blog fixture',
    config: useConsumerTheming('blog'),
  },
  {
    fixture: 'poll',
    config: usePlugins(plugins.poll),
  },
  {
    fixture: 'audio-layouts',
    config: usePlugins(plugins.audio),
  },
  'nowrap-plugins-and-text',
];

export const fixturesToTestOnSeo: Fixture[] = ['images'];
export const DEFAULT_MOBILE_WIDTHS = { widths: [375] };
