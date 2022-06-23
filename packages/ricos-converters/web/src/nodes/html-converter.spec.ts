import type { HtmlNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { htmlConverter } from './html-converter';

/* eslint-disable max-len */
describe('Html converter', () => {
  const tiptapNode = {
    type: Node_Type.HTML,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '350',
        },
        height: {
          custom: '490',
        },
        textWrap: true,
      },
      url: 'https://twitter.com/WixEng/status/1348206215336259584?ref_src=twsrc%5Etfw',
      html: `<blockquote class='twitter-tweet'><p lang='en' dir='ltr'>How we cut cost on 55% of our storage without deleting a single file? We understood that NOT all files should be treated equally. <br><br>Here’s the full story:<a href='https://t.co/zC3d0uBkEA'>https://t.co/zC3d0uBkEA</a> <a href='https://t.co/j8ND7GfOEg'>pic.twitter.com/j8ND7GfOEg</a></p>&mdash; Wix Engineering (@WixEng) <a href='https://twitter.com/WixEng/status/1348206215336259584?ref_src=twsrc%5Etfw'>January 10, 2021</a></blockquote> <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>`,
      id: '10',
    },
  };

  const htmlNode: HtmlNode = {
    type: Node_Type.HTML,
    id: '10',
    nodes: [],
    htmlData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '350',
        },
        alignment: PluginContainerData_Alignment.CENTER,
        height: {
          custom: '490',
        },
        textWrap: true,
      },
      url: 'https://twitter.com/WixEng/status/1348206215336259584?ref_src=twsrc%5Etfw',
      html: `<blockquote class='twitter-tweet'><p lang='en' dir='ltr'>How we cut cost on 55% of our storage without deleting a single file? We understood that NOT all files should be treated equally. <br><br>Here’s the full story:<a href='https://t.co/zC3d0uBkEA'>https://t.co/zC3d0uBkEA</a> <a href='https://t.co/j8ND7GfOEg'>pic.twitter.com/j8ND7GfOEg</a></p>&mdash; Wix Engineering (@WixEng) <a href='https://twitter.com/WixEng/status/1348206215336259584?ref_src=twsrc%5Etfw'>January 10, 2021</a></blockquote> <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>`,
    },
  };
  /* eslint-enable max-len */
  it('should convert HtmlNode to TiptapNode', () => {
    const actual = htmlConverter.toTiptap.convert(htmlNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to HtmlNode', () => {
    const actual = htmlConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(htmlNode);
  });
});
