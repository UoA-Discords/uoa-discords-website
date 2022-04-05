import { User } from '@uoa-discords/uoa-discords-shared-types';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

export interface UserResponse {
    user: User | undefined;
    setUser: (payload: User) => void;
    clearUser: () => void;
}

export interface FullUserResponse extends UserResponse {
    user: User;
}

/** Managers the Discord user cookie. */
function useDiscordUser(): UserResponse {
    const [{ discordUser }, setCookie, removeCookie] = useCookies<'discordUser', { discordUser?: User }>([
        'discordUser',
    ]);

    const handleSet = useCallback(
        (payload: User) => {
            setCookie('discordUser', payload, { sameSite: 'strict' });
        },
        [setCookie],
    );

    const handleRemove = useCallback(() => {
        removeCookie('discordUser');
    }, [removeCookie]);

    return {
        user: discordUser,
        setUser: handleSet,
        clearUser: handleRemove,
    };
}

export default useDiscordUser;
