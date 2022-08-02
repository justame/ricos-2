import React from 'react';
import type { Node } from 'prosemirror-model';
import type { Content } from 'wix-rich-content-toolbars-v3';
import { RicosToolbarComponent, FloatingToolbar } from 'wix-rich-content-toolbars-v3';
import { withRicosContext, withEditorContext, withPluginsContext } from 'ricos-context';
import type { GeneralContext } from 'ricos-context';
import styles from '../../statics/styles/plugin-toolbar.scss';
import type { IRicosEditor, RicosEditorPlugins } from 'ricos-types';
import { TIPTAP_COLLAPSIBLE_LIST_TYPE } from 'ricos-content';

type PluginsToolbarProps = {
  content: Content<Node[]>;
  plugins?: RicosEditorPlugins;
};

const getFirstRefrenceableDOMNode = (editor, from) => {
  const indexes = Array.from({ length: from + 1 }, (_, i) => i).reverse();
  return indexes.map(index => editor.view.nodeDOM(index)).find(element => !!element?.querySelector);
};

class PluginsToolbar extends React.Component<
  PluginsToolbarProps & { ricosContext: GeneralContext; editor: IRicosEditor }
> {
  renderPluginToolbar() {
    const { ricosContext, editor, content, plugins } = this.props;
    const tiptapEditor = editor.adapter.tiptapEditor;

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

  getNestedNodeContainerElement() {
    const { editor } = this.props;
    const tiptapEditor = editor.adapter.tiptapEditor;
    const selectedDOM = getFirstRefrenceableDOMNode(
      tiptapEditor,
      tiptapEditor.state.selection.from
    );
    const getElement = (element: HTMLElement) => {
      const parent = element?.parentElement;
      const closestAncestor = parent?.closest('[data-hook=ricos-node]');
      return closestAncestor ? getElement(closestAncestor as HTMLElement) : element;
    };
    return getElement(selectedDOM)?.firstChild as HTMLElement;
  }

  isNestedNodeInSelection() {
    const { editor } = this.props;
    const tiptapEditor = editor.adapter.tiptapEditor;

    const { selection } = tiptapEditor.state;
    return (
      selection.from === selection.to &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (selection.$anchor as any)?.path?.find(
        node => node?.type?.name === TIPTAP_COLLAPSIBLE_LIST_TYPE
      )
    );
  }

  render() {
    const { ricosContext, editor, plugins } = this.props;
    const tiptapEditor = editor.adapter.tiptapEditor;

    const isVisible = () => !!plugins?.getVisibleToolbar(tiptapEditor.state.selection);

    return (
      <FloatingToolbar
        editor={tiptapEditor}
        portal={ricosContext.portal}
        isVisible={isVisible}
        getReferenceElement={selectedDOM => {
          if (selectedDOM) {
            return selectedDOM?.querySelector?.('[data-hook=ricos-node]')
              ?.firstChild as HTMLElement;
          } else if (this.isNestedNodeInSelection()) {
            return this.getNestedNodeContainerElement();
          }
          return null;
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
