import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useDiscordUser, { FullUserResponse } from '../../hooks/useDiscordUser';
import useDiscordAccess, { FullDiscordAccessResponse } from '../../hooks/useDiscordAccess';
import LoadingAccountPage from './LoadingAccountPage';
import FullAccountPage from './FullAccountPage';

const AccountPage = () => {
    const userCookie = useDiscordUser();
    const discordAccessCookie = useDiscordAccess();

    // OAuth is present but no user info -> load user info
    if (discordAccessCookie.discordAccess && !userCookie.user) {
        return <LoadingAccountPage access_token={discordAccessCookie.discordAccess.access_token} />;
    }

    // Neither OAuth or user info present -> not logged in at all
    if (!discordAccessCookie.discordAccess && !userCookie.user) {
        return (
            <Container>
                <Typography variant="h2" textAlign="center" gutterBottom>
                    Not Logged In
                </Typography>
                <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h5" color="gray">
                        You're trying to access your profile page without being logged in.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" size="large">
                                Home
                            </Button>
                        </Link>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" size="large" color="success">
                                Login
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        );
    }

    return (
        <FullAccountPage
            userCookie={userCookie as FullUserResponse}
            discordCookie={discordAccessCookie as FullDiscordAccessResponse}
        />
    );
};

export default AccountPage;
