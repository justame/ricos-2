import type { JSONContent } from '@tiptap/react';
import * as A from 'fp-ts/Array';
import { flow, identity, pipe } from 'fp-ts/function';
import * as M from 'fp-ts/Monoid';
import * as S from 'fp-ts/string';
import type { RicosMarkExtension, RicosNodeExtension } from 'ricos-types';
import { getUnsupportedNodeConfig } from 'wix-rich-content-plugin-unsupported-blocks';
import { extract } from 'wix-tiptap-extensions';
import { getUnsupportedMarkConfig } from './components/unsupported-mark';
import { contentDefaults } from './content-defaults';
import type { Extensions } from './models/Extensions';

export type ContentTypes = {
  marks: string[];
  nodes: string[];
};

/**
 * Abstracts 2 records merge (the first overrides the second)
 */
const attributeMerger: M.Monoid<Record<string, unknown>> = {
  concat: (first, second) => ({ ...second, ...first }),
  empty: {},
};

/**
 * Abstracts multiple records merge
 */
const concatAttributes = (attrs: Record<string, unknown>[]): Record<string, unknown> =>
  M.concatAll(attributeMerger)(attrs);

/**
 * Gets all node names from given Extensions
 */
export const extractNodeNames = (extensions: Extensions): ContentTypes['nodes'] => [
  ...extensions
    .getReactNodeExtensions()
    .asArray()
    .map(({ name }) => name),
  ...extensions
    .getHtmlNodeExtensions()
    .asArray()
    .map(({ name }) => name),
];

/**
 * Gets all mark names from given Extensions
 */
export const extractMarkNames = (extensions: Extensions): ContentTypes['marks'] =>
  extensions
    .getMarkExtensions()
    .asArray()
    .map(({ name }) => name);

/**
 * Constructs ContentTypes from given Extensions
 *
 * @returns { ContentTypes } node/mark types
 */
export const toContentTypes = (extensions: Extensions): ContentTypes => ({
  marks: extractMarkNames(extensions),
  nodes: extractNodeNames(extensions),
});

const toExtensions =
  (transform: {
    marks: (m: ContentTypes['marks']) => RicosMarkExtension[];
    nodes: (n: ContentTypes['nodes']) => RicosNodeExtension[];
  }) =>
  (contentTypes: ContentTypes) => ({
    nodes: transform.nodes(contentTypes.nodes),
    marks: transform.marks(contentTypes.marks),
  });

/**
 * Gets mark names that exist in content but not in schema
 */
export const extractUnsupportedMarks =
  (content: JSONContent) =>
  (supportedMarks: ContentTypes['marks']): ContentTypes['marks'] =>
    pipe(
      extract(content)
        .map(
          flow(
            ({ marks }) => marks || [],
            A.map(({ type }) => type)
          )
        )
        .get(),
      A.chain(identity),
      A.uniq(S.Eq),
      A.difference(S.Eq)(supportedMarks)
    );

/**
 * Merges attributes of given mark type instances found in content
 */
const extractMarkAttributes =
  (content: JSONContent) =>
  (markType: string): Record<string, unknown> =>
    pipe(
      extract(content)
        .map(
          flow(
            ({ marks }: { marks: JSONContent['marks'] }) => marks || [],
            A.filter(({ type }) => type === markType),
            A.map(({ type, attrs, ...rest }) => ({ unsupportedMarkType: type, ...attrs, ...rest }))
          )
        )
        .get(),
      A.chain(identity),
      concatAttributes
    );

/**
 * Gets node names that exist in content but not in schema
 */
export const extractUnsupportedNodes =
  (content: JSONContent) =>
  (supportedNodes: ContentTypes['nodes']): ContentTypes['nodes'] =>
    pipe(
      extract(content)
        .map(({ type }) => type)
        .get(),
      A.uniq(S.Eq),
      A.difference(S.Eq)(supportedNodes)
    );

/**
 * Merges attributes of given node type instances found in content
 */
const extractNodeAttributes =
  (content: JSONContent) =>
  (nodeType: string): Record<string, unknown> =>
    pipe(
      extract(content)
        .filter(({ type }) => type === nodeType)
        .map(({ type, content: _, text, marks: __, attrs, ...rest }) => ({
          unsupportedNodeType: type,
          text,
          ...attrs,
          ...rest,
        }))
        .get(),
      concatAttributes
    );

const completeContent = (userContent: JSONContent): JSONContent => ({
  ...userContent,
  content: [...contentDefaults, ...(userContent.content ?? [])],
});

const mergeExtensions =
  (extensions: Extensions) =>
  ({ nodes, marks }: { nodes: RicosNodeExtension[]; marks: RicosMarkExtension[] }): Extensions =>
    extensions.concat([...nodes, ...marks]);

/**
 * Patches prosemirror schema to prevent exception thrown on unsupported node/mark types by prosemirror editor
 *
 * @param {JSONContent} content
 * @param {Extensions} extensions
 * @returns  {Extensions} patched extensions
 */
export const patchExtensions = (content: JSONContent, extensions: Extensions): Extensions => {
  const fullContent = completeContent(content);
  return pipe(
    extensions,
    toContentTypes,
    toExtensions({
      nodes: flow(
        extractUnsupportedNodes(fullContent),
        A.map(flow(extractNodeAttributes(fullContent), getUnsupportedNodeConfig))
      ),
      marks: flow(
        extractUnsupportedMarks(fullContent),
        A.map(flow(extractMarkAttributes(fullContent), getUnsupportedMarkConfig))
      ),
    }),
    mergeExtensions(extensions)
  );
};
