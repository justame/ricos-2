import { NodeViewContent } from '@tiptap/react';
import React, { useContext } from 'react';
import { RicosTiptapContext } from '../context';
import styles from '../statics/styles/tiptap-editor-styles.scss';

export const RicosNode = ({ Component, tiptapNodeProps }) => {
  const ricosTiptapContext = useContext(RicosTiptapContext) || {};

  const componentProps = {
    ...ricosTiptapContext, // helpes , editor Props
    componentData: tiptapNodeProps.node.attrs,
    ...tiptapNodeProps,
    NodeViewContent,
  };
  return (
    <div data-hook="ricos-node" className={styles['ricos-node']}>
      <Component {...componentProps} />
    </div>
  );
};
