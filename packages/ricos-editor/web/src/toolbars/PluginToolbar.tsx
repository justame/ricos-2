import React from 'react';
import type { Node } from 'prosemirror-model';
import type { Content } from 'wix-rich-content-toolbars-v3';
import { RicosToolbarComponent, FloatingToolbar } from 'wix-rich-content-toolbars-v3';
import { withRicosContext, withEditorContext, withPluginsContext } from 'ricos-context';
import type { GeneralContext } from 'ricos-context';
import type { RichContentAdapter } from 'wix-tiptap-editor';
import styles from '../../statics/styles/plugin-toolbar.scss';
import type { IEditorPlugins } from 'ricos-types';

type PluginsToolbarProps = {
  content: Content<Node[]>;
  plugins?: IEditorPlugins;
};

class PluginsToolbar extends React.Component<
  PluginsToolbarProps & { ricosContext: GeneralContext; editor: RichContentAdapter }
> {
  renderPluginToolbar() {
    const {
      ricosContext,
      editor: { tiptapEditor },
      content,
      plugins,
    } = this.props;

    const toolbar = plugins?.getVisibleToolbar(tiptapEditor.state.selection);

    if (toolbar) {
      return (
        <RicosToolbarComponent
          isMobile={ricosContext.isMobile}
          content={content}
          editorCommands={tiptapEditor}
          toolbarItemsConfig={toolbar.toToolbarItemsConfig()}
          toolbarItemsRenders={toolbar.getToolbarButtonsRenderers()}
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
      plugins,
    } = this.props;

    const isVisible = () => !!plugins?.getVisibleToolbar(tiptapEditor.state.selection);

    return (
      <FloatingToolbar
        editor={tiptapEditor}
        portal={ricosContext.portal}
        isVisible={isVisible}
        getReferenceElement={selectedDOM => {
          if (selectedDOM && selectedDOM.querySelector) {
            return selectedDOM?.querySelector('[data-hook=ricos-node]')?.firstChild as HTMLElement;
          } else {
            return null;
          }
        }}
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
