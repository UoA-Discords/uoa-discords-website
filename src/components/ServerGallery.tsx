import { Grid } from '@mui/material';
import React from 'react';
import sampleData from '../sampleData';
import ServerCard from './ServerCard';

const ServerGallery = () => {
    return (
        <Grid container spacing={2}>
            {sampleData.map((e, i) => (
                <Grid item key={i}>
                    <ServerCard server={e} key={i} />
                </Grid>
            ))}
        </Grid>
    );
    // return <div>ServerGallery</div>;
};

export default ServerGallery;
