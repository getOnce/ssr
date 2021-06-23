const commonSettingFactory = require('./commonSetting');
const optimizationFactory = require('./optimization');
const pluginFactory = require('./plugin');
const loaderFactory = require('./loader');
const LoadablePlugin = require('@loadable/webpack-plugin');
/**
 *
 * @param {String} webpackEnv 环境
 * @param {boolean} ssrFlag 是否导出的是服务端渲染的配置
 * @returns
 */
module.exports = function (webpackEnv, ssrFlag) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const shouldUseSourceMap = true;

    return {
        ...commonSettingFactory(isEnvProduction, isEnvDevelopment, ssrFlag),
        ...optimizationFactory(isEnvProduction, shouldUseSourceMap),
        ...(ssrFlag
            ? {
                  plugins: [
                      new LoadablePlugin({
                          filename: 'loadable-stats.json',
                          writeToDisk: true,
                      }),
                  ],
              }
            : pluginFactory(isEnvDevelopment)),
        ...loaderFactory(
            isEnvDevelopment,
            isEnvProduction,
            shouldUseSourceMap,
            ssrFlag,
        ),
    };
};
// react react-dom react-router -> vendor
// 1、把react、react-dom单独打包
// 2、把单独打包出来的信息告诉webpack，我们已经把react等相关的东西打包过了
