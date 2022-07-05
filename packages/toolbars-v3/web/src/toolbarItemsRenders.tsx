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
import { ToolbarButtonSeparator } from './components/ToolbarButtonSeparator';

export const toolbarItemsRenders = {
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
  undo: toolbarItem => {
    return <ToggleButton onClick={e => toolbarItem.commands?.undo(e)} toolbarItem={toolbarItem} />;
  },
  redo: toolbarItem => {
    return <ToggleButton onClick={e => toolbarItem.commands?.redo(e)} toolbarItem={toolbarItem} />;
  },
  bold: toolbarItem => {
    return (
      <ToggleButton onClick={e => toolbarItem.commands?.toggleBold(e)} toolbarItem={toolbarItem} />
    );
  },
  italic: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleItalic(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  underline: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleUnderline(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  blockquote: toolbarItem => {
    return (
      <ToggleButton onClick={e => toolbarItem.commands?.toggleQuote(e)} toolbarItem={toolbarItem} />
    );
  },
  codeBlock: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleCodeblock(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  orderedList: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleOrderedList(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  unorderedList: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleUnorderedList(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  spoiler: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.toggleSpoiler(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  increaseIndent: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.increaseIndent(e)}
        toolbarItem={toolbarItem}
      />
    );
  },
  decreaseIndent: toolbarItem => {
    return (
      <ToggleButton
        onClick={e => toolbarItem.commands?.decreaseIndent(e)}
        toolbarItem={toolbarItem}
      />
    );
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
