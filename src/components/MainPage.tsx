import { Container } from '@mui/material';
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
            <ServerGallery />
        </Container>
    );
};

export default MainPage;
