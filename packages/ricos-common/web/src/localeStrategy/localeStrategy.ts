export default async function localeStrategy(locale = 'en') {
  if (locale === 'en') {
    return { locale };
  }
  try {
    const localeResource = await import(
      /* webpackChunkName: "messages_[request]" */
      `wix-rich-content-common/dist/statics/locale/messages_${locale}.json`
    ).then(res => res.default);
    return { locale, localeResource };
  } catch (err) {
    console.warn(`can't find ${locale} locale`);
    return {
      locale: 'en',
    };
  }
}
