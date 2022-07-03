import React, { useContext } from 'react';
import type { FC } from 'react';
import { Content, RicosToolbarComponent, ToggleButton } from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import { RicosContext, EditorContext, PluginsContext } from 'ricos-context';
import type { Node } from 'prosemirror-model';
import styles from '../../statics/styles/footer-toolbar.scss';

interface Props {}

const content = Content.create<Node[]>([]);

export const FooterToolbar: FC<Props> = () => {
  const plugins = useContext(PluginsContext);
  const { isMobile } = useContext(RicosContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  const renderers = {};
  const pluginsAddButtons = plugins?.getAddButtons().asArray();
  pluginsAddButtons.forEach(button => {
    renderers[button.getButton().id] = toolbarItem => {
      return (
        <ToggleButton toolbarItem={toolbarItem} onClick={e => toolbarItem.commands?.click(e)} />
      );
    };
  });

  return (
    <div className={styles.footerToolbar} data-hook="footerToolbar">
      <RicosToolbarComponent
        toolbarItemsConfig={
          pluginsAddButtons.map(button =>
            button.toToolbarItemConfig()
          ) as IToolbarItemConfigTiptap[]
        }
        toolbarItemsRenders={renderers}
        content={content}
        editorCommands={getEditorCommands()}
        isMobile={isMobile}
      />
    </div>
  );
};
