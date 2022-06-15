import React, { useEffect, useState } from 'react';
import type { TranslationFunction } from 'ricos-types';
import { RicosTranslate } from 'wix-rich-content-common';
import { RicosContextProvider } from 'ricos-context';
import { fetchLocaleResource } from './translations';

export const LocaleResourceProvider = ({
  children,
  isMobile,
  locale,
  localeContent,
  experiments,
  languageDir,
  theme,
  portal,
}) => {
  const [currentLocaleResource, setLocaleResource] = useState<{
    locale: string;
    localeResource?: Record<string, string>;
  }>(
    null as unknown as {
      locale: string;
      localeResource?: Record<string, string>;
    }
  );

  // custom hook
  useEffect(() => {
    const hanldeLocaleResource = async () => {
      const localeResource = await fetchLocaleResource(locale);
      if (localeResource) {
        setLocaleResource(localeResource);
      }
    };

    hanldeLocaleResource();
  }, []);

  if (!currentLocaleResource) {
    return <div />;
  }
  return (
    <RicosTranslate
      locale={currentLocaleResource.locale}
      localeResource={currentLocaleResource.localeResource}
    >
      {(t: TranslationFunction) => (
        <RicosContextProvider
          t={t}
          locale={currentLocaleResource.locale}
          localeContent={localeContent}
          isMobile={isMobile}
          experiments={experiments}
          languageDir={languageDir}
          theme={theme}
          portal={portal}
        >
          {children}
        </RicosContextProvider>
      )}
    </RicosTranslate>
  );
};
