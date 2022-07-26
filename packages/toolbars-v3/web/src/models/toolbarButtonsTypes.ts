import type { ReactElement } from 'react';
import type { ToolbarButton } from './index';

export interface DataHookDecoratedToolbarButton {
  getButtonElement: () => ReactElement;
  getButtonElementWithDataHook: () => ReactElement;
  getButtonDataHook: () => string;
}

export interface DataHookDecoratedToolbarButtons {
  getButtonsElements: () => ReactElement[];
  getButtonsElementsWithDataHook: () => ReactElement[];
  getFirstButtonDataHook: () => string | null;
  getLastButtonDataHook: () => string | null;
}

export interface ToolbarButtonsCollection {
  getButtonByIndex: (number) => ToolbarButton;
  isEmpty: () => boolean;
  addButton: (ToolbarButton) => void;
}
