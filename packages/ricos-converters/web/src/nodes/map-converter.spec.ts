import type { MapNode } from 'ricos-content';
import {
  MapType,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { mapConverter } from './map-converter';

describe('Map converter', () => {
  const tiptapNode = {
    type: Node_Type.MAP,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '286',
        },
        height: {
          custom: '271',
        },
        textWrap: true,
      },
      mapSettings: {
        mapType: MapType.ROADMAP,
        address: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
        draggable: true,
        marker: true,
        streetViewControl: false,
        zoomControl: false,
        lat: 32.097235,
        lng: 34.77427,
        locationName: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
        initialZoom: 18,
      },
      id: '24',
    },
  };

  const mapNode: MapNode = {
    type: Node_Type.MAP,
    id: '24',
    nodes: [],
    mapData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '286',
        },
        alignment: PluginContainerData_Alignment.CENTER,
        height: {
          custom: '271',
        },
        textWrap: true,
      },
      mapSettings: {
        address: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
        draggable: true,
        marker: true,
        streetViewControl: false,
        zoomControl: false,
        lat: 32.097235,
        lng: 34.77427,
        locationName: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
        initialZoom: 18,
        mapType: MapType.ROADMAP,
      },
    },
  };

  it('should convert MapNode to TiptapNode', () => {
    const actual = mapConverter.toTiptap.convert(mapNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to MapNode', () => {
    const actual = mapConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(mapNode);
  });
});
