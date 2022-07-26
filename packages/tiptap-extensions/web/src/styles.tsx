import classNames from 'classnames';
import { camelCase, upperFirst } from 'lodash';
import type { CSSProperties } from 'react';
import React from 'react';
import type { RicosExtension, RicosExtensionConfig } from 'ricos-types';
import type { RichContentTheme } from 'wix-rich-content-common';
import generalRTLIgnoredStyles from 'wix-rich-content-common/dist/statics/styles/general.rtlignore.scss';
import generalStyles from 'wix-rich-content-editor-common/dist/statics/styles/general.scss';

const stylesWithRTL = { ...generalStyles, ...generalRTLIgnoredStyles };
export const getAlignmentClassName = (styles, alignment, theme: RichContentTheme = {}) => {
  if (!alignment) {
    return '';
  }
  const key = `align${upperFirst(alignment.toLowerCase())}`;
  return classNames(styles[key], theme[key]);
};

export const getSizeClassName = (styles, size, theme: RichContentTheme = {}) => {
  if (!size) {
    return '';
  }
  const key = `size${upperFirst(camelCase(size))}`;

  return classNames(styles[key], theme[key]);
};

export const getFocusClassName = (styles, theme: RichContentTheme = {}, isFocused) => {
  return classNames({
    [styles.hasFocus]: isFocused,
    [theme.hasFocus]: isFocused,
    [styles.hideTextSelection]: !isFocused,
  });
};

export const getTextWrapClassName = (styles, theme: RichContentTheme = {}, textWrap) => {
  if (!textWrap) {
    return '';
  }
  const key = `textWrap${upperFirst(camelCase(textWrap))}`;
  return classNames(styles[key], theme[key]);
};

export const getPluginContainerClassName = (styles, theme: RichContentTheme = {}, isMobile) => {
  return classNames(styles.pluginContainer, theme.pluginContainer, theme.pluginContainerWrapper, {
    [styles.pluginContainerMobile]: isMobile,
    [theme.pluginContainerMobile]: isMobile,
  });
};

export const getComponentStyles = ({ componentData, theme, isFocused, isMobile }) => {
  const alignment = componentData?.containerData?.alignment;
  const size = componentData?.containerData?.width?.size;
  const textWrap = componentData?.containerData?.textWrap;
  return {
    alignmentClassName: getAlignmentClassName(stylesWithRTL, alignment, theme),
    sizeClassName: getSizeClassName(stylesWithRTL, size, theme),
    focusClassName: getFocusClassName(stylesWithRTL, theme, isFocused),
    textWrapClassName: getTextWrapClassName(stylesWithRTL, theme, textWrap),
    pluginContainerClassName: getPluginContainerClassName(stylesWithRTL, theme, isMobile),
  };
};

const StylesHOC = Component => {
  const Styles = props => {
    const { context, componentData, selected, node, editor } = props;
    const nodeId = node.attrs.id;
    const { isMobile, theme } = context;
    const { selection } = editor.state;
    let isFocused = false;
    editor.state.doc.nodesBetween(selection.from, selection.to, node => {
      node.attrs.id === nodeId && (isFocused = true);
    });
    const componentStyles = getComponentStyles({
      componentData,
      theme,
      isFocused,
      isMobile,
    });

    const customWidth = componentData?.containerData?.width?.custom;
    const style: CSSProperties = {
      width: customWidth && `${customWidth}px`,
    };

    return (
      <div className={Object.values(componentStyles).join(' ')} style={style}>
        <Component {...props} />
      </div>
    );
  };
  Styles.displayName = 'StylesHoc';

  return Styles;
};

export const styles: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'style',
  reconfigure: (config: RicosExtensionConfig, extensions: RicosExtension[]) => ({
    ...config,
    addOptions: () => ({}),
    addNodeHoc: () => ({
      nodeTypes: extensions
        .filter(extension => !extension.groups.includes('custom-styles'))
        .map(({ name }) => name),
      priority: 100,
      nodeHoc: StylesHOC,
    }),
  }),
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 30,
    };
  },
};
