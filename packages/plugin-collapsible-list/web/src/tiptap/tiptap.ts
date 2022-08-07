import {
  TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE,
  TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE,
  TIPTAP_COLLAPSIBLE_ITEM_TYPE,
  TIPTAP_COLLAPSIBLE_LIST_TYPE,
} from 'ricos-content';
import collapsibleListDataDefaults from 'ricos-schema/dist/statics/collapsible_list.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import {
  CollapsibleList,
  CollapsibleListItem,
  CollapsibleListItemBody,
  CollapsibleListItemTitle,
} from './component';
import { defaultCollapsibleItem } from './defaults';
import { keyboardShortcuts } from './keyboardShortcuts';
import { collapsibleStateManagerPlugin } from '../consts';
import { getCollapsibleListItems, setCollapsibleItemsExpandState } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [TIPTAP_COLLAPSIBLE_LIST_TYPE]: {
      /**
       * Add new item to existing collapsible list
       */
      addCollapsibleListItem: (position: string) => ReturnType;
      setCollapsibleListItemsExpandState: (options: {
        nodeId: string;
        expandState: string;
      }) => ReturnType;
      setCollapsibleListOptions: (options: {
        nodeId: string;
        expandOnlyOne: boolean;
        expandState: string;
      }) => ReturnType;
    };
  }
}

export const tiptapExtensions = [
  {
    type: 'node' as const,
    groups: ['react', 'custom-styles', 'shortcuts-enabled'],
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
    createExtensionConfig({ Plugin }) {
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
            setCollapsibleListItemsExpandState:
              ({ nodeId, expandState }) =>
              ({ state, commands }) => {
                const items = getCollapsibleListItems(state, nodeId);
                setCollapsibleItemsExpandState(items, commands, expandState);
                return true;
              },
            setCollapsibleListOptions:
              ({ nodeId, expandOnlyOne, expandState }) =>
              ({ state, view, commands }) => {
                const items = getCollapsibleListItems(state, nodeId);
                setCollapsibleItemsExpandState(items, commands, expandState);
                view.dispatch?.(
                  state.tr.setMeta('collapsibleState', {
                    nodeId,
                    options: { expandOnlyOne },
                  })
                );
                return true;
              },
          };
        },
        addProseMirrorPlugins() {
          return [
            new Plugin({
              key: collapsibleStateManagerPlugin,
              state: {
                init() {
                  return {};
                },
                apply(tr, prev) {
                  const { nodeId, options } = tr.getMeta('collapsibleState') || {};
                  const { itemId } = tr.getMeta('collepsibleListItemOpen') || {};
                  if (nodeId && options) {
                    return {
                      ...prev,
                      [nodeId]: options,
                    };
                  } else if (itemId) {
                    return {
                      ...prev,
                      openedItemId: itemId,
                    };
                  }
                  return prev;
                },
              },
            }),
          ];
        },
      };
    },
  },
  {
    type: 'node' as const,
    groups: ['react', 'custom-styles'],
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
        group: TIPTAP_COLLAPSIBLE_ITEM_TYPE,
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
    groups: ['react', 'custom-styles'],
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
        return (
          parentNode.content.content.length === 1 &&
          parentNode.type.name === TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE
        );
      },
      content: 'CollapsibleList_ShownText_Placeholder',
    },
    createExtensionConfig() {
      return {
        name: this.name,
        group: TIPTAP_COLLAPSIBLE_ITEM_TITLE_TYPE,
        content: 'block',
      };
    },
  },
  {
    type: 'node' as const,
    groups: ['react', 'custom-styles'],
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
        return (
          parentNode.content.content.length === 1 &&
          parentNode.type.name === TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE
        );
      },
      content: 'CollapsibleList_CollapsedText_Placeholder',
    },
    createExtensionConfig() {
      return {
        name: this.name,
        group: TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE,
        content: 'block+',
      };
    },
  },
];
