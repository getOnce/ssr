import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {
        development: {
            overrideIgnore: true,
        },
    };
    return config;
};
