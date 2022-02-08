import { throttle } from 'lodash';
import type { ToolbarSpec } from './types';
import type { EditorCommands } from 'wix-rich-content-common';
import EventEmitter from './lib/EventEmitter';
import type { Content } from './Content';
import { ToolbarItem } from './ToolbarItemCreator';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolbarItemCreator = (content: Content, editorCommands: EditorCommands) => ToolbarItem;

type RicosToolbarProps = {
  toolbarItemCreators: ToolbarItemCreator[];
  content: Content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
};

export class RicosToolbar extends EventEmitter {
  static EVENTS = {
    UPDATED: 'UPDATED',
  };

  editorCommands;

  private toolbarItems: ToolbarItem[] = [];

  private toolbarItemCreators: ToolbarItemCreator[];

  private content: Content;

  static create({ toolbarItemCreators, content, editorCommands }: RicosToolbarProps) {
    return new RicosToolbar({ toolbarItemCreators, content, editorCommands });
  }

  private constructor({ toolbarItemCreators, content, editorCommands }: RicosToolbarProps) {
    super();
    this.toolbarItems = [];
    this.toolbarItemCreators = toolbarItemCreators;
    this.content = content;
    this.editorCommands = editorCommands;

    this.toolbarItems = this.createToolbarItems();
  }

  private handleToolbarItemChanged = throttle(() => {
    this.emit(RicosToolbar.EVENTS.UPDATED);
  }, 50);

  private createToolbarItems() {
    return this.toolbarItemCreators.map(toolbarItemCreator => {
      const toolbarItem = toolbarItemCreator(this.content, this.editorCommands);
      toolbarItem.on(ToolbarItem.EVENTS.ATTRIBUTES_CHANGED, this.handleToolbarItemChanged);
      return toolbarItem;
    });
  }

  getToolbarItemsBy(spec: ToolbarSpec) {
    return this.toolbarItems.filter(toolbarItem => {
      return spec(toolbarItem.attributes);
    });
  }

  getToolbarItemById(id) {
    return this.toolbarItems.find(item => item.id === id);
  }

  setEditorCommands(editorCommands) {
    this.editorCommands = editorCommands;
  }
}
