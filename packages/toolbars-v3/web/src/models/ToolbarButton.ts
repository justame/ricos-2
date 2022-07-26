import type { ReactElement } from 'react';
import React from 'react';
import type { DataHookDecoratedToolbarButton } from './toolbarButtonsTypes';
import type { ToolbarItem } from '../ToolbarItemCreator';

export class ToolbarButton implements DataHookDecoratedToolbarButton {
  private readonly toolbarItem: ToolbarItem;

  private readonly toolbarItemRenderElement: ReactElement;

  constructor(toolbarItem: ToolbarItem, toolbarItemRender: ReactElement) {
    this.toolbarItem = toolbarItem;
    this.toolbarItemRenderElement = toolbarItemRender;
  }

  getButtonElement(): ReactElement {
    return this.toolbarItemRenderElement;
  }

  getButtonElementWithDataHook(): ReactElement {
    const { dataHook = '' } = this.toolbarItem.presentation || {};
    return React.cloneElement(this.toolbarItemRenderElement, {
      dataHook,
    });
  }

  getButtonDataHook(): string {
    const { dataHook = '' } = this.toolbarItem.presentation || {};
    return dataHook;
  }
}
