import React, { forwardRef, Suspense } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { isSSR } from 'wix-rich-content-common';
import type { RicosEditor } from './RicosEditor';
import RicosEditorWithRef from './RicosEditor';
import type { RicosEditorRef } from './RicosEditorRef';
import type { DebugMode, TranslationFunction } from 'ricos-types';

const FullRicosEditorLazy = React.lazy(
  /* webpackChunkName: "FullRicosEditor" */
  () => import('./tiptap/FullRicosEditor')
);

const LocaleResourceProviderLazy = React.lazy(
  /* webpackChunkName: "LocaleResourceProvider" */
  () => import('./RicosContext/locale-resource-provider')
);

const renderMobileDevTools = () => {
  // @ts-ignore-next-line
  if (typeof window !== 'undefined' && !window.__RICOS_DEVTOOLS_MOBILE_HOOK__) {
    // @ts-ignore-next-line
    window.__RICOS_DEVTOOLS_MOBILE_HOOK__ = true;
    const cdnTag = document.createElement('script');
    cdnTag.src = '//cdn.jsdelivr.net/npm/eruda';
    cdnTag.onload = () => {
      // @ts-ignore-next-line
      eruda.init();
    };
    window.document.head.appendChild(cdnTag);
  }
};

const RicosEditorSwitcher = React.forwardRef<
  RicosEditorRef,
  RicosEditorProps & { debugMode?: DebugMode[] }
>((props, ref) => {
  const { rceNext, ...ricosProps } = props;
  const useTiptap = rceNext || !!props.experiments?.tiptapEditor?.enabled;
  if ((props.debugMode?.includes('mobile') || props.debugMode?.includes('all')) && props.isMobile) {
    renderMobileDevTools();
  }

  if (useTiptap) {
    const experiments = {
      ...props.experiments,
      tiptapEditor: {
        enabled: true,
        value: 'true',
        namespace: 'ricos',
      },
    };
    return isSSR() ? (
      <div />
    ) : (
      <Suspense fallback={<div />}>
        <LocaleResourceProviderLazy locale={props.locale}>
          {(locale: RicosEditorProps['locale']) => (t: TranslationFunction) =>
            (
              <FullRicosEditorLazy
                {...ricosProps}
                experiments={experiments}
                locale={locale}
                t={t}
                ref={ref}
              />
            )}
        </LocaleResourceProviderLazy>
      </Suspense>
    );
  } else {
    return <RicosEditorWithRef {...ricosProps} ref={ref as React.ForwardedRef<RicosEditor>} />;
  }
});

export default forwardRef<RicosEditorRef, RicosEditorProps & { debugMode?: DebugMode[] }>(
  (props, ref) => {
    const newProps = {
      ...props,
      ref,
    };
    return <RicosEditorSwitcher {...newProps} />;
  }
);
