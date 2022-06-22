import { Decoration_Type, Node_Type } from 'ricos-schema';
import * as A from 'fp-ts/Array';
import { flow, identity, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { extract } from './extract';
import tiptapContent from './__tests__/migrationContentTiptap.json';

describe('JSONContent extract', () => {
  it('should extract all node types from content', () => {
    const actual = pipe(
      extract(tiptapContent)
        .map(({ type }) => type)
        .get(),
      A.uniq(S.Eq)
    );
    const expected = [
      'doc',
      Node_Type.PARAGRAPH,
      'text',
      Node_Type.IMAGE,
      Node_Type.VIDEO,
      Node_Type.GALLERY,
      Node_Type.HTML,
      Node_Type.EMBED,
      'LINK_BUTTON',
      'ACTION_BUTTON',
      Node_Type.DIVIDER,
      Node_Type.CODE_BLOCK,
      Node_Type.GIF,
      Node_Type.MAP,
      Node_Type.FILE,
      Node_Type.APP_EMBED,
      Node_Type.LINK_PREVIEW,
      Node_Type.POLL,
      Node_Type.BLOCKQUOTE,
      Node_Type.ORDERED_LIST,
      Node_Type.LIST_ITEM,
      Node_Type.BULLETED_LIST,
      Node_Type.HEADING,
      Node_Type.COLLAPSIBLE_LIST,
      Node_Type.COLLAPSIBLE_ITEM,
      Node_Type.COLLAPSIBLE_ITEM_TITLE,
      Node_Type.COLLAPSIBLE_ITEM_BODY,
      Node_Type.TABLE,
      Node_Type.TABLE_ROW,
      Node_Type.TABLE_CELL,
      Node_Type.AUDIO,
    ];
    expect(actual).toEqual(expected);
  });

  it('should extract all mark types from content', () => {
    const actual = pipe(
      extract(tiptapContent)
        .map(
          flow(
            ({ marks }) => marks || [],
            A.map(({ type }) => type)
          )
        )
        .get(),
      A.chain(identity),
      A.uniq(S.Eq)
    );
    const expected = [
      Decoration_Type.BOLD,
      Decoration_Type.FONT_SIZE,
      Decoration_Type.UNDERLINE,
      Decoration_Type.ITALIC,
      Decoration_Type.LINK,
      Decoration_Type.SPOILER,
      Decoration_Type.MENTION,
      Decoration_Type.COLOR,
      Decoration_Type.ANCHOR,
    ];
    expect(actual).toEqual(expected);
  });
});
