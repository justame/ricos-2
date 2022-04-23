import type { JSONContent } from '@tiptap/core';
import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { not } from 'fp-ts/Predicate';
import type { RichContent } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';
import { toTiptap } from 'wix-tiptap-extensions';
import { coreConfigs } from '../src/components/RicosTiptapEditor/core-configs';
import { Extensions } from '../src/models/Extensions';
import type { ContentTypes } from '../src/patch-extensions';
import {
  extractUnsupportedMarks,
  extractUnsupportedNodes,
  toContentTypes,
} from '../src/patch-extensions';

const toSupportedContentTypes: (plugins: TiptapEditorPlugin[]) => ContentTypes = flow(
  A.chain(p => p.tiptapExtensions || []),
  A.concat(coreConfigs),
  Extensions.of,
  toContentTypes
);

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

export const hasUnsupportedContent = (
  content: RichContent,
  plugins: TiptapEditorPlugin[]
): boolean =>
  pipe(
    plugins,
    toSupportedContentTypes,
    toUnsupportedContentTypes(toTiptap(content)),
    not(isEmptyContentTypes)
  );
