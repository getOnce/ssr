const path = require('path');
const paths = require('./paths');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
console.log(`path.resolve('.eslintrc.js'): ${path.resolve('.eslintrc')}`);
module.exports = function (
    isEnvDevelopment,
    isEnvProduction,
    shouldUseSourceMap,
    ssrFlag,
) {
    const getStyleLoaders = (cssOptions, preProcessor) => {
        // ssr的情况
        if (ssrFlag) {
            return [
                {
                    loader: require.resolve('ignore-loader'),
                },
            ];
        }
        const loaders = [
            // 这块需要去掉 isEnvProduction
            {
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: require.resolve('css-loader'),
                options: cssOptions,
            },
            {
                // Options for PostCSS as we reference these options twice
                // Adds vendor prefixing based on your specified browser support in
                // package.json
                loader: require.resolve('postcss-loader'),
                options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebook/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        // 把现代浏览器的css转化成大部分浏览器支持的属性，根据目标浏览器
                        // 或运行时环境确定您需要的polyfill
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }),
                    ],
                    sourceMap: isEnvProduction
                        ? shouldUseSourceMap
                        : isEnvDevelopment,
                },
            },
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: isEnvProduction
                            ? shouldUseSourceMap
                            : isEnvDevelopment,
                        root: paths.appSrc,
                    },
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: true,
                    },
                },
            );
        }
        return loaders;
    };
    const imageInlineSizeLimit = 10000;
    return {
        module: {
            // 将缺失的导出提示成错误而不是警告
            strictExportPresence: true,
            rules: [
                // 禁用require.ensure 这种写法，这种写法不是标准语言特性 。
                { parser: { requireEnsure: false } },
                {
                    // 遍历所有 loader 直到有一个符合要求，最终缺少 loader 的情况下，
                    // 会由最后的 file-loader 完成解析。
                    oneOf: [
                        // TODO: Merge this config once `image/avif` is in the mime-db
                        // https://github.com/jshttp/mime-db
                        {
                            test: [/\.avif$/],
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: imageInlineSizeLimit,
                                mimetype: 'image/avif',
                                name: '[name].[hash:8].[ext]',
                            },
                        },
                        // "url" loader works like "file" loader except that it embeds assets
                        // smaller than specified limit in bytes as data URLs to avoid requests.
                        // A missing `test` is equivalent to a match.
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: imageInlineSizeLimit,
                                name: '[name].[hash:8].[ext]',
                            },
                        },
                        // Process application JS with Babel.
                        // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: paths.appSrc,

                            use: [
                                {
                                    loader: require.resolve('babel-loader'),

                                    options: {
                                        customize: require.resolve(
                                            'babel-preset-react-app/webpack-overrides',
                                        ),
                                        presets: [
                                            '@babel/preset-env',
                                            [
                                                '@babel/preset-react',
                                                {
                                                    runtime: 'automatic',
                                                },
                                            ],
                                            '@babel/preset-typescript',
                                        ],

                                        plugins: [
                                            [
                                                require.resolve(
                                                    'babel-plugin-named-asset-import',
                                                ),
                                                {
                                                    loaderMap: {
                                                        svg: {
                                                            ReactComponent:
                                                                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                                        },
                                                    },
                                                },
                                            ],
                                            '@loadable/babel-plugin',
                                            isEnvDevelopment &&
                                                !ssrFlag &&
                                                require.resolve(
                                                    'react-refresh/babel',
                                                ),
                                        ].filter(Boolean),
                                        // This is a feature of `babel-loader` for webpack (not Babel itself).
                                        // It enables caching results in ./node_modules/.cache/babel-loader/
                                        // directory for faster rebuilds.
                                        cacheDirectory: false,
                                        // See #6846 for context on why cacheCompression is disabled
                                        cacheCompression: false,
                                        compact: isEnvProduction,
                                    },
                                },
                                {
                                    loader: 'eslint-loader',
                                    options: {
                                        configFile: path.resolve('.eslintrc'),
                                    },
                                },
                            ],
                        },
                        // Process any JS outside of the app with Babel.
                        // Unlike the application JS, we only compile the standard ES features.
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [
                                    [
                                        require.resolve(
                                            'babel-preset-react-app/dependencies',
                                        ),
                                        { helpers: true },
                                    ],
                                ],
                                cacheDirectory: true,
                                // See #6846 for context on why cacheCompression is disabled
                                cacheCompression: false,

                                // Babel sourcemaps are needed for debugging into node_modules
                                // code.  Without the options below, debuggers like VSCode
                                // show incorrect code and set breakpoints on the wrong lines.
                                sourceMaps: shouldUseSourceMap,
                                inputSourceMap: shouldUseSourceMap,
                            },
                        },
                        // "postcss" loader applies autoprefixer to our CSS.
                        // "css" loader resolves paths in CSS and adds assets as dependencies.
                        // "style" loader turns CSS into JS modules that inject <style> tags.
                        // In production, we use MiniCSSExtractPlugin to extract that CSS
                        // to a file, but in development "style" loader enables hot editing
                        // of CSS.
                        // By default we support CSS Modules with the extension .module.css
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment,
                            }),
                            // Don't consider CSS imports dead code even if the
                            // containing package claims to have no side effects.
                            // Remove this when webpack adds a warning or an error for this.
                            // See https://github.com/webpack/webpack/issues/6571
                            sideEffects: true,
                        },
                        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
                        // using the extension .module.css
                        {
                            test: cssModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment,
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent,
                                },
                            }),
                        },
                        // Opt-in support for SASS (using .scss or .sass extensions).
                        // By default we support SASS Modules with the
                        // extensions .module.scss or .module.sass
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: getStyleLoaders(
                                {
                                    importLoaders: 3,
                                    sourceMap: isEnvProduction
                                        ? shouldUseSourceMap
                                        : isEnvDevelopment,
                                },
                                'sass-loader',
                            ),
                            // Don't consider CSS imports dead code even if the
                            // containing package claims to have no side effects.
                            // Remove this when webpack adds a warning or an error for this.
                            // See https://github.com/webpack/webpack/issues/6571
                            sideEffects: true,
                        },
                        // Adds support for CSS Modules, but using SASS
                        // using the extension .module.scss or .module.sass
                        {
                            test: sassModuleRegex,
                            use: getStyleLoaders(
                                {
                                    importLoaders: 3,
                                    sourceMap: isEnvProduction
                                        ? shouldUseSourceMap
                                        : isEnvDevelopment,
                                    modules: {
                                        getLocalIdent: getCSSModuleLocalIdent,
                                    },
                                },
                                'sass-loader',
                            ),
                        },
                        // "file" loader makes sure those assets get served by WebpackDevServer.
                        // When you `import` an asset, you get its (virtual) filename.
                        // In production, they would get copied to the `build` folder.
                        // This loader doesn't use a "test" so it will catch all modules
                        // that fall through the other loaders.
                        {
                            loader: require.resolve('file-loader'),
                            // Exclude `js` files to keep "css" loader working as it injects
                            // its runtime that would otherwise be processed through "file" loader.
                            // Also exclude `html` and `json` extensions so they get processed
                            // by webpacks internal loaders.
                            exclude: [
                                /\.(js|mjs|jsx|ts|tsx)$/,
                                /\.html$/,
                                /\.json$/,
                            ],
                            options: {
                                name: '[name].[hash:8].[ext]',
                            },
                        },
                        // ** STOP ** Are you adding a new loader?
                        // Make sure to add the new loader(s) before the "file" loader.
                    ],
                },
            ],
        },
    };
};
