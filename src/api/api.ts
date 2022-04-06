import Config from '../types/Config';
import { ServerAPI } from '@uoa-discords/shared-utils';

let config: Config = require('../config.json');

try {
    const overridenConfig: Config = require('../config-overrides.json');
    config = { ...config, ...overridenConfig };
} catch (error) {
    // don't care
}

const server = new ServerAPI(config.serverURL);
export default server;
