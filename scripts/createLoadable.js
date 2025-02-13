/* eslint-disable no-console */

const inquirer = require('inquirer');

const fs = require('fs');
const CURR_DIR = process.cwd();
const chalk = require('chalk');
const loadablePackageJson = `{
  "main": "../../dist/loadable/viewer/cjs/viewer-loadable.js",
  "module": "../../dist/loadable/viewer/es/viewer-loadable.js",
  "types": "../../dist/src/viewer-loadable.d.ts"
}`;

const QUESTIONS = [
  {
    name: 'pluginName',
    type: 'input',
    message: 'Enter Plugin name:',
    validate(input) {
      //hashtag, hash-tag, hash1-tag, hash-1-tag, hash-tag-1, hash-tag1
      if (/^[a-z]+[\d]*([-]{1}[a-z\d]+)*$/.test(input)) return true;
      else {
        // eslint-disable-next-line max-len
        return `Plugin name may only include lower letters.`;
      }
    },
  },
];

inquirer.prompt(QUESTIONS).then(answers => {
  const { pluginName } = answers;
  console.log(chalk.yellow(`Add loadable support to plugin-${pluginName} 🤸‍♂`));
  const pluginPackagePath = `packages/plugin-${pluginName}/web`;
  createDirectoryContents(pluginPackagePath);
  addLoadableToFilesArr(pluginPackagePath);
});

function createDirectoryContents(pluginPackagePath) {
  fs.mkdirSync(`${CURR_DIR}/${pluginPackagePath}/loadable`);
  fs.mkdirSync(`${CURR_DIR}/${pluginPackagePath}/loadable/viewer`);

  console.log(chalk.cyan(`Creating package.json loadable file`));
  fs.writeFileSync(
    `${CURR_DIR}/${pluginPackagePath}/loadable/viewer/package.json`,
    loadablePackageJson,
    'utf8'
  );

  console.log(chalk.cyan(`Creating viewer-loadable file`));
  const viewerContents = fs.readFileSync(`${pluginPackagePath}/src/viewer.ts`, 'utf8');
  const viewerLoadableContents = viewerContents.replace(
    // eslint-disable-next-line max-len
    /'\.\/typeMapper'/g,
    // eslint-disable-next-line quotes
    () => "'./typeMapper-loadable'"
  );
  fs.writeFileSync(`${pluginPackagePath}/src/viewer-loadable.ts`, viewerLoadableContents, 'utf8');

  console.log(chalk.cyan(`Creating typeMapper-loadable file`));
  const typeMapperContents = fs.readFileSync(`${pluginPackagePath}/src/typeMapper.ts`, 'utf8');
  const componentPath = typeMapperContents
    .match(/import [a-z| A-Z | -]*[v | V]iewer from '.\/[a-z| A-Z | -]*[v|V]iewer'/)[0]
    .match(/'.\/[a-z| A-Z | -]*[v|V]iewer'/)[0];

  const typeMapperLoadableContents = typeMapperContents
    .replace(
      // eslint-disable-next-line max-len
      /import [a-z| A-Z | -]*[v | V]iewer from '.\/[a-z| A-Z | -]*[v|V]iewer'/g,
      // eslint-disable-next-line quotes
      () => "import loadable from '@loadable/component'"
    )
    .replace(/component: [a-z | A-Z | -]*.*/g, text =>
      text.replace(
        /component: [a-z | A-Z | -]*/g,
        () => `component: loadable(() => import(${componentPath}))`
      )
    );
  fs.writeFileSync(
    `${pluginPackagePath}/src/typeMapper-loadable.ts`,
    typeMapperLoadableContents,
    'utf8'
  );
}

function addLoadableToFilesArr(path) {
  console.log(chalk.yellow(`Adding loadable to package.json files array`));
  const filePath = `${path}/package.json`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(chalk.red('Fail to read package.json', path, err));
    } else {
      const packageJsonObj = JSON.parse(data);
      packageJsonObj.files.push('loadable');
      const packageJson = JSON.stringify(packageJsonObj, null, 2);
      fs.writeFile(filePath, packageJson, 'utf8', () => {
        console.log(chalk.bold.green(`loadable entry added successfully to package.json 🎉🎊🎉🎊`));
      });
    }
  });
}
