import { GALLERY_LAYOUTS } from '../layout-data-provider';
import {
  GridIconNew,
  MasonryIconNew,
  CollageIconNew,
  ThumbnailsIconNew,
  SlideshowIconNew,
  PanoramaIconNew,
  SlidesIconNew,
  ColumnsIconNew,
} from '../icons';

export const galleryLayoutsData = [
  {
    text: 'GalleryPlugin_Layout_Grid',
    tooltip: 'GalleryPlugin_Layout_Grid',
    commandKey: GALLERY_LAYOUTS.GRID,
    icon: GridIconNew,
    dataHook: 'GalleryPlugin_Layout_Grid',
  },
  {
    text: 'GalleryPlugin_Layout_Masonry',
    tooltip: 'GalleryPlugin_Layout_Masonry',
    commandKey: GALLERY_LAYOUTS.MASONRY,
    dataHook: 'GalleryPlugin_Layout_Masonry',
    icon: MasonryIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.COLLAGE,
    text: 'GalleryPlugin_Layout_Collage',
    tooltip: 'GalleryPlugin_Layout_Collage',
    dataHook: 'GalleryPlugin_Layout_Collage',
    icon: CollageIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.THUMBNAIL,
    text: 'GalleryPlugin_Layout_Thumbnails',
    tooltip: 'GalleryPlugin_Layout_Thumbnails',
    dataHook: 'GalleryPlugin_Layout_Thumbnails',
    icon: ThumbnailsIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.FULLSIZE,
    text: 'GalleryPlugin_Layout_Slideshow',
    tooltip: 'GalleryPlugin_Layout_Slideshow',
    dataHook: 'GalleryPlugin_Layout_Slideshow',
    icon: SlideshowIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.PANORAMA,
    text: 'GalleryPlugin_Layout_Panorama',
    tooltip: 'GalleryPlugin_Layout_Panorama',
    dataHook: 'GalleryPlugin_Layout_Panorama',
    icon: PanoramaIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.COLUMN,
    text: 'GalleryPlugin_Layout_Columns',
    tooltip: 'GalleryPlugin_Layout_Columns',
    dataHook: 'GalleryPlugin_Layout_Columns',
    icon: ColumnsIconNew,
  },
  {
    commandKey: GALLERY_LAYOUTS.SLIDER,
    text: 'GalleryPlugin_Layout_Slides',
    tooltip: 'GalleryPlugin_Layout_Slides',
    dataHook: 'GalleryPlugin_Layout_Slides',
    icon: SlidesIconNew,
  },
];
