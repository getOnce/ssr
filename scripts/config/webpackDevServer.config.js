'use strict';

const ignoredFiles = require('react-dev-utils/ignoredFiles');
const paths = require('./paths');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function () {
    return {
        // 防止DNS rebinding 攻击，直接设置为false就可以
        disableHostCheck: false,
        // 启用 gzip compression
        compress: true,
        // 把webpackDevServer自己的日志设置为静默，当设置为none时，compile时的警告与错误仍然会显示
        clientLogLevel: 'none',
        /**
         * 注意：
         * 一定要把 headers: { 'Access-Control-Allow-Origin': '*' },这个配置加上
         * 因为做页面热更新的时候，webpack.dev.server会成为携带修改内容的json的服务器，不加上这个就会出现跨域问题
         * 原cra里面没有这个
         */
        headers: { 'Access-Control-Allow-Origin': '*' },
        // 默认情况下，WebpackDevServer提供来自当前目录的物理文件
        // 除了从内存提供的所有虚拟构建产品之外。
        contentBase: paths.appPublic,

        // By default files from `contentBase` will not trigger a page reload.
        watchContentBase: false,
        // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
        // for the WebpackDevServer client so it can learn when the files were
        // updated. The WebpackDevServer client is included as an entry point
        // in the webpack development configuration. Note that only changes
        // to CSS are currently hot reloaded. JS changes will refresh the browser.
        hot: true,
        // Use 'ws' instead of 'sockjs-node' on server since we're using native
        // websockets in `webpackHotDevClient`.
        transportMode: 'ws',

        // Enable custom sockjs pathname for websocket connection to hot reloading server.
        // Enable custom sockjs hostname, pathname and port for websocket connection
        // to hot reloading server.
        sockHost,
        sockPath,
        sockPort,
        // It is important to tell WebpackDevServer to use the same "publicPath" path as
        // we specified in the webpack config. When homepage is '.', default to serving
        // from the root.
        // remove last slash so user can land on `/test` instead of `/test/`
        publicPath: paths.publicUrlOrPath.slice(0, -1),
        // WebpackDevServer is noisy by default so we emit custom message instead
        // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
        quiet: false,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebook/create-react-app/issues/293
        // src/node_modules is not ignored to support absolute imports
        // https://github.com/facebook/create-react-app/issues/1065
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        host,
        // 出现编译器错误或警告时，在浏览器中显示全屏覆盖。
        // 因为我们只用webpack.dev.server提供静态资源，不显示html页面，所以直接设置false
        overlay: false,
    };
};
