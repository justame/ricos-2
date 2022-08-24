import React from 'react';
import type { EditorCommands, TranslationFunction } from 'ricos-types';
import { headingsMap, translateHeading, getCustomHeadingsLabel } from '../src/heading';

export const getCurrentHeadingIcon =
  (allowHeadingCustomization: boolean) =>
  (editorCommands: EditorCommands, t: TranslationFunction): ((props) => JSX.Element) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedHeading: any = editorCommands.getCurrentHeading();
    let Label;
    if (allowHeadingCustomization) {
      Label = getCustomHeadingsLabel(selectedHeading, t, editorCommands);
    } else {
      Label = translateHeading(headingsMap[selectedHeading], t);
    }
    return () => <div>{Label}</div>;
  };
