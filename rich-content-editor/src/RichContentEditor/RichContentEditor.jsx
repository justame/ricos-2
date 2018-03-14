import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EditorState, convertFromRaw } from '@wix/draft-js';
import Editor from 'draft-js-plugins-editor';
import isUndefined from 'lodash/isUndefined';
import { translate } from 'react-i18next';
import { baseUtils } from 'photography-client-lib/dist/src/utils/baseUtils';
import createToolbars from './Toolbars';
import createPlugins from './Plugins';
import createDecorators from './Decorators';
import '@wix/draft-js/dist/Draft.css'; // must import before custom styles
import Styles from '~/Styles/rich-content-editor.scss';
import '~/Styles/draft-overrides.scss';

class RichContentEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.getInitialEditorState(),
      readOnly: props.readOnly || false,
      theme: props.theme || {}
    };
    this.initPlugins();
  }

  initPlugins() {
    const {
      decorators,
      helpers,
      plugins,
      isMobile,
      anchorTarget,
      t,
    } = this.props;
    const { theme } = this.state;
    const { pluginInstances, pluginButtons } = createPlugins({ plugins, helpers, theme, t, isMobile, anchorTarget });
    this.initEditorToolbars(pluginButtons);
    this.plugins = [...pluginInstances, ...Object.values(this.toolbars)];
    this.decorators = createDecorators(decorators, theme, anchorTarget);
  }

  initEditorToolbars(pluginButtons) {
    const {
      helpers,
      hideFooterToolbar,
      sideToolbarOffset,
      textButtons,
      isMobile,
      t,
    } = this.props;
    const { theme } = this.state;
    const buttons = { textButtons, pluginButtons };

    this.toolbars = createToolbars({
      buttons,
      helpers,
      isMobile,
      hideFooterToolbar,
      sideToolbarOffset,
      theme: theme || {},
      getEditorState: () => this.state.editorState,
      setEditorState: editorState => this.setState({ editorState }),
      t,
    });
  }

  getMobileToolbar = () => this.props.isMobile ? this.toolbars.mobile.Toolbar : null;

  getInitialEditorState() {
    const { editorState, initialState } = this.props;
    if (editorState) {
      return editorState;
    }
    if (initialState) {
      return EditorState.createWithContent(convertFromRaw(initialState));
    } else {
      return EditorState.createEmpty();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isUndefined(nextProps.readOnly) && this.props.readOnly !== nextProps.readOnly) {
      this.setState({ readOnly: nextProps.readOnly });
    }
    if (this.props.editorState !== nextProps.editorState) {
      this.setState({ editorState: nextProps.editorState });
    }
    if (this.props.theme !== nextProps.theme) {
      this.setState({ theme: nextProps.theme });
    }
  }

  blockStyleFn = contentBlock => {
    const { type, data: { textAlignment } } = contentBlock.toJS();
    const classList = [];
    const { theme } = this.state;

    switch (type) {
      case 'blockquote':
        classList.push(Styles.quote);
        classList.push(theme.quote);
        break;
      case 'header-one':
        classList.push(Styles.headerOne);
        classList.push(theme.headerOne);
        break;
      case 'header-two':
        classList.push(Styles.headerTwo);
        classList.push(theme.headerTwo);
        break;
      case 'header-three':
        classList.push(Styles.headerThree);
        classList.push(theme.headerThree);
        break;
      case 'indent':
        classList.push(Styles.indent);
        classList.push(theme.indent);
        break;
      case 'ordered-list-item':
        classList.push(Styles.orderedList);
        classList.push(theme.orderedList);
        break;
      case 'unordered-list-item':
        classList.push(Styles.unorderedList);
        classList.push(theme.unorderedList);
        break;
      case 'atomic':
        classList.push(Styles.atomic);
        classList.push(theme.atomic);
        break;
      case 'code-block':
        classList.push(Styles.codeBlock);
        classList.push(theme.codeBlock);
        break;
      default:
        classList.push(Styles.text);
        classList.push(theme.text);
    }
    if (type !== 'atomic') {
      classList.push(Styles[textAlignment]);
      classList.push(theme[textAlignment]);
    }
    return classNames(...classList);
  };

  getEditorState = () => this.state.editorState;

  updateEditorState = editorState => {
    this.setState({ editorState });
    this.props.onChange && this.props.onChange(editorState);
  };

  focus = () => this.editor.focus();

  setEditor = ref => (this.editor = ref);

  renderToolbars = () => {
    if (!this.state.readOnly) {
      const toolbarsToRender = this.plugins.filter(plugin => {
        return !plugin.name ||
          plugin.name.toLowerCase().indexOf('mobile') === -1;
      });
      //eslint-disable-next-line array-callback-return
      const toolbars = toolbarsToRender.map((plugin, index) => {
        const Toolbar = plugin.Toolbar || plugin.InlineToolbar || plugin.SideToolbar;
        if (Toolbar) {
          return <Toolbar key={`k${index}`} />;
        }
      });
      return toolbars;
    }
  };

  renderEditor = () => {
    const { helpers, placeholder } = this.props;
    const { editorState, readOnly } = this.state;
    return (
      <Editor
        ref={this.setEditor}
        editorState={editorState}
        onChange={this.updateEditorState}
        plugins={this.plugins}
        decorators={this.decorators}
        blockStyleFn={this.blockStyleFn}
        placeholder={placeholder || ''}
        readOnly={!!readOnly}
        helpers={helpers}
        spellCheck
      />
    );
  };

  render() {
    const { isMobile } = this.props;
    const { theme } = this.state;
    const isAndroid = isMobile && !baseUtils.isiOS();
    const wrapperClassName = classNames(Styles.wrapper, theme.wrapper, {
      [Styles.desktop]: !isMobile,
      [theme.desktop]: !isMobile && theme && theme.desktop,
      [Styles.android]: isAndroid,
      [theme.android]: isAndroid
    });
    return (
      <div className={wrapperClassName}>
        <div className={classNames(Styles.editor, theme.editor)}>
          {this.renderEditor()}
          {this.renderToolbars()}
        </div>
      </div>
    );
  }
}

RichContentEditor.propTypes = {
  editorState: PropTypes.object,
  decorators: PropTypes.object,
  initialState: PropTypes.object,
  theme: PropTypes.object,
  onChange: PropTypes.func,
  isMobile: PropTypes.bool,
  readOnly: PropTypes.bool,
  helpers: PropTypes.object,
  placeholder: PropTypes.string,
  t: PropTypes.func,
  sideToolbarOffset: PropTypes.object,
  hideFooterToolbar: PropTypes.bool,
  textButtons: PropTypes.arrayOf(PropTypes.string),
  plugins: PropTypes.arrayOf(PropTypes.string),
  anchorTarget: PropTypes.string,
};

export default translate(null, { withRef: true })(RichContentEditor);
