import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import AccountButton from './AccountButton';
import ServerGallery from './ServerGallery';
import Title from './Title';
import { PublicRegisteredGuild } from '@uoa-discords/shared-utils';

export interface HomePageProps {
    servers: PublicRegisteredGuild[];
}

const MainPage = ({ servers }: HomePageProps) => {
    const [fadeDelay, setFadeDelay] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => setFadeDelay(fadeDelay + 1), 100);

        return () => clearInterval(interval);
    }, [fadeDelay]);

    return (
        <Container maxWidth="xl">
            <AccountButton />
            <Title />
            <ServerGallery servers={servers} />
        </Container>
    );
};

export default MainPage;
