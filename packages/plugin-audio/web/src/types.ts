import type {
  EditorPluginConfig,
  ViewerPluginConfig,
  UpdateEntityFunc,
  ComponentData,
} from 'wix-rich-content-common';
export { AUDIO_TYPE } from 'ricos-content';

export type audioMenuDataType = {
  text: string;
  onClick: () => void;
  selected?: boolean;
  dataHook?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: (props?: any) => JSX.Element;
}[];

export const audioButtonsTypes = { audio: 'audio', soundCloud: 'soundCloud', spotify: 'spotify' };

export interface AudioPluginEditorConfig extends EditorPluginConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AudioPluginViewerConfig extends ViewerPluginConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type handleFileSelectionType = (updateEntity: UpdateEntityFunc<ComponentData[]>) => (
  updateEntity: UpdateEntityFunc<ComponentData[]>,
  index?: number,
  multiple?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEntity?: any,
  componentData?: ComponentData
) => void;

export type handleFileUploadType = (files, updateEntity) => void;
