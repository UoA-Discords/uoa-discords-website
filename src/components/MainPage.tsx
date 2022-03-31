import { Container, Typography } from '@mui/material';
import React from 'react';
import ServerGallery from './ServerGallery';

const MainPage = () => {
    return (
        <Container>
            <Typography variant="h6" textAlign="center">
                UoA Discords
            </Typography>
            <ServerGallery />
        </Container>
    );
};

export default MainPage;
