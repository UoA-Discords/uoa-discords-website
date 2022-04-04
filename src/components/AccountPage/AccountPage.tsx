import React, { useCallback, useMemo } from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useUser, { FullUserResponse } from '../../hooks/useUser';
import './AccountPage.css';
import moment from 'moment';
import api from '../../api';
import useDiscordAccess, { FullDiscordAccessResponse } from '../../hooks/useDiscordAccess';

interface AccountPageProps {
    userCookie: FullUserResponse;
    discordCookie: FullDiscordAccessResponse;
}

const AccountPage = ({ userCookie, discordCookie }: AccountPageProps) => {
    const { user: userData } = userCookie;
    const { discordAccess: discordData } = discordCookie;

    const expiry = useMemo<string>(() => moment(discordData.expires_at).fromNow(true), [discordData.expires_at]);
    const expiryTitle = useMemo<string>(
        () => new Date(discordData.expires_at).toLocaleString('en-NZ'),
        [discordData.expires_at],
    );

    const loggedIn = useMemo<string>(() => moment(discordData.issued_at).fromNow(), [discordData.issued_at]);
    const loggedInTitle = useMemo<string>(
        () => new Date(discordData.issued_at).toLocaleString('en-NZ'),
        [discordData.issued_at],
    );

    const handleLogout = useCallback(() => {
        // revoke token
        api.revokeToken(discordData.access_token)
            .then((e) => {
                if (e.status !== 200)
                    console.warn(
                        `Got status code ${e.status} on token revocation attempt with message: ${e.statusText}`,
                    );
            })
            .catch((e) => console.error(e));

        // remove access cookie
        discordCookie.clearDiscordAccess();

        // remove data cookie
        userCookie.clearUser();
    }, [discordCookie, discordData.access_token, userCookie]);

    /** Whether the option for extending an access token should be visible. */
    const canRefresh = useMemo<boolean>(() => {
        // can refresh if session expires in <= 3 days
        return (discordData.expires_at - Date.now()) / 1000 / 60 / 60 / 24 <= 3;
    }, [discordData.expires_at]);

    const handleRefresh = useCallback(() => {
        api.refreshToken(discordData.refresh_token)
            .then((e) => {
                if (e.status !== 200) {
                    console.warn(
                        `Got status code ${e.status} on token refresh attempt with message: ${e.statusText}`,
                        e.data,
                    );
                }

                discordCookie.setDiscordAccess(e.data, 'refresh');
            })
            .catch((e) => console.error(e));
    }, [discordCookie, discordData.refresh_token]);

    return (
        <Container>
            <Link to="/" className="homeButton">
                <Button variant="outlined">Home</Button>
            </Link>
            <Stack alignItems="center">
                <img
                    src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`}
                    alt="Your discord profile"
                    height="128"
                    width="128"
                    className="accountPageProfileImage"
                />
                <Typography variant="h4">
                    {userData.username}
                    <span style={{ color: 'gray' }}>#{userData.discriminator}</span>
                </Typography>
                <Typography variant="caption" color="gray" title="Your Discord ID">
                    {userData.id}
                </Typography>
                <Typography variant="caption" color="gray">
                    Logged in{' '}
                    <span title={loggedInTitle} className="noSelect sessionExpiryLabel">
                        {loggedIn}
                    </span>
                    .
                </Typography>
                <Typography variant="caption" color="gray">
                    Session expires in{' '}
                    <span title={expiryTitle} className="noSelect sessionExpiryLabel">
                        {expiry}
                    </span>
                    .
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button variant="outlined" color="warning" size="small" onClick={handleLogout}>
                        Log out
                    </Button>
                    {canRefresh && (
                        <Button variant="outlined" color="success" size="small" onClick={handleRefresh}>
                            Refresh Session
                        </Button>
                    )}
                    <Link to="/apply" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="info" size="small">
                            Add Server
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Container>
    );
};

const WrappedAccountPage = () => {
    const userCookie = useUser();
    const discordAccessCookie = useDiscordAccess();

    if (!discordAccessCookie.discordAccess || !userCookie.user) {
        window.open('/', '_self');
        return <></>;
    }

    return (
        <AccountPage
            userCookie={userCookie as FullUserResponse}
            discordCookie={discordAccessCookie as FullDiscordAccessResponse}
        />
    );
};

export default WrappedAccountPage;
