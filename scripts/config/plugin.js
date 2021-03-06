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
            // ??????Webpack??????????????????????????????????????????????????????????????????????????????????????????
            // ????????????????????????????????????OSX????????????????????????????????????OSX????????????????????????????????????????????????????????????????????????????????????
            isEnvDevelopment && new CaseSensitivePathsPlugin(),

            // ????????????????????????????????????????????????????????????????????????????????????????????????
            isEnvDevelopment &&
                new WatchMissingNodeModulesPlugin(paths.appNodeModules),
            // ??????css????????????????????????????????????????????????????????????????????????????????? isEnvProduction

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
