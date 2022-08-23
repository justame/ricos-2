/* eslint-disable no-console */
const { exec } = require('node:child_process');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, '.watch-packages'))) {
  console.error(
    // eslint-disable-next-line max-len
    `Run the script from the root of the project and make sure you have the .watch-packages file that contains an array of packages to watch \n
    for example: ["tiptap-editor", "tiptap-extensions", "ricos-editor", "toolbars-v3"]`
  );
}

const packages = JSON.parse(fs.readFileSync(path.join(__dirname, '.watch-packages')).toString());
console.log('packages to watch:', packages);
packages.forEach(pkg => {
  const pkgPath = path.join(process.cwd(), 'packages', pkg, 'web');

  const child = exec(
    'yarn watch',
    {
      cwd: pkgPath,
    },
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(err);
      console.log(stderr);
    }
  );

  child.stdout.on('data', data => {
    console.log(`***** ${pkg} ***** \n ${data}`);
  });

  child.stderr.on('data', data => {
    console.error(`***** ${pkg} ***** \n ${data}`);
  });
});
