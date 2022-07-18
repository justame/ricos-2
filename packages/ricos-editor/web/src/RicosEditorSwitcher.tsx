import React, { forwardRef, Suspense } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { isSSR } from 'wix-rich-content-common';
import type { RicosEditor } from './RicosEditor';
import RicosEditorWithRef from './RicosEditor';
import type { RicosEditorRef } from './RicosEditorRef';
import type { TranslationFunction } from 'ricos-types';

const FullRicosEditorLazy = React.lazy(
  /* webpackChunkName: "FullRicosEditor" */
  () => import('./tiptap/FullRicosEditor')
);

const LocaleResourceProviderLazy = React.lazy(
  /* webpackChunkName: "LocaleResourceProvider" */
  () => import('./RicosContext/locale-resource-provider')
);

const RicosEditorSwitcher = React.forwardRef<RicosEditorRef, RicosEditorProps>((props, ref) => {
  const useTiptap = !!props.experiments?.tiptapEditor?.enabled;
  if (useTiptap) {
    return isSSR() ? (
      <div />
    ) : (
      <Suspense fallback={<div />}>
        <LocaleResourceProviderLazy locale={props.locale}>
          {(locale: RicosEditorProps['locale']) => (t: TranslationFunction) =>
            <FullRicosEditorLazy {...props} locale={locale} t={t} ref={ref} />}
        </LocaleResourceProviderLazy>
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
