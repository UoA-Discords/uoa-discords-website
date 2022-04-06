import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

/** 404 Not Found page. */
const NotFound = () => {
    return (
        <Container>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Not Found
            </Typography>
            <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <Typography variant="h5" color="gray">
                    That page doesn't exist
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
};

export default NotFound;
