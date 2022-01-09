import { mkdirSync, readdirSync, writeFileSync, readFileSync } from 'fs';
import { LATEST_VERSION } from './consts';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const run = async () => {
  const GEN_DIR = 'generated/stringEnums';
  const GEN_DIR2 = 'generated/intEnums';
  const TS_PROTO_DIR = '../../../node_modules/.bin/protoc-gen-ts_proto';
  const PACKAGE_PATH = `wix/rich_content/v${LATEST_VERSION}`;

  const BLACK_LIST = ['ricos_theme.proto'];

  const GENERATED_FILE_PREFIX = `/**
* THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
* This is the version for usage outside of Wix.
* It is generated from the main/proto version by removing Wix specific features.
*/\n\n`;

  mkdirSync(`${GEN_DIR}/proto/${PACKAGE_PATH}`, { recursive: true });
  mkdirSync(`${GEN_DIR2}/proto/${PACKAGE_PATH}`, { recursive: true });

  const schemas = readdirSync(`./src/main/proto/${PACKAGE_PATH}`).filter(
    fileName => !BLACK_LIST.includes(fileName)
  );

  schemas.forEach(schema => {
    const schemaFile =
      GENERATED_FILE_PREFIX + readFileSync(`src/main/proto/${PACKAGE_PATH}/${schema}`, 'utf8');
    writeFileSync(
      `${GEN_DIR}/proto/${PACKAGE_PATH}/${schema}`,
      schemaFile
        .replace(/\s*\[.*wix.*\];/g, ';')
        .replace(/\s*option\s*\(wix\.api\.entity\)\s*=\s*\{.*\s*fqdn.*\s*.*\s*};/g, '')
        .replace('import "wix/api/entity.proto";\n', '')
        .replace('import "wix/api/validations.proto";\n', '')
    );
  });

  const e: Promise<string>[] = [];
  schemas.forEach(schema => {
    const s: Promise<string> = exec(
      // eslint-disable-next-line max-len
      `protoc --plugin=${TS_PROTO_DIR} --proto_path ${GEN_DIR}/proto --ts_proto_opt=useOptionals=true,outputEncodeMethods=false,constEnums=true,stringEnums=true,exportCommonSymbols=false,outputPartialMethods=false --ts_proto_out=${GEN_DIR} ${GEN_DIR}/proto/${PACKAGE_PATH}/${schema}`
    );
    const s2 = exec(
      // eslint-disable-next-line max-len
      `protoc --plugin=${TS_PROTO_DIR} --proto_path ${GEN_DIR}/proto --ts_proto_opt=useOptionals=true,outputEncodeMethods=false,constEnums=true,exportCommonSymbols=false,outputPartialMethods=false --ts_proto_out=${GEN_DIR2} ${GEN_DIR}/proto/${PACKAGE_PATH}/${schema}`
    );
    e.push(s, s2);
  });
  await Promise.all(e);

  const indexFile = schemas.reduce(
    (fileString, schema) => fileString + `export * from './${schema.replace('.proto', '')}';\n`,
    `export const LATEST_VERSION = ${LATEST_VERSION};\n`
  );

  writeFileSync(`${GEN_DIR}/${PACKAGE_PATH}/index.ts`, indexFile);
  writeFileSync(`${GEN_DIR2}/${PACKAGE_PATH}/index.ts`, indexFile);
};

run();
