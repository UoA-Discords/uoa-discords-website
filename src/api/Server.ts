import {
    APIResponse,
    AccessTokenResponse,
    TagNames,
    WebApplicationRequest,
    ApplicationServer,
    POSTApplicationRoutes,
    POSTAuthRoutes,
    GETRoutes,
    ServerWithInviteInfo,
    POSTUserRoutes,
} from '@uoa-discords/shared-utils';
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
        return await this.requestWrapper(POSTAuthRoutes.GetToken, {
            code,
            redirect_uri: window.location.origin + '/auth',
        });
    }

    public async refreshToken(refresh_token: string): Promise<APIResponse<AccessTokenResponse>> {
        return await this.requestWrapper(POSTAuthRoutes.RefreshToken, { refresh_token });
    }

    public async revokeToken(token: string): Promise<APIResponse<boolean>> {
        return await this.requestWrapper(POSTAuthRoutes.RevokeToken, { token });
    }

    public async makeApplication(
        body: WebApplicationRequest,
    ): Promise<APIResponse<{ message: string; verifierOverride: boolean }>> {
        return await this.requestWrapper(POSTApplicationRoutes.ApplyWeb, body, 201);
    }

    public async getApplications(token: string): Promise<APIResponse<ApplicationServer[]>> {
        try {
            const { status, statusText, data } = await this._server.get<ApplicationServer[]>(
                GETRoutes.GetApplications,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );

            if (status !== 200) {
                console.warn(
                    `Got status code ${status} from ${this._baseURL}${GETRoutes.GetApplications} with message: ${statusText}`,
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

    public async acceptApplication(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper(POSTApplicationRoutes.Accept, { access_token, guildId }, 201);
    }

    public async rejectApplication(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper(POSTApplicationRoutes.Reject, { access_token, guildId });
    }

    public async modifyTags(access_token: string, guildId: string, tags: TagNames[]): Promise<APIResponse<void>> {
        return await this.requestWrapper(POSTApplicationRoutes.Modify, { access_token, guildId, tags });
    }

    public async getServers(): Promise<APIResponse<ServerWithInviteInfo[]>> {
        try {
            const { status, statusText, data } = await this._server.get<ServerWithInviteInfo[]>(GETRoutes.GetServers);

            if (status !== 200) {
                console.warn(
                    `Got status code ${status} from ${this._baseURL}${GETRoutes.GetServers} with message: ${statusText}`,
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

    public async getLikes(userId: string, token: string): Promise<APIResponse<string[]>> {
        try {
            const { status, statusText, data } = await this._server.get<string[]>(`/users/${userId}/likes`, {
                headers: {
                    Authorization: token,
                },
            });

            if (status !== 200) {
                console.warn(
                    `Got status code ${status} from ${this._baseURL}${GETRoutes.GetUserLikes} with message: ${statusText}`,
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

    public async removeLike(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper(POSTUserRoutes.RemoveLike, { access_token, guildId });
    }

    public async addLike(access_token: string, guildId: string): Promise<APIResponse<void>> {
        return await this.requestWrapper(POSTUserRoutes.AddLike, { access_token, guildId });
    }
}
