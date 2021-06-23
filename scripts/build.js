/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
process.env.WDS_SOCKET_HOST = `127.0.0.1`;
process.env.WDS_SOCKET_PATH = '/sockjs-node';
process.env.WDS_SOCKET_PORT = DEFAULT_PORT;
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
    throw err;
});

const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');

const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

const configFactory = require('./config/webpack.config');

if (process.env.HOST) {
    console.log(
        chalk.cyan(
            `Attempting to bind to HOST environment variable: ${chalk.yellow(
                chalk.bold(process.env.HOST),
            )}`,
        ),
    );
    console.log(
        `If this was unintentional, check that you haven't mistakenly set it in your shell.`,
    );
    console.log(
        `Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`,
    );
    console.log();
}

choosePort(HOST, DEFAULT_PORT).then((port) => {
    if (port == null) {
        // We have not found a port.
        return;
    }
    // 静态资源browser端
    const config = configFactory('production');
    const configForSSR = configFactory('production', 'ssr');
    const compiler = webpack(config);
    const compilerForSSR = webpack(configForSSR);
    let compilerForSSRFlag = false;

    compiler.hooks.done.tap('done', () => {
        console.log(`compiler.hooks.done => `);
        if (compilerForSSRFlag) return;
        compilerForSSRFlag = true;

        compilerForSSR.run((error, stats) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(
                'webpack打包结果\n' +
                    stats.toString({
                        hash: false,
                        chunks: false,
                        colors: true,
                        children: false,
                        modules: false,
                        errors: true,
                        errorDetails: true,
                    }),
            );
            compilerForSSRFlag = false;
        });
    });
    compiler.run((error, stats) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(
            'webpack打包结果\n' +
                stats.toString({
                    hash: false,
                    chunks: false,
                    colors: true,
                    children: false,
                    modules: false,
                    errors: true,
                    errorDetails: true,
                }),
        );
        compilerForSSRFlag = false;
    });
});
