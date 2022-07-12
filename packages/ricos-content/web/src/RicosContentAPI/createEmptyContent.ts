import type { RichContent } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { initializeMetadata } from '../converters/nodeUtils';

/**
 * Initializes an empty `RichContent` object
 * @param metadata Optional metadata params
 * @returns Empty `RichContent` object
 */
export const createEmptyContent: (
  metadata?: Parameters<typeof initializeMetadata>[0]
) => RichContent = metadata => ({
  nodes: [
    {
      type: Node_Type.PARAGRAPH,
      id: 'foo',
      nodes: [],
    },
  ],
  metadata: initializeMetadata(metadata),
});
