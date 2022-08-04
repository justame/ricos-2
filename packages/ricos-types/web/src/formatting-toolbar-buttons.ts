import type { ToolbarButtonProps } from './buttonTypes';
import type { IContent } from './content';
import type { EditorCommands } from './editorCommandsType';
import type { IToolbarItemConfigTiptap } from './toolbarTypes';
import type { ToolbarType } from './toolbarEnums';

/**
 * Represents formatting toolbar button.
 * Responsibilities:
 * - maps button attribute RESOLVERS_IDS to resolvers
 *
 * @export
 * @interface FormattingToolbarButton
 */
export interface FormattingToolbarButton {
  toToolbarItemConfig(
    editorCommands: EditorCommands,
    toolbarType: ToolbarType
  ): IToolbarItemConfigTiptap;
  toExternalToolbarButtonConfig(
    editorCommands: EditorCommands,
    content: IContent<unknown>
  ): ToolbarButtonProps;
}

/**
 * Aggregates formatting toolbar buttons.
 * Responsibilities:
 * - orders buttons according to config
 * - manages separators
 * - constructs full tooltip from tooltip key and shortcut info
 *
 * @export
 * @interface FormattingToolbarButtons
 */
export interface FormattingToolbarButtons {
  toToolbarItemsConfig: (
    toolbarType: ToolbarType,
    isMobile: boolean,
    editorCommands: EditorCommands
  ) => IToolbarItemConfigTiptap[];

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands,
    content: IContent<unknown>
  ): Record<string, ToolbarButtonProps>;
}
