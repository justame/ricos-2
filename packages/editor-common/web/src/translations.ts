import englishResources from 'wix-rich-content-common/dist/statics/locale/messages_en.json';

export const fetchLocaleResource = async (locale = 'en') => {
  if (locale === 'en') {
    return { locale, localeResource: englishResources };
  }
  try {
    const localeResource = await import(
      /* webpackChunkName: "ricos_messages_[request]" */
      `wix-rich-content-common/dist/statics/locale/messages_${locale}.json`
    ).then(res => res.default);
    return { locale, localeResource };
  } catch (err) {
    console.warn(`can't find ${locale} locale`);
    return false;
  }
};
