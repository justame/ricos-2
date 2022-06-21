import type { MarkType, Schema, Node } from 'prosemirror-model';
import { getMarkRange, getMarkType } from '@tiptap/core';
import type { Range, SingleCommands } from '@tiptap/core';
import type { Selection } from 'prosemirror-state';

const getActiveType = (
  typeNames: string[],
  schema: Schema,
  selection: Selection
): MarkType | undefined => {
  const types = typeNames.map(typeName => getMarkType(typeName, schema));

  const type = types.find(type => {
    return getSelectedMarkByType(selection, type);
  });
  return type;
};

const getSelectedMarkByType = (selection: Selection, type: MarkType) => {
  const { $from } = selection;
  const mark = $from.marks().find(mark => mark.type === type);
  return mark;
};

export const getSelectedMarkRangeByTypeNames = (
  typeNames: string[],
  schema: Schema,
  selection: Selection
): Range => {
  const { $from, from, to } = selection;

  const type = getActiveType(typeNames, schema, selection);

  if (!type) return { from, to };

  const attrs = getSelectedMarkByType(selection, type)?.attrs;
  return getMarkRange($from, type, attrs) || { from, to };
};

const isMarkInSelection = (mark: string, selection: Selection, doc: Node): boolean => {
  const { from, to } = selection;
  const marks: string[] = [];

  doc.nodesBetween(from, to, node => {
    node.marks.forEach(({ type: { name } }) => {
      marks.push(name);
    });
  });
  return marks.includes(mark);
};

export const cleanAndSetSelection = (
  extensionName: string,
  extensionNameToRemove: string,
  unsetCommand: () => void,
  schema: Schema,
  selection: Selection,
  doc: Node,
  commands: SingleCommands
) => {
  const { from, to } = getSelectedMarkRangeByTypeNames(
    [extensionName, extensionNameToRemove],
    schema,
    selection
  );

  isMarkInSelection(extensionNameToRemove, selection, doc) && unsetCommand();

  commands.setTextSelection({ from, to });
};
