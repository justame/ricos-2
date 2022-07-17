import type { ReactElement, ComponentClass } from 'react';
import { Children } from 'react';
import type { RichContentProps } from './types';
import type { DraftContent } from 'ricos-types';

export const emptyState: DraftContent = { blocks: [], entityMap: {} };

export const shouldRenderChild = (
  expectedChildName: 'RichContentViewer' | 'RichContentEditor',
  children: ReactElement
): boolean => {
  const child = Children.only(children) as ReactElement<RichContentProps, ComponentClass>; // ComponentClass has a displayName
  const childName = child?.type.displayName;
  return !!children && childName === expectedChildName;
};
