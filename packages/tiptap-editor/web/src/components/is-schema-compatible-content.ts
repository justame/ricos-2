import type { Editor, JSONContent } from '@tiptap/core';
import { pipe } from 'fp-ts/function';
import type { ContentTypes } from '../patch-extensions';
import { extractUnsupportedMarks, extractUnsupportedNodes } from '../patch-extensions';

const toContentTypes = (schema: Editor['schema']): ContentTypes => ({
  marks: Object.keys(schema.marks),
  nodes: Object.keys(schema.nodes),
});

const toUnsupportedContentTypes =
  (content: JSONContent) =>
  (supportedContentTypes: ContentTypes): ContentTypes =>
    pipe(
      supportedContentTypes,
      filterContentTypes({
        marks: extractUnsupportedMarks(content),
        nodes: extractUnsupportedNodes(content),
      })
    );

const filterContentTypes =
  (filter: {
    marks: (m: ContentTypes['marks']) => ContentTypes['marks'];
    nodes: (n: ContentTypes['nodes']) => ContentTypes['nodes'];
  }) =>
  (contentTypes: ContentTypes): ContentTypes => ({
    nodes: filter.nodes(contentTypes.nodes),
    marks: filter.marks(contentTypes.marks),
  });

const isEmptyContentTypes = (contentTypes: ContentTypes): boolean =>
  contentTypes.nodes.length === 0 && contentTypes.marks.length === 0;

export const isSchemaCompatibleContent = (content: JSONContent, schema: Editor['schema']) =>
  pipe(schema, toContentTypes, toUnsupportedContentTypes(content), isEmptyContentTypes);
