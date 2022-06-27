export type IToolbarItem = {
  id: string;
  type:
    | 'textColorIndicator'
    | 'toggle'
    | 'font'
    | 'imageSettings'
    | 'textType'
    | 'modal'
    | 'separator';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentation?: Record<string, any>;
  attributes: Record<string, string | boolean | number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Record<string, (...args: any) => void>;
};
