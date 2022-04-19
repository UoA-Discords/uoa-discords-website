import { Paper, Stack, Tooltip, Typography } from '@mui/material';
import { User } from '@uoa-discords/shared-utils';
import React from 'react';
import getDiscordIcon from '../../helpers/getDiscordIcon';
import useBadges from '../../hooks/useBadges';

export interface UserCardProps {
    user: User;
    children: React.ReactElement<any, any>;
}

const UserCard = ({ user, children }: UserCardProps) => {
    const { discriminator, id, username } = user;

    const badges = useBadges(id);

    const { src: profileImageSource, alt: profileImageAlt } = getDiscordIcon(user);

    return (
        <Tooltip
            children={children}
            enterDelay={0}
            TransitionProps={{ timeout: 0 }}
            components={{ Tooltip: Paper }}
            title={
                <Paper sx={{ p: 1, mt: 1 }} variant="outlined" square>
                    <Stack direction="row" spacing={1}>
                        <img
                            style={{ width: '50px' }}
                            src={profileImageSource}
                            alt={profileImageAlt}
                            className="discordProfilePicture"
                        />
                        <Stack>
                            <Typography sx={{ whiteSpace: 'nowrap' }}>
                                {username}
                                <span style={{ color: 'gray' }}>#{discriminator}</span>
                            </Typography>
                            {badges}
                        </Stack>
                    </Stack>
                </Paper>
            }
        />
    );
};

export default UserCard;
