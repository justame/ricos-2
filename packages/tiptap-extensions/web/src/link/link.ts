import type { ExtendedRegExpMatchArray } from '@tiptap/core';
import classNames from 'classnames';
import { find } from 'linkifyjs';
import type { Plugin } from 'prosemirror-state';
import { Decoration_Type } from 'ricos-schema';
import type { LinkData } from 'ricos-schema';
import type { DOMOutputSpec, ExtensionProps, MarkConfig, RicosExtension } from 'ricos-types';
import type { DeepPartial } from 'utility-types';
import styles from '../statics/styles.scss';
import { autolink } from '../link/helpers/autolink';
import { clickHandler } from '../link/helpers/clickHandler';
import { pasteHandler } from './helpers/pasteHandler';
import { RicosLink } from './models';
import { cleanAndSetSelection, getSelectedMarkRangeByTypeNames } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      /**
       * Set a link mark
       */
      setLink: (attributes: DeepPartial<LinkData>) => ReturnType;
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: DeepPartial<LinkData>) => ReturnType;
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType;
    };
  }
}

export const link: RicosExtension = {
  type: 'mark' as const,
  groups: [],
  name: Decoration_Type.LINK,
  reconfigure: (config: MarkConfig, _extensions: RicosExtension[], props: ExtensionProps) => {
    const { rel, relValue, anchorTarget } = props;
    return {
      ...config,
      addOptions: () => ({
        inclusive: false,
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        HTMLAttributes: { link: {} },
        defaultLink: RicosLink.of('', anchorTarget, relValue, rel),
      }),
    };
  },
  createExtensionConfig({ markPasteRule }) {
    return {
      name: this.name,
      keepOnSplit: false,

      priority: 1000,

      inclusive() {
        return this.options.inclusive;
      },

      addAttributes() {
        return RicosLink.getLinkDefaults();
      },

      parseHTML() {
        return [
          {
            tag: 'a[href]:not([href *= "javascript:" i])',
            getAttrs: node => {
              return {
                link: {
                  url: node.getAttribute('href') || '',
                  target: node.getAttribute('target') || '',
                },
              };
            },
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        const { link, linkInViewer } = styles;
        const classes = classNames(link, linkInViewer);
        const {
          url: href,
          rel,
          target,
        } = HTMLAttributes.link
          ? RicosLink.fromLink(HTMLAttributes.link).toHtmlAttributes()
          : this.options.defaultLink.toHtmlAttributes();

        return ['a', { href, rel, target, class: classes }, 0] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setLink:
            (link: LinkData) =>
            ({ commands, tr, state, chain }) => {
              cleanAndSetSelection(
                this.name,
                Decoration_Type.ANCHOR,
                commands.unsetAnchor,
                state.schema,
                tr.selection,
                state.doc,
                commands,
                link.link?.url || ''
              );
              return chain()
                .setMark(this.name, link)
                .setUnderline()
                .setMeta('preventAutolink', true)
                .run();
            },
          toggleLink:
            (link: LinkData) =>
            ({ chain }) => {
              return chain()
                .toggleMark(this.name, link, { extendEmptyMarkRange: true })
                .setMeta('preventAutolink', true)
                .run();
            },
          unsetLink:
            () =>
            ({ tr, chain, state }) => {
              const { from, to } = getSelectedMarkRangeByTypeNames(
                [this.name],
                state.schema,
                tr.selection
              );
              return chain()
                .setTextSelection({ from, to })
                .unsetMark(this.name)
                .unsetUnderline()
                .setMeta('preventAutolink', true)
                .run();
            },
        };
      },

      addPasteRules() {
        return [
          markPasteRule({
            find: (text: string) => {
              return find(text)
                .filter(link => {
                  if (this.options.validate) {
                    return this.options.validate(link.value);
                  }

                  return true;
                })
                .filter(link => link.isLink)
                .map(link => ({
                  text: link.value,
                  index: link.start,
                  data: link,
                }));
            },
            type: this.type,
            getAttributes: (match: ExtendedRegExpMatchArray) => {
              return this.options.defaultLink.setUrl(match.data?.href || '');
            },
          }),
        ];
      },

      addProseMirrorPlugins() {
        const plugins: Plugin[] = [];

        if (this.options.autolink) {
          plugins.push(
            autolink({
              type: this.type,
              defaultLink: this.options.defaultLink,
            })
          );
        }

        if (this.options.openOnClick) {
          plugins.push(
            clickHandler({
              type: this.type,
            })
          );
        }

        if (this.options.linkOnPaste) {
          plugins.push(
            pasteHandler({
              editor: this.editor,
              type: this.type,
              defaultLink: this.options.defaultLink,
            })
          );
        }

        return plugins;
      },
    };
  },
};
