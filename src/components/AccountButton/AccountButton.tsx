import { CircularProgress, Collapse, ListItemButton, Stack, Typography } from '@mui/material';
import useDiscordAccess from '../../hooks/useDiscordAccess';
import useDiscordUser from '../../hooks/useDiscordUser';
import discordIcon from '../../images/discordIcon.svg';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import getDiscordIcon from '../../helpers/getDiscordIcon';

const AccountButton = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { discordAccess } = useDiscordAccess();
    const { user } = useDiscordUser();

    const [image, buttonText, buttonDescription] = useMemo<[JSX.Element, string, string]>(() => {
        if (discordAccess) {
            if (user) {
                const { src, alt } = getDiscordIcon(user);

                return [
                    <img src={src} alt={alt} height="64" width="64" className="discordProfilePicture" />,
                    user.username,
                    'View profile',
                ];
            }

            // logged in - but no user data yet
            return [<CircularProgress />, 'Loading', 'Loading profile'];
        }

        // not logged in
        return [<img src={discordIcon} alt="Discord logo" height="64" width="64" />, 'Log in', 'Via Discord'];
    }, [discordAccess, user]);

    return (
        <Link to={discordAccess ? '/me' : '/login'} style={{ color: 'white' }}>
            <div
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="noSelect"
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}
            >
                <ListItemButton sx={{ borderRadius: '0 0 0 1rem' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {image}
                        <Collapse in={isHovered} orientation="horizontal" sx={{ whiteSpace: 'nowrap' }}>
                            {buttonText}
                            <Typography variant="body1" color="gray" sx={{ whiteSpace: 'nowrap' }}>
                                {buttonDescription}
                            </Typography>
                        </Collapse>
                    </Stack>
                </ListItemButton>
            </div>
        </Link>
    );
};

export default AccountButton;
