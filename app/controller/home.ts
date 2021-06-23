/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller } from 'egg';
import * as path from 'path';
const ssr = require('../public/demo/ssr/ssr.js');
const stats = path.resolve('./app/public/demo/ssr/stats.json');
const ssrStats = path.resolve('./app/public/demo/ssr/loadable-stats.json');
export default class HomeController extends Controller {
    public async index() {
        const { ctx } = this;
        // ctx.body = await ctx.service.test.sayHi('egg');
        // 最终这个名字也会由ducc根据不同环境（local、beta、prod）
        // 下发不一样的名字, prod、beta下发react_vendor.min.js
        const vendorName = 'react_vendor.js';
        const CDN = 'http://127.0.0.1:3000';
        const publicPath = '/demo/csr/v1.0/';
        let { html, scriptTags, linkTags, styleTags } = ssr(stats, ssrStats);

        scriptTags = scriptTags.replace(/(\/demo\/csr\/)/g, `${CDN}$1`);
        linkTags = linkTags.replace(/(\/demo\/csr\/)/g, `${CDN}$1`);
        styleTags = styleTags.replace(/(\/demo\/csr\/)/g, `${CDN}$1`);
        html = html.replace(/(\/demo\/csr\/)/g, `${CDN}$1`);
        // const scriptTagsString = scriptTags.map(
        //     (scriptTag) =>
        //         `<script src="${CDN}${publicPath}${scriptTag}"></script>`,
        // );
        // const linkTagsString = linkTags.map(
        //     (linkTag) =>
        //         `<link rel="stylesheet" href="${CDN}${publicPath}${linkTag}">`,
        // );
        await ctx.render('demo', {
            name: 'egg1',
            CDN, // 预发http://beta-static.jd.co.th 生产 https://static.jd.co.th
            cssUrl: '/demo/csr/v1.0/main.css',
            jsUrl: '/demo/csr/v1.0/bundle.js',
            publicPath,
            vendor: `/vendor/${vendorName}`,
            str: html,
            scriptTagsString: scriptTags,
            linkTagsString: linkTags,
            styleTags,
        });
    }
}
