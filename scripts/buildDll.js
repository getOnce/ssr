const webpack = require('webpack');
const env = process.argv.slice(2);
const webpackDllConfig = require('./config/webpack.commonVendor');

const isEnvProduction = env.includes('--production');
const config = webpackDllConfig(isEnvProduction);

const compiler = webpack(config);

compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(
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
});
