import type { FileNode } from 'ricos-content';
import {
  FileData_PDFSettings_ViewMode,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { fileUploadConverter } from './file-upload-converter';

describe('file converter', () => {
  const tiptapNode = {
    type: Node_Type.FILE,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      src: {
        url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        private: false,
      },
      name: 'document.pdf',
      type: 'pdf',
      size: 150000,
      pdfSettings: {
        viewMode: FileData_PDFSettings_ViewMode.FULL,
        disableDownload: false,
        disablePrint: false,
      },
      id: '26',
    },
  };

  const fileNode: FileNode = {
    type: Node_Type.FILE,
    id: '26',
    nodes: [],
    fileData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      src: {
        url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        private: false,
      },
      name: 'document.pdf',
      type: 'pdf',
      size: 150000,
      pdfSettings: {
        viewMode: FileData_PDFSettings_ViewMode.FULL,
        disableDownload: false,
        disablePrint: false,
      },
    },
  };

  it('should convert EmbedNode to TiptapNode', () => {
    const actual = fileUploadConverter.toTiptap.convert(fileNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to EmbedNode', () => {
    const actual = fileUploadConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(fileNode);
  });
});
