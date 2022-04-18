import { Container, Typography } from '@mui/material';
import AccountButton from './AccountButton';
import SelectedGuild from './SelectedGuild';
import ServerGallery from './ServerGallery';
import Title from './Title';

const MainPage = () => {
    return (
        <Container maxWidth="xl">
            <AccountButton />
            <Title />
            <SelectedGuild />
            <Typography color="lightcoral" textAlign="center">
                Servers may not be showing due to a rate limiting issue with Discord, we are working to resolve this :/
            </Typography>
            <ServerGallery />
        </Container>
    );
};

export default MainPage;
