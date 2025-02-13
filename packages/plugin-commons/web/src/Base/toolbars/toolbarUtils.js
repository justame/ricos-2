import { TOOLBAR_OFFSETS } from '../../consts';
import {
  mergeToolbarSettings,
  isiOS,
  TOOLBARS,
  DISPLAY_MODE,
} from 'wix-rich-content-editor-common';
import { getDefaultToolbarSettings } from '../default-toolbar-settings';
import { get } from 'lodash';

export const setVariables = ({ buttons, getToolbarSettings = () => [], isMobile }) => {
  const { all, hidden } = buttons;
  const visibleButtons = all.filter(({ keyName }) => !hidden.includes(keyName));

  const defaultSettings = getDefaultToolbarSettings({ pluginButtons: visibleButtons });
  const customSettings = getToolbarSettings({ pluginButtons: visibleButtons }).filter(
    ({ name }) => name === TOOLBARS.PLUGIN
  );
  const toolbarSettings = mergeToolbarSettings({ defaultSettings, customSettings }).filter(
    ({ name }) => name === TOOLBARS.PLUGIN
  )[0];

  const {
    shouldCreate: _shouldCreate,
    getPositionOffset,
    getButtons,
    getVisibilityFn,
    getDisplayOptions,
    getToolbarDecorationFn,
  } = toolbarSettings;

  const deviceName = !isMobile ? 'desktop' : isiOS() ? 'mobile.ios' : 'mobile.android';

  const structure = get(getButtons(), deviceName, []);
  const offset = get(getPositionOffset(), deviceName, { x: 0, y: 0 });
  const shouldCreate = get(_shouldCreate(), deviceName, true);
  const visibilityFn = get(getVisibilityFn(), deviceName, () => true);
  const displayOptions = get(getDisplayOptions(), deviceName, { displayMode: DISPLAY_MODE.NORMAL });
  const toolbarDecorationFn = get(getToolbarDecorationFn(), deviceName, () => null);
  const ToolbarDecoration = toolbarDecorationFn();
  return { structure, offset, shouldCreate, visibilityFn, displayOptions, ToolbarDecoration };
};

export const getRelativePositionStyle = ({
  boundingRect,
  offset,
  offsetHeight,
  toolbarNode,
  isMobile,
  renderedInTable,
}) => {
  const { x, y } = offset;
  const updatedOffsetHeight = offsetHeight || toolbarNode.offsetHeight;
  const toolbarHeight = updatedOffsetHeight;
  const toolbarWidth = toolbarNode.offsetWidth;
  const offsetParentRect = toolbarNode.offsetParent.getBoundingClientRect();
  const offsetParentTop = offsetParentRect.top;
  const offsetParentLeft = offsetParentRect.left;
  let top = boundingRect.top - toolbarHeight - TOOLBAR_OFFSETS.top - offsetParentTop + y;
  const tmpLeft =
    boundingRect.left + boundingRect.width / 2 - offsetParentLeft - toolbarWidth / 2 + x;
  const maxLeft = offsetParentRect.right - toolbarWidth - TOOLBAR_OFFSETS.left;
  let left = calculateLeftOffset(tmpLeft, maxLeft, isMobile);
  if (renderedInTable) {
    const outerEditor = document && document.querySelector('[data-id=rce]');
    const outerEditorRect = outerEditor.getBoundingClientRect();
    if (left + offsetParentLeft - outerEditorRect.left + toolbarWidth > outerEditor.clientWidth) {
      const maxLeftByWindowWidth = outerEditor.clientWidth - toolbarWidth;
      left = -1 * offsetParentLeft + maxLeftByWindowWidth + outerEditorRect.left;
    }
    top += 5;
  }
  return {
    position: {
      '--offset-top': `${top}px`,
      '--offset-left': `${left}px`,
      transform: 'scale(1)',
    },
    updatedOffsetHeight,
  };
};

const calculateLeftOffset = (left, maxLeft, isMobile) => {
  if (left < 0) {
    return isMobile ? TOOLBAR_OFFSETS.left : -TOOLBAR_OFFSETS.left * 2;
  }
  return Math.min(left, maxLeft - TOOLBAR_OFFSETS.left * 2);
};

export const getToolbarPosition = ({
  boundingRect,
  displayOptions,
  getRelativePositionStyle,
  offset,
}) => {
  let position;
  if (displayOptions.displayMode === DISPLAY_MODE.NORMAL) {
    position = getRelativePositionStyle(boundingRect);
  } else if (displayOptions.displayMode === DISPLAY_MODE.FLOATING) {
    position = {
      '--offset-top': `${offset.y}px`,
      '--offset-left': `${offset.x}px`,
      transform: 'scale(1)',
      position: 'absolute',
    };
  }

  return position;
};
