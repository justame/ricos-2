import linkifyIt from 'linkify-it';
const linkify = linkifyIt();

const HttpUrlPattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
); // fragment locator

export const isValidExactUrl = (str: string) => HttpUrlPattern.test(str);

export const isValidTelUrl = (str: string) => /^tel:[0-9-()+#*]+$/.test(str);

export const isValidUrl = (url: string) => url && url[0] !== '#' && linkify.test(url);

export const getUrlMatches = (text: string) => linkify.match(text) || [];

export const normalizeUrl = url => {
  const linkifyURL = linkify.match(url) && linkify.match(url)[0].url;
  if (linkifyURL) {
    return url.includes('mailto:') ? url : linkifyURL;
  }
};

export const startsWithHttps = (url: string) => /^https:/.test(url);

const startsWithHttp = (url: string) => /^http:/.test(url);

export const getHost = url =>
  url && !startsWithHttps(url) && !startsWithHttp(url)
    ? new URL(`http://${url}`).host
    : new URL(url).host;

export const hasProtocol = (url: string) => /^[a-z]+:/i.test(url);
