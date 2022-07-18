import React from 'react';
import colorDataDefaults from 'ricos-schema/dist/statics/color.defaults.json';
import type {
  DOMOutputSpec,
  ExtensionProps,
  RicosExtension,
  RicosExtensionConfig,
} from 'ricos-types';
import { Decoration_Type } from 'ricos-schema';
import { BlockSpoilerComponent } from '..';

const SPOILER_STYLE = 'blur(0.25em)';

const SpoilerHoc = Component => {
  const Spoiler = props => {
    const { context, componentData } = props;
    const { isMobile, theme, t } = context;
    if (componentData?.containerData?.spoiler?.enabled) {
      return (
        <BlockSpoilerComponent
          theme={theme}
          isMobile={isMobile}
          isEditableText
          t={t}
          pluginType="Image"
          handleDescriptionChange={() => {}}
          setInPluginEditingMode={() => {}}
          handleButtonContentChange={() => {}}
        >
          <Component {...props} />
        </BlockSpoilerComponent>
      );
    } else {
      return <Component {...props} />;
    }
  };
  Spoiler.displayName = 'SpoilerHoc';
  return Spoiler;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spoiler: {
      /**
       * Set a spoiler mark
       */
      toggleSpoiler: () => ReturnType;
    };
  }
}

export const tiptapExtensions: RicosExtension[] = [
  {
    type: 'extension' as const,
    name: 'node-spoiler',
    groups: [],
    reconfigure: (
      config: RicosExtensionConfig,
      extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => settings,
      addNodeHoc: () => ({
        nodeTypes: extensions
          .filter(extension => extension.groups.includes('spoilerable'))
          .map(({ name }) => name),
        priority: 10,
        nodeHoc: SpoilerHoc,
      }),
    }),
    createExtensionConfig() {
      return {
        name: this.name,
        priority: 10,
      };
    },
  },
  {
    type: 'mark' as const,
    groups: [],
    name: Decoration_Type.SPOILER,
    createExtensionConfig() {
      return {
        name: this.name,
        addOptions: () => ({
          HTMLAttributes: {},
        }),

        addAttributes() {
          return colorDataDefaults;
        },

        parseHTML() {
          return [
            {
              tag: 'span',
              getAttrs: element => {
                const { filter } = (element as HTMLElement).style || {};
                return filter === SPOILER_STYLE ? {} : false;
              },
            },
          ];
        },

        renderHTML() {
          return ['span', { style: `filter: ${SPOILER_STYLE}` }, 0] as DOMOutputSpec;
        },

        addCommands() {
          return {
            toggleSpoiler:
              () =>
              ({ commands }) => {
                return commands.toggleMark(this.name);
              },
          };
        },
      };
    },
  },
];
