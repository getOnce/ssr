const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const reactRefreshOverlayEntry = require.resolve(
    'react-dev-utils/refreshOverlayInterop',
);
const paths = require('./paths');

module.exports = function (isEnvProduction, shouldUseSourceMap) {
    return {
        optimization: {
            // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer 定义的插件压缩 bundle。
            minimize: isEnvProduction,
            minimizer: [
                // 压缩javascript
                // 如果你使用的是 webpack v5 或以上版本，你不需要安装这个插件。webpack v5 自带最新的 terser-webpack-plugin。
                // 如果使用 webpack v4，则必须安装 terser-webpack-plugin v4 的版本。
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            // We want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minification steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending further investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        // Added for profiling in devtools
                        keep_classnames: false,
                        keep_fnames: false,
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                    sourceMap: shouldUseSourceMap,
                }),
                //
                // 如果是webpack v5以上 需要使用 css-minimizer-webpack-plugin .
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: shouldUseSourceMap
                            ? {
                                  // `inline: false` forces the sourcemap to be output into a
                                  // separate file
                                  inline: false,
                                  // `annotation: true` appends the sourceMappingURL to the end of
                                  // the css file, helping the browser find the sourcemap
                                  annotation: true,
                              }
                            : false,
                    },
                    cssProcessorPluginOptions: {
                        preset: [
                            'default',
                            { minifyFontValues: { removeQuotes: false } },
                        ],
                    },
                }),
            ],
        },
        // 配置模块解析规则的
        resolve: {
            // 指定 node_modules
            modules: ['node_modules'],
            // 指定后缀名
            extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
            // 指定别名
            alias: {},
            plugins: [
                // 这个插件功能就是为了防止用户引入src目录之外的文件导致不可预期的结果
                new ModuleScopePlugin(paths.appSrc, [
                    paths.appPackageJson,
                    reactRefreshOverlayEntry,
                ]),
            ],
        },
        resolveLoader: {},
    };
};
