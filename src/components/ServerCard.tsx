import { Box, Card, CardActionArea, CardContent, CardMedia, Fade, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedGuildId } from '../redux/slices/main';
import LoadedGuild from '../types/LoadedGuild';

export interface ServerCardProps {
    server: LoadedGuild;
    index: number;
}

const ServerCard = ({ server, index }: ServerCardProps) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(setSelectedGuildId(server._id));
    }, [dispatch, server._id]);

    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShouldFadeIn(true), index * 100);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Fade in={shouldFadeIn}>
            <Card sx={{ height: '100%', width: '100%' }} onClick={handleClick}>
                <CardActionArea sx={{ display: 'flex', p: 1, width: '100%', height: '100%' }} className="noSelect">
                    <CardMedia
                        component="img"
                        image={`https://cdn.discordapp.com/icons/${server.invite.guild?.id || ''}/${
                            server.invite.guild?.icon || ''
                        }`}
                        sx={{ width: 128 }}
                        className="discordProfilePicture"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {server.invite.guild?.name || 'Unknown Server'}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {server.invite.approximate_member_count} Members (
                                {server.invite.approximate_presence_count} Online)
                            </Typography>
                            <span style={{ color: 'gray' }}>{server.tags.join(', ')}</span>
                        </CardContent>
                    </Box>
                </CardActionArea>
            </Card>
        </Fade>
    );
};

export default ServerCard;
