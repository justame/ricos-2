import {
  TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE,
  TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE,
  TIPTAP_COLLAPSIBLE_ITEM_TYPE,
  TIPTAP_COLLAPSIBLE_LIST_TYPE,
} from 'ricos-content';
import collapsibleListDataDefaults from 'ricos-schema/dist/statics/collapsible_list.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-tiptap-types';
import {
  CollapsibleList,
  CollapsibleListItem,
  CollapsibleListItemBody,
  CollapsibleListItemTitle,
} from './component';
import { defaultCollapsibleItem } from './defaults';
import { keyboardShortcuts } from './keyboardShortcuts';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [TIPTAP_COLLAPSIBLE_LIST_TYPE]: {
      /**
       * Add new item to existing collapsible list
       */
      addCollapsibleListItem: (position: string) => ReturnType;
    };
  }
}

export const tiptapExtensions = [
  {
    type: 'node' as const,
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
    Component: CollapsibleList,
    name: TIPTAP_COLLAPSIBLE_LIST_TYPE,
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        selectable: true,
        draggable: true,
        content: `(${TIPTAP_COLLAPSIBLE_ITEM_TYPE})+`,
        addAttributes: () => collapsibleListDataDefaults,
        addKeyboardShortcuts() {
          return keyboardShortcuts;
        },
        addCommands() {
          return {
            addCollapsibleListItem:
              position =>
              ({ commands }) => {
                return commands.insertContentAt(position - 1, defaultCollapsibleItem);
              },
          };
        },
      };
    },
  },
  {
    type: 'node' as const,
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
    Component: CollapsibleListItem,
    name: TIPTAP_COLLAPSIBLE_ITEM_TYPE,
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        draggable: true,
        content: `${TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE} ${TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE}`,
        addAttributes: () => ({
          isExpanded: { default: true },
        }),
      };
    },
  },
  {
    type: 'node' as const,
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
    Component: CollapsibleListItemTitle,
    name: TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE,
    placeholder: {
      predicate: ({ doc, pos }) => {
        const parentNode = doc.resolve(pos).parent;
        return parentNode.type.name === TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE;
      },
      content: 'CollapsibleList_ShownText_Placeholder',
    },
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        draggable: true,
        content: 'block+',
      };
    },
  },
  {
    type: 'node' as const,
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
    Component: CollapsibleListItemBody,
    name: TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE,
    placeholder: {
      predicate: ({ doc, pos }) => {
        const parentNode = doc.resolve(pos).parent;
        return parentNode.type.name === TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE;
      },
      content: 'CollapsibleList_CollapsedText_Placeholder',
    },
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        draggable: true,
        content: 'block+',
      };
    },
  },
];
