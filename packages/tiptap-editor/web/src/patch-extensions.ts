import type { JSONContent } from '@tiptap/react';
import * as A from 'fp-ts/Array';
import { flow, identity, pipe } from 'fp-ts/function';
import * as M from 'fp-ts/Monoid';
import * as S from 'fp-ts/string';
import type { RicosMarkExtension, RicosNodeExtension } from 'ricos-types';
import { getUnsupportedNodeConfig } from 'wix-rich-content-plugin-unsupported-blocks';
import { extract } from 'wix-tiptap-extensions';
import { getUnsupportedMarkConfig } from './components/unsupported-mark';
import type { Extensions } from './models/Extensions';

export type ContentTypes = {
  marks: string[];
  nodes: string[];
};

const attributeMerger: M.Monoid<Record<string, unknown>> = {
  concat: (first, second) => ({ ...second, ...first }),
  empty: {},
};

const concatAttributes = (attrs: Record<string, unknown>[]): Record<string, unknown> =>
  M.concatAll(attributeMerger)(attrs);

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

export const extractMarkNames = (extensions: Extensions): ContentTypes['marks'] =>
  extensions
    .getMarkExtensions()
    .asArray()
    .map(({ name }) => name);

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

const extractUnsupportedMarkAttributes =
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

const extractUnsupportedNodeAttributes =
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

const mergeExtensions =
  (extensions: Extensions) =>
  ({ nodes, marks }: { nodes: RicosNodeExtension[]; marks: RicosMarkExtension[] }): Extensions =>
    extensions.concat([...nodes, ...marks]);

export const patchExtensions = (content: JSONContent, extensions: Extensions): Extensions =>
  pipe(
    extensions,
    toContentTypes,
    toExtensions({
      nodes: flow(
        extractUnsupportedNodes(content),
        A.map(flow(extractUnsupportedNodeAttributes(content), getUnsupportedNodeConfig))
      ),
      marks: flow(
        extractUnsupportedMarks(content),
        A.map(flow(extractUnsupportedMarkAttributes(content), getUnsupportedMarkConfig))
      ),
    }),
    mergeExtensions(extensions)
  );
