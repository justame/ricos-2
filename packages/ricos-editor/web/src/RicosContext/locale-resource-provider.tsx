import React, { useEffect, useState } from 'react';
import { RicosTranslate } from 'wix-rich-content-common';
import { fetchLocaleResource } from './translations';

export default function LocaleResourceProvider({ locale, children }) {
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
    const handleLocaleResource = async () => {
      const localeResource = await fetchLocaleResource(locale);
      if (localeResource) {
        setLocaleResource(localeResource);
      }
    };

    handleLocaleResource();
  }, []);

  if (!currentLocaleResource) {
    return <div />;
  }
  return (
    <RicosTranslate
      locale={currentLocaleResource.locale}
      localeResource={currentLocaleResource.localeResource}
    >
      {children(currentLocaleResource.locale)}
    </RicosTranslate>
  );
}
