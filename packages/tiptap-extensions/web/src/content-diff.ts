import type { Fragment, Node } from 'prosemirror-model';
import type { EditorState, Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';
import type {
  ExtensionProps,
  RicosExtension,
  RicosExtensionConfig,
  RicosServices,
} from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { ContentChange } from './content-utils/diff-tools';
import { Range } from './range';

/*
 * A content change can be thought as an old range replaced with a new range.
 */
const getDiffRanges = (
  baseline: Fragment,
  changes: Fragment
): { oldRange: Range; newRange: Range } => {
  const from = baseline.findDiffStart(changes);
  const to = baseline.findDiffEnd(changes);

  // console.debug('RAW RANGE', from, to); // eslint-disable-line no-console

  // identical fragments
  if (from === null || to === null) {
    return { newRange: Range.empty, oldRange: Range.empty };
  }

  // 2 or more duplicate symbols typed bug?
  if (from > to.a || from > to.b) {
    return { newRange: new Range(from, to.a), oldRange: new Range(from, to.b) };
  }

  return { newRange: new Range(from, to.b), oldRange: new Range(from, to.a) };
};

const isIgnoredTransaction = (transaction: Transaction): boolean =>
  ['unique-id', 'trailingNodeInsertion'].some(key => transaction.getMeta(key));

/*
 * Returns content slices from the old and new state, according to the old and new ranges.
 */
const getContentChange = (
  baseline: Node,
  changes: Node,
  { oldRange, newRange }: { oldRange: Range; newRange: Range }
): ContentChange => {
  const oldSlice = baseline.slice(oldRange.from, oldRange.to);
  const newSlice = changes.slice(newRange.from, newRange.to);

  return new ContentChange(oldSlice, newSlice);
};

/*
 * used for diff analysis. Does not fiter anything.
 */
const reportDiff =
  (
    log: (message: string, ...args: string[]) => void,
    onPluginAdded: ({
      pluginId,
      params,
    }: {
      pluginId: string;
      params: Record<string, unknown>;
    }) => boolean,
    onPluginDeleted: ({ pluginId }: { pluginId: string }) => boolean
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
      log('DIFF RANGES', JSON.stringify({ oldRange, newRange }, null, 2));

      let contentChanges: ContentChange;
      // TODO: check why does Node.slice sometimes throw error on new line
      try {
        contentChanges = getContentChange(state.doc, transaction.doc, {
          oldRange,
          newRange,
        });
      } catch (e) {
        log('CONTENT CHANGE ERROR', e.message);
        return true;
      }

      log('CONTENT CHANGE', JSON.stringify(contentChanges.toJSON(), null, 2));

      const diffs = contentChanges.getDiff();
      log('CONTENT DIFF', JSON.stringify(diffs, null, 2));

      diffs
        .filter(diff => diff.type !== Node_Type.PARAGRAPH && diff.type !== 'text')
        .forEach(({ type, change, data }) => {
          if (change === 'insert') {
            onPluginAdded({ pluginId: type, params: data || {} });
          } else if (change === 'delete') {
            onPluginDeleted({ pluginId: type });
          }
        });
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
              ? (message: string, ...args: string[]) => console.debug(message, args) // eslint-disable-line no-console
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
