import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './HomeButton.css';

const HomeButton = () => {
    return (
        <Link to="/" className="homeButton">
            <Button variant="outlined" sx={{ position: 'absolute' }}>
                Home
            </Button>
        </Link>
    );
};

export default HomeButton;
