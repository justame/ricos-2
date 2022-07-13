import React from 'react';
import '../style.scss';
import type { Content } from '../Content';
import type { RicosToolbar } from '../RicosToolbar';
import { toolbarItemsRenders } from '../toolbarItemsRenders';
import RicosToolbarComponent from './RicosToolbarComponent';
import type { Node } from 'prosemirror-model';
import type { IToolbarItemConfigTiptap } from 'ricos-types';

interface RicosTiptapToolbarProps {
  content: Content<Node[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
  toolbarItemsConfig: IToolbarItemConfigTiptap[];
  onLoad?: (toolbar: RicosToolbar) => void;
  isMobile: boolean;
  maxWidth?: number;
}

export default function RicosTiptapToolbarComponent(props: RicosTiptapToolbarProps) {
  const { isMobile = false, maxWidth, onLoad, editorCommands, content, toolbarItemsConfig } = props;

  return (
    <RicosToolbarComponent
      toolbarItemsRenders={toolbarItemsRenders}
      toolbarItemsConfig={toolbarItemsConfig}
      isMobile={isMobile}
      maxWidth={maxWidth}
      onLoad={onLoad}
      editorCommands={editorCommands}
      content={content}
    />
  );
}
