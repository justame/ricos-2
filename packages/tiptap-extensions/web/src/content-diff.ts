import type { EditorState, Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';
import type {
  ExtensionProps,
  RicosExtension,
  RicosExtensionConfig,
  RicosServices,
} from 'ricos-types';
import { Node_Type } from 'ricos-types';
import type { ContentChange } from './content-utils/content-change';
import {
  getContentChange,
  getDiffRanges,
  isIgnoredTransaction,
  reportTextStyleDiff,
} from './content-utils/diff-tools';

/*
 * used for diff analysis. Does not fiter anything.
 */
const reportDiff =
  (
    log: (message: string, ...args: any[]) => void,
    onPluginAdded: (pluginId: string, params: Record<string, unknown>) => boolean,
    onPluginDeleted: (pluginId: string) => boolean
  ) =>
  (transaction: Transaction, state: EditorState): true => {
    // timeout to avoid performance issues -- this is acceptable for event publshing
    setTimeout(() => {
      if (!transaction.docChanged || isIgnoredTransaction(transaction)) {
        log('changes are filtered (docs are equal)');
        return true;
      }
      const { newRange, oldRange } = getDiffRanges(state.doc.content, transaction.doc.content);
      if (newRange.isEmpty() && oldRange.isEmpty()) {
        log('changes are filtered (empty ranges)');
        return true;
      }
      log('DIFF RANGES', { oldRange, newRange });

      let contentChanges: ContentChange;
      // TODO: check why does Node.slice sometimes throw error on new line
      try {
        contentChanges = getContentChange(state.doc, transaction.doc, {
          oldRange,
          newRange,
        });
      } catch (e) {
        log('CONTENT CHANGE ERROR', e);
        return true;
      }

      log('CONTENT CHANGE', contentChanges.toJSON());

      const diffs = contentChanges.getDiff();
      log('CONTENT DIFF', diffs);

      diffs
        .filter(diff => diff.type !== Node_Type.PARAGRAPH && diff.type !== 'text')
        .forEach(({ type, change, data }) => {
          if (change === 'insert') {
            onPluginAdded(type, data || {});
          } else if (change === 'delete') {
            onPluginDeleted(type);
          }
        });

      const paragraphChanges = diffs.filter(diff => diff.type === Node_Type.PARAGRAPH);
      reportTextStyleDiff(paragraphChanges, onPluginAdded, onPluginDeleted);
    }, 0);

    return true;
  };

export const contentDiff: RicosExtension = {
  name: 'contentDiff',
  type: 'extension' as const,
  groups: [],
  reconfigure(
    config: RicosExtensionConfig,
    _extensions: RicosExtension[],
    _props: ExtensionProps,
    _settings: Record<string, unknown>,
    services: RicosServices
  ) {
    return {
      ...config,
      addOptions() {
        return {
          logger:
            services.context.debugMode?.includes('all') ||
            services.context.debugMode?.includes('extensions')
              ? (message: string, ...args: any[]) => console.debug(message, ...args) // eslint-disable-line no-console
              : () => {},
          publishPluginAddSuccess(pluginId: string, params: Record<string, unknown>) {
            return services.pluginsEvents.publishPluginAddSuccess({ pluginId, params });
          },
          publishPluginDelete(pluginId: string, _params: Record<string, unknown>) {
            return services.pluginsEvents.publishPluginDelete({ pluginId });
          },
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: 'contentDiff',
      priority: 1,
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('contentDiff'),
            filterTransaction: reportDiff(
              this.options.logger,
              this.options.publishPluginAddSuccess,
              this.options.publishPluginDelete
            ),
          }),
        ];
      },
    };
  },
};
