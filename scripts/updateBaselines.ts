/* eslint-disable no-console */
import path from 'path';
import chalk from 'chalk';
import { writeFileSync, readFileSync } from 'fs';
import { fromDraft } from '../packages/ricos-content/web/src/converters/draft';
import { fromPlainText, toPlainText } from '../packages/ricos-content/web/src/converters/plainText';
import { fromRichTextHtml, toHtml } from '../packages/ricos-content/web/src/converters/html';
import { toTranslatables } from '../packages/ricos-content/web/src/TranslatableAPI/extract/toTranslatables';
import { toTiptap } from '../packages/ricos-converters/web/src';
import migrationContent from '../e2e/tests/fixtures/migration-content.json';
import { RichContent } from 'ricos-schema';

const prettifyJSON = obj => JSON.stringify(obj, (_, val) => val, 2);

const stringifyBaseline = obj => {
  let i = 0;
  const normalizeKeys = obj => {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries<any>(obj).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        // Override id for nodes only
        // val.nodes - ricos schema
        // key === 'attrs' - tiptap schema
        if (val.id && (val.nodes || key === 'attrs')) {
          val.id = `${i++}`;
        }
        normalizeKeys(val);
      }
      if (key === 'createdTimestamp' || key === 'updatedTimestamp') {
        obj[key] = '2021-07-15T07:42:30.023Z';
      }
    });
  };
  normalizeKeys(obj);
  return prettifyJSON(obj);
};

const writeBaseLine = (path, obj) => writeFileSync(path, stringifyBaseline(obj));

const getAbsPath = (relPath: string) => path.resolve(__dirname, relPath);

const HTML_CONTENT = readFileSync(
  getAbsPath(
    '../packages/ricos-content/web/src/converters/html/fromHtml/__tests__/richTextHtml.html'
  ),
  'utf8'
);

const RICH_CONTENT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/statics/json/migratedFixtures/migration-content.json'
);
const TO_PLAIN_TEXT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/plainText/toPlainText/complexPlainText.ts'
);
const FROM_PLAIN_TEXT_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/plainText/fromPlainText/plainTextContent.json'
);
const TO_HTML_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/html/toHtml/__tests__/complexContentHtml.html'
);
const FROM_HTML_BASELINE = getAbsPath(
  '../packages/ricos-content/web/src/converters/html/fromHtml/__tests__/richTextContent.json'
);
const TIPTAP_BASELINE = getAbsPath(
  '../packages/tiptap-extensions/web/src/content-utils/__tests__/migrationContentTiptap.json'
);
const TRANSLATABLES_BASELINE = getAbsPath(
  '../packages/ricos-content/web/__tests__/translatablesMock.json'
);

enum Target {
  RICOS = 'ricos',
  TEXT = 'text',
  HTML = 'html',
  TIPTAP = 'tiptap',
  LEGACY_TIPTAP = 'legacyTiptap',
}

const convertToRichContent = async () => {
  console.log('Converting to ' + chalk.green('rich content') + '...');
  const richContentJSON = RichContent.toJSON(richContent);
  writeBaseLine(RICH_CONTENT_BASELINE, richContentJSON);
  console.log('Saved rich content baseline 💰\n');
};

const convertHtml = async () => {
  console.log('Converting to/from ' + chalk.green('HTML') + '...');
  convertToHtml();
  convertFromHtml();
  console.log('Saved HTML baseline 🌎\n');
};

const convertToHtml = () => {
  const html = toHtml(richContent);
  writeFileSync(TO_HTML_BASELINE, html);
};

const convertFromHtml = () => {
  const content = fromRichTextHtml(HTML_CONTENT);
  const contentJSON = RichContent.toJSON(content);
  writeBaseLine(FROM_HTML_BASELINE, contentJSON);
};

const convertPlainText = async () => {
  console.log('Converting to/from ' + chalk.green('plain text') + '...');
  await convertToPlainText();
  convertFromPlainText();
  console.log('Saved to/from plain text baselines 📃\n');
};

const convertToPlainText = async () => {
  const plainTextBaseline = (text: string) =>
    '/* eslint-disable max-len */\nexport const PLAIN_TEXT = `' + text + '`;\n';

  const plainText = await toPlainText(richContent);
  writeFileSync(TO_PLAIN_TEXT_BASELINE, plainTextBaseline(plainText));
};

const convertFromPlainText = () => {
  const { PLAIN_TEXT } = require(TO_PLAIN_TEXT_BASELINE);
  const content = fromPlainText(PLAIN_TEXT);
  const contentJSON = RichContent.toJSON(content);
  writeBaseLine(FROM_PLAIN_TEXT_BASELINE, contentJSON);
};

const convertToTiptap = async () => {
  console.log('Converting to ' + chalk.green('tiptap') + '...');
  const tiptap = toTiptap(richContent);
  writeBaseLine(TIPTAP_BASELINE, tiptap);
  console.log('Saved tiptap baseline ⚪️\n');
};

const updateTranslatables = async () => {
  console.log(`Updating ${chalk.green('translatables')}...`);
  const content = require(RICH_CONTENT_BASELINE);
  const translatables = toTranslatables(content);
  writeFileSync(TRANSLATABLES_BASELINE, prettifyJSON(translatables));
  console.log('Saved translatables baseline 🗣\n');
};

const target = process.argv[2]?.toLowerCase();
const richContent = fromDraft(migrationContent);

const updateTasks: Promise<void>[] = [];
switch (target) {
  case Target.RICOS:
    updateTasks.push(convertToRichContent());
    break;
  case Target.HTML:
    updateTasks.push(convertHtml());
    break;
  case Target.TIPTAP:
    updateTasks.push(convertToTiptap());
    break;
  case Target.TEXT:
    updateTasks.push(convertPlainText());
    break;
  case undefined:
    updateTasks.push(
      convertToRichContent(),
      convertHtml(),
      convertToTiptap(),
      convertPlainText(),
      updateTranslatables()
    );
    break;
  default:
    console.error(chalk.red(`Target "${target}" should be one of ${Object.values(Target)}`));
}

if (updateTasks.length > 0) {
  Promise.all(updateTasks).then(() => {
    console.warn(
      chalk.yellow('Please make sure all changes to baselines are required before comitting\n')
    );
  });
}
