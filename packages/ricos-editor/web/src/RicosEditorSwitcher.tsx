import React, { forwardRef, Suspense } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { isSSR } from 'wix-rich-content-common';
import type { RicosEditor } from './RicosEditor';
import RicosEditorWithRef from './RicosEditor';
import type { RicosEditorRef } from './RicosEditorRef';

const FullRicosEditorLazy = React.lazy(
  /* webpackChunkName: "FullRicosEditor" */
  () => import('./tiptap/FullRicosEditor')
);

const RicosEditorSwitcher = React.forwardRef<RicosEditorRef, RicosEditorProps>((props, ref) => {
  const useTiptap = !!props.experiments?.tiptapEditor?.enabled;
  if (useTiptap) {
    return isSSR() ? (
      <div />
    ) : (
      <Suspense fallback={<div />}>
        <FullRicosEditorLazy {...props} ref={ref} />
      </Suspense>
    );
  } else {
    return <RicosEditorWithRef {...props} ref={ref as React.ForwardedRef<RicosEditor>} />;
  }
});

export default forwardRef<RicosEditorRef, RicosEditorProps>((props, ref) => {
  const newProps = {
    ...props,
    ref,
  };
  return <RicosEditorSwitcher {...newProps} />;
});
