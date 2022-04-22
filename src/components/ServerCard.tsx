import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Fade, Typography } from '@mui/material';
import { ServerWithInviteInfo } from '@uoa-discords/shared-utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedGuildId } from '../redux/slices/main';
import api from '../api';

import LikeIcon from '@mui/icons-material/ThumbUpOffAlt';
import LikedIcon from '@mui/icons-material/ThumbUpAlt';

import { addLikes, getUserGuilds, getUserLikes, removeLikes } from '../redux/slices/user';
import useDiscordAccess from '../hooks/useDiscordAccess';
import { modifyGuildLikes } from '../redux/slices/guildManager';

export interface ServerCardProps {
    server: ServerWithInviteInfo;
    index: number;
}

const ServerCard = ({ server, index }: ServerCardProps) => {
    const dispatch = useDispatch();
    const userLikes = useSelector(getUserLikes);
    const userGuilds = useSelector(getUserGuilds);
    const { discordAccess } = useDiscordAccess();

    const handleClick = useCallback(() => {
        dispatch(setSelectedGuildId(server._id));
    }, [dispatch, server._id]);

    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShouldFadeIn(true), index * 10);

        return () => clearTimeout(timeout);
    }, [index]);

    const likeStatus = useMemo<'notAllowed' | 'likable' | 'unlikable'>(() => {
        if (!discordAccess?.access_token) return 'unlikable';
        if (userLikes[server._id] !== undefined) return 'unlikable';
        if (userGuilds[server._id] !== undefined) return 'likable';
        return 'notAllowed';
    }, [discordAccess?.access_token, server._id, userGuilds, userLikes]);

    const [likeChangeInProgress, setLikeChangeInProgress] = useState<boolean>(false);

    const handleLike = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (likeChangeInProgress) return;
            if (likeStatus === 'notAllowed') return;
            if (!discordAccess?.access_token) return;
            setLikeChangeInProgress(true);

            let timeout: NodeJS.Timeout;

            if (likeStatus === 'likable') {
                api.addLike(discordAccess.access_token, server._id).then((res) => {
                    if (!res.success) console.error(res);
                    timeout = setTimeout(() => setLikeChangeInProgress(false), 1000);
                });
                dispatch(modifyGuildLikes({ guildId: server._id, modifier: 1 }));
                dispatch(addLikes([server._id]));
            } else {
                api.removeLike(discordAccess.access_token, server._id).then((res) => {
                    if (!res.success) console.error(res);
                });
                dispatch(modifyGuildLikes({ guildId: server._id, modifier: -1 }));
                dispatch(removeLikes([server._id]));
                timeout = setTimeout(() => setLikeChangeInProgress(false), 1000);
            }

            return () => clearTimeout(timeout);
        },
        [discordAccess?.access_token, dispatch, likeChangeInProgress, likeStatus, server._id],
    );

    return (
        <Fade in={shouldFadeIn}>
            <Card sx={{ height: '100%', width: '100%' }} onClick={handleClick}>
                <CardActionArea
                    disableRipple
                    sx={{ display: 'flex', p: 1, width: '100%', height: '100%' }}
                    className="noSelect"
                >
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
                            <Button
                                onClick={handleLike}
                                disabled={likeStatus === 'notAllowed'}
                                component="span"
                                color={likeChangeInProgress ? 'secondary' : 'primary'}
                                sx={{ position: 'absolute', bottom: 0, right: 0, pl: 1.5 }}
                                startIcon={likeStatus === 'unlikable' ? <LikedIcon /> : <LikeIcon />}
                            >
                                {server.likes}
                            </Button>
                        </CardContent>
                    </Box>
                </CardActionArea>
            </Card>
        </Fade>
    );
};

export default ServerCard;
