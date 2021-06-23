const paths = require('./paths');
const DllPlugin = require('webpack/lib/DllPlugin');
module.exports = (isProduction) => {
    return {
        mode: !isProduction ? 'development' : 'production',
        entry: {
            vendor: ['react', 'react-dom'],
        },
        resolve: { extensions: ['.js', '.jsx'] },
        output: {
            path: paths.dllBuild,
            filename: `react_[name]${isProduction ? '.min' : ''}.js`,
            library: '[name]_[hash]',
        },
        plugins: [
            new DllPlugin({
                entryOnly: true,
                path: `${paths.dllBuild}/[name]-manifest${
                    isProduction ? '.min' : ''
                }.json`,
                name: '[name]_[hash]',
            }),
        ],
    };
};
