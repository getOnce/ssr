const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const WebpackRequireFrom = require('Webpack-require-from');
const webpackDevClientEntry = require.resolve(
    'react-dev-utils/webpackHotDevClient',
);
const reactRefreshOverlayEntry = require.resolve(
    'react-dev-utils/refreshOverlayInterop',
);

const paths = require('./paths');
const webpack = require('webpack');
const getClientEnvironment = require('./env');
module.exports = function (isEnvDevelopment) {
    const env = getClientEnvironment();
    const manifest = require(`${paths.dllBuild}/vendor-manifest${
        !isEnvDevelopment ? '.min' : ''
    }.json`);

    return {
        plugins: [
            new LoadablePlugin({
                filename: '../../ssr/stats.json',
                writeToDisk: true,
            }),
            // This gives some necessary context to module not found errors, such as
            // the requesting resource.
            new ModuleNotFoundPlugin(paths.appPath),
            // Makes some environment variables available to the JS code, for example:
            // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
            // It is absolutely essential that NODE_ENV is set to production
            // during a production build.
            // Otherwise React will be compiled in the very slow development mode.
            new webpack.DefinePlugin(env.stringified),
            // This is necessary to emit hot updates (CSS and Fast Refresh):
            isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
            // Experimental hot reloading for React .
            // https://github.com/facebook/react/tree/master/packages/react-refresh
            isEnvDevelopment &&
                new ReactRefreshWebpackPlugin({
                    overlay: {
                        entry: webpackDevClientEntry,
                        // The expected exports are slightly different from what the overlay exports,
                        // so an interop is included here to enable feedback on module-level errors.
                        module: reactRefreshOverlayEntry,
                        // Since we ship a custom dev client and overlay integration,
                        // the bundled socket handling logic can be eliminated.
                        sockIntegration: false,
                    },
                }),
            // 这个Webpack插件强制所有需要的模块的整个路径与磁盘上的实际路径完全匹配。
            // 使用这个插件有助于缓解在OSX上工作的开发人员的情况，OSX不遵循严格的路径大小写敏感性，将导致与其他开发人员的冲突
            isEnvDevelopment && new CaseSensitivePathsPlugin(),

            // 如果某个依赖未安装，此插件允许你安装模块后自动重新构建打包文件。
            isEnvDevelopment &&
                new WatchMissingNodeModulesPlugin(paths.appNodeModules),
            // 提取css，我们这里无论是开发还是生产环境都需要提取，所以要去掉 isEnvProduction

            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[name].[contenthash:8].chunk.css',
            }),
            new WebpackRequireFrom({
                methodName: 'getChunkURL',
            }),
            new webpack.DllReferencePlugin({
                manifest: manifest,
            }),
            new ESLintPlugin({
                // Plugin options
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
                failOnError: !isEnvDevelopment,
                context: paths.appSrc,
                cache: true,
                cacheLocation: path.resolve(
                    paths.appNodeModules,
                    '.cache/.eslintcache',
                ),
                // ESLint class options
                cwd: paths.appPath,
                resolvePluginsRelativeTo: __dirname,
                baseConfig: {
                    extends: [require.resolve('eslint-config-react-app/base')],
                    rules: {},
                },
            }),
        ].filter(Boolean),
    };
};
