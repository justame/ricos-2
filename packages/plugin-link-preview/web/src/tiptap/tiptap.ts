import type { Editor } from '@tiptap/core';
import type { KeyboardShortcutCommand } from '@tiptap/react';
import type { ResolvedPos } from 'prosemirror-model';
import { TIPTAP_LINK_PREVIEW_TYPE, TIPTAP_EMBED_TYPE } from 'ricos-content';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import type { LinkPreviewData } from 'ricos-schema';
import linkPreviewDefaults from 'ricos-schema/dist/statics/link_preview.defaults.json';
import embedDefaults from 'ricos-schema/dist/statics/embed.defaults.json';
import type {
  ExtensionProps,
  NodeConfig,
  RicosExtension,
  RicosExtensionConfig,
} from 'ricos-tiptap-types';
import type { DeepPartial } from 'utility-types';
import {
  createLinkPreviewData,
  fetchLinkPreview,
  shouldAddEmbed,
  shouldAddLinkPreview,
} from '../../lib/utils';
import type { LinkPreviewPluginEditorConfig } from '../types';
import { LINK_PREVIEW_TYPE } from '../types';
import { LinkPreview as Component } from './component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkPreview: {
      /**
       * Set a linkPreview node
       */
      setLinkPreview: (attributes: DeepPartial<LinkPreviewData>) => ReturnType;
    };
  }
}

//// Regexes should be shared with link extension

/**
 * A regex that matches any string that contains a link
 */
export const urlRegex =
  // eslint-disable-next-line max-len
  /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)/gi;

/**
 * A regex that matches an url
 */
export const urlRegexExact = new RegExp('^' + urlRegex.source + '$', 'gi');

const isLinkOnlyBlock = ({ parent, nodeBefore }: ResolvedPos): boolean =>
  parent.childCount === 1 && nodeBefore?.text?.search(urlRegexExact) !== -1;

const insertNewLineAbove = (editor: Editor) =>
  editor.chain().enter().setTextSelection(editor.state.selection.anchor).run();

const addLinkPreview =
  (config: LinkPreviewPluginEditorConfig): KeyboardShortcutCommand =>
  ({ editor }) => {
    const pos = editor.state.selection.$anchor;
    const {
      enableEmbed = true,
      enableLinkPreview = true,
      fetchData,
      link: linkConfig,
    } = config || {};
    if (pos.nodeBefore?.text && isLinkOnlyBlock(pos) && fetchData) {
      const { target, rel } = linkConfig || {};
      const url = pos.nodeBefore?.text;
      fetchLinkPreview(fetchData, url)
        .then(linkPreviewData => {
          const shouldEmbed = shouldAddEmbed(
            linkPreviewData.html,
            enableEmbed,
            linkPreviewData.fixedUrl
          );
          if (shouldEmbed || shouldAddLinkPreview(linkPreviewData.title, enableLinkPreview)) {
            return createLinkPreviewData({ url, target, rel }, linkPreviewData, config).then(
              linkPreviewComponentData => {
                const convertedLinkPreviewData = convertBlockDataToRicos(
                  LINK_PREVIEW_TYPE,
                  linkPreviewComponentData
                );
                editor
                  .chain()
                  .deleteRange({ from: pos.pos - (pos.nodeBefore?.nodeSize || 0), to: pos.pos })
                  .insertContent({
                    type: shouldEmbed ? TIPTAP_EMBED_TYPE : TIPTAP_LINK_PREVIEW_TYPE,
                    attrs: convertedLinkPreviewData,
                  })
                  .run();
              }
            );
          }
        })
        .finally(() => insertNewLineAbove(editor));
      return true;
    }
    return false;
  };

export const tiptapExtensions = [
  {
    type: 'node' as const,
    name: TIPTAP_LINK_PREVIEW_TYPE,
    groups: ['react'],
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => settings,
    }),
    Component,
    createExtensionConfig() {
      return {
        group: 'block',
        selectable: true,
        draggable: true,
        name: this.name,
        addAttributes: () => linkPreviewDefaults,
        addCommands() {
          return {
            setLinkPreview:
              attributes =>
              ({ commands }) => {
                return commands.setNode('linkPreview', attributes);
              },
          };
        },
      };
    },
  },
  {
    type: 'node' as const,
    name: TIPTAP_EMBED_TYPE,
    groups: ['react'],
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => settings,
    }),
    Component,
    createExtensionConfig() {
      return {
        group: 'block',
        selectable: true,
        draggable: true,
        name: this.name,
        addAttributes: () => embedDefaults,
      };
    },
  },
  {
    type: 'extension' as const,
    groups: ['shortcuts-enabled'],
    name: 'linkPreviewEnter',
    reconfigure: (
      config: RicosExtensionConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addKeyboardShortcuts() {
        return {
          Enter: addLinkPreview(settings),
        };
      },
    }),
    createExtensionConfig() {
      return {
        name: this.name,
      };
    },
  },
];
