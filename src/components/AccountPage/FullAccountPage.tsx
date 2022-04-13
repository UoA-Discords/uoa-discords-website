import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Fade, Grid, Tooltip, Typography } from '@mui/material';
import { FullDiscordAccessResponse } from '../../hooks/useDiscordAccess';
import { FullUserResponse } from '../../hooks/useDiscordUser';
import { Link } from 'react-router-dom';
import './FullAccountPage.css';
import moment from 'moment';
import api from '../../api';
import AddServerPage from '../AddServerPage';
import useBadges from '../../hooks/useBadges';
import { Verifiers } from '@uoa-discords/shared-utils';

interface FullAccountPageProps {
    userCookie: FullUserResponse;
    discordCookie: FullDiscordAccessResponse;
}

const FullAccountPage = ({ userCookie, discordCookie }: FullAccountPageProps) => {
    const { user, clearUser } = userCookie;
    const { discordAccess, setDiscordAccess, clearDiscordAccess } = discordCookie;

    const [sessionExpires, setSessionExpires] = useState<string>('');
    const [sessionStarted, setSessionStarted] = useState<string>('');

    const sessionExpiresTooltip = useMemo<string>(
        () => new Date(discordAccess.expires_at).toLocaleString('en-NZ'),
        [discordAccess.expires_at],
    );
    const sessionStartedTooltip = useMemo<string>(
        () => new Date(discordAccess.issued_at).toLocaleString('en-NZ'),
        [discordAccess.issued_at],
    );

    // updating session start/end timestamps
    useEffect(() => {
        const setSessionTimestamps = () => {
            setSessionExpires(moment(discordAccess.expires_at).fromNow());
            setSessionStarted(() => moment(discordAccess.issued_at).fromNow());
        };

        setSessionTimestamps();

        const interval = setInterval(setSessionTimestamps, 5000);

        return () => clearInterval(interval);
    }, [discordAccess.expires_at, discordAccess.issued_at]);

    const [failedRefresh, setFailedRefresh] = useState<boolean>(false);
    // refreshing token if close to expiration (<= 5 days)
    useEffect(() => {
        const daysTilExpiry = (discordAccess.expires_at - Date.now()) / (1000 * 60 * 60 * 24);

        if (daysTilExpiry <= 5 && !failedRefresh) {
            api.refreshToken(discordAccess.refresh_token).then((res) => {
                if (res.success) {
                    setDiscordAccess(res.data, 'refresh');
                } else {
                    setFailedRefresh(true);
                    console.log('Failed to refresh token, API might be down?', res);
                }
            });
        }
    }, [discordAccess.expires_at, discordAccess.refresh_token, failedRefresh, setDiscordAccess]);

    const handleLogout = useCallback(() => {
        api.revokeToken(discordAccess.access_token);
        clearDiscordAccess();
        clearUser();
        window.location.href = '/';
    }, [clearDiscordAccess, clearUser, discordAccess.access_token]);

    const [isAdding, setIsAdding] = useState<boolean>(false);

    const badges = useBadges(user.id);
    const isVerifier = useMemo<boolean>(() => Verifiers.has(user.id), [user.id]);

    return (
        <Container maxWidth="sm" sx={{ pt: 3, maxWidth: '100vw', overflowX: 'hidden' }}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                        alt="Your Discord profile"
                        className="discordProfilePicture"
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Typography variant="h4">
                        {user.username}
                        <span style={{ color: 'gray' }}>#{user.discriminator}</span>
                    </Typography>
                    <Typography color="gray" title="Your Discord ID">
                        {user.id}
                    </Typography>
                    <Typography color="gray">
                        Logged in{' '}
                        <Tooltip title={<Typography>{sessionStartedTooltip}</Typography>} placement="right" arrow>
                            <span className="sessionTimeInfo">{sessionStarted}</span>
                        </Tooltip>
                        .
                    </Typography>
                    <Typography color="gray">
                        Will log out{' '}
                        <Tooltip title={<Typography>{sessionExpiresTooltip}</Typography>} placement="right" arrow>
                            <span className="sessionTimeInfo">{sessionExpires}</span>
                        </Tooltip>
                        .
                    </Typography>
                    <Fade in={failedRefresh}>
                        <Tooltip title={<Typography>Our API is probably down.</Typography>} placement="right" arrow>
                            <Typography>
                                <span className="sessionTimeInfo" style={{ color: 'lightcoral' }}>
                                    Refresh failed
                                </span>
                            </Typography>
                        </Tooltip>
                    </Fade>
                    {badges}
                </Grid>
                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="outlined">Home</Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="warning" onClick={handleLogout}>
                            Log out
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ width: '118px', whiteSpace: 'nowrap' }}
                            variant="outlined"
                            color={isAdding ? 'error' : 'info'}
                            onClick={() => setIsAdding(!isAdding)}
                        >
                            {isAdding ? 'Cancel' : 'Add Server'}
                        </Button>
                    </Grid>
                    {isVerifier && (
                        <Grid item>
                            <Link to="/applications" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" color="secondary">
                                    Applications
                                </Button>
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <AddServerPage isOpen={isAdding} access_token={discordAccess.access_token} />
        </Container>
    );
};

export default FullAccountPage;
