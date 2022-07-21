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
import { NodeSelection } from 'prosemirror-state';

const SPOILER_STYLE = 'blur(0.25em)';

const SpoilerHoc = Component => {
  const Spoiler = props => {
    const { context, updateAttributes, node, editor, getPos, selected } = props;
    const { isMobile, theme, t } = context;
    if (node.attrs.containerData.spoiler?.enabled) {
      const { spoiler } = node.attrs.containerData;

      const componentData = {
        config: {
          spoiler: {
            ...spoiler,
            buttonContent: spoiler.buttonText,
          },
        },
      };
      const updateComponentData = data => {
        const containerData = { ...node.attrs.containerData, spoiler: { ...spoiler, ...data } };
        updateAttributes({ containerData });
      };

      const handleDescriptionChange = description => updateComponentData({ description });

      const handleButtonContentChange = buttonText => updateComponentData({ buttonText });

      const setFocusToBlock = () => {
        if (!selected) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const selection = NodeSelection.create(editor.view.state.doc, (getPos as any)());
          const transaction = editor.view.state.tr.setSelection(selection);
          editor.view.dispatch(transaction);
        }
      };
      return (
        <BlockSpoilerComponent
          componentData={componentData}
          theme={theme}
          isMobile={isMobile}
          isEditableText
          t={t}
          pluginType="Image"
          handleDescriptionChange={handleDescriptionChange}
          handleButtonContentChange={handleButtonContentChange}
          setFocusToBlock={setFocusToBlock}
          setInPluginEditingMode={() => {}}
          disabledRevealSpoilerBtn
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
