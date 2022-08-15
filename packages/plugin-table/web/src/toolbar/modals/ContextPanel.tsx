import React from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal, ListItemSection } from 'wix-rich-content-toolbars-ui';
import { TABLE_COMMANDS_KEYS } from '../../consts';

type Props = {
  getSelectedStyle: () => string;
  onClick: (data: { commandKey: string }) => void;
  closeModal: () => void;
};

const ContextPanel: React.FC<Props> = ({ onClick, closeModal }) => {
  const onKeyDown = (e, commandKey) => {
    if (e.keyCode === KEYS_CHARCODE.ENTER) {
      onClick({ commandKey });
      e.stopPropagation();
      closeModal();
    }
  };

  const onOptionClick = commandKey => {
    onClick({ commandKey });
    closeModal();
  };

  const DropdownOptions = [
    <ListItemSelect
      key={'Clear'}
      dataHook={'clear'}
      title={'Clear'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.CLEAR)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.CLEAR);
      }}
    />,
    <ListItemSelect
      key={'DeleteTable'}
      dataHook={'delete-table'}
      title={'Delete table'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_TABLE)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_TABLE);
      }}
    />,
    <ListItemSelect
      key={'DeleteRow'}
      dataHook={'delete-row'}
      title={'Delete row'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_ROW)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_ROW);
      }}
    />,
    <ListItemSelect
      key={'DeleteCol'}
      dataHook={'delete-column'}
      title={'Delete column'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_COLUMN)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_COLUMN);
      }}
    />,
    <ListItemSection key={'divider1'} type={'divider'} />,
    <ListItemSelect
      key={'insertAbove'}
      dataHook={'insert-above'}
      title={'Insert 1 above'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_ABOVE)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_ABOVE);
      }}
    />,
    <ListItemSelect
      key={'insertBelow'}
      dataHook={'insert-below'}
      title={'Insert 1 below'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_BELOW)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_BELOW);
      }}
    />,
    <ListItemSelect
      key={'insertRight'}
      dataHook={'insert-right'}
      title={'Insert 1 right'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_RIGHT)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_RIGHT);
      }}
    />,
    <ListItemSelect
      key={'insertLeft'}
      dataHook={'insert-left'}
      title={'Insert 1 left'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_LEFT)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_LEFT);
      }}
    />,
    <ListItemSection key={'divider2'} type={'divider'} />,
    <ListItemSelect
      key={'merge'}
      dataHook={'merge-cells'}
      title={'Merge cells'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.MERGE_CELLS)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.MERGE_CELLS);
      }}
    />,
    <ListItemSelect
      key={'split'}
      dataHook={'split-cell'}
      title={'Split cell'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SPLIT_CELL)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.SPLIT_CELL);
      }}
    />,
    <ListItemSection key={'divider3'} type={'divider'} />,
    <ListItemSelect
      key={'distributeRows'}
      dataHook={'distribute-rows'}
      title={'Distribute rows'}
      onClick={() => {} /*onOptionClick(TABLE_COMMANDS_KEYS.DISTRIBUTE_COLUMNS)*/}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.DISTRIBUTE_ROWS);
      }}
    />,
    <ListItemSelect
      key={'distributeCols'}
      dataHook={'distribute-columns'}
      title={'Distribute columns'}
      onClick={() => {} /*onOptionClick(TABLE_COMMANDS_KEYS.DISTRIBUTE_COLUMNS)*/}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.DISTRIBUTE_COLUMNS);
      }}
    />,
    <ListItemSection key={'divider4'} type={'divider'} />,
    <ListItemSelect
      key={'selectRows'}
      dataHook={'distribute-rows'}
      title={'Select rows'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SELECT_ROWS)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.SELECT_ROWS);
      }}
    />,
    <ListItemSelect
      key={'selectCols'}
      dataHook={'select-column'}
      title={'Select columns'}
      onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SELECT_COLUMNS)}
      onKeyDown={e => {
        onKeyDown(e, TABLE_COMMANDS_KEYS.SELECT_COLUMNS);
      }}
    />,
  ];

  return <DropdownModal options={DropdownOptions} />;
};

export default ContextPanel;
