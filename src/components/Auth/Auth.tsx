import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import useDiscordAccess from '../../hooks/useDiscordAccess';
import useUser from '../../hooks/useUser';

enum AuthStages {
    Loading,
    CSRF,
    Errored,
    GettingUserData,
    Exiting,
}

const Auth = () => {
    const [searchParams] = useSearchParams();
    const [authStage, setAuthStage] = useState<AuthStages>(AuthStages.Loading);
    const [{ oauth_state }, , clearOAuthState] = useCookies<'oauth_state', { oauth_state?: string }>(['oauth_state']);

    const { setDiscordAccess, clearDiscordAccess } = useDiscordAccess();
    const { setUser } = useUser();

    useEffect(() => {
        const code = searchParams.get('code');
        const receivedState = searchParams.get('state');

        if (code && oauth_state === receivedState) {
            console.log('making request');
            api.getToken(code, window.location.origin + '/auth')
                .then((e) => {
                    clearOAuthState('oauth_state');
                    if (e.status !== 200) {
                        console.warn(
                            `Got status code ${e.status} on token get attempt with message: ${e.statusText}`,
                            e.data,
                        );
                    }

                    setDiscordAccess(e.data, 'generate');
                    setAuthStage(AuthStages.GettingUserData);

                    api.getUserInfo(e.data.access_token)
                        .then((res) => {
                            if (res.status !== 200) {
                                console.warn(
                                    `Got status code ${e.status} on token get attempt with message: ${e.statusText}`,
                                    e.data,
                                );
                            }

                            setUser(res.data);
                            setAuthStage(AuthStages.Exiting);
                            window.open('/', '_self');
                        })
                        .catch((e) => {
                            console.error(e);
                            setAuthStage(AuthStages.Errored);
                        });
                })
                .catch((e) => {
                    console.error(e);
                    setAuthStage(AuthStages.Errored);
                });
        } else if (authStage !== AuthStages.Exiting && authStage !== AuthStages.GettingUserData) {
            clearDiscordAccess();
            if (oauth_state && oauth_state !== receivedState) {
                setAuthStage(AuthStages.CSRF);
            } else {
                setAuthStage(AuthStages.Errored);
            }
        }
    }, [authStage, oauth_state, clearOAuthState, searchParams, setDiscordAccess, setUser, clearDiscordAccess]);

    const [loadingDots, setLoadDots] = useState<number>(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadDots((loadingDots + 1) % 3);
        }, 1000);

        return () => clearInterval(interval);
    }, [loadingDots]);

    switch (authStage) {
        case AuthStages.GettingUserData:
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                    <Typography variant="h3" gutterBottom>
                        Getting User Data
                        {'.'.repeat(loadingDots + 1)}
                    </Typography>
                    <CircularProgress size={80} />
                </Stack>
            );
        case AuthStages.Loading:
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                    <Typography variant="h3" gutterBottom>
                        Loading
                        {'.'.repeat(loadingDots + 1)}
                    </Typography>
                    <CircularProgress size={80} />
                </Stack>
            );
        case AuthStages.CSRF:
            return (
                <Container>
                    <Typography variant="h3" color="lightcoral" gutterBottom>
                        Security Warning
                    </Typography>
                    <Typography gutterBottom>
                        A cross-site request forgery attempt was made during login.
                        <br />
                        Your Discord account is safe, but please report this to us ASAP.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 1 }} onClick={() => window.open('/', '_self')}>
                        Home
                    </Button>
                </Container>
            );
        case AuthStages.Exiting:
            return <Typography>Sucess!</Typography>;
        case AuthStages.Errored:
        default:
            return (
                <Container>
                    <Typography variant="h3" gutterBottom>
                        Error
                    </Typography>
                    <Typography gutterBottom>
                        Something went wrong logging into Discord, please try again later and contact us if the problem
                        persists.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 1 }} onClick={() => window.open('/', '_self')}>
                        Back
                    </Button>
                </Container>
            );
    }
};

export default Auth;
