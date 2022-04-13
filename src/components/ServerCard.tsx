import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { PublicRegisteredGuild, Tags } from '@uoa-discords/shared-utils';
import React from 'react';

const ServerCard = ({ server }: { server: PublicRegisteredGuild }) => {
    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardActionArea sx={{ display: 'flex', p: 1, width: '100%', height: '100%' }} className="noSelect">
                <CardMedia
                    component="img"
                    image={`https://cdn.discordapp.com/icons/${server.inviteObject.guild?.id || ''}/${
                        server.inviteObject.guild?.icon || ''
                    }`}
                    sx={{ width: 128 }}
                    className="discordProfilePicture"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {server.inviteObject.guild?.name || 'Unknown Server'}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {server.inviteObject.approximate_member_count} Members
                        </Typography>
                        <span style={{ color: 'gray' }}>{server.tags.map((e) => Tags[e].name).join(', ')}</span>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default ServerCard;
