import type { Editor } from '@tiptap/react';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import type {
  DraftContent,
  EditorProps,
  EditorStyleClasses,
  RichContentTheme,
  TranslationFunction,
} from 'wix-rich-content-common';

export interface PluginProps {
  context: {
    isMobile: boolean;
    t: (key: string) => string;
  };
  // eslint-disable-next-line
  componentData: any;
  node: ProseMirrorNode;
  editorCommands: unknown;
  updateAttributes: (data: unknown) => null;
}

export interface RicosTiptapEditorProps {
  editor: Editor;
  t: TranslationFunction;
  onUpdate?: ({ content }: { content: DraftContent }) => void;
  editorStyleClasses?: EditorStyleClasses;
  onSelectionUpdate?: ({
    selectedNodes,
    content,
  }: {
    selectedNodes: ProseMirrorNode[];
    content: DraftContent;
  }) => void;
  theme?: RichContentTheme;
  onLoad?: EditorProps['onLoad'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
