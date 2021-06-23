"eslint": "^7.11.0",
"eslint-config-egg": "^8.0.0",
"eslint-config-prettier": "^8.3.0",
"eslint-config-react-app": "^6.0.0",
"eslint-plugin-flowtype": "^5.2.0",
"eslint-plugin-import": "^2.22.1",
"eslint-plugin-jsx-a11y": "^6.3.1",
"eslint-plugin-react": "^7.21.5",
"eslint-plugin-react-hooks": "^4.2.0",
"eslint-webpack-plugin": "^2.5.2",
"mini-css-extract-plugin": "0.11.3",
"@pmmmwh/react-refresh-webpack-plugin": "0.4.3",
"case-sensitive-paths-webpack-plugin": "2.3.0",
"optimize-css-assets-webpack-plugin": "5.0.4",
"webpack": "4.44.2",
"webpack-dev-server": "3.11.1",
"@babel/core": "7.12.3",
"babel-eslint": "^10.1.0",
"file-loader": "6.1.1",
"postcss-flexbugs-fixes": "4.2.1",
"postcss-loader": "3.0.0",
"postcss-safe-parser": "5.0.2",
"postcss-preset-env": "6.7.0",
"resolve-url-loader": "^3.1.2",
"sass-loader": "^10.0.5",
"url-loader": "4.1.1",
"css-loader": "4.3.0",
"resolve-url-loader": "^3.1.2",
"sass-loader": "^10.0.5",
"babel-loader": "8.1.0",
"babel-plugin-named-asset-import": "^0.3.7",
"babel-preset-react-app": "^10.0.0",

// webpack.config.js引入
const path = require('path');
const webpack = require('webpack');
const appPackageJson = require(paths.appPackageJson);
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const reactRefreshOverlayEntry = require.resolve(
    'react-dev-utils/refreshOverlayInterop',
);
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');


// 不需要安装的loader
"style-loader": "1.3.0",
"postcss-normalize": "8.0.1",
// 不需要安装
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');