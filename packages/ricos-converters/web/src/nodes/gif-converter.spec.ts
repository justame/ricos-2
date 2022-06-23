import type { GifNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { gifConverter } from './gif-converter';

/* eslint-disable max-len */
describe('Gif converter', () => {
  const tiptapNode = {
    type: Node_Type.GIF,
    attrs: {
      height: 281,
      width: 500,
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.SMALL,
        },
        textWrap: true,
      },

      original: {
        gif: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy.gif',
        mp4: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy.mp4?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy.mp4',
        still:
          'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy_s.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy_s.gif',
      },
      downsized: {
        gif: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized.gif',
        mp4: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized-small.mp4?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized-small.mp4',
        still:
          'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized_s.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized_s.gif',
      },
      id: '22',
    },
  };

  const gifNode: GifNode = {
    type: Node_Type.GIF,
    id: '22',
    nodes: [],
    gifData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.SMALL,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      original: {
        gif: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy.gif',
        mp4: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy.mp4?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy.mp4',
        still:
          'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy_s.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy_s.gif',
      },
      downsized: {
        gif: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized.gif',
        mp4: 'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized-small.mp4?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized-small.mp4',
        still:
          'https://media1.giphy.com/media/Cn44PUsTVimwBAtIRx/giphy-downsized_s.gif?cid=558f2fbejldbq3cgzrasbh2j4z47w8nn51qcbjzc6dg7g7af&rid=giphy-downsized_s.gif',
      },
      height: 281,
      width: 500,
    },
  };

  /* eslint-enable max-len */
  it('should convert GifNode to TiptapNode', () => {
    const actual = gifConverter.toTiptap.convert(gifNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to GifNode', () => {
    const actual = gifConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(gifNode);
  });
});
