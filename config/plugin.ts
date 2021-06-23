import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    ejs: {
        package: 'egg-view-ejs',
    },
};

export default plugin;
