/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import createHocName from '../Utils/createHocName';
import getDisplayName from '../Utils/getDisplayName';
import { normalizeURL } from '../Utils/urlValidators';
import Styles from '../Styles/global.scss';

const DEFAULTS = {
  alignment: null,
  size: 'content',
  url: undefined,
  textWrap: null,
};

const alignmentClassName = (alignment, theme) => {
  if (!alignment) {
    return '';
  }
  const key = `align${upperFirst(alignment)}`;
  return classNames(Styles[key], theme[key]);
};

const sizeClassName = (size, theme) => {
  if (!size) {
    return '';
  }
  const key = `size${upperFirst(camelCase(size))}`;
  return classNames(Styles[key], theme[key]);
};

const textWrapClassName = (textWrap, theme) => {
  if (!textWrap) {
    return '';
  }
  const key = `textWrap${upperFirst(camelCase(textWrap))}`;
  return classNames(Styles[key], theme[key]);
};

const createBaseComponent = ({ PluginComponent, theme, settings, pubsub, helpers, anchorTarget, t, isMobile }) => {
  class WrappedComponent extends Component {
    static displayName = createHocName('BaseComponent', PluginComponent);

    constructor(props) {
      super(props);
      this.state = { componentState: {}, ...this.stateFromProps(props) };
    }

    componentWillReceiveProps(nextProps) {
      this.setState(this.stateFromProps(nextProps));
    }

    stateFromProps(props) {
      const { getData, readOnly } = props.blockProps;
      const initialState = pubsub.get('initialState_' + props.block.getKey());
      if (initialState) {
        //reset the initial state
        pubsub.set('initialState_' + props.block.getKey(), undefined);
      }
      return {
        componentData: getData() || { config: DEFAULTS },
        readOnly: !!readOnly,
        componentState: initialState || {},
      };
    }

    componentDidMount() {
      this.updateComponent();
      pubsub.subscribe('componentData', this.onComponentDataChange);
      pubsub.subscribe('componentState', this.onComponentStateChange);
      pubsub.subscribe('componentAlignment', this.onComponentAlignmentChange);
      pubsub.subscribe('componentSize', this.onComponentSizeChange);
      pubsub.subscribe('componentTextWrap', this.onComponentTextWrapChange);
      pubsub.subscribe('componentLink', this.onComponentLinkChange);
    }

    componentDidUpdate() {
      this.duringUpdate = true;
      this.updateComponent();
      this.duringUpdate = false;
    }

    componentWillUnmount() {
      pubsub.unsubscribe('componentData', this.onComponentDataChange);
      pubsub.unsubscribe('componentState', this.onComponentStateChange);
      pubsub.unsubscribe('componentAlignment', this.onComponentAlignmentChange);
      pubsub.unsubscribe('componentSize', this.onComponentSizeChange);
      pubsub.unsubscribe('componentTextWrap', this.onComponentTextWrapChange);
      pubsub.unsubscribe('componentLink', this.onComponentLinkChange);
      pubsub.set('visibleBlock', null);
    }

    isMe = () => {
      const { block } = this.props;
      const updatedVisibleBlock = pubsub.get('visibleBlock');
      return updatedVisibleBlock === block.getKey();
    };

    onComponentDataChange = componentData => {
      if (this.isMeAndIdle) {
        this.setState({ componentData: componentData || {} }, () => {
          const { blockProps: { setData } } = this.props;
          setData(componentData);
        });
      }
    };

    onComponentStateChange = componentState => {
      if (this.isMeAndIdle) {
        this.setState({ componentState: componentState || {} });
      }
    };

    onComponentAlignmentChange = alignment => {
      if (alignment && this.isMeAndIdle) {
        this.updateComponentConfig({ alignment });
      }
    };

    onComponentSizeChange = size => {
      if (size && this.isMeAndIdle) {
        this.updateComponentConfig({ size });
      }
    };

    onComponentTextWrapChange = textWrap => {
      if (textWrap && this.isMeAndIdle) {
        this.updateComponentConfig({ textWrap });
      }
    };

    onComponentLinkChange = linkData => {
      const { url, targetBlank, nofollow } = linkData || {};
      if (this.isMeAndIdle) {
        const link = url ? {
          url,
          target: targetBlank ? '_blank' : '_self',
          rel: nofollow ? 'nofollow' : 'noopener'
        } : null;

        this.updateComponentConfig({ link });
      }
    };

    deleteBlock = () => {
      pubsub.set('visibleBlock', null);
      this.props.blockProps.deleteBlock();
    }

    updateComponent() {
      const { block, blockProps } = this.props;
      if (blockProps.isFocused && blockProps.isCollapsedSelection) {
        this.updateSelectedComponent();
      } else if (pubsub.get('visibleBlock') === block.getKey()) {
        this.updateUnselectedComponent();
      }
    }

    get isMeAndIdle() {
      return this.isMe() && !this.duringUpdate;
    }

    updateComponentConfig = newConfig => {
      pubsub.update('componentData', { config: newConfig });
    };

    getBoundingClientRectAsObject = element => {
      const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect();
      return { top, right, bottom, left, width, height, x, y };
    };

    updateSelectedComponent() {
      const { block } = this.props;

      const oldVisibleBlock = pubsub.get('visibleBlock');
      const visibleBlock = block.getKey();
      if (oldVisibleBlock !== visibleBlock) {
        const batchUpdates = {};
        const blockNode = findDOMNode(this);
        const componentData = this.state.componentData;
        const config = componentData.config || {};
        const boundingRect = this.getBoundingClientRectAsObject(blockNode);
        batchUpdates.boundingRect = boundingRect;
        batchUpdates.componentData = componentData;
        batchUpdates.componentState = {};
        batchUpdates.componentSize = config.size;
        batchUpdates.componentAlignment = config.alignment;
        batchUpdates.componentTextWrap = config.textWrap;
        batchUpdates.deleteBlock = this.deleteBlock;
        batchUpdates.visibleBlock = visibleBlock;
        pubsub.set(batchUpdates);
      } else {
        //maybe just the position has changed
        const blockNode = findDOMNode(this);
        const boundingRect = this.getBoundingClientRectAsObject(blockNode);
        pubsub.set('boundingRect', boundingRect);
      }
    }

    updateUnselectedComponent() {
      const batchUpdates = {};
      batchUpdates.visibleBlock = null;
      batchUpdates.componentData = {};
      batchUpdates.componentState = {};
      batchUpdates.componentSize = null;
      batchUpdates.componentAlignment = null;
      batchUpdates.componentTextWrap = null;
      pubsub.set(batchUpdates);
    }

    render = () => {
      const { blockProps, className, onClick, selection } = this.props;
      const { componentData, readOnly } = this.state;
      const { alignment, size, textWrap, link, width, height } = componentData.config || {};
      const isEditorFocused = selection.getHasFocus();
      const { isFocused } = blockProps;
      const isActive = isFocused && isEditorFocused && !readOnly;

      const ContainerClassNames = classNames(
        {
          [Styles.pluginContainer]: !readOnly,
          [Styles.pluginContainerReadOnly]: readOnly,
          [Styles.pluginContainerMobile]: isMobile,
          [theme.pluginContainer]: !readOnly,
          [theme.pluginContainerReadOnly]: readOnly,
          [theme.pluginContainerMobile]: isMobile,
        },
        isFunction(PluginComponent.WrappedComponent.alignmentClassName) ?
          PluginComponent.WrappedComponent.alignmentClassName(this.state.componentData, theme, Styles, isMobile) :
          alignmentClassName(alignment, theme),
        isFunction(PluginComponent.WrappedComponent.sizeClassName) ?
          PluginComponent.WrappedComponent.sizeClassName(this.state.componentData, theme, Styles, isMobile) :
          sizeClassName(size, theme),
        isFunction(PluginComponent.WrappedComponent.textWrapClassName) ?
          PluginComponent.WrappedComponent.textWrapClassName(this.state.componentData, theme, Styles, isMobile) :
          textWrapClassName(textWrap, theme),
        className || '',
        {
          [Styles.hasFocus]: isActive,
          [theme.hasFocus]: isActive,
        }
      );

      const overlayClassNames = classNames(Styles.overlay, theme.overlay, {
        [Styles.hidden]: readOnly,
        [theme.hidden]: readOnly,
      });

      const component = (
        <PluginComponent
          {...this.props}
          isMobile={isMobile}
          settings={settings}
          store={pubsub.store}
          theme={theme}
          componentData={this.state.componentData}
          componentState={this.state.componentState}
          helpers={helpers}
          t={t}
        />
      );

      let anchorProps = {};
      if (!isNil(link)) {
        anchorProps = {
          href: normalizeURL(link.url),
          target: link.targetBlank ? '_blank' : (anchorTarget || '_self'),
          rel: link.nofollow ? 'nofollow' : null
        };
      }
      const anchorClass = classNames(
        Styles.anchor, {
          [Styles.isImage]: getDisplayName(PluginComponent).toLowerCase().indexOf('image') !== -1,
        });
      /* eslint-disable jsx-a11y/anchor-has-content */
      return (
        <div style={{ width, height }} className={ContainerClassNames}>
          {!isNil(link) ? <div>{component}<a className={anchorClass} {...anchorProps}/></div> : component}
          {!this.state.readOnly && <div role="none" data-hook={'componentOverlay'} onClick={onClick} className={overlayClassNames} />}
        </div>
      );
      /* eslint-enable jsx-a11y/anchor-has-content */
    };
  }

  WrappedComponent.propTypes = {
    block: PropTypes.object.isRequired,
    blockProps: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
  };

  return WrappedComponent;
};

export default createBaseComponent;
