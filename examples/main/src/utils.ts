import { debounce, pick } from 'lodash';
import { set, get } from 'local-storage';
import MobileDetect from 'mobile-detect';
import type { DraftContent } from 'wix-rich-content-common';
import { normalizeInitialState, isSSR } from 'wix-rich-content-common';
import * as CONSTS from './consts';

const mobileDetect = !isSSR() ? new MobileDetect(window.navigator.userAgent) : null;
export const isMobile = () => mobileDetect && mobileDetect.mobile() !== null;

export const generateKey = (prefix: string) => `${prefix}-${new Date().getTime()}`;

const getStateKeysToStore = () => {
  const { STATE_KEYS_TO_STORE } = CONSTS;
  return !isMobile()
    ? STATE_KEYS_TO_STORE
    : STATE_KEYS_TO_STORE.filter(key => key.indexOf('Size') === -1);
};

export const getStorageKey = () =>
  !isMobile() ? CONSTS.LOCAL_STORAGE_KEY : CONSTS.LOCAL_STORAGE_MOBILE_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadStateFromStorage = () => get<Record<string, any>>(getStorageKey());

export const saveStateToStorage = debounce(state => {
  const stateToStore = pick(state, getStateKeysToStore());
  set(getStorageKey(), stateToStore);
}, 1000);

export const normalize = (json: DraftContent) => {
  const { anchorTarget } = CONSTS;
  return normalizeInitialState(json, {
    anchorTarget,
  });
};

export const getBaseUrl = () => {
  if (isSSR()) {
    return null;
  }

  const { hostname, port, protocol } = window.location;
  const baseUrl = `${protocol}//${hostname}`;
  return port ? `${baseUrl}:${port}` : baseUrl;
};

export const getRequestedLocale = () => getUrlParameter('locale') || 'en';

function getUrlParameter(name: string) {
  if (isSSR()) {
    return '';
  }
  const newName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + newName + '=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function disableBrowserBackButton() {
  (function (global) {
    if (typeof global === 'undefined') {
      throw new Error('window is undefined');
    }
    const _hash = '!';
    const noBackPlease = function () {
      global.location.href = '#';

      // making sure we have the fruit available for juice (^__^)
      global.setTimeout(() => {
        global.location.href += '!';
      }, 50);
    };

    global.onhashchange = function () {
      if (!global.location.hash) {
        global.location.hash = _hash;
      }
    };

    global.onload = function () {
      noBackPlease();
    };
  })(window);
}
