import React from 'react';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import { ListItemSelect, DropdownModal, ListItemSection } from 'wix-rich-content-toolbars-ui';
import { TABLE_COMMANDS_KEYS, CATEGORY } from '../../consts';

const deleteRow = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'deleteRow'}
    dataHook={'delete-row'}
    title={'Delete row'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_ROW)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_ROW);
    }}
  />
);

const deleteCol = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'deleteCol'}
    dataHook={'delete-column'}
    title={'Delete column'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_COLUMN)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_COLUMN);
    }}
  />
);

const deleteTable = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'DeleteTable'}
    dataHook={'delete-table'}
    title={'Delete table'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DELETE_TABLE)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.DELETE_TABLE);
    }}
  />
);

const insertAbove = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'insertAbove'}
    dataHook={'insert-above'}
    title={'Insert 1 above'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_ABOVE)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_ABOVE);
    }}
  />
);

const insertBelow = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'insertBelow'}
    dataHook={'insert-below'}
    title={'Insert 1 below'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_BELOW)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_BELOW);
    }}
  />
);

const insertRight = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'insertRight'}
    dataHook={'insert-right'}
    title={'Insert 1 right'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_RIGHT)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_RIGHT);
    }}
  />
);

const insertLeft = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'insertLeft'}
    dataHook={'insert-left'}
    title={'Insert 1 left'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.INSERT_LEFT)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.INSERT_LEFT);
    }}
  />
);

const merge = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'merge'}
    dataHook={'merge-cells'}
    title={'Merge cells'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.MERGE_CELLS)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.MERGE_CELLS);
    }}
  />
);

const split = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'split'}
    dataHook={'split-cell'}
    title={'Split cell'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SPLIT_CELL)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.SPLIT_CELL);
    }}
  />
);

const distributeCols = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'distributeCols'}
    dataHook={'distribute-columns'}
    title={'Distribute columns'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DISTRIBUTE_COLUMNS)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.DISTRIBUTE_COLUMNS);
    }}
  />
);

const distributeRows = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'distributeRows'}
    dataHook={'distribute-rows'}
    title={'Distribute rows'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.DISTRIBUTE_ROWS)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.DISTRIBUTE_ROWS);
    }}
  />
);

const selectRows = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'selectRows'}
    dataHook={'distribute-rows'}
    title={'Select rows'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SELECT_ROWS)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.SELECT_ROWS);
    }}
  />
);

const selectCols = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'selectCols'}
    dataHook={'select-column'}
    title={'Select columns'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.SELECT_COLUMNS)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.SELECT_COLUMNS);
    }}
  />
);

const clear = (onOptionClick, onKeyDown) => (
  <ListItemSelect
    key={'Clear'}
    dataHook={'clear'}
    title={'Clear'}
    onClick={() => onOptionClick(TABLE_COMMANDS_KEYS.CLEAR)}
    onKeyDown={e => {
      onKeyDown(e, TABLE_COMMANDS_KEYS.CLEAR);
    }}
  />
);

const DROPDOWN_OPTIONS = {
  [CATEGORY.ROW]: (onOptionClick, onKeyDown) => [
    deleteRow(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    insertAbove(onOptionClick, onKeyDown),
    insertBelow(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider3'} type={'divider'} />,
    distributeCols(onOptionClick, onKeyDown),
  ],
  [CATEGORY.COLUMN]: (onOptionClick, onKeyDown) => [
    deleteCol(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    insertRight(onOptionClick, onKeyDown),
    insertLeft(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider3'} type={'divider'} />,
    distributeRows(onOptionClick, onKeyDown),
  ],
  [CATEGORY.ENTIRE_TABLE]: (onOptionClick, onKeyDown) => [
    deleteTable(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    insertAbove(onOptionClick, onKeyDown),
    insertBelow(onOptionClick, onKeyDown),
    insertRight(onOptionClick, onKeyDown),
    insertLeft(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider3'} type={'divider'} />,
    distributeRows(onOptionClick, onKeyDown),
    distributeCols(onOptionClick, onKeyDown),
  ],
  [CATEGORY.RANGE]: (onOptionClick, onKeyDown) => [
    split(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    distributeRows(onOptionClick, onKeyDown),
    distributeCols(onOptionClick, onKeyDown),
  ],
  [CATEGORY.ROW_RANGE]: (onOptionClick, onKeyDown) => [
    split(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    distributeRows(onOptionClick, onKeyDown),
  ],
  [CATEGORY.COLUMN_RANGE]: (onOptionClick, onKeyDown) => [
    split(onOptionClick, onKeyDown),
    <ListItemSection key={'divider1'} type={'divider'} />,
    merge(onOptionClick, onKeyDown),
    <ListItemSection key={'divider2'} type={'divider'} />,
    distributeCols(onOptionClick, onKeyDown),
  ],
  [CATEGORY.CELL_BORDER]: (onOptionClick, onKeyDown) => [
    <ListItemSection key={'divider1'} type={'divider'} />,
    selectRows(onOptionClick, onKeyDown),
    selectCols(onOptionClick, onKeyDown),
  ],
};

type Props = {
  getSelectedStyle: () => string;
  onClick: (data: { commandKey: string }) => void;
  closeModal: () => void;
  category: string;
};

const ContextPanel: React.FC<Props> = ({ onClick, closeModal, category }) => {
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
    clear(onOptionClick, onKeyDown),
    ...DROPDOWN_OPTIONS[category](onOptionClick, onKeyDown),
  ];

  return <DropdownModal options={DropdownOptions} />;
};

export default ContextPanel;
