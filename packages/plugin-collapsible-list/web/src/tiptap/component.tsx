import React, { useContext } from 'react';
import type { PluginProps } from 'ricos-tiptap-types';
import NewPairButton from '../components/NewPairButton';
import { mergeStyles } from 'wix-rich-content-common';
import collapsibleListStyles from '../../statics/styles/collapsible-list-component.rtlignore.scss';
import collapsibleListItemStyles from '../../statics/styles/collapsible-list-pair.rtlignore.scss';
import ExpandCollapseButton from '../components/ExpandCollapseButton';
import { DndIcon } from '../icons';
import { TIPTAP_COLLAPSIBLE_ITEM_TYPE } from 'ricos-content';
import { findParentNodeClosestToPos, isInCollapsibleList } from './utils';
import { RicosContext } from 'ricos-context';

export const CollapsibleList: React.FC<PluginProps> = ({
  editor,
  node,
  NodeViewContent,
  componentData,
  getPos,
}) => {
  const { theme, t } = useContext(RicosContext);
  const styles = mergeStyles({ styles: collapsibleListStyles, theme });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pos = (getPos as any)();
  const inCollapsibleList = isInCollapsibleList(editor);

  const preventDeselection = e => {
    if (inCollapsibleList) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const addNewPair = e => {
    e.preventDefault();
    e.stopPropagation();
    editor.commands.addCollapsibleListItem(pos + node.nodeSize);
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={styles[componentData.direction]}
      onMouseDown={preventDeselection}
      // onFocus={this.onFocus}
      // tabIndex="0"
      data-hook="collapsibleListComponent"
    >
      <NodeViewContent />
      {inCollapsibleList && (
        <NewPairButton
          onClick={addNewPair}
          label={t('CollapsibleList_ShownText_Add_Placeholder')}
        />
      )}
    </div>
  );
};

export const CollapsibleListItem: React.FC<PluginProps> = ({
  editor,
  node,
  NodeViewContent,
  updateAttributes,
}) => {
  const { theme, t } = useContext(RicosContext);
  const styles = mergeStyles({ styles: collapsibleListItemStyles, theme });
  const isExpanded = node.attrs.isExpanded;
  const toggleCollapsibleListBody = () => {
    updateAttributes({ isExpanded: !isExpanded });
  };
  const inCollapsibleList = isInCollapsibleList(editor);

  return (
    <div className={styles.itemContainer}>
      {inCollapsibleList && (
        <div className={styles.dndIcon} draggable="true" contentEditable="false" data-drag-handle>
          <DndIcon />
        </div>
      )}
      <div className={styles.expandIcon}>
        <ExpandCollapseButton
          isExpanded={isExpanded}
          onClick={toggleCollapsibleListBody}
          // idx={idx}
          ariaLabel={
            isExpanded
              ? t('CollapsibleListPlugin_ExpandButton_AriaLabel')
              : t('CollapsibleListPlugin_CollapseButton_AriaLabel')
          }
        />
      </div>
      <NodeViewContent />
    </div>
  );
};

export const CollapsibleListItemTitle: React.FC<PluginProps> = ({ NodeViewContent }) => {
  return (
    <div className={collapsibleListItemStyles.titleContainer}>
      <NodeViewContent contenteditable="true" />
    </div>
  );
};

export const CollapsibleListItemBody: React.FC<PluginProps> = ({
  NodeViewContent,
  editor,
  getPos,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $pos = editor.view.state.doc.resolve((getPos as any)());

  const isShown = findParentNodeClosestToPos(
    $pos,
    node => node.type.name === TIPTAP_COLLAPSIBLE_ITEM_TYPE
  )?.node?.attrs?.isExpanded;
  return isShown ? (
    <div className={collapsibleListItemStyles.titleContainer}>
      <NodeViewContent contenteditable="true" />
    </div>
  ) : null;
};
