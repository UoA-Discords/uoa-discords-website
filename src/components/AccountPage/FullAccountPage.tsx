import { Button, Container, Grid, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FullDiscordAccessResponse } from '../../hooks/useDiscordAccess';
import { FullUserResponse } from '../../hooks/useDiscordUser';
import api from '../../api';
import './FullAccountPage.css';

// badges, coming soon
// import VerifiedIcon from '@mui/icons-material/Verified';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import StarIcon from '@mui/icons-material/Star';

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

    // refreshing token if close to expiration (<= 5 days)
    useEffect(() => {
        const daysTilExpiry = (discordAccess.expires_at - Date.now()) / (1000 * 60 * 60 * 24);

        if (daysTilExpiry <= 5) {
            api.refreshToken(discordAccess.refresh_token).then((res) => {
                if (res.success) {
                    setDiscordAccess(res.data, 'refresh');
                } else {
                    console.error(res.error);
                }
            });
        }
    }, [discordAccess.expires_at, discordAccess.refresh_token, setDiscordAccess]);

    const handleLogout = useCallback(() => {
        api.revokeToken(discordAccess.access_token);
        clearDiscordAccess();
        clearUser();
        window.location.href = '/';
    }, [clearDiscordAccess, clearUser, discordAccess.access_token]);

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
                </Grid>
                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Tooltip title={<Typography>Return to the home page</Typography>} arrow>
                                <Button variant="outlined">Home</Button>
                            </Tooltip>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Tooltip title={<Typography>Log out of Discord</Typography>} arrow>
                            <Button variant="outlined" color="warning" onClick={handleLogout}>
                                Log out
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title={<Typography>Add a server application</Typography>} arrow>
                            <Button variant="outlined" color="info">
                                Add Server
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FullAccountPage;
