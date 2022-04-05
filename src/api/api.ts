import axios, { AxiosError, AxiosResponse } from 'axios';
import Config from '../types/Config';
import { AccessTokenResponse, Invite, User } from '@uoa-discords/uoa-discords-shared-types';
import APIResponse from '../types/APIResponse';

let config: Config = require('../config.json');

try {
    const overridenConfig: Config = require('../config-overrides.json');
    config = { ...config, ...overridenConfig };
} catch (error) {
    // don't care
}

/** UoA Discords API. */
export const server = axios.create({
    baseURL: config.serverURL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

/** Discord API. */
export const discord = axios.create({
    baseURL: 'https://discord.com/api/v9',
    headers: {
        'Content-Type': 'application/json',
    },
});

/** Asks the server to upgrade a Discord OAuth code to a full OAuth access token. */
export async function getToken(code: string, origin: string): Promise<AxiosResponse<AccessTokenResponse>> {
    const res = await server.post<AccessTokenResponse>('/auth/getToken', { code, redirect_uri: origin });
    return res;
}

export async function revokeToken(token: string): Promise<boolean> {
    try {
        const { data, status, statusText } = await server.post('/auth/revokeToken', { token });

        if (status !== 200) {
            console.warn(`Got status code ${status} trying to get user info with message: ${statusText}`, data);
        }

        return true;
    } catch (error) {
        console.error('Failed token revocation', error);
        return false;
    }
}

export async function refreshToken(refresh_token: string): Promise<APIResponse<AccessTokenResponse>> {
    try {
        const { data, status, statusText } = await server.post<AccessTokenResponse>('auth/refreshToken', {
            refresh_token,
        });

        if (status !== 200) {
            console.warn(`Got status code ${status} trying to get user info with message: ${statusText}`, data);
        }

        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error as Error as AxiosError,
        };
    }
}

export async function getUserInfo(token: string): Promise<APIResponse<User>> {
    try {
        const { data, status, statusText } = await discord.get<User>('users/@me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (status !== 200) {
            console.warn(`Got status code ${status} trying to get user info with message: ${statusText}`, data);
        }

        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error as Error as AxiosError,
        };
    }
}

// currently unused
export async function getDiscordInvite(invite: string): Promise<AxiosResponse<Invite>> {
    const res = await discord.get<Invite>(`/invites/${invite}?with_expiration=true`);

    return res;
}
