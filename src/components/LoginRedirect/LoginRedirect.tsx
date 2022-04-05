import React from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import useDiscordAccess from '../../hooks/useDiscordAccess';

const CLIENT_ID = '958568584349618227';
const SCOPES = ['guilds', 'identify'].join('%20');
const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/auth`);

/** Centralized component to redirect user to Discord OAuth endpoint.
 *
 * This is here because we have (or likely will have) lots of places that you should be able to login from.
 */
const LoginRedirect = () => {
    const [, setOAuthState] = useCookies<'oauth_state', { oauth_state?: string }>(['oauth_state']);

    const { discordAccess, clearDiscordAccess } = useDiscordAccess();

    if (discordAccess) {
        return (
            <Container>
                <Typography variant="h2" textAlign="center" gutterBottom>
                    Already Logged In
                </Typography>
                <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h5" color="gray">
                        You should only visit this page if you're trying to log in.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" size="large">
                                Home
                            </Button>
                        </Link>
                        <Button variant="outlined" color="warning" size="large" onClick={() => clearDiscordAccess()}>
                            Continue
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        );
    }

    const state = uuid();
    setOAuthState('oauth_state', state, { sameSite: 'strict' });
    window.open(
        `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&state=${state}&redirect_uri=${REDIRECT_URI}&prompt=consent`,
        '_self',
    );

    return (
        <Container sx={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Redirecting to Discord
            </Typography>
            <img src="https://i.redd.it/m308pw9b09831.jpg" loading="lazy" alt="Adios" />
        </Container>
    );
};

export default LoginRedirect;
