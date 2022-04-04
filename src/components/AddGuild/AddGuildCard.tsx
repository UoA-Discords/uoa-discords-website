import { Card, CardActionArea, Fade, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ExtendedGuild from '../../types/ExtendedGuild';
import './AddGuildCard.css';

const AddGuildCard = ({ guild }: { guild: ExtendedGuild }) => {
    const image = useMemo<string>(() => {
        if (guild.icon) return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
        else return `https://avatars.githubusercontent.com/u/102650663`;
    }, [guild.icon, guild.id]);

    const classNames = useMemo<string>(() => {
        const output = ['addGuildCard'];
        if (!guild.isValid) output.push('disabled');
        return output.join(' ');
    }, [guild.isValid]);

    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setShouldFadeIn(true);
        }, Math.random() * 300);
    }, []);

    return (
        <Fade in={shouldFadeIn}>
            <Card>
                <CardActionArea
                    sx={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        p: 1,
                        justifyContent: 'flex-start',
                    }}
                    className={classNames}
                >
                    <img
                        src={image}
                        height="64"
                        width="64"
                        alt={`${guild.name}'s icon`}
                        style={{ borderRadius: '50%' }}
                    />
                    <Stack sx={{ ml: 1 }}>
                        <Typography
                            component="div"
                            variant="h5"
                            sx={{
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {guild.name}
                        </Typography>
                        {guild.isDuplicate ? (
                            <Typography color="lightcoral">Already Added</Typography>
                        ) : !guild.isAdmin ? (
                            <Typography color="lightcoral">Not Admin</Typography>
                        ) : guild.isBlacklisted ? (
                            <Typography color="lightcoral">Blacklisted</Typography>
                        ) : (
                            <Typography>&nbsp;</Typography>
                        )}
                    </Stack>
                </CardActionArea>
            </Card>
        </Fade>
    );
};

export default AddGuildCard;
