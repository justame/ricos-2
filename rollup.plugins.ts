import { resolve as pathResolve } from 'path';
import svgr from '@svgr/rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import aliasPlugin from '@rollup/plugin-alias';
import copyPlugin from 'rollup-plugin-copy';
/* @ts-ignore typescript-plugin external types issue */
import babelPlugin from '@rollup/plugin-babel';
import typescriptPlugin from 'rollup-plugin-typescript2';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import postcssPlugin from 'rollup-plugin-postcss';
/* @ts-ignore typescript-plugin external types issue */
import postcssExclude from 'postcss-exclude-files';
import postcssURL from 'postcss-url';
/* @ts-ignore typescript-plugin external types issue */
import postcssRTL from 'postcss-rtl';
import replacePlugin from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import visualizerPlugin from 'rollup-plugin-visualizer';
import type { Plugin } from 'rollup';
import libsPackageJsonGeneratorPlugin from './scripts/rollupPlugin-libsPackageJsonGenerator';
import { writeFileSync, readdirSync, existsSync, readFileSync } from 'fs';
import { createFilter } from '@rollup/pluginutils';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const IS_DEV_ENV = process.env.NODE_ENV === 'development';
const editorExtractedStylePath = 'dist/styles.min.global.css';
const getExtractedCssPath = entry => `dist/styles.${entry}.min.global.css`;

const resolve = (): Plugin => {
  return resolvePlugin({
    preferBuiltins: true,
    extensions: ['.js', '.jsx', '.json'],
  });
};

const resolveAlias = (): Plugin => {
  return aliasPlugin({
    entries: {
      'draft-js': '@wix/draft-js',
    },
  });
};

const copy = (): Plugin => {
  // copyPlugin has a bug with copying folder in writeBundle stage. So it's split up from copyAfterBundleWritten()
  const targets = [{ src: 'statics', dest: 'dist' }];
  return copyPlugin({
    targets,
    copyOnce: true,
  });
};

const copyAfterBundleWritten = (): Plugin => {
  const targets = [
    // create viewer entry point declaration files
    {
      src: 'dist/src/viewer.d.ts',
      dest: 'dist',
      rename: () => 'module.viewer.d.ts',
      transform: () => "export * from './src/viewer';", // eslint-disable-line quotes
    },
    // create cjs version for viewer entry point declaration files
    {
      src: 'dist/module.viewer.d.ts',
      dest: 'dist',
      rename: () => 'module.viewer.cjs.d.ts',
    },
    {
      src: ['dist/es/*.css'],
      dest: 'dist',
    },
  ];

  return copyPlugin({
    targets,
    copyOnce: true,
    hook: 'writeBundle',
  });
};

const babel = (): Plugin => {
  const include = ['packages/**/src/**', 'packages/**/lib/**', '**/@tiptap/**'];
  const options = {
    resolve: pathResolve(__dirname),
  };
  return babelPlugin({
    configFile: pathResolve(__dirname, 'babel.config.js'),
    filter: createFilter(include, undefined, options),
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    babelHelpers: 'runtime',
  });
};

const typescript = (): Plugin => {
  const absPath = (dir: string) => `${process.cwd()}/${dir}`;
  return typescriptPlugin({
    useTsconfigDeclarationDir: true,
    check: true,
    tsconfig: `${__dirname}/tsconfig.json`,
    tsconfigOverride: {
      compilerOptions: {
        declarationDir: absPath('dist'),
        rootDir: absPath(''),
        sourceMap: true,
        allowJs: process.env.ALLOW_JS === 'true',
      },
      include: [
        'src',
        'src/**/*.json',
        'src/**/*.scss',
        'statics/**/*.json',
        'statics/**/*.schema.json',
        'statics/**/*.defaults.json',
        'statics/**/*.scss',
        'package.json',
        'lib',
        'node_modules/@tiptap',
      ].map(path => absPath(path)),
      exclude: ['node_modules', '**/*.spec.*'].map(path => absPath(path)),
    },
    // debugging options:
    // verbosity: 3,
    // clean: true,
  });
};

const json = (): Plugin => {
  return jsonPlugin({
    include: [
      'statics/**',
      'node_modules/**',
      '../../../node_modules/**',
      '../../../packages/**/package.json',
      '../../common/web/dist/statics/schemas/*.schema.json',
      '../../ricos-schema/web/dist/statics/*.defaults.json',
    ],
  });
};

const postcss = (shouldExtract: boolean, entry?: string): Plugin => {
  return postcssPlugin({
    minimize: {
      // reduceIdents: false,
      // safe: true,
      /*  @ts-ignore: cssnanoOptions typing is wrong */
      normalizeWhitespace: false,
    },
    modules: {
      generateScopedName: IS_DEV_ENV ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]',
      hashPrefix: process.env.MODULE_NAME,
    },
    extract: shouldExtract && (entry ? getExtractedCssPath(entry) : editorExtractedStylePath),
    plugins: [
      postcssExclude({
        filter: '**/*.rtlignore.scss',
        plugins: [postcssRTL()],
      }),
      postcssURL({
        url: asset => asset.url.replace('../', '/statics/'),
      }),
    ],
  });
};

const replace = (): Plugin => {
  return replacePlugin({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  });
};

const uglify = (): Plugin => {
  return terser({
    mangle: false,
    output: {
      comments: (node, comment) => {
        return /@preserve|@license|@cc_on|webpackChunkName/i.test(comment.value);
      },
    },
  });
};

const visualizer = (): Plugin => {
  return visualizerPlugin({
    sourcemap: true,
  });
};

const createFakeStylesFile = (): Plugin => ({
  name: 'create-fake-styles-file',
  writeBundle() {
    writeFileSync('dist/styles.min.css', '');
  },
});

function addStylesImport() {
  return {
    name: 'add-style-import',
    // async generateBundle(options, bundle: { [key: string]: { fileName: string; code?: string } }) {
    //   const files = Object.values(bundle);
    //   const jsFile = files.find(({fileName}) => fileName.endsWith('.js'))!;
    //   const cssFile = files.find(({fileName}) => fileName.endsWith('.css'));
    //   // const files: string[] = Object.keys(bundle);
    //   if (cssFile) {
    //     debugger;
    //     const cssImport =
    //         options.format === 'es'
    //             ? `import './${cssFile.fileName}';`
    //             : `require('./${cssFile.fileName}');`;
    //     jsFile.code += `\n${cssImport}\n`;
    //   }
    // },
    async writeBundle() {
      const packageJson = require(process.cwd() + '/package.json');
      const packageName = packageJson.name;

      const getExtractedCssCjsFile = path => `require('${packageName}/${path}')`;
      const getExtractedCssEsFile = path => `import '${packageName}/${path}'`;

      const writeContent = (path, content) => {
        if (existsSync(path)) {
          const code = readFileSync(path, 'utf8');
          const result = code.includes(content) ? code : code + '\n' + content;
          writeFileSync(path, result, 'utf8');
        }
      };
      const writeCjsAndEsContent = (cjsPath, esPath, cssPath) => {
        writeContent(esPath, getExtractedCssEsFile(cssPath));
        writeContent(cjsPath, getExtractedCssCjsFile(cssPath));
      };
      const viewerExtractedStylePath = getExtractedCssPath('viewer');
      const isExistEditorStyles = existsSync(editorExtractedStylePath);
      const isExistViewerStyles = existsSync(viewerExtractedStylePath);
      const loadableViewerPath = 'dist/loadable/viewer';

      if (isExistEditorStyles) {
        writeCjsAndEsContent(packageJson.main, packageJson.module, editorExtractedStylePath);
      }

      if (isExistViewerStyles) {
        writeCjsAndEsContent(
          'dist/' + process.env.DYNAMIC_IMPORT ? 'cjs/viewer.js' : 'module.viewer.cjs.js',
          'dist/' + process.env.DYNAMIC_IMPORT ? 'es/viewer.js' : 'module.viewer.js',
          viewerExtractedStylePath
        );
        if (existsSync(`${loadableViewerPath}/es`)) {
          let dynamicLoadableChunkName;
          readdirSync(`${loadableViewerPath}/es`).forEach(file => {
            const fileName = file.split('.')[0];
            !fileName.includes('viewer-loadable') && (dynamicLoadableChunkName = fileName);
          });

          if (dynamicLoadableChunkName) {
            writeCjsAndEsContent(
              `${loadableViewerPath}/cjs/${dynamicLoadableChunkName}.cjs.js`,
              `${loadableViewerPath}/es/${dynamicLoadableChunkName}.js`,
              viewerExtractedStylePath
            );
          }
        }
      }
      if (existsSync('./lib/')) {
        readdirSync('./lib/').forEach(file => {
          const fileName = file.split('.')[0];
          const cssPath = getExtractedCssPath(fileName);
          if (existsSync(cssPath)) {
            writeCjsAndEsContent(`dist/lib/${fileName}.cjs.js`, `dist/lib/${fileName}.js`, cssPath);
          }
        });
      }
      const cssMobilePath = getExtractedCssPath('mobile');
      if (existsSync(cssMobilePath)) {
        writeContent('dist/mobileNativeLoader.js', getExtractedCssEsFile(cssMobilePath));
      }
      // deprecated: create empty styles files for non breaking changes
      writeFileSync('dist/styles.min.css', '');
    },
  };
}

let plugins: Plugin[] = [
  svgr(),
  resolveAlias(),
  resolve(),
  typescript(),
  babel(),
  commonjsPlugin(),
  json(),
];

if (!IS_DEV_ENV) {
  plugins = [...plugins, replace(), uglify()];
}

if (process.env.MODULE_ANALYZE_EDITOR || process.env.MODULE_ANALYZE_VIEWER) {
  plugins = [...plugins, visualizer()];
}

if (process.env.EXTRACT_CSS === 'false') {
  plugins = [...plugins, createFakeStylesFile()];
}

const lastEntryPlugins = [libsPackageJsonGeneratorPlugin(), copy(), copyAfterBundleWritten()];
export { plugins, postcss, addStylesImport, lastEntryPlugins };
