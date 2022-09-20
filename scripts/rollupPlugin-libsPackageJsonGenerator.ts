function writePackageJson(packagePath: string, filePath: string) {
  const fs = require('fs');
  fs.mkdirSync(packagePath, { recursive: true });
  fs.writeFile(
    packagePath + '/package.json',
    `{
    "main": "${filePath}.cjs.js",
    "module": "${filePath}.js",
    "types": "${filePath}.d.ts"
    }`,
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  );
}

function writeDynamicModuleViewerPackageJson() {
  const fs = require('fs');
  fs.mkdirSync('viewer', { recursive: true });
  fs.writeFile(
    'viewer/package.json',
    `{
      "main": "../dist/cjs/viewer.js",
      "module": "../dist/es/viewer.js",
      "types": "../dist/src/viewer.d.ts"
  }`,
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  );
}

function removeExtension(fileName: string) {
  return fileName.split('.').slice(0, -1).join('.');
}

export default function createLibsPackageJsons() {
  return {
    name: 'copy-and-watch',
    async writeBundle() {
      const fs = require('fs');
      if (fs.existsSync('lib')) {
        fs.readdirSync('lib').forEach(file => {
          const fileName = removeExtension(file);
          const path = 'libs/' + fileName;
          writePackageJson(path, `../../dist/lib/${fileName}`);
        });
      }
      if (fs.existsSync('src/viewer.ts')) {
        process.env.DYNAMIC_IMPORT
          ? writeDynamicModuleViewerPackageJson()
          : writePackageJson('viewer', '../dist/module.viewer');
      }
    },
  };
}
