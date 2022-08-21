import type { MarkConfig } from '@tiptap/core';
import { isMarkActive, mergeAttributes } from '@tiptap/core';
import { Decoration_Type } from 'ricos-schema';
import type { DOMOutputSpec, RicosExtension, RicosServices } from 'ricos-types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    underline: {
      /**
       * Set an underline mark
       */
      setUnderline: () => ReturnType;
      /**
       * Toggle an underline mark
       */
      toggleUnderline: () => ReturnType;
      /**
       * Unset an underline mark
       */
      unsetUnderline: () => ReturnType;
    };
  }
}

export const underline: RicosExtension = {
  type: 'mark' as const,
  groups: [],
  name: Decoration_Type.UNDERLINE,
  reconfigure(config: MarkConfig, _extensions, _props, _settings, services: RicosServices) {
    return {
      ...config,
      addOptions() {
        return {
          publishPluginToggleEvent(toggleOn: boolean) {
            return toggleOn
              ? services.pluginsEvents.publishPluginAdd({
                  pluginId: Decoration_Type.UNDERLINE,
                  params: {},
                })
              : services.pluginsEvents.publishPluginDelete({ pluginId: Decoration_Type.UNDERLINE });
          },
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },

      parseHTML() {
        return [
          {
            tag: 'u',
          },
          {
            style: 'text-decoration',
            consuming: false,
            getAttrs: style => ((style as string).includes('underline') ? {} : false),
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          'u',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setUnderline:
            () =>
            ({ commands }) => {
              return commands.setMark(this.name);
            },
          toggleUnderline:
            () =>
            ({ state, commands }) => {
              const isActive = isMarkActive(state, this.name);
              this.options.publishPluginToggleEvent(!isActive);

              return commands.toggleMark(this.name);
            },
          unsetUnderline:
            () =>
            ({ commands }) => {
              return commands.unsetMark(this.name);
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-u': () => this.editor.commands.toggleUnderline(),
        };
      },
    };
  },
};
