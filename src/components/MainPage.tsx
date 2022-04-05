import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import AccountButton from './AccountButton';
import ServerGallery from './ServerGallery';
import Title from './Title';

const MainPage = () => {
    const [fadeDelay, setFadeDelay] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => setFadeDelay(fadeDelay + 1), 100);

        return () => clearInterval(interval);
    }, [fadeDelay]);

    return (
        <Container maxWidth="xl">
            <AccountButton />
            <Title />
            <ServerGallery />
        </Container>
    );
};

export default MainPage;
