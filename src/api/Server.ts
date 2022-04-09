import { APIResponse, AccessTokenResponse } from '@uoa-discords/shared-utils';
import axios, { AxiosError, AxiosInstance } from 'axios';

export default class Server {
    private readonly _baseURL: string;
    private readonly _server: AxiosInstance;

    public constructor(serverURL: string) {
        this._baseURL = serverURL;
        this._server = axios.create({
            baseURL: serverURL,
            headers: {
                'Content-Type': `application/json`,
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    public async requestWrapper<T>(path: string, payload: object): Promise<APIResponse<T>> {
        try {
            const { status, statusText, data } = await this._server.post<T>(path, payload);

            if (status !== 200) {
                console.warn(
                    `Got status code ${status} from ${this._baseURL}${path} with message: ${statusText}`,
                    data,
                );
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error as Error as AxiosError,
            };
        }
    }

    /** Upgrades an OAuth code to a Discord access token. */
    public async getToken(code: string): Promise<APIResponse<AccessTokenResponse>> {
        return await this.requestWrapper('/auth/getToken', { code, redirect_uri: window.location.origin + '/auth' });
    }

    public async refreshToken(refresh_token: string): Promise<APIResponse<AccessTokenResponse>> {
        return await this.requestWrapper('/auth/refreshToken', { refresh_token });
    }

    public async revokeToken(token: string): Promise<APIResponse<boolean>> {
        return await this.requestWrapper('/auth/revokeToken', { token });
    }
}
