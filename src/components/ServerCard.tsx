import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { SampleItem } from '../sampleData';

const ServerCard = ({ server }: { server: SampleItem }) => {
    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardActionArea sx={{ display: 'flex', p: 1, width: '100%', height: '100%' }} className="noSelect">
                <CardMedia component="img" image={server.icon} sx={{ width: 128 }} className="discordProfilePicture" />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {server.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {server.memberCount} Members
                        </Typography>
                        <span style={{ color: 'gray' }}>{server.tags.join(', ')}</span>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default ServerCard;
