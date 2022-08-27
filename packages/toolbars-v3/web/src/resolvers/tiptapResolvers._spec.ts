// import type { Node as TiptapNode } from 'prosemirror-model';
// import {
//   alwaysVisibleResolver,
//   isTextContainsBoldResolver,
//   isTextContainsItalicResolver,
//   isTextContainsUnderlineResolver,
//   isTextContainsQuoteResolver,
//   isTextContainsCodeblockResolver,
//   isTextContainsOrderedListResolver,
//   isTextContainsUnorderedListResolver,
//   isTextContainsSpoilerResolver,
// } from './tiptapResolvers';

// import { Node_Type, Decoration_Type } from 'ricos-schema';

// describe('tiptap resolvers', () => {
//   describe('alwaysVisibleResolver', () => {
//     it('should always return true', () => {
//       const mockContent = [{ type: Node_Type.PARAGRAPH }];
//       expect(alwaysVisibleResolver.resolve(mockContent as unknown as TiptapNode[])).toBe(true);
//     });
//   });

//   describe('isTextContainsBold', () => {
//     it('should return true if selected text is bold', () => {
//       const mockContentWithBold = [
//         {
//           type: { name: 'text' },
//           marks: [
//             {
//               type: { name: Decoration_Type.BOLD },
//               attrs: {
//                 fontWeightValue: 700,
//               },
//             },
//           ],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsBoldResolver.resolve(mockContentWithBold as unknown as TiptapNode[], {})
//       ).toBe(true);
//     });

//     it('should return false if selected text is not bold', () => {
//       const mockContentWithoutBold = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.UNDERLINE } }],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsBoldResolver.resolve(mockContentWithoutBold as unknown as TiptapNode[], {})
//       ).toBe(false);
//     });
//   });

//   describe('isTextContainsItalicResolver', () => {
//     it('should return true if selected text is italic', () => {
//       const mockContentWithItalic = [
//         {
//           type: { name: 'text' },
//           marks: [
//             {
//               type: { name: Decoration_Type.ITALIC },
//               attrs: {
//                 italicData: true,
//               },
//             },
//           ],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsItalicResolver.resolve(mockContentWithItalic as unknown as TiptapNode[], {})
//       ).toBe(true);
//     });

//     it('should return false if selected text is not italic', () => {
//       const mockContentWithoutItalic = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.BOLD } }],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsItalicResolver.resolve(
//           mockContentWithoutItalic as unknown as TiptapNode[],
//           {}
//         )
//       ).toBe(false);
//     });
//   });

//   describe('isTextContainsUnderlineResolver', () => {
//     it('should return true if selected text is underline', () => {
//       const mockContentWithUnderline = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.UNDERLINE } }],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsUnderlineResolver.resolve(mockContentWithUnderline as unknown as TiptapNode[])
//       ).toBe(true);
//     });

//     it('should return false if selected text is not underline', () => {
//       const mockContentWithoutUnderline = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.ITALIC } }],
//           text: 'World',
//         },
//       ];
//       expect(
//         isTextContainsUnderlineResolver.resolve(
//           mockContentWithoutUnderline as unknown as TiptapNode[]
//         )
//       ).toBe(false);
//     });
//   });

//   describe('isTextContainsQuoteResolver', () => {
//     it('should return true if selected text is quote', () => {
//       const mockContent = [{ type: { name: Node_Type.BLOCKQUOTE } }];
//       expect(isTextContainsQuoteResolver.resolve(mockContent as TiptapNode[])).toBe(true);
//     });

//     it('should return false if selected text is not quote', () => {
//       const mockContentWithoutGif = [{ type: { name: 'text' } }];
//       expect(isTextContainsQuoteResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
//         false
//       );
//     });
//   });

//   describe('isTextContainsCodeblockResolver', () => {
//     it('should return true if selected text is code block', () => {
//       const mockContent = [{ type: { name: Node_Type.CODE_BLOCK } }];
//       expect(isTextContainsCodeblockResolver.resolve(mockContent as TiptapNode[])).toBe(true);
//     });

//     it('should return false if selected text is not code block', () => {
//       const mockContentWithoutGif = [{ type: { name: 'text' } }];
//       expect(isTextContainsCodeblockResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
//         false
//       );
//     });
//   });

//   describe('isTextContainsOrderedListResolver', () => {
//     it('should return true if selected text is ordered list', () => {
//       const mockContent = [{ type: { name: Node_Type.ORDERED_LIST } }];
//       expect(isTextContainsOrderedListResolver.resolve(mockContent as TiptapNode[])).toBe(true);
//     });

//     it('should return false if selected text is not ordered list', () => {
//       const mockContentWithoutGif = [{ type: { name: 'text' } }];
//       expect(isTextContainsOrderedListResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
//         false
//       );
//     });
//   });

//   describe('isTextContainsUnorderedListResolver', () => {
//     it('should return true if selected text is unordered list', () => {
//       const mockContent = [{ type: { name: Node_Type.BULLETED_LIST } }];
//       expect(isTextContainsUnorderedListResolver.resolve(mockContent as TiptapNode[])).toBe(true);
//     });

//     it('should return false if selected text is not unordered list', () => {
//       const mockContentWithoutGif = [{ type: { name: 'text' } }];
//       expect(
//         isTextContainsUnorderedListResolver.resolve(mockContentWithoutGif as TiptapNode[])
//       ).toBe(false);
//     });
//   });

//   describe('isTextContainsSpoilerResolver', () => {
//     it('should return true if selected text is spoiler', () => {
//       const mockContent = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.SPOILER } }],
//           text: 'World',
//         },
//       ];
//       expect(isTextContainsSpoilerResolver.resolve(mockContent as unknown as TiptapNode[])).toBe(
//         true
//       );
//     });

//     it('should return false if selected text is not spoiler', () => {
//       const mockContent = [
//         {
//           type: { name: 'text' },
//           marks: [{ type: { name: Decoration_Type.ITALIC } }],
//           text: 'World',
//         },
//       ];
//       expect(isTextContainsSpoilerResolver.resolve(mockContent as unknown as TiptapNode[])).toBe(
//         false
//       );
//     });
//   });
// });
