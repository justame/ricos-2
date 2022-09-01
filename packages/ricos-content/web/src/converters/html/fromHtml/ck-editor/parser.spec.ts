import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import type { RichContent } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import parse from './parser';
import { tap } from '../../../../fp-utils';
import { toDraft } from '../../../draft/toDraft/toDraft';
import { extract } from '../../../../RicosContentAPI/extract';
import type { DraftContent } from '../../../../types/contentTypes';

const loadFile = (filename: string) =>
  readFileSync(`${__dirname}/../__tests__/${filename}`, 'utf8');
const _writeFile = (fileName: string) =>
  tap((data: RichContent | DraftContent) => writeFileSync(fileName, JSON.stringify(data), 'utf8'));
const _appendFile = (fileName: string) =>
  tap((data: string) => appendFileSync(fileName, data, 'utf8'));

describe('CKEditor parser', () => {
  const html = loadFile('FAQContent.html');
  const content = parse(html);
  it('iframe => video with youtube url', async () => {
    const videos = extract(content.nodes)
      .filter(({ type }) => type === Node_Type.VIDEO)
      .get();
    expect(videos.length).toEqual(1);
    expect(videos[0].videoData?.video?.src?.url).toEqual(
      'https://www.youtube.com/watch?v=4meDcOLeWSs'
    );
  });

  it('iframe => video with vimeo url', async () => {
    // eslint-disable-next-line max-len
    const answer = `<p class="align-center font_8"><div id='innerContainer_oz4w1zch'><div id="innercomp_oz4w1zch" class="container-video s59" style="height: 263px;width: 475px;position: static;margin-top: 10px;margin-bottom: 10px;display: block;clear: both;float: none;border: 0px;min-width: 240px;min-height: 180px;"><div id="innercomp_oz4w1zchvideoFrame" class="container-video s59videoFrame"><iframe width="100%" height="100%" allow="fullscreen  accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" src="https://player.vimeo.com/video/391866790?badge=0"></iframe></div></div></div></p><br /><br /><p class="font_8"><br /><p class="font_8"> </p><br /></p><br />`;
    const actual = parse(answer);
    const videos = extract(actual.nodes)
      .filter(({ type }) => type === Node_Type.VIDEO)
      .get();
    expect(videos.length).toEqual(1);
    expect(videos[0].videoData?.video?.src?.url).toEqual(
      'https://player.vimeo.com/video/391866790?badge=0'
    );
  });

  it('<a><img></a> => image with link', async () => {
    const images = extract(content.nodes)
      .filter(({ type }) => type === Node_Type.IMAGE)
      .get();
    expect(images.length).toEqual(5);
    expect(images[0].imageData?.image?.src?.url).toEqual(
      'https://static.wixstatic.com/media/23a20f14fc6d489d91b14aaa3033cd30.jpg'
    );
    expect(images[0].imageData?.link?.url).toEqual('javascript:void(0)'); // eslint-disable-line no-script-url
    expect(images[0].imageData?.link?.customData).toEqual(
      JSON.stringify({ type: 'pageLink', id: 'eihsd' })
    );
  });

  it('should output valid content for toDraft', () => {
    const failedContent = pipe(
      // 'crashes.json',
      'migration-failures.json',
      loadFile,
      JSON.parse,
      // a => [a[7]],
      A.map((item: string) =>
        E.tryCatch(
          () =>
            pipe(
              item,
              parse,
              /* _writeFile('faq-rich.json'),  */ toDraft /* ,_writeFile('faq-draft.json'), */
            ),
          () => _appendFile('invalid_parse.json')(`"${item}",\n`)
        )
      )
    );
    expect(failedContent.length).toEqual(173);
  });
});
