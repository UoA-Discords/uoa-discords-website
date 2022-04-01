import axios from 'axios';
import LoginResponse from '../types/LoginResponse';
import Config from '../types/Config';

let config: Config = require('../config.json');

try {
    const overridenConfig: Config = require('../config-overrides.json');
    config = { ...config, ...overridenConfig };
} catch (error) {
    //
}

export const server = axios.create({
    baseURL: config.serverURL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

/** Asks to server to verify a Discord access token. */
export async function getToken(code: string, origin: string): Promise<LoginResponse> {
    const res = await server.post<LoginResponse>('/auth/getToken', { code, redirect_uri: origin });
    return res.data;
}
