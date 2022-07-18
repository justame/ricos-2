import { UnsupportedBlock as Component } from './component';
import type { DOMOutputSpec, RicosNodeExtension } from 'ricos-types';
import { firstRight } from 'wix-rich-content-common';
import { isObject } from 'lodash';

const getDefaultValue = (value: unknown) =>
  firstRight(value, value, [
    [v => typeof v === 'number', () => 0],
    [v => typeof v === 'string', () => ''],
    [v => typeof v === 'boolean', () => false],
    [v => Array.isArray(v), () => []],
    [v => isObject(v), v => toGlobalAttributes(v as Record<string, unknown>)],
  ]);

const toGlobalAttributes = (attrs: Record<string, unknown>): Record<string, unknown> =>
  Object.keys(attrs).reduce(
    (globalAttributes, key) => ({
      ...globalAttributes,
      [key]: { default: getDefaultValue(attrs[key]) },
    }),
    {}
  );

export const getUnsupportedNodeConfig = ({ unsupportedNodeType, ...attrs }): RicosNodeExtension => {
  return {
    type: 'node' as const,
    groups: ['react'],
    Component,
    name: unsupportedNodeType,
    createExtensionConfig: ({ mergeAttributes }) => ({
      name: unsupportedNodeType,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },

      addGlobalAttributes: () => [
        {
          types: [unsupportedNodeType],
          attributes: toGlobalAttributes(attrs),
        },
      ],
      content: 'block*',
      group: 'block',
      selectable: false,
      draggable: false,
      marks: '_',
      atom: true,
      allowGapCursor: false,

      parseHTML() {
        return [{ tag: unsupportedNodeType }];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          unsupportedNodeType,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as DOMOutputSpec;
      },
    }),
  };
};
