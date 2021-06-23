const path = require('path');
const fs = require('fs');
const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
module.exports = {
    appIndexJs: resolveApp('browser/index.tsx'),
    ssrAppIndexJS: resolveApp('browser/ssr.tsx'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('browser'),
    appBuild: resolveApp('app/public/demo/csr/v1.0'),
    ssrAppBuild: resolveApp('app/public/demo/ssr/'),
    publicUrlOrPath: '/demo/csr/v1.0/',
    appPath: resolveApp('.'),
    appNodeModules: resolveApp('node_modules'),
    dllBuild: resolveApp('app/public/vendor/'),

    appPublic: resolveApp('app/public/'),
};
module.exports.moduleFileExtensions = moduleFileExtensions;
