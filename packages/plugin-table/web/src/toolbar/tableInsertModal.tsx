import React, { Component } from 'react';
import type { ModalService } from 'ricos-types';
import type { Helpers, Pubsub } from 'wix-rich-content-common';
import TableSettingsModal from './tableSettingsModal';

interface Props {
  context: ModalService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  helpers: Helpers;
  onConfirm: (arg: unknown) => void;
  pubsub: Pubsub;
}

class TableInsertModal extends Component<Props> {
  closeModal = () => {
    this.props.helpers?.closeModal?.();
  };

  onTableAdd = data => {
    const { onConfirm, pubsub, componentData } = this.props;
    if (onConfirm) {
      onConfirm({
        ...componentData,
        ...data,
      });
    } else {
      pubsub.update('componentData', data);
    }
    this.closeModal();
  };

  render() {
    return (
      <TableSettingsModal
        {...this.props}
        onTableAdd={this.onTableAdd}
        closeModal={this.closeModal}
      />
    );
  }
}

export default TableInsertModal;
