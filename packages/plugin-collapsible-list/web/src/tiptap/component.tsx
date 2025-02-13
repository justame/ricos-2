/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Suspense, useContext, useState, useEffect } from 'react';
import type { PluginProps } from 'ricos-types';
import NewPairButton from '../components/NewPairButton';
import { mergeStyles } from 'wix-rich-content-common';
import collapsibleListStyles from '../../statics/styles/collapsible-list-component.rtlignore.scss';
import collapsibleListItemStyles from '../../statics/styles/collapsible-list-pair.rtlignore.scss';
import ExpandCollapseButton from '../components/ExpandCollapseButton';
import { DndIcon } from '../icons';
import { TIPTAP_COLLAPSIBLE_ITEM_TYPE } from 'ricos-content';
import {
  findParentNodeClosestToPos,
  isInCollapsibleList,
  findContainerNode,
  isInCollapsibleListBody,
} from './utils';
import { RicosContext } from 'ricos-context';
import classNames from 'classnames';
import { collapsibleStateManagerPlugin, COLLAPSIBLE_EXPAND_STATE } from '../consts';
const FloatingAddPluginMenu = React.lazy(() => import('./lazy-FloatingAddPluginMenu'));

const isInContainer = (parentNode, itemId) => {
  return parentNode.content.content.some(node => node.attrs.id === itemId);
};

const TO_RICOS_OPTIONS = {
  [COLLAPSIBLE_EXPAND_STATE.FIRST]: 'FIRST',
  [COLLAPSIBLE_EXPAND_STATE.EXPANDED]: 'ALL',
  [COLLAPSIBLE_EXPAND_STATE.COLLAPSED]: 'NONE',
};

const preventFocusJumpToFirstNode = event => {
  event.preventDefault();
  event.stopPropagation();
};

export const CollapsibleList: React.FC<PluginProps> = ({
  editor,
  node,
  NodeViewContent,
  componentData,
  getPos,
}) => {
  const { theme, t, languageDir } = useContext(RicosContext);
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

  const options = {
    expandState:
      TO_RICOS_OPTIONS[(componentData?.config as Record<string, string>)?.expandState] || 'ALL',
  };

  // To make sure the useEffect runs exactly once.
  const didMount = 5;

  useEffect(() => {
    const state = {
      nodeId: node.attrs.id as string,
      ...options,
    };
    editor.commands.setCollapsibleListItemsExpandState(state);
  }, [didMount]);

  const direction = componentData.config?.direction || languageDir;

  return (
    <div
      className={classNames(styles[direction], styles.listDimensions)}
      onMouseDown={preventDeselection}
      // onFocus={this.onFocus}
      // tabIndex="0"
      data-hook="collapsibleListComponent"
    >
      <NodeViewContent className={styles.item} />

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
  const collapsibleState = collapsibleStateManagerPlugin.getState(editor.state);
  const { openedItemId } = collapsibleState;
  const parentNode = findContainerNode(editor, node.attrs.id);
  const parentId = parentNode?.attrs.id;
  const { expandOnlyOne } = collapsibleState[parentId] || {};
  const { theme, t } = useContext(RicosContext);
  const styles = mergeStyles({ styles: collapsibleListItemStyles, theme });
  const isExpanded = !!node.attrs.isExpanded;

  const toggleCollapsibleListBody = () => {
    if (!isExpanded) {
      editor.view.dispatch(
        editor.state.tr.setMeta('collepsibleListItemOpen', { itemId: node.attrs.id })
      );
    }
    updateAttributes({ isExpanded: !isExpanded });
  };
  const inCollapsibleList = isInCollapsibleList(editor);

  const [mouseDown, setMouseDown] = useState<boolean>(false);

  useEffect(() => {
    if (
      openedItemId &&
      isExpanded &&
      expandOnlyOne &&
      openedItemId !== node.attrs.id &&
      isInContainer(parentNode, openedItemId)
    ) {
      updateAttributes({ isExpanded: false });
    }
  }, [openedItemId]);

  return (
    <div className={styles.itemContainer}>
      {inCollapsibleList && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={classNames(styles.dndIcon, mouseDown && styles.mouseDown)}
          draggable="true"
          contentEditable="false"
          data-drag-handle
          onDragEnd={() => setMouseDown(false)}
          onMouseUp={() => setMouseDown(false)}
          onMouseDown={() => setMouseDown(true)}
        >
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
      <NodeViewContent className={collapsibleListItemStyles.innerEditor} />
    </div>
  );
};

export const CollapsibleListItemTitle: React.FC<PluginProps> = ({ NodeViewContent }) => {
  return (
    <div className={collapsibleListItemStyles.titleContainer}>
      <NodeViewContent contenteditable="true" className={collapsibleListItemStyles.innerEditor} />
    </div>
  );
};

export const CollapsibleListItemBody: React.FC<PluginProps> = ({
  NodeViewContent,
  editor,
  getPos,
  node,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $pos = editor.view.state.doc.resolve((getPos as any)());

  const isShown = findParentNodeClosestToPos(
    $pos,
    node => node.type.name === TIPTAP_COLLAPSIBLE_ITEM_TYPE
  )?.node?.attrs?.isExpanded;

  const isSelected = isInCollapsibleListBody(editor, node.attrs.id);

  return isShown ? (
    <>
      {isSelected && (
        <Suspense fallback={<div />}>
          <div
            onClick={preventFocusJumpToFirstNode}
            onMouseDown={preventFocusJumpToFirstNode}
            onKeyDown={preventFocusJumpToFirstNode}
          >
            <FloatingAddPluginMenu />
          </div>
        </Suspense>
      )}
      <div className={collapsibleListItemStyles.titleContainer}>
        <NodeViewContent contenteditable="true" className={collapsibleListItemStyles.innerEditor} />
      </div>
    </>
  ) : null;
};
