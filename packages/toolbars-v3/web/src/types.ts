//TODO: understand
import type { ToolbarContextType } from 'ricos-context';
import type { TranslationFunction, IToolbarItem, TiptapCommand } from 'ricos-types';

type Modify<T, R> = Omit<T, keyof R> & R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolbarSpec = (attributes: Record<string, any>) => boolean;

export type IToolbarItemConfig = Modify<
  IToolbarItem,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
    // commands: Record<string, Command | TiptapCommand>;
    commands: Record<string, TiptapCommand>;
  }
>;

export type ToolbarItemProps = {
  toolbarItem: IToolbarItem;
  onClick: (any) => void;
  context?: ToolbarContextType & { t: TranslationFunction };
  dataHook?: string;
};
