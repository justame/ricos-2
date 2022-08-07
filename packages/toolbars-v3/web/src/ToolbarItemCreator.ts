import type { IToolbarItemConfig } from './types';
import { Content } from './Content';
import EventEmitter from './lib/EventEmitter';
import type { IToolbarItem } from 'ricos-types';

export class ToolbarItemCreator {
  static create(toolbarItemConfig: IToolbarItemConfig) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (content: Content<unknown>, editorCommands: any) => {
      return new ToolbarItem(toolbarItemConfig, content, editorCommands);
    };
  }
}

type UpdatedAttributes = {
  attributeName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attribute: any;
};

export class ToolbarItem extends EventEmitter {
  static EVENTS = {
    ATTRIBUTES_CHANGED: 'ATTRIBUTES_CHANGED',
    COMMAND_EXECUTED: 'COMMAND_EXECUTED',
  };

  private toolbarItem: IToolbarItem;

  constructor(
    private toolbarItemConfig: IToolbarItemConfig,
    private content: Content<unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private editorCommands: any
  ) {
    super();
    this.toolbarItemConfig = toolbarItemConfig;
    this.toolbarItem = {
      id: toolbarItemConfig.id,
      presentation: toolbarItemConfig.presentation,
      type: toolbarItemConfig.type,
      attributes: {},
      commands: {},
    };

    this.assignCommands();
    this.updateAttributes();

    this.content.on(Content.EVENTS.contentChangeEvent, () => {
      const changedAttributes = this.updateAttributes();
      if (changedAttributes.length > 0) {
        this.emit(ToolbarItem.EVENTS.ATTRIBUTES_CHANGED, changedAttributes);
      }
    });
  }

  assignCommands() {
    Object.keys(this.toolbarItemConfig.commands).forEach(commandName => {
      this.toolbarItem.commands[commandName] = (...args: any[]) => {
        const command = this.toolbarItemConfig.commands[commandName]({
          attributes: this.toolbarItem.attributes,
          editorCommands: this.editorCommands,
        });
        // eslint-disable-next-line prefer-spread
        command.apply(null, args);

        this.emit(ToolbarItem.EVENTS.COMMAND_EXECUTED, {
          commandName,
          args,
        });

        const changedAttributes = this.updateAttributes();
        if (changedAttributes.length > 0) {
          this.emit(ToolbarItem.EVENTS.ATTRIBUTES_CHANGED, changedAttributes);
        }
      };
    });
  }

  updateAttributes() {
    const updatedAttributes: UpdatedAttributes[] = [];
    Object.keys(this.toolbarItemConfig.attributes).forEach(attributeName => {
      const attribute = this.content.resolve(this.toolbarItemConfig.attributes[attributeName]);
      if (this.toolbarItem.attributes[attributeName] !== attribute) {
        this.toolbarItem.attributes[attributeName] = attribute;
        updatedAttributes.push({ attributeName, attribute });
      }
    });
    return updatedAttributes;
  }

  get id() {
    return this.toolbarItem.id;
  }

  get presentation() {
    return this.toolbarItem.presentation;
  }

  get attributes() {
    return this.toolbarItem.attributes;
  }

  get commands() {
    return this.toolbarItem.commands;
  }
}
