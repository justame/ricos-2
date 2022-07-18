import React from 'react';
import type { RicosTiptapContextValue } from 'ricos-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditorPropsContext = React.createContext<Record<string, any> | null>(null);

export const RicosTiptapContext = React.createContext<RicosTiptapContextValue>(
  null as unknown as RicosTiptapContextValue
);
