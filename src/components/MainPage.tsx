import { Container, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AccountButton from './AccountButton';
import SelectedGuild from './SelectedGuild';
import ServerGallery from './ServerGallery';
import Title from './Title';

const iCanRemoveThis = new Date(1650359380326);

const MainPage = () => {
    const [timeTillRemoval, setTimeTillRemoval] = useState<string>(moment(iCanRemoveThis).fromNow());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeTillRemoval(moment(iCanRemoveThis).fromNow());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Container maxWidth="xl">
            <AccountButton />
            <Title />
            <SelectedGuild />
            {/* <Typography color="lightcoral" textAlign="center">
                Servers may not be showing due to a rate limiting issue with Discord, we are working to resolve this :/
            </Typography> */}
            <ServerGallery />
            <Typography>Servers coming back {timeTillRemoval}</Typography>
            <Typography>i dun goofed :P</Typography>
        </Container>
    );
};

export default MainPage;
