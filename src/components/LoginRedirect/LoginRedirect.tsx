import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { v4 as uuid } from 'uuid';
import useDiscordAccess from '../../hooks/useDiscordAccess';

const CLIENT_ID = '958568584349618227';
const SCOPES = ['guilds', 'identify'].join('%20');
const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/auth`);

const LoginRedirect = () => {
    const [, setOAuthState] = useCookies<'oauth_state', { oauth_state?: string }>(['oauth_state']);

    const { discordAccess } = useDiscordAccess();

    useEffect(() => {
        if (discordAccess) {
            window.open('/me', '_self');
        } else {
            const state = uuid();
            setOAuthState('oauth_state', state, { sameSite: 'strict' });
            window.open(
                `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&state=${state}&redirect_uri=${REDIRECT_URI}&prompt=consent`,
                '_self',
            );
        }
    }, [discordAccess, setOAuthState]);

    return <Typography>Sending you to Discord!</Typography>;
};

export default LoginRedirect;
