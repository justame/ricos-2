import type { AppEmbedNode } from 'ricos-content';
import { AppEmbedData_AppType, Node_Type } from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { appEmbedConverter } from './app-embed-converter';
/* eslint-disable max-len */
describe('appEmbed converter', () => {
  const tiptapNode = {
    type: Node_Type.APP_EMBED,
    attrs: {
      type: AppEmbedData_AppType.EVENT,
      itemId: '65129504-3bfc-44c8-90cc-f9eedfea9321',
      name: '2-week course of intensive physical research, with a sense of plenty of time for process and discovery. Rooted in Ohad N',
      imageSrc: 'https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg',
      url: 'https://www.wix.app/events/54e7b326-49ec-434f-a7cc-c2ad1eaec049/65129504-3bfc-44c8-90cc-f9eedfea9321/details?d=https://sapirs0.wixsite.com/mysite/event-details/2-week-course-of-intensive-physical-research-with-a-sense-of-plenty-of-time-for-process-and-discovery-rooted-in-ohad-n',
      image: {
        src: {
          url: 'https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg',
        },
      },
      eventData: {
        scheduling: '13 de octubre de 2020 19:00–27 de octubre de 2020 23:00 ',
        location: ' Suzanna Baby Shop',
      },
      id: '30',
    },
  };

  const appEmbedNode: AppEmbedNode = {
    type: Node_Type.APP_EMBED,
    id: '30',
    nodes: [],
    appEmbedData: {
      type: AppEmbedData_AppType.EVENT,
      itemId: '65129504-3bfc-44c8-90cc-f9eedfea9321',
      name: '2-week course of intensive physical research, with a sense of plenty of time for process and discovery. Rooted in Ohad N',
      imageSrc: 'https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg',
      url: 'https://www.wix.app/events/54e7b326-49ec-434f-a7cc-c2ad1eaec049/65129504-3bfc-44c8-90cc-f9eedfea9321/details?d=https://sapirs0.wixsite.com/mysite/event-details/2-week-course-of-intensive-physical-research-with-a-sense-of-plenty-of-time-for-process-and-discovery-rooted-in-ohad-n',
      image: {
        src: {
          url: 'https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg',
        },
      },
      eventData: {
        scheduling: '13 de octubre de 2020 19:00–27 de octubre de 2020 23:00 ',
        location: ' Suzanna Baby Shop',
      },
    },
  };
  /* eslint-enable max-len */
  it('should convert EmbedNode to TiptapNode', () => {
    const actual = appEmbedConverter.toTiptap.convert(appEmbedNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to EmbedNode', () => {
    const actual = appEmbedConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(appEmbedNode);
  });
});
