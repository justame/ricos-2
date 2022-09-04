import React from 'react';
import {
  ToggleButton,
  AlignmentButton,
  LineSpacingButton,
  FontSizeButton,
  LinkButton,
  TextColorButton,
  HighlightColorButton,
  TitleButton,
  AddPluginMenuButton,
  UrlLinkButton,
  AnchorLinkButton,
  HeadingButtonSwitch,
  EditLinkButton,
} from './components/buttons';
import { ToolbarButtonSeparator } from 'wix-rich-content-toolbars-ui';
import { Decoration_Type, Node_Type } from 'ricos-types';
import { INDENT_TYPE } from 'wix-rich-content-common';

const toggleRenders = [
  'UNDO',
  'REDO',
  Decoration_Type.BOLD,
  Decoration_Type.ITALIC,
  Decoration_Type.UNDERLINE,
  Node_Type.BLOCKQUOTE,
  Node_Type.CODE_BLOCK,
  Node_Type.ORDERED_LIST,
  Node_Type.BULLETED_LIST,
  Decoration_Type.SPOILER,
  `${INDENT_TYPE}.increase`,
  `${INDENT_TYPE}.decrease`,
].reduce((acc, t) => {
  return {
    ...acc,
    [t]: toolbarItem => {
      return (
        <ToggleButton onClick={e => toolbarItem.commands?.click(e)} toolbarItem={toolbarItem} />
      );
    },
  };
}, {});

export const toolbarItemsRenders = {
  ...toggleRenders,
  anchorLink: toolbarItem => {
    return <AnchorLinkButton toolbarItem={toolbarItem} />;
  },
  removeLink: toolbarItem => {
    return (
      <ToggleButton onClick={e => toolbarItem.commands?.removeLink(e)} toolbarItem={toolbarItem} />
    );
  },
  removeAnchor: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.removeAnchor(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  editLink: toolbarItem => {
    return <EditLinkButton toolbarItem={toolbarItem} />;
  },
  urlLink: toolbarItem => {
    return <UrlLinkButton toolbarItem={toolbarItem} />;
  },
  addPlugin: toolbarItem => {
    return <AddPluginMenuButton toolbarItem={toolbarItem} />;
  },
  separator: () => {
    return <ToolbarButtonSeparator />;
  },
  ALIGNMENT: toolbarItem => {
    return <AlignmentButton toolbarItem={toolbarItem} />;
  },
  [`${Node_Type.HEADING}.title`]: toolbarItem => {
    return <TitleButton toolbarItem={toolbarItem} />;
  },
  [`${Node_Type.HEADING}.dropdown`]: toolbarItem => {
    return <HeadingButtonSwitch toolbarItem={toolbarItem} />;
  },
  LINE_SPACING: toolbarItem => {
    return <LineSpacingButton toolbarItem={toolbarItem} />;
  },
  [Decoration_Type.FONT_SIZE]: toolbarItem => {
    return <FontSizeButton toolbarItem={toolbarItem} />;
  },
  [Decoration_Type.LINK]: toolbarItem => {
    return <LinkButton toolbarItem={toolbarItem} />;
  },
  [`${Decoration_Type.COLOR}.foreground`]: toolbarItem => {
    return <TextColorButton toolbarItem={toolbarItem} />;
  },
  [`${Decoration_Type.COLOR}.background`]: toolbarItem => {
    return <HighlightColorButton toolbarItem={toolbarItem} />;
  },
  delete: toolbarItem => {
    return <ToggleButton onClick={e => toolbarItem.commands.delete(e)} toolbarItem={toolbarItem} />;
  },
};
