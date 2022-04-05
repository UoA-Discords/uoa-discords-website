import { Container, Typography, LinearProgress, Stack, Fade, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import useDiscordUser from '../../hooks/useDiscordUser';

enum ErrorStates {
    InvalidAuth,
    NotFound,
    Unknown,
}

const LoadingAccountPage = ({ access_token }: { access_token: string }) => {
    const { setUser } = useDiscordUser();

    const [errorState, setErrorMessage] = useState<ErrorStates | null>(null);
    const [waitTime, setWaitTime] = useState<number>(0);

    const isTakingTooLong = useMemo<boolean>(() => waitTime >= 3, [waitTime]);

    useEffect(() => {
        api.getUserInfo(access_token).then((res) => {
            if (res.success) setUser(res.data);
            else {
                if (res.error.response?.status === 401) {
                    setErrorMessage(ErrorStates.InvalidAuth);
                } else if (res.error.response?.status === 404) {
                    setErrorMessage(ErrorStates.NotFound);
                } else setErrorMessage(ErrorStates.Unknown);
            }
        });
    }, [access_token, setUser]);

    useEffect(() => {
        const interval = setInterval(() => setWaitTime(waitTime + 1), 1000);

        return () => clearInterval(interval);
    }, [waitTime]);

    switch (errorState) {
        case ErrorStates.InvalidAuth:
            return (
                <Container>
                    <Typography variant="h2" textAlign="center" gutterBottom>
                        Token Error
                    </Typography>
                    <LinearProgress color="warning" variant="determinate" value={100} />
                    <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h5" color="gray" textAlign="center">
                            Your session has expired. Please log back in.
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
        case ErrorStates.NotFound:
            return (
                <Container>
                    <Typography variant="h2" textAlign="center" gutterBottom>
                        Not Found
                    </Typography>
                    <LinearProgress color="warning" variant="determinate" value={100} />
                    <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h5" color="gray" textAlign="center">
                            Discord didn't respond, it might be down.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" size="large">
                                    Home
                                </Button>
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            );
        case ErrorStates.Unknown:
            return (
                <Container>
                    <Typography variant="h2" textAlign="center" gutterBottom>
                        Unknown Error
                    </Typography>
                    <LinearProgress color="error" variant="determinate" value={100} />
                    <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h5" color="gray" textAlign="center">
                            An unknown error occurred.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" size="large">
                                    Home
                                </Button>
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            );
        case null:
            break;
        default:
            console.error(`Unhandled error state: ${errorState}`);
            break;
    }

    return (
        <Container>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Getting User Data
            </Typography>
            <LinearProgress />
            <Fade in={isTakingTooLong}>
                <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h5" color="gray" textAlign="center">
                        This seems to be taking a while ({waitTime}s)
                    </Typography>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="large">
                            Home
                        </Button>
                    </Link>
                </Stack>
            </Fade>
        </Container>
    );
};

export default LoadingAccountPage;
