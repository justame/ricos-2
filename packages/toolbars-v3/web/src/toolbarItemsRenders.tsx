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
} from './components/buttons';
import { ToolbarButtonSeparator } from 'wix-rich-content-toolbars-ui';

const toggleRenders = [
  'undo',
  'redo',
  'bold',
  'italic',
  'underline',
  'blockquote',
  'codeBlock',
  'orderedList',
  'unorderedList',
  'spoiler',
  'increaseIndent',
  'decreaseIndent',
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
    return <LinkButton toolbarItem={toolbarItem} />;
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
  alignment: toolbarItem => {
    return <AlignmentButton toolbarItem={toolbarItem} />;
  },
  title: toolbarItem => {
    return <TitleButton toolbarItem={toolbarItem} />;
  },
  headings: toolbarItem => {
    return <HeadingButtonSwitch toolbarItem={toolbarItem} />;
  },
  lineSpacing: toolbarItem => {
    return <LineSpacingButton toolbarItem={toolbarItem} />;
  },
  fontSize: toolbarItem => {
    return <FontSizeButton toolbarItem={toolbarItem} />;
  },
  link: toolbarItem => {
    return <LinkButton toolbarItem={toolbarItem} />;
  },
  textColor: toolbarItem => {
    return <TextColorButton toolbarItem={toolbarItem} />;
  },
  textHighlight: toolbarItem => {
    return <HighlightColorButton toolbarItem={toolbarItem} />;
  },
  delete: toolbarItem => {
    return <ToggleButton onClick={e => toolbarItem.commands.delete(e)} toolbarItem={toolbarItem} />;
  },
};
