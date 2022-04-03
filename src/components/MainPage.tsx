import { Container, Typography } from '@mui/material';
import React from 'react';
import AccountButton from './AccountButton';
import ServerGallery from './ServerGallery';

const MainPage = () => {
    return (
        <Container>
            <AccountButton />
            <Typography variant="h6" textAlign="center">
                UoA Discords
            </Typography>
            <ServerGallery />
        </Container>
    );
};

export default MainPage;
