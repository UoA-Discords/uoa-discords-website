import { APIResponse, AccessTokenResponse, WebApplication, TagNames } from '@uoa-discords/shared-utils';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ServerApplication } from '../types/ServerApplication';

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

    /** Wrapper for POST requests to the server. */
    public async requestWrapper<T>(path: string, payload: object, expectedCode: number = 200): Promise<APIResponse<T>> {
        try {
            const { status, statusText, data } = await this._server.post<T>(path, payload);

            if (status !== expectedCode) {
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

    public async makeApplication(
        body: WebApplication,
    ): Promise<APIResponse<{ message: string; verifierOverride: boolean }>> {
        for (let i = 0; i < body.tags.length; i++) {
            if (typeof body.tags[i] === 'string') {
                body.tags[i] = parseInt(body.tags[i] as unknown as string);
            }
        }
        return await this.requestWrapper('/applications/applyWeb', body, 201);
    }

    public async getApplications(token: string): Promise<APIResponse<ServerApplication[]>> {
        try {
            const { status, statusText, data } = await this._server.get<ServerApplication[]>('/applications', {
                headers: {
                    Authorization: token,
                },
            });

            if (status !== 200) {
                console.warn(
                    `Got status code ${status} from ${this._baseURL}/applications with message: ${statusText}`,
                    data,
                );
            }

            data.forEach((application) => {
                application.tags = application.tags.map((e) => parseInt(e as unknown as string));
            });

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

    public async acceptApplication(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper('/applications/accept', { access_token, guildId }, 201);
    }

    public async rejectApplication(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper('applications/reject', { access_token, guildId });
    }

    public async modifyTags(access_token: string, guildId: string, tags: TagNames[]): Promise<APIResponse<void>> {
        return await this.requestWrapper('applications/modifyTags', { access_token, guildId, tags });
    }
}
