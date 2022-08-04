import { Node_Type } from 'ricos-schema';
import type { Node } from 'ricos-schema';
import type { AnchorableBlock, TypesWithIndices, AnchorableBlockWithThumbnail } from './types';
import {
  Anchorable_Blocks_Types,
  headersMapper,
  textNodesMapper,
  atomicNodesMapper,
  isAnchorableAtomicPluginNode,
  isAnchorableTextNode,
  isThumbnailNode,
} from './helpers';

const mapTextNodeType = (node: Node): AnchorableBlock['type'] => {
  const { type } = node;

  if (node.headingData) {
    const headingLevel = node.headingData?.level;

    return headersMapper[headingLevel];
  } else {
    return textNodesMapper[type];
  }
};

const getAnchorType = (node: Node): AnchorableBlock['anchorType'] => {
  const { type } = node;
  return { ...atomicNodesMapper, ...textNodesMapper }[type];
};

const mapTypesAndIndices = (block: AnchorableBlock, typesWithIndices: TypesWithIndices) => {
  if (!typesWithIndices[block.anchorType]) {
    typesWithIndices[block.anchorType] = 1;
  } else {
    (typesWithIndices[block.anchorType] as number)++;
  }
  block.index = typesWithIndices[block.anchorType] as number;
};

const getType = (node: Node): AnchorableBlock['type'] => {
  if (isAnchorableAtomicPluginNode(node)) {
    return Anchorable_Blocks_Types.ATOMIC;
  } else {
    return mapTextNodeType(node);
  }
};

const getData = (node: Node): AnchorableBlockWithThumbnail['data'] | undefined => {
  if (node.type === Node_Type.IMAGE) {
    const file_name = node.imageData?.image?.src?.id;
    if (file_name) {
      return {
        src: {
          file_name,
        },
      };
    }
  }

  if (node.type === Node_Type.GALLERY) {
    const url = node.galleryData?.items[0].image?.media?.src?.url;
    if (url) {
      return {
        items: [{ url }],
      };
    }
  }

  if (node.type === Node_Type.GIF) {
    const downsizedUrl = node.gifData?.downsized?.gif;
    if (downsizedUrl) {
      return {
        gif: { downsizedUrl },
      };
    }
  }

  if (node.type === Node_Type.VIDEO) {
    const thumbnail = node.videoData?.thumbnail?.src?.id;
    const src = node.videoData?.video?.src?.url;

    if (thumbnail) {
      return {
        src: { thumbnail: { pathname: thumbnail } },
      };
    } else if (src) {
      return {
        src,
      };
    }
  }
};

export const getAnchorableBlocksFromAnchorableNodes = (
  anchorableNodes: Node[]
): {
  anchorableBlocks: AnchorableBlock[];
  pluginsIncluded: Partial<AnchorableBlock['anchorType']>[];
} => {
  const anchorableBlocks: AnchorableBlock[] = anchorableNodes.map((node: Node) => {
    const key = node.id;
    const type = getType(node);
    const anchorType = getAnchorType(node);

    let text;
    if (isAnchorableTextNode(node)) {
      text = node.nodes[0].textData?.text;
    }

    let data;
    if (isThumbnailNode(node)) {
      data = getData(node);
    }

    const newNode: AnchorableBlock = {
      key,
      type,
      anchorType,
      ...(text && { text }),
      ...(data && { data }),
    };

    // blockPreview api - block.data

    return newNode;
  });

  const typesWithIndices: TypesWithIndices = {};
  anchorableBlocks.forEach(block => mapTypesAndIndices(block, typesWithIndices));
  return {
    anchorableBlocks,
    pluginsIncluded: Object.keys(typesWithIndices) as Partial<AnchorableBlock['anchorType']>[],
  };
};
