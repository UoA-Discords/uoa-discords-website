import axios, { AxiosResponse } from 'axios';
import Config from '../types/Config';
import { AccessTokenResponse, Guild, User } from '@uoa-discords/uoa-discords-shared-types';

let config: Config = require('../config.json');

try {
    const overridenConfig: Config = require('../config-overrides.json');
    config = { ...config, ...overridenConfig };
} catch (error) {
    //
}

/** UoA Discords API. */
export const server = axios.create({
    baseURL: config.serverURL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

/** Discord API. */
export const discord = axios.create({
    baseURL: 'https://discord.com/api/v9',
});

/** Asks the server to verify a Discord access token. */
export async function getToken(code: string, origin: string): Promise<AxiosResponse<AccessTokenResponse>> {
    const res = await server.post<AccessTokenResponse>('/auth/getToken', { code, redirect_uri: origin });
    return res;
}

export async function revokeToken(token: string): Promise<AxiosResponse> {
    const res = await server.post('/auth/revokeToken', { token });
    return res;
}

export async function refreshToken(refresh_token: string): Promise<AxiosResponse<AccessTokenResponse>> {
    const res = await server.post<AccessTokenResponse>('auth/refreshToken', { refresh_token });
    return res;
}

export async function getUserInfo(token: string): Promise<AxiosResponse<User>> {
    const res = await discord.get<User>('users/@me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
}

export async function getDiscordGuilds(token: string): Promise<AxiosResponse<Guild[]>> {
    const res = await discord.get<Guild[]>('/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
}
