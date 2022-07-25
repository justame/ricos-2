import type { DOMOutputSpec, RicosExtension } from 'ricos-types';

export interface HardBreakOptions {
  keepMarks: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    hardBreak: {
      /**
       * Add a hard break
       */
      setHardBreak: () => ReturnType;
    };
  }
}

export const hardBreak: RicosExtension = {
  type: 'node' as const,
  name: 'hardBreak',
  groups: ['shortcuts-enabled'],
  createExtensionConfig({ mergeAttributes }) {
    return {
      name: this.name,
      inline: true,
      group: 'inline',
      priority: 900,

      selectable: false,

      parseHTML() {
        return [{ tag: 'br' }];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          'br',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ] as DOMOutputSpec;
      },

      renderText() {
        return '\n';
      },
      addKeyboardShortcuts() {
        return {
          'Mod-Enter': () => this.editor.commands.setHardBreak(),
          'Shift-Enter': () => this.editor.commands.setHardBreak(),
        };
      },
      addCommands() {
        return {
          setHardBreak:
            () =>
            ({ commands, chain, state, editor }) => {
              return commands.first([
                () => commands.exitCode(),
                () =>
                  commands.command(() => {
                    const { selection, storedMarks } = state;

                    if (selection.$from.parent.type.spec.isolating) {
                      return false;
                    }

                    const { keepMarks } = this.options;
                    const { splittableMarks } = editor.extensionManager;
                    const marks =
                      storedMarks || (selection.$to.parentOffset && selection.$from.marks());

                    return chain()
                      .insertContent({ type: this.name })
                      .command(({ tr, dispatch }) => {
                        if (dispatch && marks && keepMarks) {
                          const filteredMarks = marks.filter(mark =>
                            splittableMarks.includes(mark.type.name)
                          );

                          tr.ensureMarks(filteredMarks);
                        }

                        return true;
                      })
                      .run();
                  }),
              ]);
            },
        };
      },
    };
  },
};
