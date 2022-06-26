import React from 'react';
import type { Node } from 'prosemirror-model';
import type { Content } from 'wix-rich-content-toolbars-v3';
import { RicosToolbarComponent, FloatingToolbar } from 'wix-rich-content-toolbars-v3';
import { withRicosContext, withEditorContext } from 'ricos-context';
import type { GeneralContext } from 'ricos-context';
import type { RichContentAdapter } from 'wix-tiptap-editor';
import { withPluginsContext } from 'ricos-plugins';
import type { PluginsContextValue } from 'ricos-plugins';
import { isNodeSelection } from '@tiptap/core';
import styles from '../../statics/styles/plugin-toolbar.scss';

type PluginsToolbarProps = {
  content: Content<Node[]>;
  pluginsContext: PluginsContextValue;
};

class PluginsToolbar extends React.Component<
  PluginsToolbarProps & { ricosContext: GeneralContext; editor: RichContentAdapter }
> {
  renderPluginToolbar() {
    const {
      ricosContext,
      editor: { tiptapEditor },
      content,
      pluginsContext: { plugins },
    } = this.props;

    const toolbar = plugins.getVisibleToolbar(content.value);
    if (toolbar && !ricosContext.isMobile) {
      return (
        <RicosToolbarComponent
          isMobile={ricosContext.isMobile}
          content={content}
          editorCommands={tiptapEditor}
          toolbarItemsConfig={toolbar.toToolbarItemsConfig()}
          toolbarItemsRenders={toolbar.getToolberButtonsRenderers()}
          maxWidth={tiptapEditor.view.dom.clientWidth}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const {
      ricosContext,
      editor: { tiptapEditor },
    } = this.props;

    return (
      <FloatingToolbar
        editor={tiptapEditor}
        portal={ricosContext.portal}
        isVisible={isNodeSelection}
      >
        {() => (
          <div
            dir={ricosContext.languageDir}
            data-hook={'floating-plugin-toolbar'}
            className={styles.floatingToolbar}
          >
            {this.renderPluginToolbar()}
          </div>
        )}
      </FloatingToolbar>
    );
  }
}
const PluginsToolbarWithContext = withPluginsContext(
  withRicosContext<PluginsToolbarProps>(withEditorContext<PluginsToolbarProps>(PluginsToolbar))
);
export default PluginsToolbarWithContext;
