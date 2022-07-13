import type { Node } from 'ricos-schema';
import {
  DividerData_Alignment,
  DividerData_LineStyle,
  DividerData_Width,
  Node_Type,
} from 'ricos-schema';
import { createEmptyContent } from '../RicosContentAPI/createEmptyContent';
import { createBuilder } from './builder';

const mockParagraphNode: Node = {
  id: '1',
  type: Node_Type.PARAGRAPH,
  nodes: [
    { id: '', nodes: [], type: Node_Type.TEXT, textData: { text: 'hello', decorations: [] } },
  ],
};

const mockDividerNode: Node = {
  id: '2',
  type: Node_Type.DIVIDER,
  nodes: [],
  dividerData: {
    width: DividerData_Width.LARGE,
    lineStyle: DividerData_LineStyle.DASHED,
    alignment: DividerData_Alignment.CENTER,
  },
};

const mockImageNode: Node = {
  id: '3',
  type: Node_Type.IMAGE,
  nodes: [],
  imageData: { image: { src: { url: 'www.some-web.com' } } },
};

describe('Builder', () => {
  const emptyContent = { nodes: [], metadata: { version: 1 } };
  let builder = createBuilder(emptyContent);

  it('should get content', () => {
    const content = builder.render();
    expect(content).toStrictEqual(emptyContent);
  });

  it('should append nodes', () => {
    builder = builder.append(mockParagraphNode);
    const content = builder.render();
    expect(content.nodes).toStrictEqual([mockParagraphNode]);
  });

  it('should insertBefore', () => {
    builder = builder.insertBefore('1', mockDividerNode);
    const content = builder.render();
    expect(content.nodes).toStrictEqual([mockDividerNode, mockParagraphNode]);
  });

  it('should insertAfter', () => {
    builder = builder.insertAfter('2', mockImageNode);
    const content = builder.render();
    expect(content.nodes).toStrictEqual([mockDividerNode, mockImageNode, mockParagraphNode]);
  });

  it('should append on existing content', () => {
    builder = builder.append(mockImageNode);
    const content = builder.render();
    expect(content.nodes).toStrictEqual([
      mockDividerNode,
      mockImageNode,
      mockParagraphNode,
      mockImageNode,
    ]);
  });
});
