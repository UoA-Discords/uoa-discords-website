import { AccessTokenResponse } from '@uoa-discords/uoa-discords-shared-types';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

interface ExtendedTokenResponse extends AccessTokenResponse {
    /** [Added] Date of token expiration. */
    expires_at: number;
    /** [Added] Date of token issuing. */
    issued_at: number;
}

type AccessSetter = (payload: AccessTokenResponse, setReason: 'generate' | 'refresh') => void;

export interface DiscordAccessResponse {
    discordAccess: ExtendedTokenResponse | undefined;
    setDiscordAccess: AccessSetter;
    clearDiscordAccess: () => void;
}

export interface FullDiscordAccessResponse extends DiscordAccessResponse {
    discordAccess: ExtendedTokenResponse;
}

/** Manages the Discord OAuth user cookie. */
function useDiscordAccess(): DiscordAccessResponse {
    const [{ discordOAuth }, setCookie, removeCookie] = useCookies<
        'discordOAuth',
        { discordOAuth?: ExtendedTokenResponse }
    >(['discordOAuth']);

    /**
     * Updates the stored Discord OAuth data.
     * @param {AccessTokenResponse} payload - Discord access token and other data.
     * @param {string} setReason - Why the data was updated.
     * */
    const handleSet = useCallback<AccessSetter>(
        (payload: AccessTokenResponse, setReason: 'generate' | 'refresh') => {
            let upgradedPayload: ExtendedTokenResponse;
            if (setReason === 'generate') {
                upgradedPayload = {
                    ...payload,
                    issued_at: Date.now(),
                    expires_at: Date.now() + payload.expires_in * 1000,
                };
            } else {
                if (!discordOAuth)
                    throw new Error(`Tried to refresh OAuth but didn't have a token in the first place!`);
                upgradedPayload = { ...discordOAuth, ...payload, expires_at: Date.now() + payload.expires_in * 1000 };
            }

            setCookie('discordOAuth', upgradedPayload, {
                sameSite: 'strict',
                expires: new Date(upgradedPayload.expires_at),
            });
        },
        [discordOAuth, setCookie],
    );

    const handleRemove = useCallback(() => {
        removeCookie('discordOAuth');
    }, [removeCookie]);

    return {
        discordAccess: discordOAuth,
        setDiscordAccess: handleSet,
        clearDiscordAccess: handleRemove,
    };
}

export default useDiscordAccess;
