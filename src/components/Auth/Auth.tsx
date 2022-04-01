import { Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

enum AuthStage {
    Loading,
    CSRF,
    Errored,
}

const Auth = () => {
    const [searchParams] = useSearchParams();
    const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.Loading);
    const [cookies, setCookie, removeCookie] = useCookies(['oauth_state', 'user']);

    useEffect(() => {
        const token = searchParams.get('code');
        const receivedState = searchParams.get('state');

        if (token && cookies.oauth_state === receivedState) {
            api.getToken(token, window.location.origin + '/auth')
                .then((e) => {
                    removeCookie('oauth_state');
                    setCookie('user', e, { sameSite: 'strict' });
                    window.open('/', '_self');
                })
                .catch((e) => {
                    console.log(e);
                    setAuthStage(AuthStage.Errored);
                });
        } else {
            removeCookie('user');
            if (cookies.oauth_state && cookies.oauth_state !== receivedState) {
                setAuthStage(AuthStage.CSRF);
            } else {
                setAuthStage(AuthStage.Errored);
            }
        }
    }, [cookies.oauth_state, removeCookie, searchParams, setCookie]);

    const [loadingDots, setLoadDots] = useState<number>(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadDots((loadingDots + 1) % 3);
        }, 1000);

        return () => clearInterval(interval);
    }, [loadingDots]);

    if (authStage === AuthStage.Loading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                <Typography variant="h3" gutterBottom>
                    Loading
                    {'.'.repeat(loadingDots + 1)}
                </Typography>
                <CircularProgress size={80} />
            </Stack>
        );
    } else if (authStage === AuthStage.Errored) {
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
    } else
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
};

export default Auth;
