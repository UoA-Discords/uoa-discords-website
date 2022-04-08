import Config from '../types/Config';
import Server from './Server';

let config: Config = require('../config.json');

try {
    const overridenConfig: Config = require('../config-overrides.json');
    config = { ...config, ...overridenConfig };
} catch (error) {
    // don't care
}

const server = new Server(config.serverURL);
export default server;
