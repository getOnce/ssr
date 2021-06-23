const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');
const appPackageJson = require(paths.appPackageJson);
const webpackDevClientEntry = require.resolve(
    'react-dev-utils/webpackHotDevClient',
);
module.exports = function (isEnvProduction, isEnvDevelopment, ssrFlag) {
    let setting = {};
    // 如果是服务端渲染
    if (ssrFlag) {
        setting = {
            entry: paths.ssrAppIndexJS,
            target: 'node',
            externals: ['react', '@loadable/component', nodeExternals()],
            // 出口
            output: {
                libraryTarget: 'commonjs2',
                libraryExport: 'default',
                // path对应一个绝对路径，这个目录存放编译之后的文件
                path: paths.ssrAppBuild,
                // 输出文件的文件名
                filename: 'ssr.js',

                // 告诉 webpack 使用未来版本的资源文件 emit 逻辑，允许在 emit 后释放资源文件的内存。
                // 这可能会破坏那些认为资源文件 emit 后仍然可读的插件。
                // 在 webpack v5.0.0 中 选项被移除并且这种行为将被默认支持
                futureEmitAssets: true,

                // 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。当将资源托管到 CDN 时必须用到
                publicPath: paths.publicUrlOrPath,

                // 防止多个webpack运行时有冲突
                jsonpFunction: `webpackJsonp${appPackageJson.name}${
                    ssrFlag ? 'ssr' : 'csr'
                }`,

                // 当输出为 library 时，尤其是当 libraryTarget 为 'umd'时，
                // 此选项将决定使用哪个全局对象来挂载 library。为了使 UMD 构建在浏览器和 Node.js 上均可用，
                // 应将 output.globalObject 选项设置为 'this'。对于类似 web 的目标，默认为 self。
                // 这里是为了在web workers中使用 window
                // globalObject: 'this',
            },
        };
        // 如果不是服务端渲染
    } else {
        setting = {
            // 在第一个错误出现时抛出失败结果，而不是容忍它。
            // 默认情况下，当使用 HMR 时，webpack 会将在终端以及浏览器控制台中，
            // 以红色文字记录这些错误，但仍然继续进行打包。要启用它
            bail: isEnvProduction,
            // 此选项控制是否生成，以及如何生成 source map
            devtool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',
            // 入口
            entry: isEnvDevelopment
                ? [webpackDevClientEntry, paths.appIndexJs]
                : paths.appIndexJs,
            // 出口
            output: {
                // path对应一个绝对路径，这个目录存放编译之后的文件
                path: paths.appBuild,
                // 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。
                // 此选项在 development 模式时的默认值为 true，而在 production 模式时的默认值为 false。
                // 当值为 'verbose' 时，会显示更多信息，如 export，运行时依赖以及 bailouts。
                pathinfo: isEnvDevelopment,
                // 输出文件的文件名
                filename: 'bundle.js',
                // 告诉 webpack 使用未来版本的资源文件 emit 逻辑，允许在 emit 后释放资源文件的内存。
                // 这可能会破坏那些认为资源文件 emit 后仍然可读的插件。
                // 在 webpack v5.0.0 中 选项被移除并且这种行为将被默认支持
                futureEmitAssets: true,

                // 此选项决定了非初始（non-initial）chunk 文件的名称。
                chunkFilename: isEnvProduction
                    ? '[name].[contenthash:8].chunk.js'
                    : isEnvDevelopment && '[name].chunk.js',

                // 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。当将资源托管到 CDN 时必须用到
                publicPath: paths.publicUrlOrPath,

                // 防止多个webpack运行时有冲突
                jsonpFunction: `webpackJsonp${appPackageJson.name}`,

                // 当输出为 library 时，尤其是当 libraryTarget 为 'umd'时，
                // 此选项将决定使用哪个全局对象来挂载 library。为了使 UMD 构建在浏览器和 Node.js 上均可用，
                // 应将 output.globalObject 选项设置为 'this'。对于类似 web 的目标，默认为 self。
                // 这里是为了在web workers中使用 window
                globalObject: 'this',
            },
            // Some libraries import Node modules but don't use them in the browser.
            // Tell webpack to provide empty mocks for them so importing them works.
            node: {
                module: 'empty',
                dgram: 'empty',
                dns: 'mock',
                fs: 'empty',
                http2: 'empty',
                net: 'empty',
                tls: 'empty',
                child_process: 'empty',
            },
        };
    }
    return {
        // webpack运行环境
        mode: isEnvProduction
            ? 'production'
            : isEnvDevelopment && 'development',
        ...setting,

        // Turn off performance processing because we utilize
        // our own hints via the FileSizeReporter
        performance: false,
    };
};
