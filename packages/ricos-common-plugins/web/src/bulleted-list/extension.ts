import { InputRule, getNodeType, isNodeActive } from '@tiptap/core';
import type { RicosExtension } from 'ricos-types';
import bulletedListDataDefaults from 'ricos-schema/dist/statics/bulleted_list.defaults.json';
import type { DOMOutputSpec } from 'prosemirror-model';
import { Node_Type } from 'ricos-schema';
import styles from '../statics/styles.scss';
import { createListInputRuleHandler } from '../list-input-rule-handler';

export interface BulletListOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleBulletList: () => ReturnType;
      /**
       * Toggle off an bulleted list if exists
       */
      toggleOffBulletList: () => ReturnType;
    };
  }
}

export const inputRegex = /^\s*([-+*])\s$/;

export const bulletedList: RicosExtension = {
  type: 'node' as const,
  groups: [],
  name: Node_Type.BULLETED_LIST,
  createExtensionConfig({ mergeAttributes }) {
    return {
      name: this.name,
      addOptions() {
        return {
          HTMLAttributes: { class: styles.bulletedList },
          itemTypeName: Node_Type.LIST_ITEM,
        };
      },

      group: 'block list',

      content() {
        return `${this.options.itemTypeName}+`;
      },

      parseHTML() {
        return [{ tag: 'ul' }];
      },

      addAttributes() {
        return { ...bulletedListDataDefaults, indentation: { default: 0 } };
      },

      renderHTML({ HTMLAttributes }) {
        return [
          'ul',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          toggleBulletList:
            () =>
            ({ commands }) => {
              return commands.toggleLists(this.name, Node_Type.LIST_ITEM);
            },
          toggleOffBulletList:
            () =>
            ({ state, commands }) => {
              const isActive = isNodeActive(state, getNodeType(this.name, state.schema));
              if (isActive) {
                return commands.toggleBulletList();
              }
              return true;
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
        };
      },

      addInputRules() {
        return [
          new InputRule({
            find: inputRegex,
            handler: createListInputRuleHandler({ type: this.type }),
          }),
        ];
      },
    };
  },
};
